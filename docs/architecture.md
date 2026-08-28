# System Architecture — Smart Farmer Market Intelligence Platform

The **Smart Farmer Market Intelligence Platform** is an enterprise-grade agricultural decision-support web application designed as a "ChatGPT for Farmers".

## System Context Diagram

```
                              FARMER USER
                                  │
                                  ▼
               ┌──────────────────────────────────────┐
               │    REACT 18 SPA FRONTEND             │
               │  - ChatGPT for Farmers Chatbox       │
               │  - Dynamic Land Allocation Visualizer│
               │  - 500+ Crop Explorer & Dashboards   │
               │  - Recharts Multi-line Price Charts  │
               └──────────────────┬───────────────────┘
                                  │ REST API (JWT/Cookies)
                                  ▼
               ┌──────────────────────────────────────┐
               │    NODE.JS / EXPRESS BACKEND         │
               │  - Auth & Profile Controllers        │
               │  - Query Understanding (Levenshtein) │
               │  - Dynamic Query Planner             │
               │  - Analytical & Risk Engines         │
               │  - Configurable AI Reasoning Layer   │
               └──────────────────┬───────────────────┘
                                  │ SQL Queries
                                  ▼
               ┌──────────────────────────────────────┐
               │    MYSQL / SQLITE DATABASE           │
               │  - 500+ Products across 14 Categories│
               │  - 10-Yr Monthly Prices & Market Data│
               │  - Agronomics, Costs, Supply & Events│
               └──────────────────────────────────────┘
```

## Key Layers & Design Principles
1. **Separation of Concerns**: Controllers remain thin. Intent parsing, land allocation, multi-year tree crop economics, and risk scoring are encapsulated in dedicated analytical services (`src/services/`).
2. **AI Layer Security**: The AI never directly executes arbitrary SQL or mutates database tables. The backend validates and executes dynamic queries, producing structured analytical JSON context for the LLM to interpret and format for the farmer.
3. **Data Integrity**: Database operates as a connected agricultural graph linking products to growth characteristics, water, soil, climate, costs, yield, 10-year market prices, demand, supply, events, buyers, and risks.
