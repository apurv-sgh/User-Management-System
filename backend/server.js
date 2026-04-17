const app = require('./src/app');
const connectDB = require('./src/config/db');
const config = require('./src/config/env');

// Connect to MongoDB
connectDB();

// Start server
const server = app.listen(config.port, () => {
  console.log(`Server running in ${config.nodeEnv} mode on port ${config.port}`);
  console.log(`CORS enabled for: ${config.corsOrigin}`);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.log(`Error: ${err.message}`);
  server.close(() => process.exit(1));
});

module.exports = server;
