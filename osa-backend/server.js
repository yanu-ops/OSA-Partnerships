require('dotenv').config();
const app = require('./src/app');

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`
    ╔═══════════════════════════════════════╗
    ║  OSA Partnership Monitoring System    ║
    ║  Server running on port ${PORT}         ║
    ║  Environment: ${process.env.NODE_ENV || 'development'}           ║
    ╚═══════════════════════════════════════╝
  `);
  console.log(`\n✅ Server is ready!`);
  console.log(`📡 Health check: http://localhost:${PORT}/health\n`);
});