# Recommendation Engine & Dynamic Land Allocation Logic

The recommendation engine evaluates agricultural products against farmer constraints to return 3 distinct options:

1. **Low Risk Option**: Focuses on stable-demand regular crops with low price volatility, high water suitability, and minimal capital exposure.
2. **Balanced Option**: Combines growing seasonal demand (e.g. upcoming festival windows) with drip fertigation for high yield productivity.
3. **High Potential Option**: Targets premium value or export-oriented crops (e.g. Badam, Pomegranate) providing compounding multi-year revenue.

## Dynamic Land Allocation Algorithm

The system divides total farm acreage ($A$) dynamically:

$$\text{Total Area } A = A_{\text{LongTerm}} + A_{\text{Constant}} + A_{\text{Seasonal}}$$

Ratios are adjusted by:
- **Water Level**: If water is `LOW`, $A_{\text{LongTerm}}$ ratio increases by $+10\%$ (drought-tolerant tree crops), while $A_{\text{Seasonal}}$ decreases.
- **Risk Preference**: If `LOW_RISK`, $A_{\text{Constant}}$ ratio increases by $+15\%$. If `HIGH_POTENTIAL`, $A_{\text{Seasonal}}$ increases by $+20\%$.
- **Ratios are normalized** so that $\sum \text{ratios} = 1.0$.
