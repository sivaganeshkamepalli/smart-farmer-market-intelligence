# Core Business & Safety Rules

1. **Farmer Data Privacy**: Private farmer data (name, phone, email, farm budget, cultivation plans) is strictly segregated and never exposed to other users.
2. **AI Execution Guardrails**: AI layer is strictly read-only and analytical. AI cannot execute direct SQL, change database prices, or alter farmer cultivation plans.
3. **Fact vs. Prediction**: Historical market prices are clearly labeled as historical facts, while model forecasts are labeled as estimates with explicit confidence percentages.
4. **Causality & Evidence**: The system never fabricates price change causes. If evidence is insufficient, it explicitly states: *"Data does not establish a single clear cause."*
5. **Future Oversupply Control**: Recommendations evaluate regional cultivation plans and upcoming supply to avoid advising all farmers to plant the same high-price crop simultaneously.
