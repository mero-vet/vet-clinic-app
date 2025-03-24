import React, { createContext, useContext, useState } from 'react';

const MedicalRecordsContext = createContext();

export const useMedicalRecords = () => {
    const context = useContext(MedicalRecordsContext);
    if (!context) {
        throw new Error('useMedicalRecords must be used within a MedicalRecordsProvider');
    }
    return context;
};

export const MedicalRecordsProvider = ({ children }) => {
    const [visitHistory, setVisitHistory] = useState([]);
    const [vaccinations, setVaccinations] = useState([]);
    const [medications, setMedications] = useState([]);
    const [weightHistory, setWeightHistory] = useState([]);
    const [labResults, setLabResults] = useState([]);
    const [medicalAlerts, setMedicalAlerts] = useState([]);

    // Function to set mock data for testing/demo
    const setMockMedicalRecordsData = () => {
        // Mock visit history
        setVisitHistory([
            {
                id: 'V1001',
                date: '2024-03-18',
                reason: 'Annual Checkup',
                doctor: 'Dr. Patterson',
                diagnoses: ['Healthy', 'Mild tartar buildup'],
                notes: 'Patient is generally healthy. Recommended dental cleaning at next visit.',
                followupNeeded: true,
                followupDate: '2025-03-18',
            },
            {
                id: 'V1002',
                date: '2023-10-05',
                reason: 'Limping on right hind leg',
                doctor: 'Dr. Lee',
                diagnoses: ['Mild cruciate strain'],
                notes: 'Prescribed rest for 2 weeks, Rimadyl for pain/inflammation.',
                followupNeeded: true,
                followupDate: '2023-10-19',
            },
            {
                id: 'V1003',
                date: '2023-10-19',
                reason: 'Recheck for limping',
                doctor: 'Dr. Lee',
                diagnoses: ['Resolved cruciate strain'],
                notes: 'Limping has resolved. Patient is moving normally. Discontinue Rimadyl.',
                followupNeeded: false,
                followupDate: '',
            },
            {
                id: 'V1004',
                date: '2023-06-12',
                reason: 'Vaccines',
                doctor: 'Dr. Patterson',
                diagnoses: ['Healthy'],
                notes: 'Annual vaccines administered. Patient is in good health.',
                followupNeeded: false,
                followupDate: '',
            },
        ]);

        // Mock vaccination records
        setVaccinations([
            {
                id: 'VAX001',
                name: 'Rabies',
                date: '2023-06-12',
                expirationDate: '2026-06-12',
                lotNumber: 'R789456',
                administrator: 'Dr. Patterson',
                siteLocation: 'Right rear leg',
            },
            {
                id: 'VAX002',
                name: 'DHPP',
                date: '2023-06-12',
                expirationDate: '2024-06-12',
                lotNumber: 'D456789',
                administrator: 'Dr. Patterson',
                siteLocation: 'Left rear leg',
            },
            {
                id: 'VAX003',
                name: 'Bordetella',
                date: '2023-06-12',
                expirationDate: '2024-06-12',
                lotNumber: 'B123456',
                administrator: 'Dr. Patterson',
                siteLocation: 'Intranasal',
            },
            {
                id: 'VAX004',
                name: 'Lyme',
                date: '2022-06-15',
                expirationDate: '2023-06-15',
                lotNumber: 'L567890',
                administrator: 'Dr. Lee',
                siteLocation: 'Right rear leg',
            },
        ]);

        // Mock medication history
        setMedications([
            {
                id: 'MED001',
                name: 'Rimadyl 100mg',
                startDate: '2023-10-05',
                endDate: '2023-10-19',
                dosage: '1 tablet',
                frequency: 'Every 12 hours',
                prescribedBy: 'Dr. Lee',
                notes: 'Give with food to prevent stomach upset',
                active: false,
            },
            {
                id: 'MED002',
                name: 'Heartgard Plus',
                startDate: '2024-01-01',
                endDate: '2024-12-31',
                dosage: '1 chew',
                frequency: 'Monthly',
                prescribedBy: 'Dr. Patterson',
                notes: 'Monthly heartworm prevention',
                active: true,
            },
            {
                id: 'MED003',
                name: 'Nexgard',
                startDate: '2024-01-01',
                endDate: '2024-12-31',
                dosage: '1 chew',
                frequency: 'Monthly',
                prescribedBy: 'Dr. Patterson',
                notes: 'Monthly flea and tick prevention',
                active: true,
            },
        ]);

        // Mock weight history
        setWeightHistory([
            { date: '2024-03-18', weight: 69.5, unit: 'lbs', notes: '' },
            { date: '2023-10-19', weight: 71.2, unit: 'lbs', notes: 'Slight weight gain' },
            { date: '2023-10-05', weight: 70.8, unit: 'lbs', notes: '' },
            { date: '2023-06-12', weight: 68.5, unit: 'lbs', notes: 'Optimal weight' },
            { date: '2022-12-15', weight: 67.2, unit: 'lbs', notes: '' },
            { date: '2022-06-15', weight: 65.0, unit: 'lbs', notes: 'Growing appropriately' },
            { date: '2021-12-10', weight: 58.5, unit: 'lbs', notes: '' },
            { date: '2021-06-22', weight: 45.0, unit: 'lbs', notes: 'Young adult' },
        ]);

        // Mock lab results
        setLabResults([
            {
                id: 'LAB001',
                date: '2024-03-18',
                testName: 'Complete Blood Count',
                results: [
                    { parameter: 'RBC', value: '6.8', unit: 'M/μL', range: '5.5-8.5', flagged: false },
                    { parameter: 'WBC', value: '12.1', unit: 'K/μL', range: '6.0-17.0', flagged: false },
                    { parameter: 'HGB', value: '15.5', unit: 'g/dL', range: '12.0-18.0', flagged: false },
                    { parameter: 'HCT', value: '46', unit: '%', range: '37-55', flagged: false },
                    { parameter: 'Platelets', value: '320', unit: 'K/μL', range: '200-500', flagged: false },
                ],
                notes: 'All parameters within normal limits',
                orderedBy: 'Dr. Patterson',
            },
            {
                id: 'LAB002',
                date: '2024-03-18',
                testName: 'Chemistry Panel',
                results: [
                    { parameter: 'ALT', value: '62', unit: 'U/L', range: '10-100', flagged: false },
                    { parameter: 'AST', value: '35', unit: 'U/L', range: '0-50', flagged: false },
                    { parameter: 'ALP', value: '76', unit: 'U/L', range: '23-212', flagged: false },
                    { parameter: 'GGT', value: '2', unit: 'U/L', range: '0-7', flagged: false },
                    { parameter: 'BUN', value: '18', unit: 'mg/dL', range: '7-27', flagged: false },
                    { parameter: 'Creatinine', value: '1.2', unit: 'mg/dL', range: '0.5-1.8', flagged: false },
                    { parameter: 'Glucose', value: '95', unit: 'mg/dL', range: '70-143', flagged: false },
                ],
                notes: 'All parameters within normal limits',
                orderedBy: 'Dr. Patterson',
            },
            {
                id: 'LAB003',
                date: '2023-03-15',
                testName: 'Heartworm Test',
                results: [
                    { parameter: 'Heartworm Antigen', value: 'Negative', unit: '', range: 'Negative', flagged: false },
                ],
                notes: 'Annual heartworm test',
                orderedBy: 'Dr. Lee',
            },
        ]);

        // Mock medical alerts
        setMedicalAlerts([
            {
                id: 'ALT001',
                type: 'Medication Sensitivity',
                description: 'Bad response to rimadyl',
                dateAdded: '2023-10-19',
                addedBy: 'Dr. Lee',
                severity: 'Medium',
                active: true,
            },
            {
                id: 'ALT002',
                type: 'Behavior',
                description: 'Anxious during nail trims, muzzle recommended',
                dateAdded: '2022-09-08',
                addedBy: 'Dr. Patterson',
                severity: 'Low',
                active: true,
            },
        ]);
    };

    // CRUD operations for visits
    const addVisit = (visit) => {
        setVisitHistory([...visitHistory, visit]);
    };

    const updateVisit = (id, updatedVisit) => {
        setVisitHistory(
            visitHistory.map((visit) => (visit.id === id ? updatedVisit : visit))
        );
    };

    // CRUD operations for vaccinations
    const addVaccination = (vaccination) => {
        setVaccinations([...vaccinations, vaccination]);
    };

    const updateVaccination = (id, updatedVaccination) => {
        setVaccinations(
            vaccinations.map((vaccination) => (vaccination.id === id ? updatedVaccination : vaccination))
        );
    };

    // CRUD operations for medications
    const addMedication = (medication) => {
        setMedications([...medications, medication]);
    };

    const updateMedication = (id, updatedMedication) => {
        setMedications(
            medications.map((medication) => (medication.id === id ? updatedMedication : medication))
        );
    };

    // Add weight record
    const addWeightRecord = (weightRecord) => {
        setWeightHistory([...weightHistory, weightRecord]);
    };

    // CRUD operations for lab results
    const addLabResult = (labResult) => {
        setLabResults([...labResults, labResult]);
    };

    const updateLabResult = (id, updatedLabResult) => {
        setLabResults(
            labResults.map((labResult) => (labResult.id === id ? updatedLabResult : labResult))
        );
    };

    // CRUD operations for medical alerts
    const addMedicalAlert = (alert) => {
        setMedicalAlerts([...medicalAlerts, alert]);
    };

    const updateMedicalAlert = (id, updatedAlert) => {
        setMedicalAlerts(
            medicalAlerts.map((alert) => (alert.id === id ? updatedAlert : alert))
        );
    };

    const toggleAlertStatus = (id) => {
        setMedicalAlerts(
            medicalAlerts.map((alert) => {
                if (alert.id === id) {
                    return { ...alert, active: !alert.active };
                }
                return alert;
            })
        );
    };

    return (
        <MedicalRecordsContext.Provider
            value={{
                visitHistory,
                vaccinations,
                medications,
                weightHistory,
                labResults,
                medicalAlerts,
                setMockMedicalRecordsData,
                addVisit,
                updateVisit,
                addVaccination,
                updateVaccination,
                addMedication,
                updateMedication,
                addWeightRecord,
                addLabResult,
                updateLabResult,
                addMedicalAlert,
                updateMedicalAlert,
                toggleAlertStatus,
            }}
        >
            {children}
        </MedicalRecordsContext.Provider>
    );
}; 