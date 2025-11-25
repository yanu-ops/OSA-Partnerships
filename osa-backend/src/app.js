const express = require('express');
const cors = require('cors');
const authRoutes = require('./routes/auth.routes');
const partnershipRoutes = require('./routes/partnership.routes');
const adminRoutes = require('./routes/admin.routes');

const app = express();


app.use(cors({
  origin: process.env.ALLOWED_ORIGINS?.split(',') || '*',
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});


app.use('/api/auth', authRoutes);
app.use('/api/partnerships', partnershipRoutes);
app.use('/api/admin', adminRoutes);


app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found'
  });
});


app.use((err, req, res, next) => {
  console.error('Error:', err);

  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal server error';

  res.status(statusCode).json({
    success: false,
    message,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
});

module.exports = app;