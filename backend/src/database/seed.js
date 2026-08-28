const { initDB, query, execRaw, getDbType } = require('../config/db');

const CATEGORIES = [
  { name: 'Fruits', code: 'FRUITS', desc: 'Fresh fruits and tree crops' },
  { name: 'Vegetables', code: 'VEGETABLES', desc: 'Leafy, root, and fruiting vegetables' },
  { name: 'Flowers', code: 'FLOWERS', desc: 'Commercial and ornamental flowers' },
  { name: 'Nuts', code: 'NUTS', desc: 'Edible tree nuts and oil nuts' },
  { name: 'Grains & Cereals', code: 'GRAINS', desc: 'Staple cereal grains' },
  { name: 'Pulses', code: 'PULSES', desc: 'Legumes and protein pulses' },
  { name: 'Oilseeds', code: 'OILSEEDS', desc: 'Edible and industrial oilseeds' },
  { name: 'Spices', code: 'SPICES', desc: 'Aromatic spices and condiments' },
  { name: 'Herbs', code: 'HERBS', desc: 'Culinary and culinary herbs' },
  { name: 'Plantation Crops', code: 'PLANTATION', desc: 'Perennial estate crops' },
  { name: 'Medicinal Crops', code: 'MEDICINAL', desc: 'Pharmacological and ayurvedic plants' },
  { name: 'Aromatic Crops', code: 'AROMATIC', desc: 'Essential oil yielding crops' },
  { name: 'Aquatic Crops', code: 'AQUATIC', desc: 'Water-cultivated plants and crops' },
  { name: 'Other Crops', code: 'OTHER', desc: 'Fodder, fiber, and miscellaneous crops' }
];

const MARKETS = [
  { name: 'Kolar Wholesale Mandi', location: 'Kolar', district: 'Kolar', state: 'Karnataka', type: 'WHOLESALE' },
  { name: 'Guntur Chilli & Produce Yard', location: 'Guntur', district: 'Guntur', state: 'Andhra Pradesh', type: 'EXPORT_HUB' },
  { name: 'Azadpur Mandi', location: 'Delhi', district: 'North Delhi', state: 'Delhi', type: 'NATIONAL_HUB' },
  { name: 'Vashi Agricultural Market', location: 'Navi Mumbai', district: 'Thane', state: 'Maharashtra', type: 'WHOLESALE' },
  { name: 'Koyambedu Wholesale Market', location: 'Chennai', district: 'Chennai', state: 'Tamil Nadu', type: 'WHOLESALE' },
  { name: 'Dindigul Fruit & Veg Market', location: 'Dindigul', district: 'Dindigul', state: 'Tamil Nadu', type: 'REGIONAL' }
];

const TECHNOLOGIES = [
  { name: 'Drip Irrigation', type: 'IRRIGATION', desc: 'Precision water and fertigation delivery directly to roots' },
  { name: 'Sprinkler System', type: 'IRRIGATION', desc: 'Overhead micro-sprinkler for uniform microclimate control' },
  { name: 'Soil & Moisture Sensors', type: 'IOT_SENSORS', desc: 'Real-time telemetry for soil pH, NPK, and volumetric water content' },
  { name: 'Greenhouse / Polyhouse', type: 'PROTECTED', desc: 'Climate-controlled polyhouse for high-value crops' },
  { name: 'Shade Net House', type: 'PROTECTED', desc: '50% - 75% shade netting for heat protection' },
  { name: 'Hydroponics / NFT', type: 'SOIL-LESS', desc: 'Nutrient Film Technique for soil-less fast-growth cultivation' },
  { name: 'Plastic Mulching Sheet', type: 'CULTIVATION', desc: '25-micron silver-black plastic mulch for weed control & moisture retention' },
  { name: 'Integrated Pest Monitoring', type: 'BIOLOGICAL', desc: 'Pheromone traps and sticky traps for early pest detection' }
];

const PRODUCT_TEMPLATES = {
  FRUITS: [
    'Mango (Alphonso)', 'Mango (Banganapalli)', 'Mango (Dasheri)', 'Mango (Kesar)', 'Guava (Taiwan Pink)',
    'Guava (Allahabad Safeda)', 'Pomegranate (Bhagwa)', 'Pomegranate (Ganesh)', 'Banana (Grand Naine)',
    'Banana (Elakki)', 'Papaya (Red Lady)', 'Apple (Fuji)', 'Apple (Royal Gala)', 'Orange (Nagpur)',
    'Grapes (Thomson Seedless)', 'Grapes (Black Muscat)', 'Watermelon (Kiran)', 'Muskmelon (Kajal)',
    'Custard Apple (Balanagar)', 'Fig (Poona)', 'Sapota (Kalipatti)', 'Pineapple (Queen)',
    'Strawberry (Camarosa)', 'Dragon Fruit (Red Flesh)', 'Avocado (Hass)', 'Jackfruit (Honey Jack)',
    'Lychee (Shahi)', 'Peach (Flordasun)', 'Plum (Satluj Purple)', 'Pear (Patharnakh)', 'Kiwi (Hayward)',
    'Passion Fruit (Purple)', 'Star Fruit', 'Rambutan', 'Mangosteen', 'Sweet Lime (Mosambi)', 'Aonla (Chakaiya)',
    'Jamun (Konkan Bahadoli)', 'Wood Apple', 'Bael Fruit'
  ],
  VEGETABLES: [
    'Tomato (Hybrid Arka Rakshak)', 'Tomato (Roma)', 'Tomato (Cherry)', 'Onion (Red Nashik)', 'Onion (White)',
    'Potato (Kufri Jyoti)', 'Carrot (Red Super)', 'Brinjal (Purple Long)', 'Brinjal (Round Green)',
    'Okra (Bhindi Radhika)', 'Cabbage (Golden Acre)', 'Cauliflower (Snowball)', 'Spinach (All Green)',
    'Capsicum (Green)', 'Capsicum (Red Yellow Bell)', 'Bitter Gourd (Jhalri)', 'Bottle Gourd (Pusa Naveen)',
    'Ridge Gourd', 'Sponge Gourd', 'Snake Gourd', 'Pumpkin (Disco)', 'Cucumber (Green Long)',
    'Cucumber (Dutch Hydroponic)', 'Green Chillies (G4)', 'Garlic (Yamuna Safed)', 'Ginger (Maran)',
    'Radish (Pusa Chetki)', 'Beetroot (Ruby Queen)', 'Drumstick (Moringa PKM-1)', 'French Beans',
    'Cluster Beans (Guar)', 'Cowpea (Lobia)', 'Sweet Potato', 'Colocasia (Arbi)', 'Elephant Foot Yam',
    'Broad Beans', 'Turnip', 'Fenugreek Leaves (Methi)', 'Coriander Leaves', 'Curry Leaves'
  ],
  FLOWERS: [
    'Rose (Dutch Red)', 'Rose (Button Yellow)', 'Jasmine (Madurai Malli)', 'Marigold (African Orange)',
    'Marigold (French Yellow)', 'Chrysanthemum (Yellow)', 'Tuberose (Single)', 'Tuberose (Double)',
    'Gerbera (Hybrid)', 'Carnation (Pink)', 'Orchid (Dendrobium)', 'Anthurium (Red)', 'Gladiolus',
    'Lotus (Pink)', 'Crossandra (Kanakambaram)', 'Lilium', 'Aster', 'Zinnia', 'Gomphrena', 'Statice'
  ],
  NUTS: [
    'Badam (Almond Nonpareil)', 'Badam (California Type)', 'Cashew (Vengurla-4)', 'Cashew (Ullal-1)',
    'Walnut (Kashmiri Soft Shell)', 'Pistachio (Kerman)', 'Macadamia Nut', 'Hazelnut', 'Pecan Nut',
    'Betel Nut (Arecanut Mangala)', 'Coconut (Tall West Coast)', 'Coconut (Dwarf Green)', 'Pine Nut'
  ],
  GRAINS: [
    'Rice (Sona Masoori)', 'Rice (Basmati 1121)', 'Rice (IR-64)', 'Rice (Ponni)', 'Wheat (Sharbati)',
    'Wheat (HD-2967)', 'Maize (Yellow Hybrid)', 'Sweet Corn', 'Pearl Millet (Bajra)', 'Finger Millet (Ragi)',
    'Sorghum (Jowar White)', 'Foxtail Millet (Navane)', 'Little Millet (Samai)', 'Kodo Millet', 'Barnyard Millet'
  ],
  PULSES: [
    'Red Gram (Tur / Arhar Dal)', 'Green Gram (Moong Dal)', 'Black Gram (Urad Dal)', 'Bengal Gram (Chana)',
    'Chickpea (Kabuli)', 'Lentil (Masoor Dal)', 'Horse Gram (Kollu)', 'Cowpea Pulse', 'Dry Green Peas', 'Rajma (Red Kidney Beans)'
  ],
  OILSEEDS: [
    'Groundnut (Peanut JL-24)', 'Mustard (Pusa Bold)', 'Soybean (JS-335)', 'Sunflower (KBSH-44)',
    'Sesame (Till White)', 'Castor (GCH-7)', 'Safflower (Kusum)', 'Niger Seed', 'Linseed (Flaxseed)'
  ],
  SPICES: [
    'Dry Red Chilli (Byadgi)', 'Dry Red Chilli (Teja)', 'Black Pepper (Panniyur-1)', 'Cardamom (Small Green)',
    'Cardamom (Large)', 'Turmeric (Salem Finger)', 'Turmeric (Lakadong)', 'Cumin Seeds (Jeera)',
    'Coriander Seeds (Dhana)', 'Fennel Seeds (Saunf)', 'Fenugreek Seeds (Methi)', 'Clove', 'Cinnamon (Ceylon)',
    'Nutmeg & Mace', 'Star Anise', 'Saffron (Kashmiri Mongra)'
  ],
  HERBS: [
    'Mint (Pudina)', 'Basil (Sweet Tulsi)', 'Holy Basil (Shyama Tulsi)', 'Rosemary', 'Thyme',
    'Oregano', 'Parsley (Curly)', 'Stevia (Sweet Herb)', 'Aloe Vera (Barbadensis)', 'Lemongrass'
  ],
  PLANTATION: [
    'Coffee (Arabica)', 'Coffee (Robusta)', 'Tea (Darjeeling CTC)', 'Rubber (RRII 105)',
    'Cocoa (Criollo)', 'Oil Palm', 'Betel Leaf (Banarasi)', 'Cardamom Plantation', 'Bamboo (Dendrocalamus)'
  ],
  MEDICINAL: [
    'Ashwagandha (Withania)', 'Shatavari (Asparagus)', 'Giloy (Guduchi)', 'Kalmegh',
    'Isabgol (Psyllium Husk)', 'Sarpagandha', 'Brahmi (Bacopa)', 'Senna (Cassia)'
  ],
  AROMATIC: [
    'Vetiver (Khus)', 'Palmarosa', 'Citronella', 'Patchouli', 'Geranium Oil Plant', 'Javagrass'
  ],
  AQUATIC: [
    'Water Chestnut (Singhara)', 'Lotus Root (Kamal Kakdi)', 'Gorgon Nut (Makhana)', 'Water Spinach (Kangkong)', 'Azolla Fodder'
  ],
  OTHER: [
    'Sugarcane (Co 0238)', 'Cotton (Bt Hybrid)', 'Jute (Mesta)', 'Sunn Hemp', 'Napier Grass Fodder'
  ]
};

async function seed() {
  console.log('Starting comprehensive seed process for Smart Farmer Platform...');
  await initDB();

  // Clear existing tables in sequence to avoid FK conflicts
  const tables = [
    'ai_analysis_records', 'messages', 'conversations', 'cultivation_plans', 'risk_factors',
    'buyer_product_requirements', 'buyers', 'price_change_factors', 'event_product_demand', 'events',
    'market_events', 'product_supply', 'product_demand', 'market_prices', 'markets',
    'product_technology_compatibility', 'cultivation_technologies', 'product_uses',
    'long_term_crop_economics', 'cultivation_costs', 'yield_data', 'cultivation_stages',
    'product_climate_requirements', 'product_soil_requirements', 'product_water_requirements',
    'product_growth_characteristics', 'products', 'sub_categories', 'categories',
    'farm_plots', 'farms', 'farmer_profiles', 'users'
  ];

  for (const t of tables) {
    try {
      await execRaw(`DELETE FROM ${t};`);
    } catch (e) {
      // Ignore if table doesn't exist
    }
  }

  console.log('Cleared existing data.');

  // 1. Seed Categories & Sub-categories
  const categoryMap = {};
  for (const cat of CATEGORIES) {
    const res = await query('INSERT INTO categories (name, code, description) VALUES (?, ?, ?)', [cat.name, cat.code, cat.desc]);
    const catId = res.insertId || (await query('SELECT id FROM categories WHERE code = ?', [cat.code]))[0].id;
    categoryMap[cat.code] = catId;

    // Subcategory
    await query('INSERT INTO sub_categories (category_id, name, code, description) VALUES (?, ?, ?, ?)', [
      catId, `${cat.name} Standard`, `${cat.code}_STD`, `Standard commercial varieties of ${cat.name}`
    ]);
  }
  console.log(`Seeded ${CATEGORIES.length} Categories.`);

  // 2. Seed Markets
  const marketIds = [];
  for (const m of MARKETS) {
    const res = await query('INSERT INTO markets (name, location, district, state, market_type) VALUES (?, ?, ?, ?, ?)', [
      m.name, m.location, m.district, m.state, m.type
    ]);
    marketIds.push(res.insertId || (await query('SELECT id FROM markets WHERE name = ?', [m.name]))[0].id);
  }
  console.log(`Seeded ${MARKETS.length} Markets.`);

  // 3. Seed Technologies
  const techIds = [];
  for (const t of TECHNOLOGIES) {
    const res = await query('INSERT INTO cultivation_technologies (name, technology_type, description) VALUES (?, ?, ?)', [
      t.name, t.type, t.desc
    ]);
    techIds.push(res.insertId || (await query('SELECT id FROM cultivation_technologies WHERE name = ?', [t.name]))[0].id);
  }

  // 4. Generate 500+ Products dynamically across categories
  const allProducts = [];
  let productCount = 0;

  for (const [catCode, templates] of Object.entries(PRODUCT_TEMPLATES)) {
    const catId = categoryMap[catCode] || categoryMap['OTHER'];
    const targetCount = catCode === 'FRUITS' ? 80 :
                        catCode === 'VEGETABLES' ? 100 :
                        catCode === 'FLOWERS' ? 40 :
                        catCode === 'NUTS' ? 30 :
                        catCode === 'GRAINS' ? 50 :
                        catCode === 'PULSES' ? 40 :
                        catCode === 'OILSEEDS' ? 25 :
                        catCode === 'SPICES' ? 35 :
                        catCode === 'HERBS' ? 20 :
                        catCode === 'PLANTATION' ? 25 :
                        catCode === 'MEDICINAL' ? 15 :
                        catCode === 'AROMATIC' ? 10 :
                        catCode === 'AQUATIC' ? 15 : 15;

    let index = 0;
    while (index < targetCount) {
      let baseName = templates[index % templates.length];
      let pName = index >= templates.length ? `${baseName} Grade-${Math.floor(index / templates.length) + 1}` : baseName;
      let sciName = `${baseName.split(' ')[0]} spp.`;
      
      const res = await query('INSERT INTO products (name, scientific_name, description, category_id, status) VALUES (?, ?, ?, ?, ?)', [
        pName, sciName, `Commercial high-yield cultivar of ${pName} optimized for regional climate performance.`, catId, 'ACTIVE'
      ]);
      const pId = res.insertId || (await query('SELECT id FROM products WHERE name = ?', [pName]))[0].id;
      allProducts.push({ id: pId, name: pName, category: catCode });
      productCount++;
      index++;
    }
  }

  console.log(`Seeded ${productCount} unique Products across 14 categories.`);

  // 5. Seed Connected Attributes for every product
  const waterLevels = ['VERY_LOW', 'LOW', 'MEDIUM', 'HIGH', 'VERY_HIGH'];
  const growthTypes = ['ABOVE_GROUND', 'UNDERGROUND', 'TREE', 'BUSH', 'VINE', 'AQUATIC', 'PROTECTED', 'OPEN_FIELD'];
  const soilTypes = ['Red Loamy', 'Black Cotton', 'Alluvial', 'Sandy Loam', 'Laterite'];

  for (const p of allProducts) {
    const isTree = p.category === 'FRUITS' || p.category === 'NUTS' || p.category === 'PLANTATION';
    const isShort = p.category === 'VEGETABLES' || p.category === 'FLOWERS' || p.category === 'HERBS';
    
    const growthType = isTree ? 'TREE' : p.category === 'AQUATIC' ? 'AQUATIC' : isShort ? 'ABOVE_GROUND' : 'BUSH';
    const waterLevel = p.category === 'AQUATIC' ? 'VERY_HIGH' : isTree ? 'MEDIUM' : isShort ? 'HIGH' : 'LOW';
    const firstHarvestDays = isShort ? 60 + (p.id % 30) : 120;
    const firstHarvestYears = isTree ? 3 + (p.id % 3) : 0;
    const lifespanYears = isTree ? 25 + (p.id % 20) : 1;

    // Growth Characteristics
    await query(`
      INSERT INTO product_growth_characteristics 
      (product_id, growth_type, cultivation_method, first_harvest_days, first_harvest_months, first_meaningful_harvest_years, productive_lifespan_years, harvest_frequency, description)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, [
      p.id, growthType, 'Open Field / Drip Irrigated', firstHarvestDays, Math.ceil(firstHarvestDays / 30), firstHarvestYears, lifespanYears,
      isShort ? 'Weekly harvest over 60 days' : 'Annual seasonal harvest', `High yield characteristics for ${p.name}`
    ]);

    // Water Requirements
    await query(`
      INSERT INTO product_water_requirements
      (product_id, water_level, approximate_water_requirement, irrigation_frequency, drought_tolerance, flood_tolerance, rainfed_suitability, drip_suitability, notes)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, [
      p.id, waterLevel, `${300 + (p.id % 10) * 100} mm per season`, 'Every 4-7 days',
      waterLevel === 'LOW' || waterLevel === 'VERY_LOW' ? 'HIGH' : 'MEDIUM',
      waterLevel === 'VERY_HIGH' ? 'HIGH' : 'LOW',
      waterLevel === 'LOW' ? 1 : 0, 1, `Water regime optimized for ${p.name}`
    ]);

    // Soil Requirements
    await query(`
      INSERT INTO product_soil_requirements
      (product_id, soil_type, min_ph, max_ph, drainage_requirement, soil_moisture_requirement, soil_fertility_requirement, notes)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `, [
      p.id, soilTypes[p.id % soilTypes.length], 6.0, 7.5, 'Well-drained deep loamy soil', 'Moderate moisture retention', 'High organic matter', `Soil parameters for ${p.name}`
    ]);

    // Climate Requirements
    await query(`
      INSERT INTO product_climate_requirements
      (product_id, min_temperature, max_temperature, optimal_temperature_min, optimal_temperature_max, rainfall_min, rainfall_max, humidity_min, humidity_max, heat_tolerance, cold_tolerance, drought_tolerance, flood_tolerance, climate_notes)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, [
      p.id, 15.0, 38.0, 22.0, 32.0, 400.0, 1800.0, 45.0, 85.0, 'HIGH', 'MEDIUM',
      waterLevel === 'LOW' ? 'HIGH' : 'MEDIUM', 'LOW', `Tropical to subtropical climate range for ${p.name}`
    ]);

    // Cultivation Costs
    const initCost = isTree ? 45000 + (p.id % 20) * 2000 : 18000 + (p.id % 15) * 1000;
    const monthlyCost = isTree ? 3500 : 2500;
    await query(`
      INSERT INTO cultivation_costs (product_id, cost_type, amount, unit, period_type, year)
      VALUES (?, 'INITIAL', ?, 'per acre', 'INITIAL', 2026)
    `, [p.id, initCost]);
    await query(`
      INSERT INTO cultivation_costs (product_id, cost_type, amount, unit, period_type, year)
      VALUES (?, 'LABOUR_MAINTENANCE', ?, 'per acre', 'MONTHLY', 2026)
    `, [p.id, monthlyCost]);

    // Yield Data
    const avgYield = isTree ? 8.5 + (p.id % 5) : 12.0 + (p.id % 10);
    await query(`
      INSERT INTO yield_data (product_id, yield_min, yield_average, yield_max, yield_unit, area_unit, data_year)
      VALUES (?, ?, ?, ?, 'tons', 'acre', 2025)
    `, [p.id, avgYield * 0.75, avgYield, avgYield * 1.35]);

    // Long term economics for tree crops (Badam, Mango, Guava, Pomegranate, etc.)
    if (isTree) {
      for (let yr = 1; yr <= 5; yr++) {
        const yrInvest = yr === 1 ? initCost : 15000;
        const yrMaint = 12000 + yr * 2000;
        const yrYield = yr < 3 ? 0 : (yr - 2) * 3.5;
        const yrRev = yrYield * 45000; // estimated price per ton
        const yrProfit = yrRev - (yrInvest + yrMaint);
        await query(`
          INSERT INTO long_term_crop_economics (product_id, year_number, investment, maintenance_cost, expected_yield, expected_revenue, expected_profit, notes)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        `, [p.id, yr, yrInvest, yrMaint, yrYield, yrRev, yrProfit, `Year ${yr} financial projection for ${p.name}`]);
      }
    }

    // Technology Compatibility
    const primaryTechId = techIds[p.id % techIds.length];
    await query(`
      INSERT INTO product_technology_compatibility (product_id, technology_id, investment_cost, expected_benefit, water_saving_percentage, yield_impact, risk_reduction)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `, [
      p.id, primaryTechId, 25000, 'Increases water efficiency and yield uniformity by 35%', 40.0, 25.0, 'HIGH'
    ]);

    // Product Uses
    await query(`
      INSERT INTO product_uses (product_id, use_category, use_description)
      VALUES (?, 'FRESH_CONSUMPTION', 'Direct table sale and retail consumption')
    `, [p.id]);
    await query(`
      INSERT INTO product_uses (product_id, use_category, use_description)
      VALUES (?, 'PROCESSING', 'Value-added processing into jams, pulps, oils, or dried goods')
    `, [p.id]);

    // Risk Factors
    await query(`
      INSERT INTO risk_factors (product_id, risk_type, risk_level, risk_score, description)
      VALUES (?, 'CLIMATE', 'MEDIUM', 45.0, 'Sensitive to unseasonal frost and extreme monsoon deluge during flowering stage')
    `, [p.id]);
    await query(`
      INSERT INTO risk_factors (product_id, risk_type, risk_level, risk_score, description)
      VALUES (?, 'MARKET', 'MEDIUM', 52.0, 'Seasonal price volatility during peak harvest arrival months')
    `, [p.id]);
  }

  console.log('Seeded connected agronomic data (Growth, Water, Soil, Climate, Costs, Yield, Tech, Risks) for all products.');

  // 6. Generate 10 Years of Monthly Market Price, Demand, and Supply Data (2016-2026)
  console.log('Generating 10-year monthly market prices, demand, and supply records...');
  const years = [2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024, 2025, 2026];

  for (const p of allProducts) {
    const isDetailed = p.id <= 60;
    const sampleYears = isDetailed ? years : [2024, 2025, 2026];
    const basePrice = (p.id % 20 + 1) * 350 + 800; // Base price in Rs per quintal (e.g. 1500 to 7500)

    for (const yr of sampleYears) {
      for (let m = 1; m <= 12; m++) {
        if (yr === 2026 && m > 8) break; // Up to current date

        const dateStr = `${yr}-${String(m).padStart(2, '0')}-15`;
        const mktId = marketIds[(p.id + m) % marketIds.length];

        // Seasonality factor (Tomato & Vegetables peak in Feb / Nov, Mango in May-July)
        let seasonalFactor = 1.0;
        if (p.name.includes('Tomato') && (m === 2 || m === 11)) seasonalFactor = 1.65;
        else if (p.name.includes('Onion') && (m === 9 || m === 10)) seasonalFactor = 1.80;
        else if (p.name.includes('Mango') && (m >= 4 && m <= 7)) seasonalFactor = 1.40;
        else if (m === 10 || m === 11) seasonalFactor = 1.25; // Festival season demand boost

        const avgPrice = Math.round(basePrice * seasonalFactor * (1 + (yr - 2016) * 0.05) * (0.9 + (Math.sin(m) * 0.1)));
        const minPrice = Math.round(avgPrice * 0.85);
        const maxPrice = Math.round(avgPrice * 1.18);
        const arrivalQty = Math.round(1500 + Math.cos(m) * 400 + (p.id % 10) * 100);
        const soldQty = Math.round(arrivalQty * 0.94);

        // Insert Market Price
        const priceRes = await query(`
          INSERT INTO market_prices (product_id, market_id, date, year, month, minimum_price, maximum_price, average_price, quantity_arrived, quantity_sold, unit)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'quintal')
        `, [p.id, mktId, dateStr, yr, m, minPrice, maxPrice, avgPrice, arrivalQty, soldQty]);

        const priceId = priceRes.insertId;

        // Insert Demand
        const dLevel = seasonalFactor > 1.3 ? 'HIGH' : seasonalFactor > 1.5 ? 'VERY_HIGH' : 'MEDIUM';
        await query(`
          INSERT INTO product_demand (product_id, market_id, date, year, month, demand_level, estimated_demand, demand_unit)
          VALUES (?, ?, ?, ?, ?, ?, ?, 'metric_tons')
        `, [p.id, mktId, dateStr, yr, m, dLevel, Math.round(arrivalQty * 1.05)]);

        // Insert Supply
        const sLevel = arrivalQty > 1700 ? 'HIGH' : arrivalQty < 1200 ? 'LOW' : 'MEDIUM';
        await query(`
          INSERT INTO product_supply (product_id, date, year, month, estimated_area, estimated_production, market_arrival, supply_level)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        `, [p.id, dateStr, yr, m, 1200 + m * 50, arrivalQty * 1.2, arrivalQty, sLevel]);

        // Causal factors for price spikes
        if (seasonalFactor > 1.5 && priceId) {
          await query(`
            INSERT INTO price_change_factors (market_price_id, product_id, year, month, factor_type, factor_description, impact_direction, estimated_impact)
            VALUES (?, ?, ?, ?, 'SEASONAL_FESTIVAL', 'High festival and seasonal consumption demand coupled with localized supply delay', 'INCREASE', 35.0)
          `, [priceId, p.id, yr, m]);
        }
      }
    }
  }

  console.log('Seeded historical market prices, demand levels, and supply volumes.');

  // 7. Seed Events & Policy Gazette
  const event1 = await query(`
    INSERT INTO events (name, event_type, start_date, end_date, description, expected_population_impact)
    VALUES ('Ayyappa & Winter Festive Season', 'RELIGIOUS', '2026-11-15', '2027-01-15', 'Peak religious pilgrimage season driving 300% surge in demand for vegetables, milk, fruits, and flowers.', 'HIGH')
  `);
  const event1Id = event1.insertId || 1;

  await query(`
    INSERT INTO event_product_demand (event_id, product_id, historical_demand_change_percentage, historical_price_change_percentage, demand_direction)
    VALUES (?, ?, 45.0, 30.0, 'INCREASE')
  `, [event1Id, allProducts[0].id]); // Tomato

  await query(`
    INSERT INTO policy_events (title, policy_type, start_date, description, affected_products, impact_direction)
    VALUES ('Minimum Support Price & Export Incentive Scheme', 'MSP', '2026-01-01', 'Government announced 8% increase in MSP and freight subsidy for horticulture exports.', 'Vegetables, Spices, Fruits', 'POSITIVE')
  `);

  // 8. Seed Buyers & Transport & Storage Options
  const buyer1 = await query(`
    INSERT INTO buyers (name, buyer_type, location, verified_status, contact_information, requirements)
    VALUES ('AgriCorp Fresh Exports', 'EXPORTER', 'Chennai Port Hub', 1, '+91-98400-11223', 'Requires Grade-A Pomegranate, Tomato, and Chilli for UAE export.')
  `);
  const buyer1Id = buyer1.insertId || 1;

  await query(`
    INSERT INTO buyer_product_requirements (buyer_id, product_id, minimum_quantity, maximum_quantity, quality_requirements, offered_price, status)
    VALUES (?, ?, 5.0, 50.0, 'Grade-A export quality, uniform size, zero pest blemish', 4800.0, 'OPEN')
  `, [buyer1Id, allProducts[0].id]);

  await query(`
    INSERT INTO transport_options (origin, destination, transport_type, estimated_cost, distance, estimated_time)
    VALUES ('Kolar Farm Gate', 'Azadpur Delhi Mandi', 'REFRIGERATED_VAN', 14500.0, 1850.0, '36 Hours')
  `);

  await query(`
    INSERT INTO storage_options (location, storage_type, capacity, cost_per_unit, status)
    VALUES ('Kolar Cold Storage Hub', 'COLD_STORAGE', 5000.0, 150.0, 'AVAILABLE')
  `);

  console.log('Seed completed successfully! (Zero dummy user accounts seeded. Users table starts empty.)');
}

seed().then(() => {
  process.exit(0);
}).catch((err) => {
  console.error('Seed script failed:', err);
  process.exit(1);
});
