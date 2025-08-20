/**
 * Logger Utility
 * Centralized logging for the application
 */

const fs = require('fs');
const path = require('path');
const config = require('../config/config');

// Ensure logs directory exists
const logsDir = path.dirname(config.logging.file);
if (!fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir, { recursive: true });
}

class Logger {
  constructor() {
    this.logFile = config.logging.file;
    this.logLevel = config.logging.level;
    this.levels = {
      error: 0,
      warn: 1,
      info: 2,
      debug: 3,
    };
  }

  /**
   * Get current timestamp
   * @returns {string} Formatted timestamp
   */
  getTimestamp() {
    return new Date().toISOString();
  }

  /**
   * Format log message
   * @param {string} level - Log level
   * @param {string} message - Log message
   * @param {Object} meta - Additional metadata
   * @returns {string} Formatted log entry
   */
  formatMessage(level, message, meta = {}) {
    const timestamp = this.getTimestamp();
    const logEntry = {
      timestamp,
      level: level.toUpperCase(),
      message,
      ...meta,
    };

    return JSON.stringify(logEntry);
  }

  /**
   * Write log to file
   * @param {string} logEntry - Formatted log entry
   */
  writeToFile(logEntry) {
    try {
      fs.appendFileSync(this.logFile, logEntry + '\n');
    } catch (error) {
      console.error('Failed to write to log file:', error);
    }
  }

  /**
   * Check if should log based on level
   * @param {string} level - Log level to check
   * @returns {boolean} Should log or not
   */
  shouldLog(level) {
    const currentLevelValue = this.levels[this.logLevel] || 2;
    const messageLevelValue = this.levels[level] || 2;
    return messageLevelValue <= currentLevelValue;
  }

  /**
   * Log error message
   * @param {string} message - Error message
   * @param {Object} meta - Additional metadata
   */
  error(message, meta = {}) {
    if (!this.shouldLog('error')) return;

    const logEntry = this.formatMessage('error', message, meta);
    console.error('❌', message, meta);
    this.writeToFile(logEntry);
  }

  /**
   * Log warning message
   * @param {string} message - Warning message
   * @param {Object} meta - Additional metadata
   */
  warn(message, meta = {}) {
    if (!this.shouldLog('warn')) return;

    const logEntry = this.formatMessage('warn', message, meta);
    console.warn('⚠️', message, meta);
    this.writeToFile(logEntry);
  }

  /**
   * Log info message
   * @param {string} message - Info message
   * @param {Object} meta - Additional metadata
   */
  info(message, meta = {}) {
    if (!this.shouldLog('info')) return;

    const logEntry = this.formatMessage('info', message, meta);
    console.log('ℹ️', message, meta);
    this.writeToFile(logEntry);
  }

  /**
   * Log debug message
   * @param {string} message - Debug message
   * @param {Object} meta - Additional metadata
   */
  debug(message, meta = {}) {
    if (!this.shouldLog('debug')) return;

    const logEntry = this.formatMessage('debug', message, meta);
    console.log('🐛', message, meta);
    this.writeToFile(logEntry);
  }

  /**
   * Log HTTP request
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   * @param {number} responseTime - Response time in ms
   */
  logRequest(req, res, responseTime) {
    const meta = {
      method: req.method,
      url: req.originalUrl,
      statusCode: res.statusCode,
      responseTime: `${responseTime}ms`,
      ip: req.ip,
      userAgent: req.get('User-Agent'),
      userId: req.userId || null,
    };

    if (res.statusCode >= 400) {
      this.error(`HTTP ${res.statusCode} - ${req.method} ${req.originalUrl}`, meta);
    } else {
      this.info(`HTTP ${res.statusCode} - ${req.method} ${req.originalUrl}`, meta);
    }
  }

  /**
   * Log payment event
   * @param {string} event - Payment event type
   * @param {Object} data - Payment data
   */
  logPayment(event, data) {
    this.info(`Payment Event: ${event}`, {
      event,
      userId: data.userId,
      planId: data.planId,
      amount: data.amount,
      currency: data.currency,
      subscriptionId: data.subscriptionId,
    });
  }

  /**
   * Log authentication event
   * @param {string} event - Auth event type
   * @param {Object} data - Auth data
   */
  logAuth(event, data) {
    this.info(`Auth Event: ${event}`, {
      event,
      userId: data.userId,
      email: data.email,
      ip: data.ip,
      userAgent: data.userAgent,
    });
  }

  /**
   * Log system event
   * @param {string} event - System event type
   * @param {Object} data - System data
   */
  logSystem(event, data = {}) {
    this.info(`System Event: ${event}`, {
      event,
      ...data,
    });
  }
}

// Create singleton instance
const logger = new Logger();

module.exports = logger;
