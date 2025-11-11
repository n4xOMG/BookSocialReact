/**
 * Error Logging Utility
 * Central place to handle error logging and reporting
 */

/**
 * Log error to console and potentially to external service
 * @param {Error} error - The error object
 * @param {Object} errorInfo - Additional error information
 * @param {string} context - Context where the error occurred
 */
export const logError = (error, errorInfo = {}, context = "Unknown") => {
  // Log to console in development
  if (process.env.NODE_ENV === "development") {
    console.group(`🚨 Error in ${context}`);
    console.error("Error:", error);
    console.error("Error Info:", errorInfo);
    console.error("Stack:", error?.stack);
    console.groupEnd();
  }

  // In production, you would send to an error tracking service
  // Example integrations:
  // - Sentry: Sentry.captureException(error, { contexts: { react: errorInfo } });
  // - LogRocket: LogRocket.captureException(error, { extra: errorInfo });
  // - Custom API: sendErrorToAPI({ error, errorInfo, context });

  // For now, just log basic info in production
  if (process.env.NODE_ENV === "production") {
    console.error(`Error in ${context}:`, error?.message || error);
  }
};

/**
 * Log warning (non-critical issues)
 */
export const logWarning = (message, context = "Unknown") => {
  if (process.env.NODE_ENV === "development") {
    console.warn(`⚠️ Warning in ${context}:`, message);
  }
};

/**
 * Log info for debugging
 */
export const logInfo = (message, context = "Unknown") => {
  if (process.env.NODE_ENV === "development") {
    console.info(`ℹ️ Info in ${context}:`, message);
  }
};

export default {
  logError,
  logWarning,
  logInfo,
};
