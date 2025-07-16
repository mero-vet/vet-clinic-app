/**
 * Test Setup File - Vitest + React Testing Library
 * Configures global test environment, mocks, and utilities
 */

import '@testing-library/jest-dom';

// Mock browser APIs that are not available in jsdom
global.ResizeObserver = class ResizeObserver {
    constructor(cb) {
        this.cb = cb;
    }
    observe() {
        this.cb([{ borderBoxSize: { inlineSize: 0, blockSize: 0 } }], this);
    }
    unobserve() { }
    disconnect() { }
};

global.DOMRect = {
    fromRect: () => ({ top: 0, left: 0, bottom: 0, right: 0, width: 0, height: 0 }),
};

global.Range = function Range() { };

const createContextualFragment = (html) => {
    const div = document.createElement('div');
    div.innerHTML = html;
    return div;
};

Range.prototype.createContextualFragment = (html) => createContextualFragment(html);

// Mock window.location
delete window.location;
window.location = {
    href: 'http://localhost:3000',
    pathname: '/',
    search: '',
    hash: '',
    reload: vi.fn(),
    assign: vi.fn(),
    replace: vi.fn(),
};

// Mock window.scrollTo
window.scrollTo = vi.fn();

// Mock window.open
window.open = vi.fn();

// Mock localStorage
const localStorageMock = (() => {
    let store = {};
    return {
        getItem: (key) => store[key] || null,
        setItem: (key, value) => {
            store[key] = value.toString();
        },
        removeItem: (key) => {
            delete store[key];
        },
        clear: () => {
            store = {};
        },
        get length() {
            return Object.keys(store).length;
        },
        key: (index) => {
            const keys = Object.keys(store);
            return keys[index] || null;
        },
    };
})();

Object.defineProperty(window, 'localStorage', {
    value: localStorageMock,
});

Object.defineProperty(window, 'sessionStorage', {
    value: localStorageMock,
});

// Mock indexedDB for scenarios that use it
import 'fake-indexeddb/auto';

// Mock performance API for performance monitoring
Object.defineProperty(window, 'performance', {
    value: {
        now: vi.fn(() => Date.now()),
        mark: vi.fn(),
        measure: vi.fn(),
        getEntriesByName: vi.fn(() => []),
        getEntriesByType: vi.fn(() => []),
        clearMarks: vi.fn(),
        clearMeasures: vi.fn(),
        memory: {
            usedJSHeapSize: 1000000,
            totalJSHeapSize: 2000000,
            jsHeapSizeLimit: 4000000,
        },
    },
});

// Mock navigator for geolocation and other APIs
Object.defineProperty(window, 'navigator', {
    value: {
        ...window.navigator,
        geolocation: {
            getCurrentPosition: vi.fn(),
            watchPosition: vi.fn(),
        },
        clipboard: {
            writeText: vi.fn(() => Promise.resolve()),
            readText: vi.fn(() => Promise.resolve('')),
        },
        userAgent: 'Mozilla/5.0 (Test Environment)',
        platform: 'Test',
    },
});

// Mock IntersectionObserver
global.IntersectionObserver = class IntersectionObserver {
    constructor() { }
    observe() {
        return null;
    }
    disconnect() {
        return null;
    }
    unobserve() {
        return null;
    }
};

// Mock MutationObserver
global.MutationObserver = class MutationObserver {
    constructor() { }
    observe() {
        return null;
    }
    disconnect() {
        return null;
    }
    unobserve() {
        return null;
    }
};

// Mock fetch API for API calls
global.fetch = vi.fn(() =>
    Promise.resolve({
        ok: true,
        status: 200,
        json: () => Promise.resolve({}),
        text: () => Promise.resolve(''),
        blob: () => Promise.resolve(new Blob()),
    })
);

// Mock console methods in tests to avoid noise
global.console = {
    ...console,
    // Keep important methods
    error: console.error,
    warn: console.warn,
    // Mock debug methods
    log: vi.fn(),
    debug: vi.fn(),
    info: vi.fn(),
};

// Mock File System Access API
Object.defineProperty(window, 'showDirectoryPicker', {
    value: vi.fn(() => Promise.reject(new Error('Not available in test'))),
});

// Global test utilities
global.TestUtils = {
    // Helper for waiting for async operations
    waitFor: (ms = 0) => new Promise(resolve => setTimeout(resolve, ms)),

    // Helper for creating mock events
    createMockEvent: (type, properties = {}) => ({
        type,
        preventDefault: vi.fn(),
        stopPropagation: vi.fn(),
        target: { value: '' },
        ...properties,
    }),

    // Helper for mocking console temporarily
    mockConsole: () => {
        const originalConsole = global.console;
        global.console = {
            ...global.console,
            log: vi.fn(),
            info: vi.fn(),
            debug: vi.fn(),
        };
        return () => {
            global.console = originalConsole;
        };
    },

    // Helper for creating mock agent testing infrastructure
    createMockTestLogger: () => ({
        log: vi.fn(),
        logError: vi.fn(),
        logPerformance: vi.fn(),
        clear: vi.fn(),
        getMetrics: vi.fn(() => ({})),
    }),
};

// Set up mock testLogger for agent testing
window.testLogger = TestUtils.createMockTestLogger();

// Clean up after each test
afterEach(() => {
    // Clear all mocks
    vi.clearAllMocks();

    // Reset localStorage
    localStorage.clear();
    sessionStorage.clear();

    // Reset location
    window.location.pathname = '/';
    window.location.search = '';
    window.location.hash = '';

    // Clear console mocks
    if (global.console.log.mockClear) {
        global.console.log.mockClear();
        global.console.info.mockClear();
        global.console.debug.mockClear();
    }

    // Reset testLogger
    window.testLogger = TestUtils.createMockTestLogger();
});

// Error boundary for catching test errors
global.TestErrorBoundary = ({ children, onError = () => { } }) => {
    try {
        return children;
    } catch (error) {
        onError(error);
        return null;
    }
}; 