import React, { createContext, useContext, useState } from 'react';

const PharmacyContext = createContext();

export const usePharmacy = () => {
    const context = useContext(PharmacyContext);
    if (!context) {
        throw new Error('usePharmacy must be used within a PharmacyProvider');
    }
    return context;
};

export const PharmacyProvider = ({ children }) => {
    const [prescriptions, setPrescriptions] = useState([]);
    const [medicationDatabase, setMedicationDatabase] = useState([]);
    const [dispensingLog, setDispensingLog] = useState([]);
    const [refillRequests, setRefillRequests] = useState([]);
    const [controlledSubstanceLog, setControlledSubstanceLog] = useState([]);

    // Function to set mock data for testing/demo
    const setMockPharmacyData = () => {
        // Mock medication database
        setMedicationDatabase([
            {
                id: 'MED001',
                name: 'Rimadyl (Carprofen)',
                strengths: ['25mg', '75mg', '100mg'],
                forms: ['Caplets', 'Chewable Tablets'],
                category: 'NSAID',
                species: ['Canine'],
                warnings: ['Not for use in cats', 'May cause liver damage'],
                contraindications: ['Renal disease', 'Dehydration', 'Bleeding disorders'],
                sideEffects: ['Vomiting', 'Diarrhea', 'Decreased appetite', 'Lethargy'],
                dispensingNotes: 'Give with food to reduce GI upset',
                isControlled: false,
                controlledClass: '',
                inStock: true,
            },
            {
                id: 'MED002',
                name: 'Apoquel (Oclacitinib)',
                strengths: ['3.6mg', '5.4mg', '16mg'],
                forms: ['Tablets'],
                category: 'Immunomodulator',
                species: ['Canine'],
                warnings: ['Not for use in dogs less than 12 months', 'Not for dogs with serious infections'],
                contraindications: ['Breeding dogs', 'Severe infections'],
                sideEffects: ['Vomiting', 'Diarrhea', 'Lethargy', 'Increased susceptibility to infection'],
                dispensingNotes: 'Can be given with or without food',
                isControlled: false,
                controlledClass: '',
                inStock: true,
            },
            {
                id: 'MED003',
                name: 'Ketamine',
                strengths: ['10mg/ml'],
                forms: ['Injectable Solution'],
                category: 'Anesthetic',
                species: ['Canine', 'Feline', 'Exotic'],
                warnings: ['DEA Schedule III controlled substance', 'For veterinary use only'],
                contraindications: ['Severe cardiac disease', 'Hypertension'],
                sideEffects: ['Increased heart rate', 'Respiratory depression', 'Muscle rigidity'],
                dispensingNotes: 'Requires controlled substance log, DEA number required',
                isControlled: true,
                controlledClass: 'Schedule III',
                inStock: true,
            },
            {
                id: 'MED004',
                name: 'Amoxicillin',
                strengths: ['50mg', '100mg', '250mg', '500mg'],
                forms: ['Tablets', 'Capsules', 'Oral Suspension'],
                category: 'Antibiotic',
                species: ['Canine', 'Feline'],
                warnings: ['May cause allergic reactions'],
                contraindications: ['Known penicillin allergy'],
                sideEffects: ['Vomiting', 'Diarrhea', 'Rash'],
                dispensingNotes: 'Complete full course of treatment',
                isControlled: false,
                controlledClass: '',
                inStock: true,
            },
            {
                id: 'MED005',
                name: 'Prednisolone',
                strengths: ['5mg', '10mg', '20mg'],
                forms: ['Tablets', 'Oral Solution'],
                category: 'Corticosteroid',
                species: ['Canine', 'Feline'],
                warnings: ['Long-term use may cause Cushing\'s syndrome'],
                contraindications: ['Systemic fungal infections', 'Tuberculosis'],
                sideEffects: ['Increased thirst', 'Increased urination', 'Increased appetite', 'Weight gain'],
                dispensingNotes: 'Taper dose when discontinuing long-term use',
                isControlled: false,
                controlledClass: '',
                inStock: true,
            },
        ]);

        // Mock prescriptions
        setPrescriptions([
            {
                id: 'RX001',
                patientId: 'P2001',
                patientName: 'Wilson',
                clientId: 'C1001',
                clientName: 'Remy Olson',
                medicationId: 'MED001',
                medicationName: 'Rimadyl (Carprofen)',
                strength: '100mg',
                form: 'Caplets',
                quantity: 30,
                dosage: '1 tablet',
                frequency: 'Every 12 hours',
                directions: 'Give with food',
                refills: 2,
                refillsRemaining: 2,
                issueDate: '2023-10-05',
                expiryDate: '2024-04-05',
                prescribedBy: 'Dr. Lee',
                status: 'Completed',
                notes: 'For pain/inflammation due to cruciate ligament strain',
            },
            {
                id: 'RX002',
                patientId: 'P2001',
                patientName: 'Wilson',
                clientId: 'C1001',
                clientName: 'Remy Olson',
                medicationId: 'MED002',
                medicationName: 'Apoquel (Oclacitinib)',
                strength: '16mg',
                form: 'Tablets',
                quantity: 60,
                dosage: '1 tablet',
                frequency: 'Every 24 hours',
                directions: 'Can be given with or without food',
                refills: 5,
                refillsRemaining: 3,
                issueDate: '2024-01-10',
                expiryDate: '2025-01-10',
                prescribedBy: 'Dr. Patterson',
                status: 'Active',
                notes: 'For allergic dermatitis',
            },
        ]);

        // Mock dispensing log
        setDispensingLog([
            {
                id: 'DISP001',
                prescriptionId: 'RX001',
                patientId: 'P2001',
                patientName: 'Wilson',
                clientId: 'C1001',
                clientName: 'Remy Olson',
                medicationId: 'MED001',
                medicationName: 'Rimadyl (Carprofen)',
                strength: '100mg',
                quantity: 30,
                dispensedBy: 'Jane Doe',
                dispensingDate: '2023-10-05',
                notes: 'Initial fill',
            },
            {
                id: 'DISP002',
                prescriptionId: 'RX002',
                patientId: 'P2001',
                patientName: 'Wilson',
                clientId: 'C1001',
                clientName: 'Remy Olson',
                medicationId: 'MED002',
                medicationName: 'Apoquel (Oclacitinib)',
                strength: '16mg',
                quantity: 30,
                dispensedBy: 'Jane Doe',
                dispensingDate: '2024-01-10',
                notes: 'Initial fill',
            },
            {
                id: 'DISP003',
                prescriptionId: 'RX002',
                patientId: 'P2001',
                patientName: 'Wilson',
                clientId: 'C1001',
                clientName: 'Remy Olson',
                medicationId: 'MED002',
                medicationName: 'Apoquel (Oclacitinib)',
                strength: '16mg',
                quantity: 30,
                dispensedBy: 'Mark Wilson',
                dispensingDate: '2024-02-10',
                notes: 'Refill #1',
            },
        ]);

        // Mock refill requests
        setRefillRequests([
            {
                id: 'REF001',
                prescriptionId: 'RX002',
                patientId: 'P2001',
                patientName: 'Wilson',
                clientId: 'C1001',
                clientName: 'Remy Olson',
                medicationName: 'Apoquel (Oclacitinib)',
                requestDate: '2024-03-20',
                status: 'Pending',
                requestNotes: 'Running low, would like to pick up this weekend',
                requestMethod: 'Phone',
            },
        ]);

        // Mock controlled substance log
        setControlledSubstanceLog([
            {
                id: 'CSL001',
                medicationId: 'MED003',
                medicationName: 'Ketamine',
                strength: '10mg/ml',
                action: 'Received',
                quantity: 1,
                unit: 'vial',
                totalAmount: '10ml',
                date: '2024-01-05',
                staffName: 'Dr. Patterson',
                patientId: null,
                patientName: null,
                notes: 'Received from supplier',
            },
            {
                id: 'CSL002',
                medicationId: 'MED003',
                medicationName: 'Ketamine',
                strength: '10mg/ml',
                action: 'Administered',
                quantity: 0.5,
                unit: 'ml',
                totalAmount: '5mg',
                date: '2024-02-15',
                staffName: 'Dr. Lee',
                patientId: 'P2005',
                patientName: 'Max',
                notes: 'Used for sedation during wound treatment',
            },
        ]);
    };

    // CRUD operations for prescriptions
    const addPrescription = (prescription) => {
        setPrescriptions([...prescriptions, prescription]);
    };

    const updatePrescription = (id, updatedPrescription) => {
        setPrescriptions(
            prescriptions.map((prescription) => (prescription.id === id ? updatedPrescription : prescription))
        );
    };

    // Add dispensing record
    const addDispensingRecord = (dispensingRecord) => {
        setDispensingLog([...dispensingLog, dispensingRecord]);

        // Update prescription refill count if this is a refill
        if (dispensingRecord.prescriptionId) {
            const prescription = prescriptions.find(rx => rx.id === dispensingRecord.prescriptionId);
            if (prescription && prescription.refillsRemaining > 0) {
                updatePrescription(prescription.id, {
                    ...prescription,
                    refillsRemaining: prescription.refillsRemaining - 1,
                    status: prescription.refillsRemaining === 1 ? 'Completed' : 'Active'
                });
            }
        }
    };

    // CRUD operations for refill requests
    const addRefillRequest = (request) => {
        setRefillRequests([...refillRequests, request]);
    };

    const updateRefillRequest = (id, updatedRequest) => {
        setRefillRequests(
            refillRequests.map((request) => (request.id === id ? updatedRequest : request))
        );
    };

    const approveRefillRequest = (id) => {
        const request = refillRequests.find(req => req.id === id);
        if (request) {
            // Update request status
            updateRefillRequest(id, { ...request, status: 'Approved' });

            // Get the associated prescription
            const prescription = prescriptions.find(rx => rx.id === request.prescriptionId);
            if (prescription && prescription.refillsRemaining > 0) {
                // Create a new dispensing record
                addDispensingRecord({
                    id: `DISP${dispensingLog.length + 1}`.padStart(7, '0'),
                    prescriptionId: prescription.id,
                    patientId: prescription.patientId,
                    patientName: prescription.patientName,
                    clientId: prescription.clientId,
                    clientName: prescription.clientName,
                    medicationId: prescription.medicationId,
                    medicationName: prescription.medicationName,
                    strength: prescription.strength,
                    quantity: prescription.quantity,
                    dispensedBy: 'System', // This would be updated with actual staff later
                    dispensingDate: new Date().toISOString().split('T')[0],
                    notes: `Refill #${prescription.refills - prescription.refillsRemaining + 1}`,
                });
            }
        }
    };

    // Controlled substance log operations
    const addControlledSubstanceRecord = (record) => {
        setControlledSubstanceLog([...controlledSubstanceLog, record]);
    };

    // Calculate dosage based on patient weight
    const calculateDosage = (medicationId, weight, unit = 'kg', dosagePerKg) => {
        const medication = medicationDatabase.find(med => med.id === medicationId);
        if (!medication) return null;

        // Convert pounds to kg if needed
        const weightInKg = unit === 'lbs' ? weight * 0.453592 : weight;

        return {
            medication,
            totalDosage: weightInKg * dosagePerKg,
            weightInKg,
        };
    };

    return (
        <PharmacyContext.Provider
            value={{
                prescriptions,
                medicationDatabase,
                dispensingLog,
                refillRequests,
                controlledSubstanceLog,
                setMockPharmacyData,
                addPrescription,
                updatePrescription,
                addDispensingRecord,
                addRefillRequest,
                updateRefillRequest,
                approveRefillRequest,
                addControlledSubstanceRecord,
                calculateDosage,
            }}
        >
            {children}
        </PharmacyContext.Provider>
    );
}; 