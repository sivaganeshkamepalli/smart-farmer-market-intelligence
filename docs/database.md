# Database Architecture & Entity Relationships

The platform database comprises 28 normalized tables storing agricultural agronomics, 10-year monthly market economics, climate records, events, buyers, transport/storage options, and farmer profiles.

## Core Schema Structure

1. **User & Farm Domain**:
   - `users`: Credentials, auth role, mobile, email, verification status.
   - `farmer_profiles`: Personal details, state, district, village, preferred language.
   - `farms`: Total area, area unit, location, soil type, soil pH, water availability, annual budget, labor.
   - `farm_plots`: Plot-level soil pH, water, current crop, and acreage.

2. **Agricultural Master Domain**:
   - `categories`: 14 master categories (Fruits, Vegetables, Flowers, Nuts, Grains, Pulses, Oilseeds, Spices, Herbs, Plantation, Medicinal, Aromatic, Aquatic, Other).
   - `sub_categories`: Subcategory classifications.
   - `products`: 500+ unique agricultural products.
   - `product_growth_characteristics`: Growth type (Tree, Above Ground, Underground, Bush, Vine, Aquatic, Protected), harvest days/months, productive lifespan.
   - `product_water_requirements`: Water level (Very Low, Low, Medium, High, Very High), irrigation frequency, drought/flood tolerance, drip suitability.
   - `product_soil_requirements`: Soil types, pH range (min_ph, max_ph), drainage requirements.
   - `product_climate_requirements`: Min/max temperature, optimal range, rainfall bounds, heat/cold tolerance.
   - `cultivation_costs`: Per acre costs for seeds, fertilizer, labor, land prep, monthly/seasonal breakdown.
   - `long_term_crop_economics`: Year 1 to 5+ cash flows, maintenance costs, expected yields, and profits for tree/estate crops (Badam, Mango, Guava, Pomegranate).

3. **Market Intelligence & Macro Domain**:
   - `markets`: Wholesale produce yards, location, market type.
   - `market_prices`: 10-year monthly minimum, maximum, and average prices, arrival quantities, and units.
   - `product_demand`: Estimated regional demand levels.
   - `product_supply`: Estimated cultivation area, production, and oversupply indicators.
   - `events` & `event_product_demand`: Religious seasons (Ayyappa season, Diwali), festivals, and historical price impact percentages.
   - `price_change_factors`: Causality records documenting weather, supply shocks, transport fuels, or policy impacts.

4. **Conversations & Planning Domain**:
   - `conversations`: Persistent chat threads.
   - `messages`: User and Assistant message history.
   - `ai_analysis_records`: Audit trail of intent, entities, calculations, predictions, and confidence scores.
