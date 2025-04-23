const Logger = require('./utils/logger'); // Correct import of the Logger class

module.exports = async () => {
  // Create an instance of Logger, you can specify a generic test title or a unique one for global setup
  const logger = new Logger('GlobalSetup');
  
  // Optionally, you can log to console the log file path if needed
  console.log(`📝 Logging test run to: ${logger.logFilePath}`);
};