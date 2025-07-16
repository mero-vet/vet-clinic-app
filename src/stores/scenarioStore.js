import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';

const useScenarioStore = create(
  devtools(
    persist(
      (set, get) => ({
        scenarios: new Map(),
        activeScenario: null,
        scenarioHistory: [],
        performanceMetrics: {
          decisionsPerMinute: 0,
          errorRate: 0,
          recoveryTime: 0,
          completionRate: 0,
        },

        registerScenario: (scenario) =>
          set((state) => {
            const newScenarios = new Map(state.scenarios);
            newScenarios.set(scenario.id, scenario);
            return { scenarios: newScenarios };
          }),

        setActiveScenario: (scenarioId) =>
          set((state) => ({
            activeScenario: state.scenarios.get(scenarioId) || null,
          })),

        updateScenarioProgress: (scenarioId, progress) =>
          set((state) => {
            const scenario = state.scenarios.get(scenarioId);
            if (!scenario) return state;

            const newScenarios = new Map(state.scenarios);
            newScenarios.set(scenarioId, { ...scenario, progress });
            return { scenarios: newScenarios };
          }),

        completeScenario: (scenarioId, results) =>
          set((state) => ({
            scenarioHistory: [
              ...state.scenarioHistory,
              {
                scenarioId,
                completedAt: new Date().toISOString(),
                results,
              },
            ],
            activeScenario: null,
          })),

        updatePerformanceMetrics: (metrics) =>
          set((state) => ({
            performanceMetrics: {
              ...state.performanceMetrics,
              ...metrics,
            },
          })),

        resetScenarioState: () =>
          set({
            activeScenario: null,
            performanceMetrics: {
              decisionsPerMinute: 0,
              errorRate: 0,
              recoveryTime: 0,
              completionRate: 0,
            },
          }),
      }),
      {
        name: 'scenario-storage',
        partialize: (state) => ({
          scenarioHistory: state.scenarioHistory,
        }),
      }
    ),
    {
      name: 'ScenarioStore',
    }
  )
);

export default useScenarioStore;