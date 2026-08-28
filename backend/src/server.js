const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const cookieParser = require('cookie-parser');
const rateLimit = require('express-rate-limit');
const dotenv = require('dotenv');
const { initDB } = require('./config/db');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Security & Middleware
app.use(helmet({ contentSecurityPolicy: false }));
app.use(cors({ origin: true, credentials: true }));
app.use(cookieParser());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Rate Limiter
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 300,
  message: { success: false, message: 'Too many requests from this IP, please try again later.' }
});
app.use(limiter);

// Import Routes
const authRoutes = require('./modules/auth/authRoutes');
const farmerRoutes = require('./modules/farmers/farmerRoutes');
const farmRoutes = require('./modules/farms/farmRoutes');
const productRoutes = require('./modules/products/productRoutes');
const marketRoutes = require('./modules/market/marketRoutes');
const climateRoutes = require('./modules/climate/climateRoutes');
const recommendationRoutes = require('./modules/recommendations/recommendationRoutes');
const aiRoutes = require('./modules/ai/aiRoutes');
const investmentRoutes = require('./modules/investment/investmentRoutes');
const riskRoutes = require('./modules/risks/riskRoutes');

// Mount API Endpoints
app.use('/api/auth', authRoutes);
app.use('/api/farmer', farmerRoutes);
app.use('/api/farms', farmRoutes);
app.use('/api/products', productRoutes);
app.use('/api/market', marketRoutes);
app.use('/api/climate', climateRoutes);
app.use('/api/recommendations', recommendationRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/investment', investmentRoutes);
app.use('/api/risks', riskRoutes);

// Health Check
app.get('/api/health', (req, res) => {
  res.json({ success: true, message: 'Smart Farmer Platform API is running smoothly.', timestamp: new Date() });
});

// Error Handling Middleware
app.use((err, req, res, next) => {
  console.error('Unhandled Server Error:', err.stack);
  res.status(500).json({ success: false, message: 'An internal server error occurred.', error: err.message });
});

// Start Server & Initialize Database
initDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Smart Farmer Backend API running on http://localhost:${PORT}`);
  });
}).catch((err) => {
  console.error('Failed to initialize database:', err);
});
