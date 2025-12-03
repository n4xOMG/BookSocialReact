/**
 * Logger Utility
 * Centralized logging that respects environment and provides structured logging
 *
 * Usage:
 * import { logger } from '../utils/logger';
 * logger.log('User logged in', { userId: 123 });
 * logger.warn('Deprecated API used');
 * logger.error('Failed to fetch data', error);
 */

const isDev = process.env.REACT_APP_ENV === "development";
const isTest = process.env.REACT_APP_ENV === "test";

// Color codes for better visibility in development
const colors = {
  log: "#2196F3",
  info: "#4CAF50",
  warn: "#FF9800",
  error: "#F44336",
  debug: "#9C27B0",
  success: "#00E676",
};

/**
 * Format log message with timestamp and context
 */
const formatMessage = (level, message, context) => {
  const timestamp = new Date().toISOString();
  const contextStr = context ? ` [${context}]` : "";
  return `[${timestamp}]${contextStr} ${message}`;
};

/**
 * Logger object with various log levels
 */
export const logger = {
  /**
   * Log general information (only in development)
   */
  log: (message, data, context) => {
    if (!isDev || isTest) return;

    if (data !== undefined) {
      console.log(`%c${formatMessage("LOG", message, context)}`, `color: ${colors.log}`, data);
    } else {
      console.log(`%c${formatMessage("LOG", message, context)}`, `color: ${colors.log}`);
    }
  },

  /**
   * Log informational messages (only in development)
   */
  info: (message, data, context) => {
    if (!isDev || isTest) return;

    if (data !== undefined) {
      console.info(`%c${formatMessage("INFO", message, context)}`, `color: ${colors.info}`, data);
    } else {
      console.info(`%c${formatMessage("INFO", message, context)}`, `color: ${colors.info}`);
    }
  },

  /**
   * Log warnings (only in development)
   */
  warn: (message, data, context) => {
    if (!isDev || isTest) return;

    if (data !== undefined) {
      console.warn(`%c${formatMessage("WARN", message, context)}`, `color: ${colors.warn}`, data);
    } else {
      console.warn(`%c${formatMessage("WARN", message, context)}`, `color: ${colors.warn}`);
    }
  },

  /**
   * Log errors (always logged, even in production)
   */
  error: (message, error, context) => {
    const formattedMsg = formatMessage("ERROR", message, context);

    if (isDev && !isTest) {
      console.error(`%c${formattedMsg}`, `color: ${colors.error}; font-weight: bold`, error || "");
    } else {
      // In production, log minimal info
      console.error(formattedMsg, error?.message || error || "");
    }
  },

  /**
   * Log debug information (only in development)
   */
  debug: (message, data, context) => {
    if (!isDev || isTest) return;

    if (data !== undefined) {
      console.debug(`%c${formatMessage("DEBUG", message, context)}`, `color: ${colors.debug}`, data);
    } else {
      console.debug(`%c${formatMessage("DEBUG", message, context)}`, `color: ${colors.debug}`);
    }
  },

  /**
   * Log success messages (only in development)
   */
  success: (message, data, context) => {
    if (!isDev || isTest) return;

    if (data !== undefined) {
      console.log(`%c✓ ${formatMessage("SUCCESS", message, context)}`, `color: ${colors.success}; font-weight: bold`, data);
    } else {
      console.log(`%c✓ ${formatMessage("SUCCESS", message, context)}`, `color: ${colors.success}; font-weight: bold`);
    }
  },

  /**
   * Log grouped messages (only in development)
   */
  group: (label, callback) => {
    if (!isDev || isTest) return;

    console.group(label);
    callback();
    console.groupEnd();
  },

  /**
   * Log grouped messages (collapsed by default, only in development)
   */
  groupCollapsed: (label, callback) => {
    if (!isDev || isTest) return;

    console.groupCollapsed(label);
    callback();
    console.groupEnd();
  },

  /**
   * Log a table (only in development)
   */
  table: (data, columns) => {
    if (!isDev || isTest) return;

    if (columns) {
      console.table(data, columns);
    } else {
      console.table(data);
    }
  },
};

/**
 * Create a namespaced logger for a specific module
 * @param {string} namespace - Module name (e.g., 'WebSocket', 'Auth', 'API')
 */
export const createLogger = (namespace) => ({
  log: (message, data) => logger.log(message, data, namespace),
  info: (message, data) => logger.info(message, data, namespace),
  warn: (message, data) => logger.warn(message, data, namespace),
  error: (message, error) => logger.error(message, error, namespace),
  debug: (message, data) => logger.debug(message, data, namespace),
  success: (message, data) => logger.success(message, data, namespace),
});

export default logger;
