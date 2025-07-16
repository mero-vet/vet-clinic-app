/**
 * Logger Infrastructure - Production-ready logging service
 * Replaces all console.log statements with proper development/production logging
 */

class Logger {
    constructor() {
        this.isDevelopment = process.env.NODE_ENV === 'development';
        this.enabledLevels = this.isDevelopment
            ? ['debug', 'info', 'warn', 'error']
            : ['warn', 'error'];
        this.errorCount = 0;
        this.logQueue = [];
        this.maxQueueSize = 1000;
    }

    /**
     * Debug logging - only in development
     */
    debug(message, ...args) {
        if (this.enabledLevels.includes('debug')) {
            console.log(`[DEBUG] ${message}`, ...args);
            this.addToQueue('debug', message, args);
        }
    }

    /**
     * Info logging - only in development
     */
    info(message, ...args) {
        if (this.enabledLevels.includes('info')) {
            console.info(`[INFO] ${message}`, ...args);
            this.addToQueue('info', message, args);
        }
    }

    /**
     * Warning logging - always enabled
     */
    warn(message, ...args) {
        console.warn(`[WARN] ${message}`, ...args);
        this.addToQueue('warn', message, args);
        this.reportToService('warn', message, args);
    }

    /**
     * Error logging - always enabled
     */
    error(message, error, ...args) {
        console.error(`[ERROR] ${message}`, error, ...args);
        this.errorCount++;
        this.addToQueue('error', message, [error, ...args]);
        this.reportToService('error', message, error, args);
    }

    /**
     * Performance logging with timing
     */
    performance(label, duration, ...args) {
        if (this.isDevelopment) {
            console.log(`[PERF] ${label}: ${duration.toFixed(2)}ms`, ...args);
        }
        this.addToQueue('performance', `${label}: ${duration.toFixed(2)}ms`, args);
    }

    /**
     * Tab debugging - specific logger for tab operations
     */
    tabDebug(message, ...args) {
        if (this.isDevelopment) {
            console.log(`[TAB] ${message}`, ...args);
        }
        this.addToQueue('tab', message, args);
    }

    /**
     * Agent testing specific logging
     */
    agentLog(message, data = {}) {
        const logEntry = {
            timestamp: Date.now(),
            level: 'agent',
            message,
            data,
            url: window.location.href,
            userAgent: navigator.userAgent
        };

        if (this.isDevelopment) {
            console.log(`[AGENT] ${message}`, data);
        }

        // Report to agent testing infrastructure
        if (window.testLogger) {
            window.testLogger.log(logEntry);
        }

        this.addToQueue('agent', message, [data]);
    }

    /**
     * Add log entry to queue for analysis
     */
    addToQueue(level, message, args) {
        this.logQueue.push({
            level,
            message,
            args,
            timestamp: Date.now(),
            url: window.location.href
        });

        // Prevent memory leaks by limiting queue size
        if (this.logQueue.length > this.maxQueueSize) {
            this.logQueue.shift();
        }
    }

    /**
     * Report errors and warnings to external service
     */
    reportToService(level, message, error, args) {
        // In production, this would send to error tracking service
        // For now, just ensure it's captured for agent testing
        if (window.testLogger) {
            window.testLogger.logError({
                level,
                message,
                error: error?.message || error,
                stack: error?.stack,
                args,
                timestamp: Date.now(),
                url: window.location.href
            });
        }
    }

    /**
     * Get logging statistics for monitoring
     */
    getStats() {
        return {
            errorCount: this.errorCount,
            queueSize: this.logQueue.length,
            levels: this.enabledLevels,
            isDevelopment: this.isDevelopment
        };
    }

    /**
     * Get recent logs for debugging
     */
    getRecentLogs(count = 50) {
        return this.logQueue.slice(-count);
    }

    /**
     * Clear log queue
     */
    clearQueue() {
        this.logQueue = [];
        this.errorCount = 0;
    }

    /**
     * Set log level dynamically
     */
    setLogLevel(levels) {
        this.enabledLevels = Array.isArray(levels) ? levels : [levels];
    }
}

// Create singleton instance
export const logger = new Logger();

// Convenience exports for common logging patterns
export const debugLog = (message, ...args) => logger.debug(message, ...args);
export const infoLog = (message, ...args) => logger.info(message, ...args);
export const warnLog = (message, ...args) => logger.warn(message, ...args);
export const errorLog = (message, error, ...args) => logger.error(message, error, ...args);
export const perfLog = (label, duration, ...args) => logger.performance(label, duration, ...args);
export const tabLog = (message, ...args) => logger.tabDebug(message, ...args);
export const agentLog = (message, data) => logger.agentLog(message, data);

// Development helper for migration
export const devLog = (...args) => {
    if (process.env.NODE_ENV === 'development') {
        console.log('[DEV]', ...args);
    }
};

export default logger; 