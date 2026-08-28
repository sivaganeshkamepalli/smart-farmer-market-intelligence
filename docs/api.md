# REST API Reference Manual

## Authentication Endpoints
- `POST /api/auth/register`: Create user account.
- `POST /api/auth/login`: Authenticate with email/mobile and password.
- `POST /api/auth/send-otp`: Request 6-digit OTP for mobile login.
- `POST /api/auth/verify-otp`: Verify OTP and establish persistent session.
- `POST /api/auth/logout`: Clear session cookies.
- `GET /api/auth/me`: Get active user profile and farm details.

## Agricultural Product Endpoints
- `GET /api/products`: List and filter 500+ products (query params: `search`, `category`, `waterLevel`, `growthType`, `page`, `limit`).
- `GET /api/products/categories`: Get all 14 categories.
- `GET /api/products/:id`: Get complete product agronomic and 10-year market profile.

## AI Chatbox Endpoints
- `POST /api/ai/chat`: Process farmer query, run intent detection, typo correction, dynamic query plan, recommendation engine, and return structured AI response.
- `GET /api/ai/conversations`: Get all saved chat conversations.
- `GET /api/ai/conversations/:id`: Get full message history for a conversation thread.
- `DELETE /api/ai/conversations/:id`: Delete a chat conversation.

## Recommendation & Financial Endpoints
- `POST /api/recommendations/crops`: Generate Low Risk, Balanced, and High Potential crop options.
- `POST /api/recommendations/land-allocation`: Calculate dynamic land split across Long-Term, Constant, and Seasonal.
- `POST /api/investment/calculate`: Calculate initial investment, monthly operational costs, ROI, and multi-year tree crop cash flows.
- `POST /api/risks/analyse`: Compute 8-dimension risk score.
