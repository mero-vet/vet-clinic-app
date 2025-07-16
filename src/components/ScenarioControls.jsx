import React, { useState, useEffect } from 'react';
import { useScenarioStore } from '../stores/scenarioStore';
import { ScenarioEngine } from '../services/scenarios/ScenarioEngine';
import { ScenarioRegistry } from '../services/scenarios/ScenarioRegistry';
import { Button } from './design-system/Button';
import { Card } from './design-system/Card';
import './ScenarioControls.css';

const scenarioEngine = new ScenarioEngine();
const scenarioRegistry = new ScenarioRegistry();

const ScenarioControls = ({ className = '' }) => {
    const {
        activeScenario,
        scenarios,
        performanceMetrics,
        registerScenario,
        setActiveScenario,
        updatePerformanceMetrics
    } = useScenarioStore();

    const [availableScenarios, setAvailableScenarios] = useState([]);
    const [scenarioState, setScenarioState] = useState(null);
    const [isRunning, setIsRunning] = useState(false);
    const [logs, setLogs] = useState([]);

    useEffect(() => {
        loadAvailableScenarios();
        setupScenarioEngineListeners();

        return () => {
            scenarioEngine.removeAllListeners();
        };
    }, []);

    const loadAvailableScenarios = async () => {
        try {
            const scenarios = await scenarioRegistry.getAllScenarios();
            setAvailableScenarios(scenarios);

            // Register scenarios in store
            scenarios.forEach(scenario => {
                registerScenario(scenario);
            });
        } catch (error) {
            console.error('Failed to load scenarios:', error);
            addLog('Error: Failed to load scenarios', 'error');
        }
    };

    const setupScenarioEngineListeners = () => {
        scenarioEngine.on('scenario:loaded', (data) => {
            addLog(`Scenario loaded: ${data.title}`, 'info');
            setIsRunning(true);
        });

        scenarioEngine.on('scenario:completed', (data) => {
            addLog(`Scenario completed with score: ${data.score}`, 'success');
            setIsRunning(false);
            updatePerformanceMetrics(data.metrics);
        });

        scenarioEngine.on('scenario:decision', (data) => {
            addLog(`Decision made: ${data.decision} (${data.timeMs}ms)`, 'info');
        });

        scenarioEngine.on('scenario:error', (data) => {
            addLog(`Error: ${data.message}`, 'error');
        });

        scenarioEngine.on('scenario:phase-change', (data) => {
            addLog(`Phase changed: ${data.from} → ${data.to}`, 'info');
            setScenarioState(data.state);
        });
    };

    const addLog = (message, type = 'info') => {
        const timestamp = new Date().toLocaleTimeString();
        setLogs(prev => [...prev.slice(-9), { timestamp, message, type }]);
    };

    const startScenario = async (scenarioId) => {
        try {
            const scenario = availableScenarios.find(s => s.id === scenarioId);
            if (!scenario) return;

            setActiveScenario(scenarioId);
            setLogs([]);

            const state = await scenarioEngine.loadScenario(scenario);
            setScenarioState(state);

            addLog(`Starting scenario: ${scenario.title}`, 'info');
        } catch (error) {
            console.error('Failed to start scenario:', error);
            addLog('Failed to start scenario', 'error');
        }
    };

    const stopScenario = () => {
        if (scenarioEngine.currentScenario) {
            scenarioEngine.stopScenario();
            setIsRunning(false);
            setActiveScenario(null);
            setScenarioState(null);
            addLog('Scenario stopped', 'info');
        }
    };

    const makeDecision = (decision) => {
        if (scenarioEngine.currentScenario && isRunning) {
            scenarioEngine.makeDecision(decision);
        }
    };

    const getCurrentPhaseOptions = () => {
        if (!scenarioState || !scenarioEngine.currentScenario) return [];

        const currentPhase = scenarioEngine.currentScenario.phases[scenarioState.currentPhase];
        return currentPhase?.transitions || [];
    };

    return (
        <div className={`scenario-controls ${className}`} data-testid="scenario-controls">
            <Card className="scenario-controls-card">
                <Card.Header>
                    <h3>Scenario Engine</h3>
                    {isRunning && (
                        <div className="scenario-status running">
                            <span className="status-indicator"></span>
                            Running
                        </div>
                    )}
                </Card.Header>

                <Card.Body>
                    {!isRunning ? (
                        <div className="scenario-selector">
                            <h4>Available Scenarios</h4>
                            <div className="scenario-list">
                                {availableScenarios.map(scenario => (
                                    <div key={scenario.id} className="scenario-item">
                                        <div className="scenario-info">
                                            <div className="scenario-title">{scenario.title}</div>
                                            <div className="scenario-description">{scenario.description}</div>
                                            <div className="scenario-meta">
                                                <span className={`difficulty ${scenario.difficulty}`}>
                                                    {scenario.difficulty}
                                                </span>
                                                <span className="category">{scenario.category}</span>
                                            </div>
                                        </div>
                                        <Button
                                            variant="primary"
                                            size="small"
                                            onClick={() => startScenario(scenario.id)}
                                            data-testid={`start-scenario-${scenario.id}`}
                                        >
                                            Start
                                        </Button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ) : (
                        <div className="scenario-runtime">
                            <div className="scenario-header">
                                <h4>{activeScenario && availableScenarios.find(s => s.id === activeScenario)?.title}</h4>
                                <Button
                                    variant="secondary"
                                    size="small"
                                    onClick={stopScenario}
                                    data-testid="stop-scenario"
                                >
                                    Stop
                                </Button>
                            </div>

                            {scenarioState && (
                                <div className="scenario-state">
                                    <div className="current-phase">
                                        <strong>Current Phase:</strong> {scenarioState.currentPhase}
                                    </div>

                                    {getCurrentPhaseOptions().length > 0 && (
                                        <div className="phase-options">
                                            <h5>Available Actions:</h5>
                                            {getCurrentPhaseOptions().map((option, index) => (
                                                <Button
                                                    key={index}
                                                    variant="tertiary"
                                                    size="small"
                                                    onClick={() => makeDecision(option.to)}
                                                    data-testid={`scenario-action-${option.to}`}
                                                    className="phase-option"
                                                >
                                                    {option.label}
                                                </Button>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            )}

                            <div className="scenario-logs">
                                <h5>Activity Log</h5>
                                <div className="logs-container">
                                    {logs.map((log, index) => (
                                        <div key={index} className={`log-entry ${log.type}`}>
                                            <span className="log-timestamp">{log.timestamp}</span>
                                            <span className="log-message">{log.message}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}
                </Card.Body>

                {performanceMetrics && Object.keys(performanceMetrics).length > 0 && (
                    <Card.Footer>
                        <div className="performance-summary">
                            <h5>Performance Metrics</h5>
                            <div className="metrics-grid">
                                <div className="metric">
                                    <span className="metric-label">Decisions/Min:</span>
                                    <span className="metric-value">{performanceMetrics.decisionsPerMinute || 0}</span>
                                </div>
                                <div className="metric">
                                    <span className="metric-label">Error Rate:</span>
                                    <span className="metric-value">{(performanceMetrics.errorRate * 100 || 0).toFixed(1)}%</span>
                                </div>
                                <div className="metric">
                                    <span className="metric-label">Recovery Time:</span>
                                    <span className="metric-value">{performanceMetrics.recoveryTime || 0}ms</span>
                                </div>
                                <div className="metric">
                                    <span className="metric-label">Completion Rate:</span>
                                    <span className="metric-value">{(performanceMetrics.completionRate * 100 || 0).toFixed(1)}%</span>
                                </div>
                            </div>
                        </div>
                    </Card.Footer>
                )}
            </Card>
        </div>
    );
};

export default ScenarioControls; 