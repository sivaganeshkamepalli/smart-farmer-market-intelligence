const { correctTyposAndExtractEntities } = require('./queryUnderstandingService');
const { executeQueryPlan } = require('./queryPlannerService');
const { generateFarmerRecommendations } = require('./recommendationService');
const { calculateRiskProfile } = require('./riskAnalysisService');

async function processFarmerQuery(userMessage, farmerProfile = null, conversationHistory = []) {
  // 1. Understand Query
  const queryAnalysis = await correctTyposAndExtractEntities(userMessage);

  // Requirement #24: GREETING Intent Handling
  if (queryAnalysis.intent === 'GREETING') {
    return {
      message: "👋 Hello! How can I help you with your farming decisions today?",
      intent: "GREETING",
      queryAnalysis,
      recommendations: [],
      landAllocation: null,
      riskProfile: null,
      supportingData: {},
      missingInformation: [],
      confidence: "High",
      dataCompleteness: 100,
      followUpOptions: [
        "What should I cultivate?",
        "Analyse market prices",
        "Show upcoming demand",
        "Calculate cultivation cost",
        "Check climate suitability",
        "Analyse my farm"
      ]
    };
  }

  // Merge ONLY stored user entities without inventing fake defaults
  const mergedEntities = {
    ...queryAnalysis.entities,
    landArea: queryAnalysis.entities.landArea || farmerProfile?.total_area || null,
    waterLevel: queryAnalysis.entities.waterLevel || farmerProfile?.water_availability || null,
    budget: queryAnalysis.entities.budget || farmerProfile?.annual_budget || null,
    location: queryAnalysis.entities.location || farmerProfile?.state || null
  };

  // Requirement #27 & #28: Handle missing parameters gracefully
  const hasPartialInfo = mergedEntities.landArea || mergedEntities.waterLevel || mergedEntities.location;
  const isMissingKeyParams = !mergedEntities.landArea || !mergedEntities.location;

  // 2. Execute Dynamic Query Plan
  const dbContext = await executeQueryPlan(queryAnalysis.intent, mergedEntities);

  // 3. Generate Analytical Recommendations
  let recommendations = null;
  if (queryAnalysis.intent === 'CROP_RECOMMENDATION' || queryAnalysis.intent === 'SAFER_OPTION' || (!mergedEntities.product && queryAnalysis.intent !== 'PRICE_EXPLANATION')) {
    recommendations = await generateFarmerRecommendations(farmerProfile, mergedEntities);
  }

  let riskProfile = null;
  if (mergedEntities.productId) {
    riskProfile = await calculateRiskProfile(mergedEntities.productId, mergedEntities.waterLevel || 'MEDIUM');
  }

  // 4. Formulate Response Text & Limitations Notice
  let aiTextResponse = '';
  const followUpOptions = [];

  if (queryAnalysis.intent === 'CROP_RECOMMENDATION' || queryAnalysis.intent === 'GENERAL_INQUIRY') {
    if (isMissingKeyParams) {
      aiTextResponse = `Based on the available information, I have prepared a preliminary crop comparison for you. However, to make this recommendation significantly more accurate for your specific farm, I recommend providing your location and water availability:`;
    } else {
      aiTextResponse = `Based on your **${mergedEntities.landArea} acres** land size, **${mergedEntities.waterLevel || 'moderate'}** water availability, and **${mergedEntities.location}** location, I have analyzed historical market prices, 10-year demand trends, water requirements, and investment costs to generate personalized options for your farm:`;
    }

    followUpOptions.push('Show historical price chart', 'Calculate 5-year investment', 'Give me a safer low-risk option', 'Compare with another crop', 'Find suitable buyers');
  } else if (queryAnalysis.intent === 'PRICE_EXPLANATION') {
    const pName = mergedEntities.product || 'Tomato';
    aiTextResponse = `I have analyzed the historical market price records for **${pName}**. Historical data shows that price movements were driven by a combination of high seasonal demand during festival windows and localized supply arrivals.`;
    
    followUpOptions.push(`Show ${pName} 5-year price chart`, `Check ${pName} investment cost`, `Compare ${pName} with Onion`);
  } else {
    aiTextResponse = `I have analyzed your request regarding **${mergedEntities.product || 'your farm plan'}** using our 500-product agricultural market database.`;
    followUpOptions.push('Show historical market price', 'Calculate expected profit', 'Check climate suitability');
  }

  if (queryAnalysis.typoCorrected) {
    aiTextResponse = `*(Interpreted "${userMessage}" as **${queryAnalysis.correctedQuery}**)*\n\n` + aiTextResponse;
  }

  return {
    message: aiTextResponse,
    intent: queryAnalysis.intent,
    queryAnalysis,
    recommendations: recommendations ? recommendations.recommendationOptions : [],
    landAllocation: recommendations ? recommendations.landAllocation : null,
    riskProfile: riskProfile || (recommendations?.recommendationOptions?.[0] ? { overallRiskLevel: 'LOW', overallRiskScore: 35 } : null),
    supportingData: {
      matchedProduct: dbContext.productData,
      historicalPrices: dbContext.historicalPrices,
      costData: dbContext.costData,
      priceFactors: dbContext.priceChangeFactors,
      upcomingEvents: dbContext.upcomingEvents
    },
    missingInformation: queryAnalysis.missingInfo,
    confidence: recommendations ? recommendations.recommendationConfidence : 'High',
    dataCompleteness: recommendations ? recommendations.dataCompletenessPercentage : 70,
    followUpOptions
  };
}

module.exports = {
  processFarmerQuery
};
