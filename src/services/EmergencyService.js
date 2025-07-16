import { DataFactory } from './mockData/DataFactory';
import QueueManagementService from './QueueManagementService';

class EmergencyService {
    constructor() {
        this.emergencyPatients = new Map();
        this.triageProtocols = new Map();
        this.emergencyAlerts = [];
        this.criticalThresholds = {
            heartRate: { min: 60, max: 200, critical: { min: 40, max: 250 } },
            respiratoryRate: { min: 10, max: 40, critical: { min: 5, max: 60 } },
            temperature: { min: 99, max: 103, critical: { min: 95, max: 106 } },
            bloodPressure: { systolic: { min: 90, max: 160, critical: { min: 70, max: 200 } } },
            oxygenSaturation: { min: 95, max: 100, critical: { min: 85, max: 100 } }
        };

        this.initialize();
    }

    initialize() {
        this.setupTriageProtocols();
        this.startEmergencyMonitoring();
    }

    setupTriageProtocols() {
        const protocols = [
            {
                id: 'respiratory-distress',
                name: 'Respiratory Distress Protocol',
                conditions: ['labored breathing', 'cyanosis', 'open mouth breathing'],
                priority: 9,
                immediateActions: [
                    'Provide oxygen supplementation',
                    'Check airway for obstruction',
                    'Monitor respiratory rate and effort',
                    'Prepare emergency intubation equipment'
                ],
                timeLimit: 300 // 5 minutes
            },
            {
                id: 'cardiovascular-emergency',
                name: 'Cardiovascular Emergency Protocol',
                conditions: ['cardiac arrest', 'severe arrhythmia', 'shock'],
                priority: 10,
                immediateActions: [
                    'Begin CPR if indicated',
                    'Establish IV access',
                    'Monitor cardiac rhythm',
                    'Administer emergency medications'
                ],
                timeLimit: 120 // 2 minutes
            },
            {
                id: 'trauma-major',
                name: 'Major Trauma Protocol',
                conditions: ['hit by car', 'fall from height', 'severe bleeding'],
                priority: 8,
                immediateActions: [
                    'Control bleeding',
                    'Stabilize fractures',
                    'Check for internal injuries',
                    'Pain management'
                ],
                timeLimit: 600 // 10 minutes
            },
            {
                id: 'toxicosis',
                name: 'Toxicosis Protocol',
                conditions: ['poisoning', 'overdose', 'toxic ingestion'],
                priority: 8,
                immediateActions: [
                    'Identify toxin if possible',
                    'Induce vomiting if appropriate',
                    'Administer activated charcoal',
                    'Support vital functions'
                ],
                timeLimit: 900 // 15 minutes
            },
            {
                id: 'neurological-emergency',
                name: 'Neurological Emergency Protocol',
                conditions: ['seizures', 'altered consciousness', 'head trauma'],
                priority: 8,
                immediateActions: [
                    'Protect airway',
                    'Control seizures if present',
                    'Monitor neurological status',
                    'Prepare for imaging'
                ],
                timeLimit: 450 // 7.5 minutes
            }
        ];

        protocols.forEach(protocol => {
            this.triageProtocols.set(protocol.id, protocol);
        });
    }

    startEmergencyMonitoring() {
        // Check for critical patients every 30 seconds
        setInterval(() => {
            this.monitorCriticalPatients();
            this.updateEmergencyAlerts();
        }, 30000);
    }

    registerEmergencyPatient(patientData) {
        const emergency = {
            id: `emergency-${Date.now()}`,
            patientId: patientData.patient.id,
            patient: patientData.patient,
            arrivalTime: new Date(),
            triageLevel: this.calculateTriageLevel(patientData),
            vitals: this.generateVitals(patientData),
            symptoms: patientData.symptoms || [],
            consciousness: patientData.consciousness || 'alert',
            pain: patientData.pain || 0,
            protocol: this.assignProtocol(patientData),
            interventions: [],
            monitoring: {
                startTime: new Date(),
                frequency: this.getMonitoringFrequency(patientData),
                nextCheck: new Date(Date.now() + this.getMonitoringFrequency(patientData) * 1000)
            },
            stabilization: {
                isStable: false,
                targetTime: new Date(Date.now() + this.getStabilizationTarget(patientData) * 1000),
                criticalWindow: this.getCriticalWindow(patientData)
            }
        };

        this.emergencyPatients.set(emergency.id, emergency);

        // Create emergency alert
        this.createEmergencyAlert({
            type: 'new-emergency',
            severity: this.getSeverityLevel(emergency.triageLevel),
            message: `Emergency patient: ${emergency.patient.name} - ${emergency.protocol?.name || 'General Emergency'}`,
            patientId: emergency.patientId,
            emergencyId: emergency.id,
            timestamp: new Date()
        });

        // Auto-escalate in queue management
        this.escalateInQueue(emergency);

        return emergency;
    }

    calculateTriageLevel(patientData) {
        let baseLevel = 5;

        // Age factors
        if (patientData.patient.age < 1) baseLevel += 2;
        if (patientData.patient.age > 12) baseLevel += 1;

        // Symptom severity
        const criticalSymptoms = ['unconscious', 'not breathing', 'severe bleeding', 'cardiac arrest'];
        const urgentSymptoms = ['difficulty breathing', 'severe pain', 'vomiting', 'seizures'];

        if (patientData.symptoms?.some(s => criticalSymptoms.includes(s.toLowerCase()))) {
            baseLevel = 10;
        } else if (patientData.symptoms?.some(s => urgentSymptoms.includes(s.toLowerCase()))) {
            baseLevel += 3;
        }

        // Vitals assessment
        const vitals = this.generateVitals(patientData);
        if (this.isVitalsCritical(vitals)) {
            baseLevel = Math.max(baseLevel, 9);
        }

        return Math.min(baseLevel, 10);
    }

    generateVitals(patientData) {
        const species = patientData.patient.species?.toLowerCase() || 'dog';
        const age = patientData.patient.age || 5;

        // Base normal ranges by species
        const normals = {
            dog: { heartRate: 80, respiratoryRate: 20, temperature: 101.5 },
            cat: { heartRate: 180, respiratoryRate: 25, temperature: 101.0 },
            bird: { heartRate: 300, respiratoryRate: 40, temperature: 105.0 },
            rabbit: { heartRate: 200, respiratoryRate: 35, temperature: 102.0 }
        };

        const baseVitals = normals[species] || normals.dog;

        // Add variation for emergency conditions
        const severity = patientData.symptoms?.length || 1;
        const variation = 0.2 + (severity * 0.1);

        return {
            heartRate: Math.round(baseVitals.heartRate * (1 + (Math.random() - 0.5) * variation)),
            respiratoryRate: Math.round(baseVitals.respiratoryRate * (1 + (Math.random() - 0.5) * variation)),
            temperature: Number((baseVitals.temperature * (1 + (Math.random() - 0.5) * variation * 0.1)).toFixed(1)),
            bloodPressure: {
                systolic: Math.round(120 + (Math.random() - 0.5) * 40),
                diastolic: Math.round(80 + (Math.random() - 0.5) * 20)
            },
            oxygenSaturation: Math.max(85, Math.min(100, Math.round(98 - severity * 2 + Math.random() * 4))),
            timestamp: new Date()
        };
    }

    isVitalsCritical(vitals) {
        const thresholds = this.criticalThresholds;

        return (
            vitals.heartRate < thresholds.heartRate.critical.min ||
            vitals.heartRate > thresholds.heartRate.critical.max ||
            vitals.respiratoryRate < thresholds.respiratoryRate.critical.min ||
            vitals.respiratoryRate > thresholds.respiratoryRate.critical.max ||
            vitals.temperature < thresholds.temperature.critical.min ||
            vitals.temperature > thresholds.temperature.critical.max ||
            vitals.oxygenSaturation < thresholds.oxygenSaturation.critical.min
        );
    }

    assignProtocol(patientData) {
        const symptoms = patientData.symptoms?.map(s => s.toLowerCase()) || [];

        for (const [id, protocol] of this.triageProtocols) {
            if (protocol.conditions.some(condition =>
                symptoms.some(symptom => symptom.includes(condition))
            )) {
                return protocol;
            }
        }

        return null; // General emergency care
    }

    escalateInQueue(emergency) {
        // Find patient in queue management and escalate priority
        const queues = QueueManagementService.getAllQueues();

        for (const [queueType, patients] of Object.entries(queues)) {
            const patient = patients.find(p => p.patientId === emergency.patientId);
            if (patient) {
                QueueManagementService.updatePatientPriority(patient.id, emergency.triageLevel);

                // Move to emergency queue if available, otherwise highest priority in waiting
                if (queueType !== 'inprogress') {
                    QueueManagementService.movePatientToQueue(patient.id, 'waiting');
                }
                break;
            }
        }
    }

    performIntervention(emergencyId, intervention) {
        const emergency = this.emergencyPatients.get(emergencyId);
        if (!emergency) return false;

        const interventionRecord = {
            id: `intervention-${Date.now()}`,
            type: intervention.type,
            description: intervention.description,
            performedBy: intervention.performedBy,
            timestamp: new Date(),
            success: intervention.success !== false, // Default to true
            vitalsAfter: this.updateVitalsAfterIntervention(emergency, intervention),
            notes: intervention.notes || ''
        };

        emergency.interventions.push(interventionRecord);

        // Update patient stability based on intervention
        this.updateStabilization(emergency, intervention);

        return interventionRecord;
    }

    updateVitalsAfterIntervention(emergency, intervention) {
        const currentVitals = emergency.vitals;
        const newVitals = { ...currentVitals, timestamp: new Date() };

        // Simulate intervention effects
        switch (intervention.type) {
            case 'oxygen_therapy':
                newVitals.oxygenSaturation = Math.min(100, newVitals.oxygenSaturation + 5 + Math.random() * 10);
                newVitals.respiratoryRate = Math.max(10, newVitals.respiratoryRate - 2 - Math.random() * 8);
                break;
            case 'iv_fluids':
                newVitals.bloodPressure.systolic += 10 + Math.random() * 15;
                newVitals.heartRate = Math.max(60, newVitals.heartRate - 5 - Math.random() * 15);
                break;
            case 'pain_medication':
                // Pain reduction would be tracked separately
                newVitals.heartRate = Math.max(60, newVitals.heartRate - 10 - Math.random() * 20);
                newVitals.respiratoryRate = Math.max(10, newVitals.respiratoryRate - 3 - Math.random() * 10);
                break;
            case 'emergency_surgery':
                // Major intervention with mixed results
                if (intervention.success) {
                    newVitals.heartRate = Math.max(60, newVitals.heartRate - 20 + Math.random() * 10);
                    newVitals.bloodPressure.systolic = Math.max(90, newVitals.bloodPressure.systolic - 10 + Math.random() * 20);
                }
                break;
        }

        emergency.vitals = newVitals;
        return newVitals;
    }

    updateStabilization(emergency, intervention) {
        const effectiveInterventions = ['oxygen_therapy', 'iv_fluids', 'emergency_surgery'];

        if (effectiveInterventions.includes(intervention.type) && intervention.success) {
            // Check if patient is becoming stable
            const vitalsImproving = !this.isVitalsCritical(emergency.vitals);
            const timeInWindow = Date.now() - emergency.stabilization.criticalWindow < 0;

            if (vitalsImproving && !timeInWindow) {
                emergency.stabilization.isStable = true;
                emergency.stabilization.stabilizedAt = new Date();

                this.createEmergencyAlert({
                    type: 'patient-stabilized',
                    severity: 'success',
                    message: `Patient ${emergency.patient.name} has been stabilized`,
                    patientId: emergency.patientId,
                    emergencyId: emergency.id,
                    timestamp: new Date()
                });
            }
        }
    }

    monitorCriticalPatients() {
        this.emergencyPatients.forEach(emergency => {
            if (Date.now() >= emergency.monitoring.nextCheck) {
                this.performMonitoringCheck(emergency);
                emergency.monitoring.nextCheck = new Date(Date.now() + emergency.monitoring.frequency * 1000);
            }

            // Check for critical deterioration
            if (!emergency.stabilization.isStable && Date.now() > emergency.stabilization.criticalWindow) {
                this.handleCriticalDeterioration(emergency);
            }
        });
    }

    performMonitoringCheck(emergency) {
        // Simulate vital signs evolution
        const change = (Math.random() - 0.5) * 0.1; // ±5% change
        const vitals = emergency.vitals;

        vitals.heartRate = Math.max(30, Math.min(300, Math.round(vitals.heartRate * (1 + change))));
        vitals.respiratoryRate = Math.max(5, Math.min(80, Math.round(vitals.respiratoryRate * (1 + change))));
        vitals.oxygenSaturation = Math.max(70, Math.min(100, Math.round(vitals.oxygenSaturation * (1 + change * 0.5))));
        vitals.timestamp = new Date();

        // Check for critical changes
        if (this.isVitalsCritical(vitals)) {
            this.createEmergencyAlert({
                type: 'critical-vitals',
                severity: 'critical',
                message: `Critical vital signs detected for ${emergency.patient.name}`,
                patientId: emergency.patientId,
                emergencyId: emergency.id,
                timestamp: new Date(),
                vitals: vitals
            });
        }
    }

    handleCriticalDeterioration(emergency) {
        this.createEmergencyAlert({
            type: 'critical-deterioration',
            severity: 'critical',
            message: `Patient ${emergency.patient.name} requires immediate intervention - critical window exceeded`,
            patientId: emergency.patientId,
            emergencyId: emergency.id,
            timestamp: new Date()
        });

        // Auto-escalate to highest priority
        emergency.triageLevel = 10;
        this.escalateInQueue(emergency);
    }

    createEmergencyAlert(alertData) {
        const alert = {
            id: `alert-${Date.now()}`,
            ...alertData,
            acknowledged: false,
            acknowledgedBy: null,
            acknowledgedAt: null
        };

        this.emergencyAlerts.unshift(alert);

        // Keep only last 50 alerts
        if (this.emergencyAlerts.length > 50) {
            this.emergencyAlerts = this.emergencyAlerts.slice(0, 50);
        }

        return alert;
    }

    acknowledgeAlert(alertId, acknowledgedBy) {
        const alert = this.emergencyAlerts.find(a => a.id === alertId);
        if (alert) {
            alert.acknowledged = true;
            alert.acknowledgedBy = acknowledgedBy;
            alert.acknowledgedAt = new Date();
            return true;
        }
        return false;
    }

    getEmergencyStatistics() {
        const stats = {
            activeEmergencies: this.emergencyPatients.size,
            criticalPatients: 0,
            stablePatients: 0,
            unacknowledgedAlerts: 0,
            averageStabilizationTime: 0,
            protocolDistribution: {}
        };

        let totalStabilizationTime = 0;
        let stabilizedCount = 0;

        this.emergencyPatients.forEach(emergency => {
            if (emergency.triageLevel >= 8) stats.criticalPatients++;
            if (emergency.stabilization.isStable) {
                stats.stablePatients++;
                if (emergency.stabilization.stabilizedAt) {
                    totalStabilizationTime += emergency.stabilization.stabilizedAt - emergency.arrivalTime;
                    stabilizedCount++;
                }
            }

            const protocolName = emergency.protocol?.name || 'General Emergency';
            stats.protocolDistribution[protocolName] = (stats.protocolDistribution[protocolName] || 0) + 1;
        });

        stats.unacknowledgedAlerts = this.emergencyAlerts.filter(a => !a.acknowledged).length;
        stats.averageStabilizationTime = stabilizedCount > 0 ?
            Math.round(totalStabilizationTime / stabilizedCount / (1000 * 60)) : 0; // minutes

        return stats;
    }

    // Utility methods
    getSeverityLevel(triageLevel) {
        if (triageLevel >= 9) return 'critical';
        if (triageLevel >= 7) return 'high';
        if (triageLevel >= 5) return 'medium';
        return 'low';
    }

    getMonitoringFrequency(patientData) {
        const severity = patientData.symptoms?.length || 1;
        if (severity >= 5) return 60; // Every minute for critical
        if (severity >= 3) return 300; // Every 5 minutes for urgent
        return 900; // Every 15 minutes for moderate
    }

    getStabilizationTarget(patientData) {
        const protocol = this.assignProtocol(patientData);
        return protocol?.timeLimit || 1800; // Default 30 minutes
    }

    getCriticalWindow(patientData) {
        const baseWindow = this.getStabilizationTarget(patientData);
        return new Date(Date.now() + baseWindow * 1000);
    }

    // Public API methods
    getAllEmergencyPatients() {
        return Array.from(this.emergencyPatients.values());
    }

    getEmergencyPatient(emergencyId) {
        return this.emergencyPatients.get(emergencyId);
    }

    getAllProtocols() {
        return Array.from(this.triageProtocols.values());
    }

    getActiveAlerts() {
        return this.emergencyAlerts.filter(a => !a.acknowledged);
    }

    getAllAlerts() {
        return [...this.emergencyAlerts];
    }

    removeEmergencyPatient(emergencyId) {
        return this.emergencyPatients.delete(emergencyId);
    }
}

export default new EmergencyService(); 