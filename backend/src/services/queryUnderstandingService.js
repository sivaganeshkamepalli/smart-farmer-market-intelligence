const { query } = require('../config/db');

function levenshteinDistance(a, b) {
  const matrix = [];
  for (let i = 0; i <= b.length; i++) matrix[i] = [i];
  for (let j = 0; j <= a.length; j++) matrix[0][j] = j;

  for (let i = 1; i <= b.length; i++) {
    for (let j = 1; j <= a.length; j++) {
      if (b.charAt(i - 1) === a.charAt(j - 1)) {
        matrix[i][j] = matrix[i - 1][j - 1];
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j - 1] + 1,
          Math.min(matrix[i][j - 1] + 1, matrix[i - 1][j] + 1)
        );
      }
    }
  }
  return matrix[b.length][a.length];
}

async function correctTyposAndExtractEntities(userQuery) {
  const text = userQuery.toLowerCase().trim();

  // 1. Detect Greeting Intent First (Requirement #24)
  const greetingWords = ['hi', 'hello', 'hey', 'namaste', 'good morning', 'good afternoon', 'good evening', 'greetings'];
  const isGreetingOnly = greetingWords.includes(text) || text.split(/\s+/).every(w => greetingWords.includes(w) || w.length <= 2);

  if (isGreetingOnly) {
    return {
      originalQuery: userQuery,
      correctedQuery: userQuery,
      matchedProduct: null,
      intent: 'GREETING',
      entities: {
        product: null,
        productId: null,
        landArea: null,
        waterLevel: null,
        budget: null,
        location: null
      },
      missingInfo: [],
      typoCorrected: false
    };
  }

  // 2. Fetch products from DB for fuzzy matching
  const products = await query('SELECT id, name, category_id FROM products');
  let matchedProduct = null;
  let bestDistance = Infinity;
  let correctedQueryText = userQuery;

  const words = text.split(/\s+/);

  for (const word of words) {
    if (word.length < 3) continue;
    for (const p of products) {
      const pNameLower = p.name.toLowerCase();
      if (pNameLower.includes(word) || word.includes(pNameLower.split(' ')[0].toLowerCase())) {
        matchedProduct = p;
        bestDistance = 0;
        break;
      }
      
      const primaryWord = pNameLower.split(' ')[0].replace(/[^a-z]/g, '');
      const dist = levenshteinDistance(word, primaryWord);
      if (dist <= 2 && dist < bestDistance) {
        bestDistance = dist;
        matchedProduct = p;
        if (dist > 0) {
          correctedQueryText = userQuery.replace(new RegExp(word, 'gi'), primaryWord);
        }
      }
    }
    if (bestDistance === 0) break;
  }

  // 3. Extract Land Size (e.g. "2 acres")
  let landArea = null;
  const landMatch = text.match(/(\d+(?:\.\d+)?)\s*(acre|acres|hectare|hectares|cent|cents)/i);
  if (landMatch) {
    let val = parseFloat(landMatch[1]);
    const unit = landMatch[2].toLowerCase();
    if (unit.includes('hectare')) val = val * 2.47105;
    else if (unit.includes('cent')) val = val * 0.01;
    landArea = val;
  }

  // 4. Extract Water Availability
  let waterLevel = null;
  if (text.includes('limited water') || text.includes('low water') || text.includes('drought') || text.includes('scarce water')) {
    waterLevel = 'LOW';
  } else if (text.includes('abundant water') || text.includes('high water') || text.includes('plenty of water') || text.includes('canal')) {
    waterLevel = 'HIGH';
  } else if (text.includes('moderate water') || text.includes('drip') || text.includes('medium water')) {
    waterLevel = 'MEDIUM';
  }

  // 5. Extract Budget
  let budget = null;
  const lakhMatch = text.match(/(\d+(?:\.\d+)?)\s*(lakh|lakhs|l|k)/i);
  if (lakhMatch) {
    let num = parseFloat(lakhMatch[1]);
    const unit = lakhMatch[2].toLowerCase();
    if (unit.startsWith('l')) budget = num * 100000;
    else if (unit.startsWith('k')) budget = num * 1000;
  } else {
    const numMatch = text.match(/(?:rs|inr|₹)?\s*(\d{4,7})/i);
    if (numMatch) budget = parseFloat(numMatch[1]);
  }

  // 6. Extract Location
  let location = null;
  const stateList = ['andhra pradesh', 'telangana', 'karnataka', 'tamil nadu', 'maharashtra', 'delhi', 'kerala', 'punjab', 'gujarat'];
  for (const st of stateList) {
    if (text.includes(st)) {
      location = st.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
      break;
    }
  }

  // 7. Detect Intent
  let intent = 'GENERAL_INQUIRY';
  if (text.includes('what should i cultivate') || text.includes('what should i grow') || text.includes('recommend') || text.includes('farming plan')) {
    intent = 'CROP_RECOMMENDATION';
  } else if (text.includes('why was') || text.includes('why did') || text.includes('price high') || text.includes('price change') || text.includes('why price')) {
    intent = 'PRICE_EXPLANATION';
  } else if (text.includes('compare') || text.includes('versus') || text.includes('vs')) {
    intent = 'CROP_COMPARISON';
  } else if (text.includes('how much') || text.includes('investment') || text.includes('cost') || text.includes('return')) {
    intent = 'INVESTMENT_ANALYSIS';
  } else if (text.includes('buyer') || text.includes('where to sell') || text.includes('best market')) {
    intent = 'BUYER_MATCHING';
  } else if (text.includes('safer') || text.includes('low risk')) {
    intent = 'SAFER_OPTION';
  }

  // 8. Check Missing Info
  const missingInfo = [];
  if (!landArea) missingInfo.push({ field: 'landArea', label: 'Land Size (acres)', prompt: 'What is your total land area?' });
  if (!waterLevel) missingInfo.push({ field: 'waterLevel', label: 'Water Availability', prompt: 'What is your water availability (Low, Moderate, High)?' });
  if (!location) missingInfo.push({ field: 'location', label: 'Farm Location / State', prompt: 'Where is your farm located?' });

  return {
    originalQuery: userQuery,
    correctedQuery: correctedQueryText,
    matchedProduct,
    intent,
    entities: {
      product: matchedProduct ? matchedProduct.name : null,
      productId: matchedProduct ? matchedProduct.id : null,
      landArea,
      waterLevel,
      budget,
      location
    },
    missingInfo,
    typoCorrected: bestDistance > 0 && bestDistance <= 2
  };
}

module.exports = {
  correctTyposAndExtractEntities
};
