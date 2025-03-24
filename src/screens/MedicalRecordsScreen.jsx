import React, { useEffect, useState } from 'react';
import { useMedicalRecords } from '../context/MedicalRecordsContext';
import { usePatient } from '../context/PatientContext';
import '../styles/WindowsClassic.css';

const MedicalRecordsScreen = () => {
    const { patientData } = usePatient();
    const {
        visitHistory,
        vaccinations,
        medications,
        weightHistory,
        labResults,
        medicalAlerts,
        setMockMedicalRecordsData
    } = useMedicalRecords();

    const [activeTab, setActiveTab] = useState('visits');

    useEffect(() => {
        // Load mock data for this demo
        setMockMedicalRecordsData();
    }, []);

    // Sort weight history in chronological order for charting
    const sortedWeightHistory = [...weightHistory].sort((a, b) =>
        new Date(a.date) - new Date(b.date)
    );

    // Sort visit history in reverse chronological order (newest first)
    const sortedVisitHistory = [...visitHistory].sort((a, b) =>
        new Date(b.date) - new Date(a.date)
    );

    // Formatted vaccines with status
    const formattedVaccines = vaccinations.map(vax => {
        const expiryDate = new Date(vax.expirationDate);
        const today = new Date();
        const daysUntilExpiry = Math.floor((expiryDate - today) / (1000 * 60 * 60 * 24));

        let status = "Current";
        if (daysUntilExpiry < 0) {
            status = "Expired";
        } else if (daysUntilExpiry < 30) {
            status = "Due Soon";
        }

        return {
            ...vax,
            status,
            daysUntilExpiry
        };
    });

    // Render visit history tab
    const renderVisitsTab = () => (
        <div style={{ height: '100%', overflowY: 'auto' }}>
            <h3>Visit History</h3>
            <div className="medical-records-visits">
                {sortedVisitHistory.map((visit) => (
                    <div key={visit.id} className="fieldset" style={{ marginBottom: '16px' }}>
                        <div className="form-row" style={{ justifyContent: 'space-between' }}>
                            <strong>{visit.date}</strong>
                            <span>Provider: {visit.doctor}</span>
                        </div>
                        <div className="form-row">
                            <strong>Reason:</strong> {visit.reason}
                        </div>
                        <div className="form-row">
                            <strong>Diagnosis:</strong> {visit.diagnoses.join(', ')}
                        </div>
                        <div className="form-row">
                            <strong>Notes:</strong> {visit.notes}
                        </div>
                        {visit.followupNeeded && (
                            <div className="form-row">
                                <strong>Follow-up Date:</strong> {visit.followupDate}
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );

    // Render vaccination records tab
    const renderVaccinationsTab = () => (
        <div style={{ height: '100%', overflowY: 'auto' }}>
            <h3>Vaccination Records</h3>
            <table className="windows-table" style={{ width: '100%' }}>
                <thead>
                    <tr>
                        <th>Vaccine</th>
                        <th>Date</th>
                        <th>Expiration</th>
                        <th>Status</th>
                        <th>Lot #</th>
                        <th>Administrator</th>
                        <th>Site</th>
                    </tr>
                </thead>
                <tbody>
                    {formattedVaccines.map((vax) => (
                        <tr key={vax.id}>
                            <td>{vax.name}</td>
                            <td>{vax.date}</td>
                            <td>{vax.expirationDate}</td>
                            <td style={{
                                backgroundColor:
                                    vax.status === 'Expired' ? '#FFCDD2' :
                                        vax.status === 'Due Soon' ? '#FFF9C4' :
                                            '#C8E6C9'
                            }}>
                                {vax.status}
                            </td>
                            <td>{vax.lotNumber}</td>
                            <td>{vax.administrator}</td>
                            <td>{vax.siteLocation}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );

    // Render medication history tab
    const renderMedicationsTab = () => (
        <div style={{ height: '100%', overflowY: 'auto' }}>
            <h3>Medication History</h3>
            <table className="windows-table" style={{ width: '100%' }}>
                <thead>
                    <tr>
                        <th>Medication</th>
                        <th>Start Date</th>
                        <th>End Date</th>
                        <th>Dosage</th>
                        <th>Frequency</th>
                        <th>Prescribed By</th>
                        <th>Status</th>
                    </tr>
                </thead>
                <tbody>
                    {medications.map((med) => (
                        <tr key={med.id}>
                            <td>{med.name}</td>
                            <td>{med.startDate}</td>
                            <td>{med.endDate || 'Ongoing'}</td>
                            <td>{med.dosage}</td>
                            <td>{med.frequency}</td>
                            <td>{med.prescribedBy}</td>
                            <td style={{
                                backgroundColor: med.active ? '#C8E6C9' : '#EEEEEE'
                            }}>
                                {med.active ? 'Active' : 'Completed'}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <div className="form-row" style={{ marginTop: '16px' }}>
                <strong>Notes:</strong>
            </div>
            <ul style={{ margin: '8px 0' }}>
                {medications.map(med => (
                    <li key={med.id}>{med.name}: {med.notes}</li>
                ))}
            </ul>
        </div>
    );

    // Render growth chart tab with weight history
    const renderGrowthChartTab = () => {
        // Simple ASCII chart for the demo
        // In a real app, you would use a charting library
        const maxWeight = Math.max(...sortedWeightHistory.map(w => parseFloat(w.weight))) * 1.1;
        const chartHeight = 200;

        return (
            <div style={{ height: '100%', overflowY: 'auto' }}>
                <h3>Growth Chart</h3>

                {/* Simple visualization of weight over time */}
                <div style={{ position: 'relative', height: `${chartHeight + 50}px`, border: '1px solid #000', padding: '10px' }}>
                    {sortedWeightHistory.map((weight, index) => {
                        const percentage = (parseFloat(weight.weight) / maxWeight) * 100;
                        const barHeight = (percentage / 100) * chartHeight;
                        const barWidth = 40;
                        const spacing = 60;

                        return (
                            <div key={weight.date} style={{ position: 'absolute', bottom: '25px', left: `${index * spacing + 25}px` }}>
                                <div style={{
                                    height: `${barHeight}px`,
                                    width: `${barWidth}px`,
                                    backgroundColor: '#1976d2',
                                    position: 'relative'
                                }}></div>
                                <div style={{
                                    textAlign: 'center',
                                    position: 'absolute',
                                    bottom: `-25px`,
                                    width: `${barWidth}px`,
                                    fontSize: '10px'
                                }}>
                                    {weight.date.split('-')[0].slice(2)}/{weight.date.split('-')[1]}
                                </div>
                                <div style={{
                                    position: 'absolute',
                                    bottom: `${barHeight + 5}px`,
                                    width: `${barWidth}px`,
                                    textAlign: 'center',
                                    fontSize: '12px'
                                }}>
                                    {weight.weight}
                                </div>
                            </div>
                        );
                    })}
                    <div style={{ position: 'absolute', left: '5px', bottom: '0', height: '100%', borderLeft: '1px solid #aaa' }}></div>
                    <div style={{ position: 'absolute', left: '0', bottom: '25px', width: '100%', borderBottom: '1px solid #aaa' }}></div>
                </div>

                {/* Weight history table */}
                <table className="windows-table" style={{ width: '100%', marginTop: '20px' }}>
                    <thead>
                        <tr>
                            <th>Date</th>
                            <th>Weight</th>
                            <th>Unit</th>
                            <th>Notes</th>
                        </tr>
                    </thead>
                    <tbody>
                        {sortedWeightHistory.map((weight, index) => (
                            <tr key={index}>
                                <td>{weight.date}</td>
                                <td>{weight.weight}</td>
                                <td>{weight.unit}</td>
                                <td>{weight.notes}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        );
    };

    // Render lab results tab
    const renderLabResultsTab = () => (
        <div style={{ height: '100%', overflowY: 'auto' }}>
            <h3>Lab Results</h3>

            {labResults.map((lab) => (
                <div key={lab.id} className="fieldset" style={{ marginBottom: '16px' }}>
                    <div className="form-row" style={{ justifyContent: 'space-between' }}>
                        <strong>{lab.testName}</strong>
                        <span>Date: {lab.date}</span>
                    </div>
                    <div className="form-row">
                        <strong>Ordered by:</strong> {lab.orderedBy}
                    </div>

                    <table className="windows-table" style={{ width: '100%', marginTop: '10px' }}>
                        <thead>
                            <tr>
                                <th>Parameter</th>
                                <th>Result</th>
                                <th>Unit</th>
                                <th>Reference Range</th>
                            </tr>
                        </thead>
                        <tbody>
                            {lab.results.map((result, idx) => (
                                <tr key={idx} style={{
                                    backgroundColor: result.flagged ? '#FFCDD2' : 'transparent'
                                }}>
                                    <td>{result.parameter}</td>
                                    <td>{result.value}</td>
                                    <td>{result.unit}</td>
                                    <td>{result.range}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    {lab.notes && (
                        <div className="form-row" style={{ marginTop: '10px' }}>
                            <strong>Notes:</strong> {lab.notes}
                        </div>
                    )}
                </div>
            ))}
        </div>
    );

    // Render alerts tab
    const renderAlertsTab = () => (
        <div style={{ height: '100%', overflowY: 'auto' }}>
            <h3>Medical Alerts</h3>

            <table className="windows-table" style={{ width: '100%' }}>
                <thead>
                    <tr>
                        <th>Type</th>
                        <th>Description</th>
                        <th>Added By</th>
                        <th>Date Added</th>
                        <th>Severity</th>
                        <th>Status</th>
                    </tr>
                </thead>
                <tbody>
                    {medicalAlerts.map((alert) => (
                        <tr key={alert.id} style={{
                            backgroundColor:
                                alert.severity === 'High' ? '#FFCDD2' :
                                    alert.severity === 'Medium' ? '#FFF9C4' :
                                        '#E3F2FD'
                        }}>
                            <td>{alert.type}</td>
                            <td>{alert.description}</td>
                            <td>{alert.addedBy}</td>
                            <td>{alert.dateAdded}</td>
                            <td>{alert.severity}</td>
                            <td>{alert.active ? 'Active' : 'Resolved'}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );

    return (
        <div className="windows-classic">
            <div className="window" style={{ margin: '0', height: '100%' }}>
                <div className="title-bar">
                    <div className="title-bar-text">Patient Medical Records</div>
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
                                <div className="form-row">
                                    <strong>Breed:</strong> {patientData.breed}
                                </div>
                            </div>
                            <div>
                                <div className="form-row">
                                    <strong>Age:</strong> {patientData.ageYears}y {patientData.ageMonths}m {patientData.ageDays}d
                                </div>
                                <div className="form-row">
                                    <strong>Sex:</strong> {patientData.sex}
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
                                <div className="form-row">
                                    <strong>Phone:</strong> {patientData.phoneHome}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Tab buttons */}
                    <div style={{ display: 'flex', marginBottom: '16px' }}>
                        <button
                            className={`windows-button ${activeTab === 'visits' ? 'active' : ''}`}
                            onClick={() => setActiveTab('visits')}
                            style={{
                                backgroundColor: activeTab === 'visits' ? '#000080' : '',
                                color: activeTab === 'visits' ? 'white' : '',
                                marginRight: '4px'
                            }}
                        >
                            Visit History
                        </button>
                        <button
                            className={`windows-button ${activeTab === 'vaccinations' ? 'active' : ''}`}
                            onClick={() => setActiveTab('vaccinations')}
                            style={{
                                backgroundColor: activeTab === 'vaccinations' ? '#000080' : '',
                                color: activeTab === 'vaccinations' ? 'white' : '',
                                marginRight: '4px'
                            }}
                        >
                            Vaccinations
                        </button>
                        <button
                            className={`windows-button ${activeTab === 'medications' ? 'active' : ''}`}
                            onClick={() => setActiveTab('medications')}
                            style={{
                                backgroundColor: activeTab === 'medications' ? '#000080' : '',
                                color: activeTab === 'medications' ? 'white' : '',
                                marginRight: '4px'
                            }}
                        >
                            Medications
                        </button>
                        <button
                            className={`windows-button ${activeTab === 'growth' ? 'active' : ''}`}
                            onClick={() => setActiveTab('growth')}
                            style={{
                                backgroundColor: activeTab === 'growth' ? '#000080' : '',
                                color: activeTab === 'growth' ? 'white' : '',
                                marginRight: '4px'
                            }}
                        >
                            Growth Chart
                        </button>
                        <button
                            className={`windows-button ${activeTab === 'labs' ? 'active' : ''}`}
                            onClick={() => setActiveTab('labs')}
                            style={{
                                backgroundColor: activeTab === 'labs' ? '#000080' : '',
                                color: activeTab === 'labs' ? 'white' : '',
                                marginRight: '4px'
                            }}
                        >
                            Lab Results
                        </button>
                        <button
                            className={`windows-button ${activeTab === 'alerts' ? 'active' : ''}`}
                            onClick={() => setActiveTab('alerts')}
                            style={{
                                backgroundColor: activeTab === 'alerts' ? '#000080' : '',
                                color: activeTab === 'alerts' ? 'white' : '',
                                marginRight: '4px'
                            }}
                        >
                            Alerts
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
                        {activeTab === 'visits' && renderVisitsTab()}
                        {activeTab === 'vaccinations' && renderVaccinationsTab()}
                        {activeTab === 'medications' && renderMedicationsTab()}
                        {activeTab === 'growth' && renderGrowthChartTab()}
                        {activeTab === 'labs' && renderLabResultsTab()}
                        {activeTab === 'alerts' && renderAlertsTab()}
                    </div>

                    {/* Action buttons */}
                    <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '16px', gap: '8px' }}>
                        <button className="windows-button">Print</button>
                        <button className="windows-button">Export</button>
                        <button className="windows-button">Add Note</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MedicalRecordsScreen; 