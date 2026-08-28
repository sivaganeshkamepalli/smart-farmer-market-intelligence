# 🌾 Smart Farmer Market Intelligence Platform

## AI-Powered Agricultural Decision Support System

Smart Farmer Market Intelligence Platform is an AI-based agricultural
decision-support application designed to help farmers make better
cultivation and market decisions.

The platform combines agricultural product information, historical
market data, demand, supply, climate conditions, cultivation costs,
risks, and farmer-specific information to provide personalized
analysis, predictions, and recommendations.

The central idea is to provide a **"ChatGPT for Farmers"** experience
where farmers can ask questions naturally and receive data-supported
answers.

---

## 🎯 Project Objective

Farmers often make cultivation decisions without being able to
consider all relevant factors together.

A farmer may ask:

- Which crop should I cultivate?
- What crop may have high demand next season?
- Why did the price of a crop increase?
- How much investment is required?
- What is the expected return?
- What are the climate risks?
- Which crop is suitable for my available water?
- Should I choose a long-term or seasonal crop?
- Which crops have stable demand?
- Should I cultivate a crop with increasing demand?

This platform combines these factors into one intelligent system.

---

# 🚜 Core Concept

The platform analyses:

```text
Farmer Information
        +
Agricultural Product Data
        +
Historical Market Data
        +
Demand
        +
Supply
        +
Climate
        +
Cultivation Cost
        +
Yield
        +
Upcoming Events
        +
Risk Factors
        ↓
   AI Analysis
        ↓
Recommendations
he AI identifies the user's intent and retrieves the relevant
agricultural data before generating the response.

2. Personalized Recommendations

Recommendations are based on the farmer's actual information.

Possible inputs include:

Farm location
Land area
Soil
Water availability
Irrigation
Budget
Labour availability
Risk preference

The system should never invent missing farmer information.

If information is missing, the AI can ask the farmer for it or
provide a preliminary analysis using the available information.

3. Long-Term + Constant-Demand + Seasonal Strategy

The platform considers three major cultivation strategies:

Long-Term

Examples:

Mango
Guava
Pomegranate
Badam

These crops may require several years before reaching significant
production.

Constant Demand

Products with relatively stable demand throughout the year.

Seasonal Demand

Products whose demand may increase during specific:

Seasons
Festivals
Religious events
Weather conditions
Market periods
Other demand events

The recommended land allocation is dynamic.

The system does not permanently use a fixed ratio such as 20/40/40.

The ratio can change based on:

Land
Water
Budget
Climate
Demand
Supply
Price
Price volatility
Risk
Cultivation duration
Expected return
📊 Market Intelligence

The platform analyses:

Current prices
Historical prices
Monthly trends
Yearly trends
Demand
Supply
Price volatility
Market arrivals
Seasonal patterns

Historical information can be used to identify recurring patterns.

For example:

Demand ↑
Supply ↓
      ↓
Price pressure ↑

The system can also investigate possible contributing factors such as:

Climate
Flood
Drought
Festival demand
Government policies
Imports
Exports
Transportation
Storage
Supply shortage

The AI must distinguish between evidence-supported factors and
uncertain explanations.

🌦 Climate Intelligence

The platform considers agricultural climate requirements such as:

Temperature
Rainfall
Humidity
Drought tolerance
Flood tolerance
Heat tolerance
Cold tolerance
Water requirements

Climate data can be compared with crop requirements to determine
crop suitability and climate-related risk.

💰 Cultivation Investment Analysis

The system can analyse:

Seeds
Seedlings
Land preparation
Fertilizer
Pesticides
Labour
Irrigation
Electricity
Fuel
Machinery
Equipment
Packaging
Storage
Transportation
Other expenses

For long-term crops, the platform can analyse costs across multiple
years.

📈 Yield and Profit Analysis

The system can estimate:

Expected yield
Expected revenue
Cultivation cost
Expected profit
ROI
Risk

Predictions must be clearly distinguished from historical facts.

The system must not present future prices or profits as guaranteed.

⚠️ Risk Analysis

The platform considers multiple risk categories:

Climate risk
Market risk
Price risk
Supply risk
Demand risk
Investment risk
Production risk
Pest/disease risk

Each risk can contain:

Risk score
Risk level
Reason
Supporting data
Possible mitigation
🌱 Agricultural Product Database

The application is designed to support 500+ agricultural products.

Categories can include:

Fruits
Vegetables
Flowers
Nuts
Grains
Cereals
Pulses
Oilseeds
Spices
Herbs
Plantation crops
Medicinal crops
Aromatic crops
Aquatic crops
Other agricultural products

Each product can be connected to:

Category
Growing type
Cultivation duration
Water requirements
Soil requirements
Climate requirements
Yield
Cultivation costs
Historical prices
Demand
Supply
Market
Uses
Technologies
Risks
Events
🧑‍🌾 User-Specific Data

Agricultural product data and farmer data are treated differently.

Agricultural Data

Development versions can contain dummy data for:

500+ products
Historical prices
Demand
Supply
Climate
Costs
Events
Risks
Technologies
Farmer Data

Farmer accounts are not dummy data.

Users are created dynamically through the authentication system.

User-specific information includes:

Account
Profile
Farms
Farm plots
Cultivation plans
Preferences
Conversations
AI interactions

Every farmer's private information is associated with their
authenticated user_id.

🔐 Authentication

The application supports the architecture for:

Mobile OTP
Google authentication
Email/password

Unauthenticated users cannot access protected farmer pages.

The application checks authentication before loading the dashboard.

Open Application
       ↓
Check Authentication
       ↓
 ┌─────┴─────┐
 ↓           ↓
Logged In   Not Logged In
 ↓           ↓
Dashboard   Login
💬 Conversation Persistence

AI conversations are associated with the authenticated user.

A user can:

Create a new conversation
Continue a conversation
Rename a conversation
View previous conversations
Delete conversations

The AI can use previously provided information when relevant.

For example:

User:
I have 2 acres.

AI:
Where is your farm?

User:
Guntur.

AI:
What is your water availability?

User:
Medium.

Later:

User:
What about pomegranate?

The system can use the previously stored information when analysing
the question.

🧠 AI Query Processing

The AI request pipeline is designed as:

User Message
     ↓
Authentication
     ↓
Conversation Context
     ↓
Intent Detection
     ↓
Entity Extraction
     ↓
Typo Correction
     ↓
Missing Information Detection
     ↓
Query Planning
     ↓
Database Retrieval
     ↓
Analytical Services
     ↓
Risk / Prediction
     ↓
AI Response
     ↓
Save Conversation
🔎 Intent Detection

Possible intents include:

GREETING
CROP_INFORMATION
CROP_RECOMMENDATION
PRICE_ANALYSIS
PRICE_HISTORY
DEMAND_ANALYSIS
SUPPLY_ANALYSIS
CLIMATE_ANALYSIS
INVESTMENT_ANALYSIS
PROFIT_ANALYSIS
RISK_ANALYSIS
CROP_COMPARISON
LAND_ALLOCATION
TECHNOLOGY_RECOMMENDATION
MARKET_RECOMMENDATION

A simple greeting such as:

hi

must not automatically trigger expensive crop or market analysis.

Instead:

User: hi

AI:
Hello! How can I help you with your farming decisions today?

Suggestions:
- What should I cultivate?
- Analyse market prices
- Show upcoming demand
- Calculate cultivation cost
- Check climate suitability
🧩 Missing Information Handling

The AI should not assume missing farmer information.

For example, if the user says:

"What should I cultivate?"

but has not provided:

Land
Location
Water
Soil

the system can say:

I can provide a general analysis.

For a more personalized recommendation,
please provide your land size and location.

If partial information exists, the system should use the available
information and clearly state that the analysis is preliminary.

✏️ Typo Correction

The AI should understand common typing mistakes.

Examples:

tomoto → tomato
pomegranet → pomegranate
badam pricee → badam price

If the intended meaning is clear, the system can correct it.

If multiple interpretations are possible, it should ask the user.

📚 Data-Driven AI

The AI should use database information rather than inventing
agricultural facts.

Important responses should distinguish:

Historical Fact
Current Observation
Calculated Estimate
Prediction
Recommendation

Example:

Historical:
Prices increased during several previous seasonal periods.

Prediction:
The available data indicates possible upward price pressure.

Recommendation:
Consider this crop as a seasonal opportunity.

Predictions are not guarantees.

📊 Evidence-Based Recommendations

Recommendations should provide supporting information.

Example:

Recommendation
      ↓
Why?
      ↓
Historical Price
Demand Trend
Supply
Climate
Investment
Risk

Users should be able to inspect the supporting data.

📈 Data Completeness and Confidence

The platform can provide:

Data Completeness
Confidence

For example:

Data Completeness: 60%
Confidence: Moderate

After the farmer provides more information:

Data Completeness: 85%
Confidence: High
🖥️ Frontend

The frontend is built with:

React
Vite
Tailwind CSS
Recharts

Main pages include:

Login
Register
Dashboard
Ask AI
My Farm
Crop Explorer
Crop Details
Market Intelligence
Demand Trends
Climate Insights
Financial Investment
Risk Analysis
Farm Planner
Profile
🏗️ Frontend Structure
frontend/
├── src/
│   ├── components/
│   │   ├── chat/
│   │   └── layout/
│   ├── context/
│   ├── pages/
│   ├── services/
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css
├── package.json
└── vite.config.js
⚙️ Backend

The backend uses:

Node.js
Express.js
SQLite in the current development version
AI services
REST APIs

Backend modules include:

auth
farmers
farms
products
market
climate
investment
recommendations
risks
ai

Supporting services include:

aiService
conversationService
costProfitService
landAllocationService
queryPlannerService
queryUnderstandingService
recommendationService
riskAnalysisService
🏗️ Backend Structure
backend/
├── src/
│   ├── config/
│   ├── database/
│   ├── middleware/
│   ├── modules/
│   │   ├── ai/
│   │   ├── auth/
│   │   ├── climate/
│   │   ├── farmers/
│   │   ├── farms/
│   │   ├── investment/
│   │   ├── market/
│   │   ├── products/
│   │   ├── recommendations/
│   │   └── risks/
│   ├── services/
│   ├── tests/
│   └── server.js
├── package.json
└── ...
🗄️ Database

The current development project uses SQLite.

The database contains agricultural and application data used by the
backend.

The project also includes:

schema.sql
seed.js

The seed system is intended for agricultural development data.

🌐 API

Examples of API endpoints include:

Authentication
POST /api/auth/register
POST /api/auth/login
POST /api/auth/send-otp
POST /api/auth/verify-otp
POST /api/auth/logout
GET  /api/auth/me
Products
GET /api/products
GET /api/products/:id
Farms
GET  /api/farms
POST /api/farms
GET  /api/farms/:id
PUT  /api/farms/:id
AI
POST /api/ai/chat
GET /api/ai/conversations
GET /api/ai/conversations/:id
DELETE /api/ai/conversations/:id
🔒 Privacy

Farmer-specific information must remain private.

Private information includes:

Name
Phone
Email
Farm
Land
Budget
Cultivation plans
Conversations
Recommendations

The backend must authorize requests using the authenticated user's
identity.

A frontend-provided user_id must never be blindly trusted for
authorization.

📱 Responsive Design

The application is designed for:

Desktop
Tablet
Mobile

The interface uses:

Responsive cards
Responsive charts
Mobile-friendly navigation
Touch-friendly controls
Farmer-friendly language
🚀 Running the Project Locally
Backend

Open a terminal:

cd backend
npm install
npm start

or use the project's development command where applicable.

Frontend

Open another terminal:

cd frontend
npm install
npm run dev

The frontend development server will normally be available at:

http://localhost:3000

The backend runs on its configured local port.

🌱 Development Dataset

The project can use generated agricultural development data.

The seed process is intended to provide:

500+ agricultural products
        +
Historical market data
        +
Demand
        +
Supply
        +
Climate
        +
Cultivation costs
        +
Yield
        +
Risks
        +
Technologies
        +
Events

This data is for development and demonstration purposes and
should not be treated as real agricultural market information.

🔮 Future Improvements

Possible future improvements include:

Real agricultural datasets
Real-time market prices
Real weather APIs
Real climate forecasts
Government agricultural data
Real market arrivals
Real demand datasets
Regional price intelligence
Advanced ML prediction models
Real SMS OTP provider
Production-grade cloud database
Farmer regional language support
Voice-based farmer interaction
Agricultural image analysis
Disease detection
Real-time market alerts
⚠️ Disclaimer

The current development version may contain generated/dummy
agricultural data.

AI recommendations and predictions should not be treated as
guaranteed financial or agricultural outcomes.

When real-world deployment is performed, the system should use
verified agricultural, market, weather, and government data sources.

📄 Project Documentation

Additional documentation is available in:

docs/
├── api.md
├── architecture.md
├── business-rules.md
├── database.md
└── recommendation-engine.md
👨‍💻 Technology Stack
Layer	Technology
Frontend	React
Build Tool	Vite
Styling	Tailwind CSS
Charts	Recharts
Backend	Node.js
API	Express.js
Database	SQLite (current development version)
AI	AI API / AI service
Authentication	OTP / Google / Email architecture
Version Control	Git + GitHub
🌾 Vision

The long-term goal is to build an intelligent agricultural platform
that helps farmers make cultivation decisions before planting,
rather than reacting only after market prices change.

The system aims to answer:

"Given my land, resources, climate, market conditions and future
demand, what should I cultivate, how much should I invest, what
risks should I expect, and why?"

Instead of simply telling farmers what happened in the market,
the platform aims to help them understand:

Past
 ↓
Present
 ↓
Expected Future
 ↓
Risk
 ↓
Decision

Smart Farmer Market Intelligence Platform



Then save it as:

```text
C:\Users\sivag\OneDrive\Desktop\smart-farmer-market-intelligence\README.md

After saving, run:

git status

You should see:

modified/new: README.md

Then commit it:

git add README.md
git commit -m "Add project README"

And when you're ready to push the README along with the project:

git push -u origin main

This README describes the current project accurately—in particular, it says SQLite is the current database rather than incorrectly claiming that MySQL has already been implemented.