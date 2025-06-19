import { describe, it, expect } from 'vitest';

// Patch indexedDB global before importing service
const mockIndexedDB = {
    open: () => {
        const req = {};
        setTimeout(() => {
            if (req.onerror) req.onerror({ target: { error: new Error('Simulated failure') } });
        }, 0);
        return req;
    }
};

globalThis.indexedDB = mockIndexedDB;

describe('ScenarioService fallback', () => {
    it('should return default scenarios when IndexedDB fails', async () => {
        const { default: scenarioService } = await import('../../services/ScenarioService');
        const scenarios = await scenarioService.getEnabledScenarios();
        expect(scenarios.length).toBeGreaterThan(0);
    });
}); 