-- SMART FARMER MARKET INTELLIGENCE PLATFORM DATABASE SCHEMA
-- Compatible with MySQL and SQLite

CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  full_name VARCHAR(255),
  email VARCHAR(255) UNIQUE,
  phone VARCHAR(50) UNIQUE,
  password_hash VARCHAR(255),
  google_id VARCHAR(255) UNIQUE,
  auth_provider VARCHAR(50) DEFAULT 'LOCAL',
  role VARCHAR(50) DEFAULT 'FARMER',
  is_verified BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  last_login_at TIMESTAMP NULL
);

CREATE TABLE IF NOT EXISTS farmer_profiles (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  full_name VARCHAR(255) NOT NULL,
  preferred_language VARCHAR(50) DEFAULT 'English',
  phone VARCHAR(50),
  email VARCHAR(255),
  state VARCHAR(100),
  district VARCHAR(100),
  village VARCHAR(100),
  location_latitude DECIMAL(10, 8),
  location_longitude DECIMAL(11, 8),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS farms (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  farm_name VARCHAR(255) NOT NULL,
  total_area DECIMAL(10, 2) NOT NULL,
  area_unit VARCHAR(50) DEFAULT 'acres',
  location VARCHAR(255),
  state VARCHAR(100),
  district VARCHAR(100),
  village VARCHAR(100),
  latitude DECIMAL(10, 8),
  longitude DECIMAL(11, 8),
  soil_type VARCHAR(100),
  soil_ph DECIMAL(4, 2),
  water_availability VARCHAR(50),
  irrigation_type VARCHAR(100),
  annual_budget DECIMAL(12, 2),
  labour_availability VARCHAR(50),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS farm_plots (
  id INT AUTO_INCREMENT PRIMARY KEY,
  farm_id INT NOT NULL,
  plot_name VARCHAR(255) NOT NULL,
  area DECIMAL(10, 2) NOT NULL,
  area_unit VARCHAR(50) DEFAULT 'acres',
  soil_type VARCHAR(100),
  soil_ph DECIMAL(4, 2),
  water_availability VARCHAR(50),
  irrigation_type VARCHAR(100),
  current_crop VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (farm_id) REFERENCES farms(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS categories (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL UNIQUE,
  code VARCHAR(50) NOT NULL UNIQUE,
  description TEXT
);

CREATE TABLE IF NOT EXISTS sub_categories (
  id INT AUTO_INCREMENT PRIMARY KEY,
  category_id INT NOT NULL,
  name VARCHAR(100) NOT NULL,
  code VARCHAR(50) NOT NULL,
  description TEXT,
  FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS products (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  scientific_name VARCHAR(255),
  description TEXT,
  category_id INT NOT NULL,
  sub_category_id INT,
  status VARCHAR(50) DEFAULT 'ACTIVE',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (category_id) REFERENCES categories(id),
  FOREIGN KEY (sub_category_id) REFERENCES sub_categories(id)
);

CREATE TABLE IF NOT EXISTS product_growth_characteristics (
  id INT AUTO_INCREMENT PRIMARY KEY,
  product_id INT NOT NULL,
  growth_type VARCHAR(50) NOT NULL,
  cultivation_method VARCHAR(100),
  first_harvest_days INT,
  first_harvest_months INT,
  first_meaningful_harvest_years INT,
  productive_lifespan_years INT,
  harvest_frequency VARCHAR(100),
  description TEXT,
  FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS product_water_requirements (
  id INT AUTO_INCREMENT PRIMARY KEY,
  product_id INT NOT NULL,
  water_level VARCHAR(50) NOT NULL,
  approximate_water_requirement VARCHAR(100),
  irrigation_frequency VARCHAR(100),
  drought_tolerance VARCHAR(50),
  flood_tolerance VARCHAR(50),
  water_critical_stages VARCHAR(255),
  rainfed_suitability BOOLEAN DEFAULT FALSE,
  drip_suitability BOOLEAN DEFAULT TRUE,
  notes TEXT,
  FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS product_soil_requirements (
  id INT AUTO_INCREMENT PRIMARY KEY,
  product_id INT NOT NULL,
  soil_type VARCHAR(255) NOT NULL,
  min_ph DECIMAL(4, 2),
  max_ph DECIMAL(4, 2),
  drainage_requirement VARCHAR(100),
  soil_moisture_requirement VARCHAR(100),
  soil_fertility_requirement VARCHAR(100),
  notes TEXT,
  FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS product_climate_requirements (
  id INT AUTO_INCREMENT PRIMARY KEY,
  product_id INT NOT NULL,
  min_temperature DECIMAL(5, 2),
  max_temperature DECIMAL(5, 2),
  optimal_temperature_min DECIMAL(5, 2),
  optimal_temperature_max DECIMAL(5, 2),
  rainfall_min DECIMAL(7, 2),
  rainfall_max DECIMAL(7, 2),
  humidity_min DECIMAL(5, 2),
  humidity_max DECIMAL(5, 2),
  heat_tolerance VARCHAR(50),
  cold_tolerance VARCHAR(50),
  drought_tolerance VARCHAR(50),
  flood_tolerance VARCHAR(50),
  climate_notes TEXT,
  FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS cultivation_stages (
  id INT AUTO_INCREMENT PRIMARY KEY,
  product_id INT NOT NULL,
  stage_name VARCHAR(100) NOT NULL,
  duration_days INT,
  water_requirement VARCHAR(100),
  temperature_requirement VARCHAR(100),
  rainfall_preference VARCHAR(100),
  labour_requirement VARCHAR(100),
  risk_factors TEXT,
  notes TEXT,
  FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS yield_data (
  id INT AUTO_INCREMENT PRIMARY KEY,
  product_id INT NOT NULL,
  region_id VARCHAR(100) DEFAULT 'ALL',
  cultivation_method VARCHAR(100),
  yield_min DECIMAL(10, 2),
  yield_average DECIMAL(10, 2),
  yield_max DECIMAL(10, 2),
  yield_unit VARCHAR(50) DEFAULT 'tons',
  area_unit VARCHAR(50) DEFAULT 'acre',
  data_year INT,
  source VARCHAR(255) DEFAULT 'Govt Agri Database',
  confidence DECIMAL(5, 2) DEFAULT 90.0,
  FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS cultivation_costs (
  id INT AUTO_INCREMENT PRIMARY KEY,
  product_id INT NOT NULL,
  region_id VARCHAR(100) DEFAULT 'ALL',
  cost_type VARCHAR(100) NOT NULL,
  amount DECIMAL(12, 2) NOT NULL,
  unit VARCHAR(50) DEFAULT 'per acre',
  period_type VARCHAR(50) DEFAULT 'SEASONAL',
  year INT,
  source VARCHAR(255) DEFAULT 'Agri Cost Index',
  notes TEXT,
  FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS long_term_crop_economics (
  id INT AUTO_INCREMENT PRIMARY KEY,
  product_id INT NOT NULL,
  year_number INT NOT NULL,
  investment DECIMAL(12, 2) NOT NULL,
  maintenance_cost DECIMAL(12, 2) NOT NULL,
  expected_yield DECIMAL(10, 2) NOT NULL,
  expected_revenue DECIMAL(12, 2) NOT NULL,
  expected_profit DECIMAL(12, 2) NOT NULL,
  notes TEXT,
  FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS product_uses (
  id INT AUTO_INCREMENT PRIMARY KEY,
  product_id INT NOT NULL,
  use_category VARCHAR(100) NOT NULL,
  use_description TEXT,
  FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS cultivation_technologies (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  technology_type VARCHAR(100)
);

CREATE TABLE IF NOT EXISTS product_technology_compatibility (
  id INT AUTO_INCREMENT PRIMARY KEY,
  product_id INT NOT NULL,
  technology_id INT NOT NULL,
  investment_cost DECIMAL(12, 2),
  expected_benefit TEXT,
  water_saving_percentage DECIMAL(5, 2),
  yield_impact DECIMAL(5, 2),
  risk_reduction VARCHAR(100),
  suitability VARCHAR(50) DEFAULT 'HIGH',
  notes TEXT,
  FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
  FOREIGN KEY (technology_id) REFERENCES cultivation_technologies(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS markets (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  location VARCHAR(255),
  district VARCHAR(100),
  state VARCHAR(100),
  latitude DECIMAL(10, 8),
  longitude DECIMAL(11, 8),
  market_type VARCHAR(100) DEFAULT 'WHOLESALE',
  status VARCHAR(50) DEFAULT 'ACTIVE'
);

CREATE TABLE IF NOT EXISTS market_prices (
  id INT AUTO_INCREMENT PRIMARY KEY,
  product_id INT NOT NULL,
  market_id INT NOT NULL,
  date DATE NOT NULL,
  year INT NOT NULL,
  month INT NOT NULL,
  minimum_price DECIMAL(10, 2),
  maximum_price DECIMAL(10, 2),
  average_price DECIMAL(10, 2) NOT NULL,
  quantity_arrived DECIMAL(12, 2),
  quantity_sold DECIMAL(12, 2),
  unit VARCHAR(50) DEFAULT 'quintal',
  source VARCHAR(255) DEFAULT 'Agmarknet Intelligence',
  FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
  FOREIGN KEY (market_id) REFERENCES markets(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS product_demand (
  id INT AUTO_INCREMENT PRIMARY KEY,
  product_id INT NOT NULL,
  region_id VARCHAR(100) DEFAULT 'ALL',
  market_id INT,
  date DATE NOT NULL,
  year INT NOT NULL,
  month INT NOT NULL,
  demand_level VARCHAR(50) NOT NULL,
  estimated_demand DECIMAL(12, 2),
  demand_unit VARCHAR(50) DEFAULT 'metric_tons',
  source VARCHAR(255) DEFAULT 'Market Demand Index',
  confidence DECIMAL(5, 2) DEFAULT 88.5,
  FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS product_supply (
  id INT AUTO_INCREMENT PRIMARY KEY,
  product_id INT NOT NULL,
  region_id VARCHAR(100) DEFAULT 'ALL',
  date DATE NOT NULL,
  year INT NOT NULL,
  month INT NOT NULL,
  estimated_area DECIMAL(12, 2),
  estimated_production DECIMAL(12, 2),
  market_arrival DECIMAL(12, 2),
  supply_level VARCHAR(50) NOT NULL,
  source VARCHAR(255) DEFAULT 'Supply Survey Data',
  confidence DECIMAL(5, 2) DEFAULT 85.0,
  FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS events (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  event_type VARCHAR(100) NOT NULL,
  region_id VARCHAR(100) DEFAULT 'ALL',
  start_date DATE,
  end_date DATE,
  description TEXT,
  expected_population_impact VARCHAR(100),
  source VARCHAR(255) DEFAULT 'Cultural Calendar'
);

CREATE TABLE IF NOT EXISTS event_product_demand (
  id INT AUTO_INCREMENT PRIMARY KEY,
  event_id INT NOT NULL,
  product_id INT NOT NULL,
  historical_demand_change_percentage DECIMAL(5, 2),
  historical_price_change_percentage DECIMAL(5, 2),
  demand_direction VARCHAR(50) DEFAULT 'INCREASE',
  confidence DECIMAL(5, 2) DEFAULT 90.0,
  source VARCHAR(255) DEFAULT 'Historical Festival Analytics',
  FOREIGN KEY (event_id) REFERENCES events(id) ON DELETE CASCADE,
  FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS market_events (
  id INT AUTO_INCREMENT PRIMARY KEY,
  event_name VARCHAR(255) NOT NULL,
  event_type VARCHAR(100) NOT NULL,
  region_id VARCHAR(100) DEFAULT 'ALL',
  start_date DATE,
  end_date DATE,
  description TEXT,
  source VARCHAR(255) DEFAULT 'Market Monitor'
);

CREATE TABLE IF NOT EXISTS price_change_factors (
  id INT AUTO_INCREMENT PRIMARY KEY,
  market_price_id INT,
  product_id INT NOT NULL,
  year INT,
  month INT,
  factor_type VARCHAR(100) NOT NULL,
  factor_description TEXT NOT NULL,
  impact_direction VARCHAR(50) DEFAULT 'INCREASE',
  estimated_impact DECIMAL(5, 2),
  confidence DECIMAL(5, 2) DEFAULT 85.0,
  source VARCHAR(255) DEFAULT 'Agri Causal Engine',
  FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS climate_records (
  id INT AUTO_INCREMENT PRIMARY KEY,
  region_id VARCHAR(100) NOT NULL,
  date DATE NOT NULL,
  year INT NOT NULL,
  month INT NOT NULL,
  rainfall DECIMAL(7, 2),
  temperature_min DECIMAL(5, 2),
  temperature_max DECIMAL(5, 2),
  temperature_average DECIMAL(5, 2),
  humidity DECIMAL(5, 2),
  flood_event BOOLEAN DEFAULT FALSE,
  drought_event BOOLEAN DEFAULT FALSE,
  extreme_weather_event VARCHAR(255),
  source VARCHAR(255) DEFAULT 'Meteorological Dept'
);

CREATE TABLE IF NOT EXISTS climate_forecasts (
  id INT AUTO_INCREMENT PRIMARY KEY,
  region_id VARCHAR(100) NOT NULL,
  forecast_date DATE NOT NULL,
  rainfall_forecast DECIMAL(7, 2),
  temperature_min DECIMAL(5, 2),
  temperature_max DECIMAL(5, 2),
  temperature_average DECIMAL(5, 2),
  flood_risk VARCHAR(50) DEFAULT 'LOW',
  drought_risk VARCHAR(50) DEFAULT 'LOW',
  source VARCHAR(255) DEFAULT 'Climate Prediction Model',
  confidence DECIMAL(5, 2) DEFAULT 80.0
);

CREATE TABLE IF NOT EXISTS policy_events (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  policy_type VARCHAR(100) NOT NULL,
  region_id VARCHAR(100) DEFAULT 'ALL',
  start_date DATE,
  end_date DATE,
  description TEXT,
  affected_products TEXT,
  impact_direction VARCHAR(50),
  source VARCHAR(255) DEFAULT 'Govt Policy Gazette',
  confidence DECIMAL(5, 2) DEFAULT 95.0
);

CREATE TABLE IF NOT EXISTS buyers (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  buyer_type VARCHAR(100) NOT NULL,
  location VARCHAR(255),
  verified_status BOOLEAN DEFAULT TRUE,
  contact_information VARCHAR(255),
  requirements TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS buyer_product_requirements (
  id INT AUTO_INCREMENT PRIMARY KEY,
  buyer_id INT NOT NULL,
  product_id INT NOT NULL,
  minimum_quantity DECIMAL(12, 2),
  maximum_quantity DECIMAL(12, 2),
  quality_requirements TEXT,
  offered_price DECIMAL(10, 2),
  price_date DATE,
  valid_until DATE,
  status VARCHAR(50) DEFAULT 'OPEN',
  FOREIGN KEY (buyer_id) REFERENCES buyers(id) ON DELETE CASCADE,
  FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS transport_options (
  id INT AUTO_INCREMENT PRIMARY KEY,
  origin VARCHAR(255) NOT NULL,
  destination VARCHAR(255) NOT NULL,
  transport_type VARCHAR(100) NOT NULL,
  estimated_cost DECIMAL(10, 2) NOT NULL,
  distance DECIMAL(10, 2),
  estimated_time VARCHAR(100),
  source VARCHAR(255) DEFAULT 'Logistics Index',
  date DATE
);

CREATE TABLE IF NOT EXISTS storage_options (
  id INT AUTO_INCREMENT PRIMARY KEY,
  location VARCHAR(255) NOT NULL,
  storage_type VARCHAR(100) NOT NULL,
  capacity DECIMAL(12, 2),
  cost_per_unit DECIMAL(10, 2) NOT NULL,
  available_from DATE,
  available_until DATE,
  status VARCHAR(50) DEFAULT 'AVAILABLE'
);

CREATE TABLE IF NOT EXISTS risk_factors (
  id INT AUTO_INCREMENT PRIMARY KEY,
  product_id INT NOT NULL,
  risk_type VARCHAR(100) NOT NULL,
  risk_level VARCHAR(50) NOT NULL,
  risk_score DECIMAL(5, 2) NOT NULL,
  description TEXT NOT NULL,
  source VARCHAR(255) DEFAULT 'Agri Risk Engine',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS cultivation_plans (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  farm_id INT NOT NULL,
  plot_id INT,
  product_id INT NOT NULL,
  planned_area DECIMAL(10, 2) NOT NULL,
  planting_date DATE,
  expected_harvest_date DATE,
  cultivation_status VARCHAR(50) DEFAULT 'PLANNED',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (farm_id) REFERENCES farms(id) ON DELETE CASCADE,
  FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS conversations (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  title VARCHAR(255) NOT NULL DEFAULT 'Agri Intelligence Chat',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  deleted_at TIMESTAMP NULL,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS messages (
  id INT AUTO_INCREMENT PRIMARY KEY,
  conversation_id INT NOT NULL,
  role VARCHAR(50) NOT NULL,
  content TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (conversation_id) REFERENCES conversations(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS ai_analysis_records (
  id INT AUTO_INCREMENT PRIMARY KEY,
  conversation_id INT NOT NULL,
  message_id INT NOT NULL,
  intent VARCHAR(100),
  entities TEXT,
  data_sources TEXT,
  analysis_summary TEXT,
  calculations TEXT,
  prediction TEXT,
  risk_analysis TEXT,
  recommendation TEXT,
  confidence DECIMAL(5, 2),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (conversation_id) REFERENCES conversations(id) ON DELETE CASCADE,
  FOREIGN KEY (message_id) REFERENCES messages(id) ON DELETE CASCADE
);
