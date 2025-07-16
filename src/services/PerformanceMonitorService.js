/**
 * Performance Monitoring Service
 * Comprehensive performance tracking and analysis for PRD-20 Phase 1C
 * Integrates with existing performance hooks and provides bundle analysis
 */

import { perfLog, warnLog, infoLog } from '../utils/logger';

class PerformanceMonitorService {
    constructor() {
        this.metrics = new Map();
        this.performanceEntries = [];
        this.bundleMetrics = {
            initialLoadTime: null,
            bundleSize: null,
            chunksLoaded: 0,
            resourceTimings: [],
        };
        this.vitals = {
            fcp: null, // First Contentful Paint
            lcp: null, // Largest Contentful Paint
            fid: null, // First Input Delay
            cls: null, // Cumulative Layout Shift
            ttfb: null, // Time to First Byte
        };
        this.isMonitoring = false;
        this.performanceObserver = null;
        this.memoryCheckInterval = null;

        this.initializeMonitoring();
    }

    /**
     * Initialize performance monitoring
     */
    initializeMonitoring() {
        if (typeof window === 'undefined') return;

        this.isMonitoring = true;

        // Monitor initial load
        if (document.readyState === 'loading') {
            window.addEventListener('load', () => this.captureInitialLoad());
        } else {
            this.captureInitialLoad();
        }

        // Set up performance observers
        this.setupPerformanceObservers();

        // Start memory monitoring
        this.startMemoryMonitoring();

        // Monitor bundle loading
        this.monitorResourceLoading();

        infoLog('Performance monitoring initialized');
    }

    /**
     * Capture initial page load metrics
     */
    captureInitialLoad() {
        const navigation = performance.getEntriesByType('navigation')[0];
        if (navigation) {
            this.bundleMetrics.initialLoadTime = navigation.loadEventEnd - navigation.fetchStart;
            this.vitals.ttfb = navigation.responseStart - navigation.fetchStart;

            perfLog('Initial load', this.bundleMetrics.initialLoadTime);

            // Report to agent testing infrastructure
            if (window.testLogger) {
                window.testLogger.logPerformance({
                    type: 'initial_load',
                    loadTime: this.bundleMetrics.initialLoadTime,
                    ttfb: this.vitals.ttfb,
                    timestamp: Date.now(),
                });
            }
        }

        // Calculate bundle size from resource timings
        this.calculateBundleSize();
    }

    /**
     * Set up performance observers for Web Vitals
     */
    setupPerformanceObservers() {
        if (!('PerformanceObserver' in window)) return;

        try {
            // Observe paint entries (FCP)
            const paintObserver = new PerformanceObserver((list) => {
                for (const entry of list.getEntries()) {
                    if (entry.name === 'first-contentful-paint') {
                        this.vitals.fcp = entry.startTime;
                        perfLog('First Contentful Paint', entry.startTime);
                    }
                }
            });
            paintObserver.observe({ entryTypes: ['paint'] });

            // Observe largest contentful paint
            const lcpObserver = new PerformanceObserver((list) => {
                const entries = list.getEntries();
                const lastEntry = entries[entries.length - 1];
                this.vitals.lcp = lastEntry.startTime;
                perfLog('Largest Contentful Paint', lastEntry.startTime);
            });
            lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });

            // Observe first input delay
            const fidObserver = new PerformanceObserver((list) => {
                for (const entry of list.getEntries()) {
                    this.vitals.fid = entry.processingStart - entry.startTime;
                    perfLog('First Input Delay', this.vitals.fid);
                }
            });
            fidObserver.observe({ entryTypes: ['first-input'] });

            // Observe layout shifts
            const clsObserver = new PerformanceObserver((list) => {
                let clsValue = 0;
                for (const entry of list.getEntries()) {
                    if (!entry.hadRecentInput) {
                        clsValue += entry.value;
                    }
                }
                this.vitals.cls = clsValue;
                if (clsValue > 0.1) {
                    warnLog(`Cumulative Layout Shift detected: ${clsValue}`);
                }
            });
            clsObserver.observe({ entryTypes: ['layout-shift'] });

        } catch (error) {
            console.warn('Performance observers not fully supported:', error);
        }
    }

    /**
     * Monitor resource loading for bundle analysis
     */
    monitorResourceLoading() {
        const resourceObserver = new PerformanceObserver((list) => {
            for (const entry of list.getEntries()) {
                if (entry.name.includes('.js') || entry.name.includes('.css')) {
                    this.bundleMetrics.resourceTimings.push({
                        name: entry.name,
                        size: entry.transferSize || 0,
                        loadTime: entry.responseEnd - entry.startTime,
                        type: entry.name.includes('.js') ? 'javascript' : 'css',
                    });

                    if (entry.name.includes('chunk')) {
                        this.bundleMetrics.chunksLoaded++;
                    }
                }
            }
        });

        if ('PerformanceObserver' in window) {
            resourceObserver.observe({ entryTypes: ['resource'] });
        }
    }

    /**
     * Calculate total bundle size from resource timings
     */
    calculateBundleSize() {
        const resources = performance.getEntriesByType('resource');
        let totalSize = 0;

        resources.forEach(resource => {
            if (resource.name.includes('.js') || resource.name.includes('.css')) {
                totalSize += resource.transferSize || 0;
            }
        });

        this.bundleMetrics.bundleSize = totalSize;

        if (totalSize > 2.3 * 1024 * 1024) { // 2.3MB threshold from PRD-20
            warnLog(`Bundle size exceeds target: ${(totalSize / 1024 / 1024).toFixed(2)}MB`);
        }

        perfLog('Bundle size calculated', totalSize);
    }

    /**
     * Start memory monitoring
     */
    startMemoryMonitoring() {
        if (!performance.memory) return;

        this.memoryCheckInterval = setInterval(() => {
            const memInfo = {
                used: performance.memory.usedJSHeapSize,
                total: performance.memory.totalJSHeapSize,
                limit: performance.memory.jsHeapSizeLimit,
                timestamp: Date.now(),
            };

            // Check for memory growth
            const growthRate = this.calculateMemoryGrowthRate(memInfo);
            if (growthRate > 5 * 1024 * 1024) { // 5MB growth per minute
                warnLog(`High memory growth rate detected: ${(growthRate / 1024 / 1024).toFixed(2)}MB/min`);
            }

            // Report to agent testing
            if (window.testLogger) {
                window.testLogger.logPerformance({
                    type: 'memory',
                    ...memInfo,
                });
            }
        }, 30000); // Check every 30 seconds
    }

    /**
     * Calculate memory growth rate
     */
    calculateMemoryGrowthRate(currentMemInfo) {
        const previousChecks = this.getMetric('memory_checks') || [];
        previousChecks.push(currentMemInfo);

        // Keep only last 5 minutes of data (10 checks)
        if (previousChecks.length > 10) {
            previousChecks.shift();
        }

        this.setMetric('memory_checks', previousChecks);

        if (previousChecks.length < 2) return 0;

        const timeDiff = currentMemInfo.timestamp - previousChecks[0].timestamp;
        const memoryDiff = currentMemInfo.used - previousChecks[0].used;

        return (memoryDiff / timeDiff) * 60000; // Per minute
    }

    /**
     * Track component performance
     */
    trackComponentPerformance(componentName, operation, duration, metadata = {}) {
        const metricKey = `component_${componentName}_${operation}`;
        const existing = this.getMetric(metricKey) || [];

        existing.push({
            duration,
            timestamp: Date.now(),
            metadata,
        });

        // Keep only last 100 measurements
        if (existing.length > 100) {
            existing.splice(0, existing.length - 100);
        }

        this.setMetric(metricKey, existing);

        // Warn on slow operations
        if (duration > 16 && operation === 'render') {
            warnLog(`Slow render detected in ${componentName}: ${duration.toFixed(2)}ms`);
        }

        perfLog(`${componentName}.${operation}`, duration, metadata);
    }

    /**
     * Track route change performance
     */
    trackRouteChange(fromRoute, toRoute, duration) {
        const routeMetric = {
            from: fromRoute,
            to: toRoute,
            duration,
            timestamp: Date.now(),
        };

        const routeChanges = this.getMetric('route_changes') || [];
        routeChanges.push(routeMetric);

        // Keep only last 50 route changes
        if (routeChanges.length > 50) {
            routeChanges.shift();
        }

        this.setMetric('route_changes', routeChanges);

        if (duration > 1000) {
            warnLog(`Slow route change detected: ${fromRoute} → ${toRoute} (${duration}ms)`);
        }

        perfLog('Route change', duration, { from: fromRoute, to: toRoute });
    }

    /**
     * Track PIMS switching performance
     */
    trackPIMSSwitch(fromPIMS, toPIMS, duration) {
        const pimsMetric = {
            from: fromPIMS,
            to: toPIMS,
            duration,
            timestamp: Date.now(),
        };

        const pimsSwitches = this.getMetric('pims_switches') || [];
        pimsSwitches.push(pimsMetric);

        // Keep only last 30 switches
        if (pimsSwitches.length > 30) {
            pimsSwitches.shift();
        }

        this.setMetric('pims_switches', pimsSwitches);

        // Check against PRD-20 target of <500ms
        if (duration > 500) {
            warnLog(`PIMS switch exceeds target: ${fromPIMS} → ${toPIMS} (${duration}ms)`);
        }

        perfLog('PIMS switch', duration, { from: fromPIMS, to: toPIMS });
    }

    /**
     * Generate performance report
     */
    generatePerformanceReport() {
        const report = {
            timestamp: Date.now(),
            vitals: { ...this.vitals },
            bundle: { ...this.bundleMetrics },
            memory: performance.memory ? {
                current: performance.memory.usedJSHeapSize,
                peak: Math.max(...(this.getMetric('memory_checks') || []).map(m => m.used)),
                limit: performance.memory.jsHeapSizeLimit,
            } : null,
            components: this.getComponentPerformanceStats(),
            routes: this.getRoutePerformanceStats(),
            pims: this.getPIMSPerformanceStats(),
            issues: this.identifyPerformanceIssues(),
        };

        infoLog('Performance report generated', report);
        return report;
    }

    /**
     * Get component performance statistics
     */
    getComponentPerformanceStats() {
        const stats = {};

        for (const [key, metrics] of this.metrics) {
            if (key.startsWith('component_')) {
                const [, componentName, operation] = key.split('_');

                if (!stats[componentName]) {
                    stats[componentName] = {};
                }

                const durations = metrics.map(m => m.duration);
                stats[componentName][operation] = {
                    count: durations.length,
                    average: durations.reduce((a, b) => a + b, 0) / durations.length,
                    max: Math.max(...durations),
                    min: Math.min(...durations),
                    recent: durations.slice(-10).reduce((a, b) => a + b, 0) / Math.min(10, durations.length),
                };
            }
        }

        return stats;
    }

    /**
     * Get route performance statistics
     */
    getRoutePerformanceStats() {
        const routeChanges = this.getMetric('route_changes') || [];
        const durations = routeChanges.map(r => r.duration);

        if (durations.length === 0) return null;

        return {
            count: durations.length,
            average: durations.reduce((a, b) => a + b, 0) / durations.length,
            max: Math.max(...durations),
            slowest: routeChanges.find(r => r.duration === Math.max(...durations)),
            recent: routeChanges.slice(-5),
        };
    }

    /**
     * Get PIMS performance statistics
     */
    getPIMSPerformanceStats() {
        const pimsSwitches = this.getMetric('pims_switches') || [];
        const durations = pimsSwitches.map(p => p.duration);

        if (durations.length === 0) return null;

        return {
            count: durations.length,
            average: durations.reduce((a, b) => a + b, 0) / durations.length,
            max: Math.max(...durations),
            target: 500, // PRD-20 target
            withinTarget: durations.filter(d => d <= 500).length,
            exceedsTarget: durations.filter(d => d > 500).length,
        };
    }

    /**
     * Identify performance issues
     */
    identifyPerformanceIssues() {
        const issues = [];

        // Check Web Vitals
        if (this.vitals.fcp > 3000) {
            issues.push({
                type: 'vital',
                metric: 'FCP',
                value: this.vitals.fcp,
                severity: 'warning',
                message: 'First Contentful Paint is slower than recommended (>3s)',
            });
        }

        if (this.vitals.lcp > 2500) {
            issues.push({
                type: 'vital',
                metric: 'LCP',
                value: this.vitals.lcp,
                severity: 'warning',
                message: 'Largest Contentful Paint is slower than recommended (>2.5s)',
            });
        }

        if (this.vitals.fid > 100) {
            issues.push({
                type: 'vital',
                metric: 'FID',
                value: this.vitals.fid,
                severity: 'warning',
                message: 'First Input Delay is higher than recommended (>100ms)',
            });
        }

        if (this.vitals.cls > 0.1) {
            issues.push({
                type: 'vital',
                metric: 'CLS',
                value: this.vitals.cls,
                severity: 'warning',
                message: 'Cumulative Layout Shift is higher than recommended (>0.1)',
            });
        }

        // Check bundle size
        if (this.bundleMetrics.bundleSize > 2.3 * 1024 * 1024) {
            issues.push({
                type: 'bundle',
                metric: 'size',
                value: this.bundleMetrics.bundleSize,
                severity: 'warning',
                message: 'Bundle size exceeds PRD-20 target (>2.3MB)',
            });
        }

        // Check initial load time
        if (this.bundleMetrics.initialLoadTime > 3000) {
            issues.push({
                type: 'bundle',
                metric: 'load_time',
                value: this.bundleMetrics.initialLoadTime,
                severity: 'warning',
                message: 'Initial load time exceeds PRD-20 target (>3s)',
            });
        }

        return issues;
    }

    /**
     * Get metric by key
     */
    getMetric(key) {
        return this.metrics.get(key);
    }

    /**
     * Set metric by key
     */
    setMetric(key, value) {
        this.metrics.set(key, value);
    }

    /**
     * Clear all metrics
     */
    clearMetrics() {
        this.metrics.clear();
        infoLog('Performance metrics cleared');
    }

    /**
     * Stop monitoring
     */
    stopMonitoring() {
        this.isMonitoring = false;

        if (this.performanceObserver) {
            this.performanceObserver.disconnect();
        }

        if (this.memoryCheckInterval) {
            clearInterval(this.memoryCheckInterval);
        }

        infoLog('Performance monitoring stopped');
    }

    /**
     * Get monitoring status
     */
    getStatus() {
        return {
            isMonitoring: this.isMonitoring,
            metricsCount: this.metrics.size,
            vitalsComplete: Object.values(this.vitals).every(v => v !== null),
            memorySupported: !!performance.memory,
            observersSupported: 'PerformanceObserver' in window,
        };
    }
}

// Create singleton instance
const performanceMonitorService = new PerformanceMonitorService();

export default performanceMonitorService;
export { PerformanceMonitorService }; 