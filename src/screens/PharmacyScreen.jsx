import React, { useEffect, useState } from 'react';
import { usePharmacy } from '../context/PharmacyContext';
import { usePatient } from '../context/PatientContext';
import '../styles/WindowsClassic.css';

const PharmacyScreen = () => {
    const { patientData } = usePatient();
    const {
        prescriptions,
        medicationDatabase,
        dispensingLog,
        refillRequests,
        controlledSubstanceLog,
        setMockPharmacyData,
        addPrescription,
        updatePrescription,
        addDispensingRecord,
        approveRefillRequest,
        calculateDosage
    } = usePharmacy();

    const [activeTab, setActiveTab] = useState('prescriptions');
    const [selectedPrescription, setSelectedPrescription] = useState(null);
    const [selectedMedication, setSelectedMedication] = useState(null);
    const [selectedRefill, setSelectedRefill] = useState(null);
    const [prescriptionForm, setPrescriptionForm] = useState({
        medicationId: '',
        strength: '',
        form: '',
        quantity: '',
        dosage: '',
        frequency: '',
        directions: '',
        refills: '0',
        notes: ''
    });
    const [showDrugInteractions, setShowDrugInteractions] = useState(false);

    useEffect(() => {
        // Load mock data for this demo
        setMockPharmacyData();
    }, []);

    // Get patient prescriptions
    const patientPrescriptions = prescriptions
        .filter(rx => rx.patientId === patientData.patientId)
        .sort((a, b) => new Date(b.issueDate) - new Date(a.issueDate));

    // Get patient refill requests
    const patientRefillRequests = refillRequests
        .filter(req => req.patientId === patientData.patientId);

    // Handle medication selection
    const handleMedicationSelect = (medicationId) => {
        const medication = medicationDatabase.find(med => med.id === medicationId);
        setSelectedMedication(medication);

        if (medication) {
            setPrescriptionForm({
                ...prescriptionForm,
                medicationId: medication.id,
                strength: medication.strengths[0],
                form: medication.forms[0],
            });
        }
    };

    // Handle prescription form inputs
    const handlePrescriptionFormChange = (e) => {
        const { name, value } = e.target;
        setPrescriptionForm({
            ...prescriptionForm,
            [name]: value
        });
    };

    // Create a new prescription
    const handleCreatePrescription = () => {
        if (!prescriptionForm.medicationId || !prescriptionForm.dosage || !prescriptionForm.frequency) {
            alert('Please fill out all required fields');
            return;
        }

        const medication = medicationDatabase.find(med => med.id === prescriptionForm.medicationId);

        const newPrescription = {
            id: `RX${prescriptions.length + 1}`.padStart(5, '0'),
            patientId: patientData.patientId,
            patientName: patientData.patientName,
            clientId: patientData.clientId,
            clientName: `${patientData.clientFirstName} ${patientData.clientLastName}`,
            medicationId: prescriptionForm.medicationId,
            medicationName: medication.name,
            strength: prescriptionForm.strength,
            form: prescriptionForm.form,
            quantity: parseInt(prescriptionForm.quantity),
            dosage: prescriptionForm.dosage,
            frequency: prescriptionForm.frequency,
            directions: prescriptionForm.directions,
            refills: parseInt(prescriptionForm.refills),
            refillsRemaining: parseInt(prescriptionForm.refills),
            issueDate: new Date().toISOString().split('T')[0],
            expiryDate: new Date(new Date().setFullYear(new Date().getFullYear() + 1)).toISOString().split('T')[0],
            prescribedBy: 'Current User',
            status: 'Active',
            notes: prescriptionForm.notes,
        };

        addPrescription(newPrescription);

        // Reset form
        setPrescriptionForm({
            medicationId: '',
            strength: '',
            form: '',
            quantity: '',
            dosage: '',
            frequency: '',
            directions: '',
            refills: '0',
            notes: ''
        });
        setSelectedMedication(null);

        // Display the new prescription
        setSelectedPrescription(newPrescription);
    };

    // Handle dispensing a prescription
    const handleDispensePrescription = (prescription) => {
        if (!prescription) return;

        // Create dispensing record
        const dispensingRecord = {
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
            dispensedBy: 'Current User',
            dispensingDate: new Date().toISOString().split('T')[0],
            notes: 'Dispensed at clinic',
        };

        addDispensingRecord(dispensingRecord);

        // Update UI
        setSelectedPrescription(null);
        setTimeout(() => {
            // Find the updated prescription
            const updatedPrescription = prescriptions.find(rx => rx.id === prescription.id);
            if (updatedPrescription) {
                setSelectedPrescription(updatedPrescription);
            }
        }, 100);
    };

    // Handle approving a refill request
    const handleApproveRefill = (request) => {
        if (!request) return;
        approveRefillRequest(request.id);

        // Update UI
        setSelectedRefill(null);
    };

    // Calculate dosage
    const calculateMedicationDosage = (medicationId, weight, unit, dosagePerKg) => {
        const result = calculateDosage(medicationId, weight, unit, dosagePerKg);
        return result;
    };

    // Render prescription management tab
    const renderPrescriptionsTab = () => (
        <div style={{ display: 'flex', height: '100%', overflow: 'hidden' }}>
            {/* Prescription list */}
            <div style={{ flex: '1', overflowY: 'auto', marginRight: '16px' }}>
                <h3>Current Prescriptions</h3>

                {patientPrescriptions.length === 0 ? (
                    <p>No active prescriptions for this patient.</p>
                ) : (
                    <table className="windows-table" style={{ width: '100%' }}>
                        <thead>
                            <tr>
                                <th>Medication</th>
                                <th>Strength</th>
                                <th>Dosage</th>
                                <th>Issue Date</th>
                                <th>Status</th>
                                <th>Refills</th>
                            </tr>
                        </thead>
                        <tbody>
                            {patientPrescriptions.map((prescription) => (
                                <tr
                                    key={prescription.id}
                                    onClick={() => setSelectedPrescription(prescription)}
                                    style={{
                                        cursor: 'pointer',
                                        backgroundColor: prescription === selectedPrescription ? '#000080' :
                                            'transparent',
                                        color: prescription === selectedPrescription ? 'white' : 'black'
                                    }}
                                >
                                    <td>{prescription.medicationName}</td>
                                    <td>{prescription.strength}</td>
                                    <td>{prescription.dosage}</td>
                                    <td>{prescription.issueDate}</td>
                                    <td>{prescription.status}</td>
                                    <td>{prescription.refillsRemaining}/{prescription.refills}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}

                <div style={{ marginTop: '16px' }}>
                    <button
                        className="windows-button"
                        onClick={() => {
                            setSelectedPrescription(null);
                            setActiveTab('new-prescription');
                        }}
                    >
                        New Prescription
                    </button>
                </div>
            </div>

            {/* Prescription details */}
            {selectedPrescription && (
                <div style={{ flex: '1', overflowY: 'auto', border: '1px solid black', padding: '16px', backgroundColor: 'white' }}>
                    <h3>Prescription Details</h3>

                    <div className="form-row">
                        <strong>Patient:</strong> {selectedPrescription.patientName} ({selectedPrescription.patientId})
                    </div>
                    <div className="form-row">
                        <strong>Medication:</strong> {selectedPrescription.medicationName}
                    </div>
                    <div className="form-row">
                        <strong>Strength/Form:</strong> {selectedPrescription.strength} {selectedPrescription.form}
                    </div>
                    <div className="form-row">
                        <strong>Quantity:</strong> {selectedPrescription.quantity}
                    </div>
                    <div className="form-row">
                        <strong>Dosage:</strong> {selectedPrescription.dosage}
                    </div>
                    <div className="form-row">
                        <strong>Frequency:</strong> {selectedPrescription.frequency}
                    </div>
                    <div className="form-row">
                        <strong>Directions:</strong> {selectedPrescription.directions}
                    </div>
                    <div className="form-row">
                        <strong>Refills:</strong> {selectedPrescription.refillsRemaining}/{selectedPrescription.refills}
                    </div>
                    <div className="form-row">
                        <strong>Issue Date:</strong> {selectedPrescription.issueDate}
                    </div>
                    <div className="form-row">
                        <strong>Expiry Date:</strong> {selectedPrescription.expiryDate}
                    </div>
                    <div className="form-row">
                        <strong>Prescribed By:</strong> {selectedPrescription.prescribedBy}
                    </div>
                    <div className="form-row">
                        <strong>Status:</strong> {selectedPrescription.status}
                    </div>
                    <div className="form-row">
                        <strong>Notes:</strong> {selectedPrescription.notes}
                    </div>

                    <div style={{ marginTop: '16px' }}>
                        {selectedPrescription.status === 'Active' && (
                            <button
                                className="windows-button"
                                onClick={() => handleDispensePrescription(selectedPrescription)}
                                disabled={selectedPrescription.refillsRemaining < 1}
                            >
                                Dispense
                            </button>
                        )}
                        <button
                            className="windows-button"
                            style={{ marginLeft: '8px' }}
                            onClick={() => {
                                // Print functionality would go here
                            }}
                        >
                            Print
                        </button>
                        <button
                            className="windows-button"
                            style={{ marginLeft: '8px' }}
                            onClick={() => {
                                // Edit functionality would go here
                            }}
                        >
                            Edit
                        </button>
                    </div>
                </div>
            )}
        </div>
    );

    // Render new prescription tab
    const renderNewPrescriptionTab = () => {
        const [dosageCalcWeight, setDosageCalcWeight] = useState(patientData.weight);
        const [dosageCalcUnit, setDosageCalcUnit] = useState('lbs');
        const [dosagePerKg, setDosagePerKg] = useState('');

        return (
            <div style={{ height: '100%', overflowY: 'auto' }}>
                <h3>New Prescription</h3>

                <div style={{ display: 'flex', gap: '16px' }}>
                    {/* Main prescription form */}
                    <div style={{ flex: '2' }}>
                        <div className="form-row">
                            <label>Medication:</label>
                            <select
                                name="medicationId"
                                value={prescriptionForm.medicationId}
                                onChange={(e) => handleMedicationSelect(e.target.value)}
                            >
                                <option value="">Select a medication</option>
                                {medicationDatabase.map((med) => (
                                    <option key={med.id} value={med.id}>{med.name}</option>
                                ))}
                            </select>
                        </div>

                        {selectedMedication && (
                            <>
                                <div className="form-row">
                                    <label>Strength:</label>
                                    <select
                                        name="strength"
                                        value={prescriptionForm.strength}
                                        onChange={handlePrescriptionFormChange}
                                    >
                                        {selectedMedication.strengths.map((str) => (
                                            <option key={str} value={str}>{str}</option>
                                        ))}
                                    </select>
                                </div>

                                <div className="form-row">
                                    <label>Form:</label>
                                    <select
                                        name="form"
                                        value={prescriptionForm.form}
                                        onChange={handlePrescriptionFormChange}
                                    >
                                        {selectedMedication.forms.map((form) => (
                                            <option key={form} value={form}>{form}</option>
                                        ))}
                                    </select>
                                </div>

                                <div className="form-row">
                                    <label>Quantity:</label>
                                    <input
                                        type="number"
                                        name="quantity"
                                        value={prescriptionForm.quantity}
                                        onChange={handlePrescriptionFormChange}
                                        style={{ width: '80px' }}
                                    />
                                </div>

                                <div className="form-row">
                                    <label>Dosage:</label>
                                    <input
                                        type="text"
                                        name="dosage"
                                        value={prescriptionForm.dosage}
                                        onChange={handlePrescriptionFormChange}
                                        placeholder="e.g., 1 tablet"
                                    />
                                </div>

                                <div className="form-row">
                                    <label>Frequency:</label>
                                    <input
                                        type="text"
                                        name="frequency"
                                        value={prescriptionForm.frequency}
                                        onChange={handlePrescriptionFormChange}
                                        placeholder="e.g., Every 12 hours"
                                    />
                                </div>

                                <div className="form-row">
                                    <label>Directions:</label>
                                    <input
                                        type="text"
                                        name="directions"
                                        value={prescriptionForm.directions}
                                        onChange={handlePrescriptionFormChange}
                                        placeholder="e.g., Give with food"
                                    />
                                </div>

                                <div className="form-row">
                                    <label>Refills:</label>
                                    <input
                                        type="number"
                                        name="refills"
                                        value={prescriptionForm.refills}
                                        onChange={handlePrescriptionFormChange}
                                        style={{ width: '80px' }}
                                        min="0"
                                        max="12"
                                    />
                                </div>

                                <div className="form-row">
                                    <label>Notes:</label>
                                    <textarea
                                        name="notes"
                                        value={prescriptionForm.notes}
                                        onChange={handlePrescriptionFormChange}
                                        style={{ width: '100%', height: '80px' }}
                                    />
                                </div>

                                <div style={{ marginTop: '16px', display: 'flex', gap: '8px' }}>
                                    <button
                                        className="windows-button"
                                        onClick={handleCreatePrescription}
                                        disabled={!prescriptionForm.medicationId || !prescriptionForm.dosage || !prescriptionForm.frequency}
                                    >
                                        Create Prescription
                                    </button>
                                    <button
                                        className="windows-button"
                                        onClick={() => {
                                            setSelectedMedication(null);
                                            setPrescriptionForm({
                                                medicationId: '',
                                                strength: '',
                                                form: '',
                                                quantity: '',
                                                dosage: '',
                                                frequency: '',
                                                directions: '',
                                                refills: '0',
                                                notes: ''
                                            });
                                        }}
                                    >
                                        Clear Form
                                    </button>
                                    <button
                                        className="windows-button"
                                        onClick={() => setShowDrugInteractions(!showDrugInteractions)}
                                    >
                                        Check Interactions
                                    </button>
                                </div>
                            </>
                        )}
                    </div>

                    {/* Medication details and warnings */}
                    {selectedMedication && (
                        <div style={{ flex: '1', border: '1px solid #ccc', padding: '16px', backgroundColor: '#f9f9f9' }}>
                            <h4>Medication Information</h4>

                            <div className="form-row">
                                <strong>Category:</strong> {selectedMedication.category}
                            </div>
                            <div className="form-row">
                                <strong>Species:</strong> {selectedMedication.species.join(', ')}
                            </div>
                            <div className="form-row">
                                <strong>Controlled:</strong> {selectedMedication.isControlled ? `Yes (${selectedMedication.controlledClass})` : 'No'}
                            </div>

                            <h4>Warnings</h4>
                            <ul>
                                {selectedMedication.warnings.map((warning, index) => (
                                    <li key={index} style={{ color: 'red' }}>{warning}</li>
                                ))}
                            </ul>

                            <h4>Contraindications</h4>
                            <ul>
                                {selectedMedication.contraindications.map((contra, index) => (
                                    <li key={index}>{contra}</li>
                                ))}
                            </ul>

                            <h4>Side Effects</h4>
                            <ul>
                                {selectedMedication.sideEffects.map((effect, index) => (
                                    <li key={index}>{effect}</li>
                                ))}
                            </ul>

                            <div className="form-row">
                                <strong>Dispensing Notes:</strong> {selectedMedication.dispensingNotes}
                            </div>
                        </div>
                    )}
                </div>

                {/* Drug interactions */}
                {showDrugInteractions && selectedMedication && (
                    <div style={{ marginTop: '24px', border: '1px solid #ccc', padding: '16px', backgroundColor: '#fff4f4' }}>
                        <h4>Potential Drug Interactions</h4>
                        {patientPrescriptions.length > 0 ? (
                            <div>
                                <p>The following current medications may interact with {selectedMedication.name}:</p>
                                <ul>
                                    {selectedMedication.name === 'Rimadyl (Carprofen)' ? (
                                        <li>
                                            <strong>NSAIDs/Steroids:</strong> Concurrent use of NSAIDs and corticosteroids may increase the risk of gastrointestinal ulceration.
                                        </li>
                                    ) : (
                                        <li>No significant interactions detected with current medications.</li>
                                    )}
                                </ul>
                            </div>
                        ) : (
                            <p>No current medications to check for interactions.</p>
                        )}
                        <button
                            className="windows-button"
                            onClick={() => setShowDrugInteractions(false)}
                            style={{ marginTop: '8px' }}
                        >
                            Close
                        </button>
                    </div>
                )}
            </div>
        );
    };

    // Render refill requests tab
    const renderRefillsTab = () => {
        const pendingRefills = patientRefillRequests.filter(req => req.status === 'Pending');
        const otherRefills = patientRefillRequests.filter(req => req.status !== 'Pending');

        return (
            <div style={{ height: '100%', overflowY: 'auto' }}>
                <h3>Refill Requests</h3>

                {pendingRefills.length === 0 && otherRefills.length === 0 ? (
                    <p>No refill requests for this patient.</p>
                ) : (
                    <>
                        {pendingRefills.length > 0 && (
                            <>
                                <h4>Pending Requests</h4>
                                <table className="windows-table" style={{ width: '100%', marginBottom: '24px' }}>
                                    <thead>
                                        <tr>
                                            <th>Request Date</th>
                                            <th>Medication</th>
                                            <th>Method</th>
                                            <th>Notes</th>
                                            <th>Status</th>
                                            <th>Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {pendingRefills.map((request) => (
                                            <tr
                                                key={request.id}
                                                onClick={() => setSelectedRefill(request)}
                                                style={{
                                                    cursor: 'pointer',
                                                    backgroundColor: request === selectedRefill ? '#000080' : '#fff9c4',
                                                    color: request === selectedRefill ? 'white' : 'black'
                                                }}
                                            >
                                                <td>{request.requestDate}</td>
                                                <td>{request.medicationName}</td>
                                                <td>{request.requestMethod}</td>
                                                <td>{request.requestNotes}</td>
                                                <td>{request.status}</td>
                                                <td>
                                                    <button
                                                        className="windows-button"
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            handleApproveRefill(request);
                                                        }}
                                                    >
                                                        Approve
                                                    </button>
                                                    <button
                                                        className="windows-button"
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            // Decline functionality would go here
                                                        }}
                                                        style={{ marginLeft: '4px' }}
                                                    >
                                                        Decline
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </>
                        )}

                        {otherRefills.length > 0 && (
                            <>
                                <h4>Previous Requests</h4>
                                <table className="windows-table" style={{ width: '100%' }}>
                                    <thead>
                                        <tr>
                                            <th>Request Date</th>
                                            <th>Medication</th>
                                            <th>Method</th>
                                            <th>Notes</th>
                                            <th>Status</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {otherRefills.map((request) => (
                                            <tr key={request.id}>
                                                <td>{request.requestDate}</td>
                                                <td>{request.medicationName}</td>
                                                <td>{request.requestMethod}</td>
                                                <td>{request.requestNotes}</td>
                                                <td>{request.status}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </>
                        )}
                    </>
                )}
            </div>
        );
    };

    // Render dispensing history tab
    const renderDispenseHistoryTab = () => {
        // Filter dispensing records for this patient
        const patientDispensing = dispensingLog
            .filter(record => record.patientId === patientData.patientId)
            .sort((a, b) => new Date(b.dispensingDate) - new Date(a.dispensingDate));

        return (
            <div style={{ height: '100%', overflowY: 'auto' }}>
                <h3>Dispensing History</h3>

                {patientDispensing.length === 0 ? (
                    <p>No dispensing history for this patient.</p>
                ) : (
                    <table className="windows-table" style={{ width: '100%' }}>
                        <thead>
                            <tr>
                                <th>Date</th>
                                <th>Medication</th>
                                <th>Strength</th>
                                <th>Quantity</th>
                                <th>Rx Number</th>
                                <th>Dispensed By</th>
                                <th>Notes</th>
                            </tr>
                        </thead>
                        <tbody>
                            {patientDispensing.map((record) => (
                                <tr key={record.id}>
                                    <td>{record.dispensingDate}</td>
                                    <td>{record.medicationName}</td>
                                    <td>{record.strength}</td>
                                    <td>{record.quantity}</td>
                                    <td>{record.prescriptionId}</td>
                                    <td>{record.dispensedBy}</td>
                                    <td>{record.notes}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}

                <div style={{ marginTop: '16px' }}>
                    <button className="windows-button">Print History</button>
                </div>
            </div>
        );
    };

    // Render dosage calculator tab
    const renderCalculatorTab = () => {
        const [calcWeight, setCalcWeight] = useState(patientData.weight);
        const [calcUnit, setCalcUnit] = useState('lbs');
        const [selectedCalcMed, setSelectedCalcMed] = useState('');
        const [dosagePerKg, setDosagePerKg] = useState('');
        const [calculationResult, setCalculationResult] = useState(null);

        const handleCalculate = () => {
            if (!selectedCalcMed || !dosagePerKg || !calcWeight) {
                alert('Please fill out all required fields');
                return;
            }

            const result = calculateMedicationDosage(selectedCalcMed, parseFloat(calcWeight), calcUnit, parseFloat(dosagePerKg));
            setCalculationResult(result);
        };

        return (
            <div style={{ height: '100%', overflowY: 'auto' }}>
                <h3>Dosage Calculator</h3>

                <div style={{ display: 'flex', gap: '32px' }}>
                    <div style={{ flex: '1' }}>
                        <div className="fieldset" style={{ padding: '16px', marginBottom: '24px' }}>
                            <div className="form-row">
                                <label>Patient Weight:</label>
                                <input
                                    type="number"
                                    value={calcWeight}
                                    onChange={(e) => setCalcWeight(e.target.value)}
                                    style={{ width: '80px' }}
                                />
                                <select
                                    value={calcUnit}
                                    onChange={(e) => setCalcUnit(e.target.value)}
                                >
                                    <option value="lbs">lbs</option>
                                    <option value="kg">kg</option>
                                </select>
                            </div>

                            <div className="form-row">
                                <label>Medication:</label>
                                <select
                                    value={selectedCalcMed}
                                    onChange={(e) => setSelectedCalcMed(e.target.value)}
                                    style={{ width: '250px' }}
                                >
                                    <option value="">Select a medication</option>
                                    {medicationDatabase.map((med) => (
                                        <option key={med.id} value={med.id}>{med.name}</option>
                                    ))}
                                </select>
                            </div>

                            <div className="form-row">
                                <label>Dosage per kg:</label>
                                <input
                                    type="number"
                                    value={dosagePerKg}
                                    onChange={(e) => setDosagePerKg(e.target.value)}
                                    step="0.01"
                                    style={{ width: '80px' }}
                                />
                                <span>mg/kg</span>
                            </div>

                            <div style={{ marginTop: '16px' }}>
                                <button
                                    className="windows-button"
                                    onClick={handleCalculate}
                                    disabled={!selectedCalcMed || !dosagePerKg || !calcWeight}
                                >
                                    Calculate
                                </button>
                            </div>
                        </div>

                        {calculationResult && (
                            <div className="fieldset" style={{ padding: '16px' }}>
                                <h4>Calculation Result</h4>
                                <div className="form-row">
                                    <strong>Medication:</strong> {calculationResult.medication.name}
                                </div>
                                <div className="form-row">
                                    <strong>Patient Weight:</strong> {calculationResult.weightInKg.toFixed(2)} kg
                                </div>
                                <div className="form-row">
                                    <strong>Dosage Per kg:</strong> {dosagePerKg} mg/kg
                                </div>
                                <div className="form-row">
                                    <strong>Total Dosage Needed:</strong> {calculationResult.totalDosage.toFixed(2)} mg
                                </div>

                                <div style={{ marginTop: '16px' }}>
                                    <button
                                        className="windows-button"
                                        onClick={() => {
                                            const medication = medicationDatabase.find(med => med.id === selectedCalcMed);

                                            if (medication) {
                                                setSelectedMedication(medication);
                                                setPrescriptionForm({
                                                    medicationId: medication.id,
                                                    strength: medication.strengths[0],
                                                    form: medication.forms[0],
                                                    quantity: '',
                                                    dosage: `${calculationResult.totalDosage.toFixed(2)} mg`,
                                                    frequency: '',
                                                    directions: '',
                                                    refills: '0',
                                                    notes: `Calculated based on ${calcWeight} ${calcUnit} weight and ${dosagePerKg} mg/kg dosage.`
                                                });
                                                setActiveTab('new-prescription');
                                            }
                                        }}
                                    >
                                        Use in Prescription
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>

                    <div style={{ flex: '1' }}>
                        <div className="fieldset" style={{ padding: '16px' }}>
                            <h4>Common Dosages</h4>
                            <table className="windows-table" style={{ width: '100%' }}>
                                <thead>
                                    <tr>
                                        <th>Medication</th>
                                        <th>Species</th>
                                        <th>Typical Dosage</th>
                                        <th>Use</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td>Rimadyl (Carprofen)</td>
                                        <td>Canine</td>
                                        <td>2-4 mg/kg</td>
                                        <td>Pain/Inflammation</td>
                                    </tr>
                                    <tr>
                                        <td>Amoxicillin</td>
                                        <td>Canine/Feline</td>
                                        <td>10-20 mg/kg</td>
                                        <td>Bacterial Infection</td>
                                    </tr>
                                    <tr>
                                        <td>Prednisolone</td>
                                        <td>Canine/Feline</td>
                                        <td>0.5-1 mg/kg</td>
                                        <td>Anti-inflammatory</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    return (
        <div className="windows-classic">
            <div className="window" style={{ margin: '0', height: '100%' }}>
                <div className="title-bar">
                    <div className="title-bar-text">Pharmacy & Prescriptions</div>
                    <div className="title-bar-controls">
                        <button aria-label="Minimize"></button>
                        <button aria-label="Maximize"></button>
                        <button aria-label="Close"></button>
                    </div>
                </div>

                <div className="window-body" style={{ padding: '16px', display: 'flex', flexDirection: 'column', height: 'calc(100% - 32px)' }}>
                    {/* Patient info header */}
                    <div className="fieldset" style={{ marginBottom: '16px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <div>
                                <div className="form-row">
                                    <strong>Patient:</strong> {patientData.patientName} ({patientData.patientId})
                                </div>
                                <div className="form-row">
                                    <strong>Species:</strong> {patientData.species}
                                </div>
                            </div>
                            <div>
                                <div className="form-row">
                                    <strong>Age:</strong> {patientData.ageYears}y {patientData.ageMonths}m {patientData.ageDays}d
                                </div>
                                <div className="form-row">
                                    <strong>Weight:</strong> {patientData.weight} lbs ({(patientData.weight * 0.453592).toFixed(2)} kg)
                                </div>
                            </div>
                            <div>
                                <div className="form-row">
                                    <strong>Client:</strong> {patientData.clientFirstName} {patientData.clientLastName}
                                </div>
                                <div className="form-row">
                                    <strong>Client ID:</strong> {patientData.clientId}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Tab buttons */}
                    <div style={{ display: 'flex', marginBottom: '16px' }}>
                        <button
                            className={`windows-button ${activeTab === 'prescriptions' ? 'active' : ''}`}
                            onClick={() => setActiveTab('prescriptions')}
                            style={{
                                backgroundColor: activeTab === 'prescriptions' ? '#000080' : '',
                                color: activeTab === 'prescriptions' ? 'white' : '',
                                marginRight: '4px'
                            }}
                        >
                            Prescriptions
                        </button>
                        <button
                            className={`windows-button ${activeTab === 'new-prescription' ? 'active' : ''}`}
                            onClick={() => setActiveTab('new-prescription')}
                            style={{
                                backgroundColor: activeTab === 'new-prescription' ? '#000080' : '',
                                color: activeTab === 'new-prescription' ? 'white' : '',
                                marginRight: '4px'
                            }}
                        >
                            New Prescription
                        </button>
                        <button
                            className={`windows-button ${activeTab === 'refills' ? 'active' : ''}`}
                            onClick={() => setActiveTab('refills')}
                            style={{
                                backgroundColor: activeTab === 'refills' ? '#000080' : '',
                                color: activeTab === 'refills' ? 'white' : '',
                                marginRight: '4px',
                                position: 'relative'
                            }}
                        >
                            Refill Requests
                            {patientRefillRequests.filter(req => req.status === 'Pending').length > 0 && (
                                <span style={{
                                    position: 'absolute',
                                    top: '-5px',
                                    right: '-5px',
                                    backgroundColor: 'red',
                                    color: 'white',
                                    borderRadius: '50%',
                                    width: '18px',
                                    height: '18px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    fontSize: '11px'
                                }}>
                                    {patientRefillRequests.filter(req => req.status === 'Pending').length}
                                </span>
                            )}
                        </button>
                        <button
                            className={`windows-button ${activeTab === 'dispense-history' ? 'active' : ''}`}
                            onClick={() => setActiveTab('dispense-history')}
                            style={{
                                backgroundColor: activeTab === 'dispense-history' ? '#000080' : '',
                                color: activeTab === 'dispense-history' ? 'white' : '',
                                marginRight: '4px'
                            }}
                        >
                            Dispensing History
                        </button>
                        <button
                            className={`windows-button ${activeTab === 'calculator' ? 'active' : ''}`}
                            onClick={() => setActiveTab('calculator')}
                            style={{
                                backgroundColor: activeTab === 'calculator' ? '#000080' : '',
                                color: activeTab === 'calculator' ? 'white' : '',
                                marginRight: '4px'
                            }}
                        >
                            Dosage Calculator
                        </button>
                    </div>

                    {/* Tab content */}
                    <div style={{
                        flexGrow: 1,
                        border: '1px solid black',
                        padding: '16px',
                        backgroundColor: 'white',
                        overflowY: 'auto'
                    }}>
                        {activeTab === 'prescriptions' && renderPrescriptionsTab()}
                        {activeTab === 'new-prescription' && renderNewPrescriptionTab()}
                        {activeTab === 'refills' && renderRefillsTab()}
                        {activeTab === 'dispense-history' && renderDispenseHistoryTab()}
                        {activeTab === 'calculator' && renderCalculatorTab()}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PharmacyScreen; 