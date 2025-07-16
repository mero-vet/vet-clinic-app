/**
 * Centralized Storage Service
 * Optimized localStorage management with debouncing, compression, and error handling
 * Part of PRD-20 Phase 3A: Storage Optimization
 */

import { infoLog, warnLog, errorLog, debugLog } from '../utils/logger';

class StorageService {
    constructor() {
        this.writeQueue = new Map();
        this.pendingData = new Map();
        this.writeDelay = 300; // ms - debounce delay
        this.compressionThreshold = 50 * 1024; // 50KB
        this.maxRetries = 3;
        this.retryDelay = 1000; // ms
        this.errorCount = 0;
        this.writeStats = {
            totalWrites: 0,
            debouncedWrites: 0,
            compressionSaves: 0,
            errors: 0,
            totalDataSize: 0,
        };

        this.setupBeforeUnload();
        this.startHealthMonitoring();

        infoLog('Centralized StorageService initialized');
    }

    /**
     * Setup beforeunload event to flush pending writes
     */
    setupBeforeUnload() {
        window.addEventListener('beforeunload', (event) => {
            this.flushAllPendingWrites();
        });

        // Also handle visibility change for mobile
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                this.flushAllPendingWrites();
            }
        });
    }

    /**
     * Start health monitoring
     */
    startHealthMonitoring() {
        // Check storage health every 5 minutes
        setInterval(() => {
            this.checkStorageHealth();
        }, 5 * 60 * 1000);
    }

    /**
     * Debounced write operation
     * @param {string} key - Storage key
     * @param {any} data - Data to store
     * @param {Object} options - Write options
     */
    write(key, data, options = {}) {
        const {
            priority = 'normal', // 'high', 'normal', 'low'
            compress = 'auto', // true, false, 'auto'
            expire = null, // expiration timestamp
            namespace = 'app', // namespace for organization
        } = options;

        const fullKey = `${namespace}:${key}`;

        // Prepare data with metadata
        const dataWithMeta = {
            data,
            timestamp: Date.now(),
            expire,
            namespace,
            compressed: false,
        };

        // Store pending data
        this.pendingData.set(fullKey, dataWithMeta);

        // Handle high priority writes immediately
        if (priority === 'high') {
            this.immediateWrite(fullKey, compress);
            return;
        }

        // Clear existing timeout
        if (this.writeQueue.has(fullKey)) {
            clearTimeout(this.writeQueue.get(fullKey));
            this.writeStats.debouncedWrites++;
        }

        // Set new debounced timeout
        const delay = priority === 'low' ? this.writeDelay * 2 : this.writeDelay;
        const timeoutId = setTimeout(() => {
            this.immediateWrite(fullKey, compress);
        }, delay);

        this.writeQueue.set(fullKey, timeoutId);
        debugLog(`Queued write for ${fullKey} with ${delay}ms delay`);
    }

    /**
     * Immediate write operation
     * @param {string} fullKey - Full storage key with namespace
     * @param {string|boolean} compress - Compression setting
     */
    async immediateWrite(fullKey, compress) {
        try {
            const dataWithMeta = this.pendingData.get(fullKey);
            if (!dataWithMeta) return;

            let serializedData = JSON.stringify(dataWithMeta);
            let originalSize = serializedData.length;

            // Apply compression if needed
            if (this.shouldCompress(serializedData, compress)) {
                serializedData = await this.compressData(serializedData);
                dataWithMeta.compressed = true;
                serializedData = JSON.stringify(dataWithMeta);

                const compressedSize = serializedData.length;
                const savings = originalSize - compressedSize;

                if (savings > 0) {
                    this.writeStats.compressionSaves += savings;
                    debugLog(`Compressed ${fullKey}: saved ${savings} bytes`);
                }
            }

            // Attempt write with retry logic
            await this.writeWithRetry(fullKey, serializedData);

            // Cleanup
            this.writeQueue.delete(fullKey);
            this.pendingData.delete(fullKey);

            // Update stats
            this.writeStats.totalWrites++;
            this.writeStats.totalDataSize += serializedData.length;

            debugLog(`Successfully wrote ${fullKey} (${serializedData.length} bytes)`);

        } catch (error) {
            this.handleWriteError(fullKey, error);
        }
    }

    /**
     * Write with retry logic
     * @param {string} key - Storage key
     * @param {string} data - Serialized data
     * @param {number} attempt - Current attempt number
     */
    async writeWithRetry(key, data, attempt = 1) {
        try {
            this.checkStorageSpace(data.length);
            localStorage.setItem(key, data);
        } catch (error) {
            if (attempt < this.maxRetries) {
                warnLog(`Write failed for ${key}, retrying (${attempt}/${this.maxRetries})`);

                // Try to free up space if quota exceeded
                if (error.name === 'QuotaExceededError') {
                    await this.freeUpSpace();
                }

                // Wait before retry
                await new Promise(resolve => setTimeout(resolve, this.retryDelay * attempt));
                return this.writeWithRetry(key, data, attempt + 1);
            }

            throw error;
        }
    }

    /**
     * Read data from storage
     * @param {string} key - Storage key
     * @param {Object} options - Read options
     * @returns {any} - Stored data or default value
     */
    read(key, options = {}) {
        const {
            defaultValue = null,
            namespace = 'app',
            ignoreExpired = false,
        } = options;

        const fullKey = `${namespace}:${key}`;

        try {
            const item = localStorage.getItem(fullKey);
            if (!item) return defaultValue;

            const parsed = JSON.parse(item);

            // Handle old format data (without metadata)
            if (!parsed.timestamp) {
                return parsed;
            }

            // Check expiration
            if (!ignoreExpired && parsed.expire && Date.now() > parsed.expire) {
                this.remove(key, { namespace });
                return defaultValue;
            }

            // Decompress if needed
            if (parsed.compressed) {
                return this.decompressData(parsed.data);
            }

            return parsed.data;

        } catch (error) {
            errorLog(`Failed to read ${fullKey}`, error);
            return defaultValue;
        }
    }

    /**
     * Remove data from storage
     * @param {string} key - Storage key
     * @param {Object} options - Remove options
     */
    remove(key, options = {}) {
        const { namespace = 'app' } = options;
        const fullKey = `${namespace}:${key}`;

        try {
            localStorage.removeItem(fullKey);

            // Cancel pending writes
            if (this.writeQueue.has(fullKey)) {
                clearTimeout(this.writeQueue.get(fullKey));
                this.writeQueue.delete(fullKey);
            }
            this.pendingData.delete(fullKey);

            debugLog(`Removed ${fullKey}`);
        } catch (error) {
            errorLog(`Failed to remove ${fullKey}`, error);
        }
    }

    /**
     * Clear all data from a namespace
     * @param {string} namespace - Namespace to clear
     */
    clearNamespace(namespace = 'app') {
        try {
            const keysToRemove = [];
            const prefix = `${namespace}:`;

            for (let i = 0; i < localStorage.length; i++) {
                const key = localStorage.key(i);
                if (key && key.startsWith(prefix)) {
                    keysToRemove.push(key);
                }
            }

            keysToRemove.forEach(key => {
                localStorage.removeItem(key);
                // Cancel pending writes
                if (this.writeQueue.has(key)) {
                    clearTimeout(this.writeQueue.get(key));
                    this.writeQueue.delete(key);
                }
                this.pendingData.delete(key);
            });

            infoLog(`Cleared namespace: ${namespace} (${keysToRemove.length} items)`);
        } catch (error) {
            errorLog(`Failed to clear namespace ${namespace}`, error);
        }
    }

    /**
     * Check if compression should be applied
     * @param {string} data - Serialized data
     * @param {string|boolean} compress - Compression setting
     * @returns {boolean}
     */
    shouldCompress(data, compress) {
        if (compress === true) return true;
        if (compress === false) return false;
        if (compress === 'auto') {
            return data.length > this.compressionThreshold;
        }
        return false;
    }

    /**
     * Compress data (placeholder - would use actual compression library)
     * @param {string} data - Data to compress
     * @returns {string} - Compressed data
     */
    async compressData(data) {
        // Placeholder for actual compression
        // In real implementation, would use LZ-string or similar
        return data;
    }

    /**
     * Decompress data (placeholder)
     * @param {string} data - Compressed data
     * @returns {any} - Decompressed data
     */
    decompressData(data) {
        // Placeholder for actual decompression
        return data;
    }

    /**
     * Check available storage space
     * @param {number} requiredBytes - Bytes needed
     */
    checkStorageSpace(requiredBytes) {
        const available = this.getAvailableSpace();
        if (available !== -1 && requiredBytes > available) {
            throw new Error('Insufficient storage space');
        }
    }

    /**
     * Get available storage space
     * @returns {number} - Available bytes (-1 if unknown)
     */
    getAvailableSpace() {
        try {
            const testKey = '__storage_test__';
            let size = 0;

            // Binary search for available space
            let low = 0;
            let high = 10 * 1024 * 1024; // 10MB max test

            while (low < high) {
                const mid = Math.floor((low + high) / 2);
                try {
                    localStorage.setItem(testKey, 'x'.repeat(mid));
                    localStorage.removeItem(testKey);
                    low = mid + 1;
                } catch (e) {
                    high = mid;
                }
            }

            return low;
        } catch (error) {
            return -1;
        }
    }

    /**
     * Free up storage space
     */
    async freeUpSpace() {
        try {
            // Remove expired items first
            this.removeExpiredItems();

            // Remove old items from low-priority namespaces
            this.removeOldItems(['cache', 'temp'], 24 * 60 * 60 * 1000); // 24 hours

            infoLog('Storage space cleanup completed');
        } catch (error) {
            errorLog('Failed to free up storage space', error);
        }
    }

    /**
     * Remove expired items
     */
    removeExpiredItems() {
        const now = Date.now();
        const expiredKeys = [];

        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            if (!key) continue;

            try {
                const item = localStorage.getItem(key);
                const parsed = JSON.parse(item);

                if (parsed.expire && now > parsed.expire) {
                    expiredKeys.push(key);
                }
            } catch (error) {
                // Ignore parsing errors
            }
        }

        expiredKeys.forEach(key => {
            localStorage.removeItem(key);
        });

        if (expiredKeys.length > 0) {
            infoLog(`Removed ${expiredKeys.length} expired items`);
        }
    }

    /**
     * Remove old items from specific namespaces
     * @param {string[]} namespaces - Namespaces to clean
     * @param {number} maxAge - Maximum age in milliseconds
     */
    removeOldItems(namespaces, maxAge) {
        const cutoff = Date.now() - maxAge;
        const oldKeys = [];

        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            if (!key) continue;

            const namespace = key.split(':')[0];
            if (!namespaces.includes(namespace)) continue;

            try {
                const item = localStorage.getItem(key);
                const parsed = JSON.parse(item);

                if (parsed.timestamp && parsed.timestamp < cutoff) {
                    oldKeys.push(key);
                }
            } catch (error) {
                // Ignore parsing errors
            }
        }

        oldKeys.forEach(key => {
            localStorage.removeItem(key);
        });

        if (oldKeys.length > 0) {
            infoLog(`Removed ${oldKeys.length} old items from namespaces: ${namespaces.join(', ')}`);
        }
    }

    /**
     * Flush all pending writes
     */
    flushAllPendingWrites() {
        const pendingKeys = Array.from(this.writeQueue.keys());

        pendingKeys.forEach(key => {
            clearTimeout(this.writeQueue.get(key));
            this.immediateWrite(key, 'auto');
        });

        if (pendingKeys.length > 0) {
            infoLog(`Flushed ${pendingKeys.length} pending writes`);
        }
    }

    /**
     * Check storage health
     */
    checkStorageHealth() {
        const health = {
            available: this.getAvailableSpace(),
            pendingWrites: this.writeQueue.size,
            errorRate: this.writeStats.errors / Math.max(1, this.writeStats.totalWrites),
            compressionRatio: this.writeStats.compressionSaves / Math.max(1, this.writeStats.totalDataSize),
            stats: { ...this.writeStats },
        };

        // Report health issues
        if (health.errorRate > 0.1) {
            warnLog(`High storage error rate: ${(health.errorRate * 100).toFixed(1)}%`);
        }

        if (health.available !== -1 && health.available < 1024 * 1024) { // < 1MB
            warnLog(`Low storage space: ${(health.available / 1024).toFixed(0)}KB remaining`);
        }

        // Report to agent testing
        if (window.testLogger) {
            window.testLogger.logPerformance({
                type: 'storage_health',
                ...health,
                timestamp: Date.now(),
            });
        }

        return health;
    }

    /**
     * Handle write errors
     * @param {string} key - Storage key that failed
     * @param {Error} error - Error that occurred
     */
    handleWriteError(key, error) {
        this.errorCount++;
        this.writeStats.errors++;

        errorLog(`Storage write failed for ${key}`, error);

        // Report error to agent testing
        if (window.testLogger) {
            window.testLogger.logError({
                type: 'storage_error',
                key,
                error: error.message,
                errorType: error.name,
                timestamp: Date.now(),
            });
        }

        // Clean up failed write
        this.writeQueue.delete(key);
        this.pendingData.delete(key);
    }

    /**
     * Get storage statistics
     * @returns {Object} - Storage statistics
     */
    getStats() {
        return {
            ...this.writeStats,
            pendingWrites: this.writeQueue.size,
            errorCount: this.errorCount,
            health: this.checkStorageHealth(),
        };
    }

    /**
     * Reset statistics
     */
    resetStats() {
        this.writeStats = {
            totalWrites: 0,
            debouncedWrites: 0,
            compressionSaves: 0,
            errors: 0,
            totalDataSize: 0,
        };
        this.errorCount = 0;
        infoLog('Storage statistics reset');
    }
}

// Create singleton instance
const storageService = new StorageService();

export default storageService;
export { StorageService }; 