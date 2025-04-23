const fs = require('fs');
const path = require('path');

class Logger {
  constructor(testTitle = '') {
    const logDir = path.join(process.cwd(), 'custom-logs');
    if (!fs.existsSync(logDir)) {
      fs.mkdirSync(logDir, { recursive: true });
    }

    const timestamp = new Date().toISOString().replace(/:/g, '-').replace(/\..+/, '').replace('T', '_');
    this.logFilePath = path.join(logDir, `testlog-${testTitle || 'global'}-${timestamp}.log`);
  }

  _write(level, message, testTitle = '') {
    const time = new Date().toISOString();
    const titlePart = testTitle ? `[${testTitle}] ` : '';
    const entry = `[${time}] [${level}] ${titlePart}${message}\n`;
    fs.appendFileSync(this.logFilePath, entry);
  }

  info(message, testTitle = '') {
    this._write('INFO', message, testTitle);
  }

  warn(message, testTitle = '') {
    this._write('WARN', message, testTitle);
  }

  error(message, testTitle = '') {
    this._write('ERROR', message, testTitle);
  }

  logTestEnd(testTitle = '') {
    this.info('--- Test Ended ---', testTitle);
  }
}

module.exports = Logger;
