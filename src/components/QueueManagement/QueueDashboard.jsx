import React, { useState, useEffect } from 'react';
import { Card } from '../design-system/Card';
import { Button } from '../design-system/Button';
import QueueManagementService from '../../services/QueueManagementService';
import './QueueDashboard.css';

const QueueDashboard = ({ className = '' }) => {
    const [queues, setQueues] = useState({});
    const [statistics, setStatistics] = useState({});
    const [rooms, setRooms] = useState([]);
    const [staff, setStaff] = useState([]);
    const [selectedPatient, setSelectedPatient] = useState(null);
    const [refreshInterval, setRefreshInterval] = useState(null);

    useEffect(() => {
        loadQueueData();

        // Set up real-time updates
        const interval = setInterval(loadQueueData, 10000); // Update every 10 seconds
        setRefreshInterval(interval);

        return () => {
            if (interval) clearInterval(interval);
        };
    }, []);

    const loadQueueData = () => {
        setQueues(QueueManagementService.getAllQueues());
        setStatistics(QueueManagementService.getQueueStatistics());
        setRooms(QueueManagementService.getAllRooms());
        setStaff(QueueManagementService.getAllStaff());
    };

    const handleMovePatient = (patientId, targetQueue) => {
        QueueManagementService.movePatientToQueue(patientId, targetQueue);
        loadQueueData();
    };

    const handlePriorityChange = (patientId, newPriority) => {
        QueueManagementService.updatePatientPriority(patientId, parseInt(newPriority));
        loadQueueData();
    };

    const getPriorityColor = (priority) => {
        if (priority >= 9) return 'emergency';
        if (priority >= 7) return 'high';
        if (priority >= 5) return 'medium';
        return 'low';
    };

    const formatWaitTime = (minutes) => {
        if (minutes < 60) return `${minutes}m`;
        const hours = Math.floor(minutes / 60);
        const mins = minutes % 60;
        return `${hours}h ${mins}m`;
    };

    const QueueSection = ({ title, queueType, patients, maxHeight = '300px' }) => (
        <Card className="queue-section">
            <Card.Header>
                <h4>{title}</h4>
                <span className="patient-count">{patients.length} patients</span>
            </Card.Header>
            <Card.Body style={{ maxHeight, overflowY: 'auto' }}>
                {patients.length === 0 ? (
                    <div className="empty-queue">No patients in {title.toLowerCase()}</div>
                ) : (
                    <div className="patient-list">
                        {patients.map(entry => (
                            <div
                                key={entry.id}
                                className={`patient-entry ${selectedPatient?.id === entry.id ? 'selected' : ''}`}
                                onClick={() => setSelectedPatient(entry)}
                                data-testid={`patient-${entry.id}`}
                            >
                                <div className="patient-info">
                                    <div className="patient-header">
                                        <span className="patient-name">{entry.patient.name}</span>
                                        <span className={`priority priority-${getPriorityColor(entry.priority)}`}>
                                            P{entry.priority}
                                        </span>
                                    </div>
                                    <div className="patient-details">
                                        <span className="owner-name">{entry.patient.owner?.name}</span>
                                        <span className="appointment-time">
                                            {entry.appointmentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                        </span>
                                    </div>
                                    <div className="patient-meta">
                                        <span className="reason">{entry.reasonForVisit}</span>
                                        {entry.waitTime > 0 && (
                                            <span className="wait-time">Wait: {formatWaitTime(entry.waitTime)}</span>
                                        )}
                                    </div>
                                    {entry.assignedRoom && (
                                        <div className="assignment-info">
                                            <span className="room">{rooms.find(r => r.id === entry.assignedRoom)?.name}</span>
                                            <span className="staff">{staff.find(s => s.id === entry.assignedStaff)?.name}</span>
                                        </div>
                                    )}
                                </div>

                                {queueType !== 'inprogress' && (
                                    <div className="patient-actions">
                                        <select
                                            value={entry.priority}
                                            onChange={(e) => handlePriorityChange(entry.id, e.target.value)}
                                            data-testid={`priority-${entry.id}`}
                                            onClick={(e) => e.stopPropagation()}
                                        >
                                            {[...Array(10)].map((_, i) => (
                                                <option key={i + 1} value={i + 1}>P{i + 1}</option>
                                            ))}
                                        </select>

                                        <select
                                            value=""
                                            onChange={(e) => {
                                                if (e.target.value) {
                                                    handleMovePatient(entry.id, e.target.value);
                                                }
                                            }}
                                            data-testid={`move-${entry.id}`}
                                            onClick={(e) => e.stopPropagation()}
                                        >
                                            <option value="">Move to...</option>
                                            {Object.keys(queues).filter(q => q !== queueType).map(queueName => (
                                                <option key={queueName} value={queueName}>
                                                    {queueName.charAt(0).toUpperCase() + queueName.slice(1)}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </Card.Body>
        </Card>
    );

    return (
        <div className={`queue-dashboard ${className}`} data-testid="queue-dashboard">
            {/* Statistics Overview */}
            <Card className="statistics-card">
                <Card.Header>
                    <h3>Queue Statistics</h3>
                    <Button
                        variant="secondary"
                        size="small"
                        onClick={loadQueueData}
                        data-testid="refresh-stats"
                    >
                        Refresh
                    </Button>
                </Card.Header>
                <Card.Body>
                    <div className="stats-grid">
                        <div className="stat-item">
                            <span className="stat-label">Total Patients</span>
                            <span className="stat-value">{statistics.totalPatients || 0}</span>
                        </div>
                        <div className="stat-item">
                            <span className="stat-label">Average Wait</span>
                            <span className="stat-value">{formatWaitTime(statistics.averageWaitTime || 0)}</span>
                        </div>
                        <div className="stat-item">
                            <span className="stat-label">Peak Wait</span>
                            <span className="stat-value">{formatWaitTime(statistics.peakWaitTime || 0)}</span>
                        </div>
                        <div className="stat-item">
                            <span className="stat-label">Room Utilization</span>
                            <span className="stat-value">{statistics.roomUtilization || 0}%</span>
                        </div>
                        <div className="stat-item">
                            <span className="stat-label">Staff Utilization</span>
                            <span className="stat-value">{statistics.staffUtilization || 0}%</span>
                        </div>
                    </div>

                    {statistics.priorityDistribution && (
                        <div className="priority-distribution">
                            <h5>Priority Distribution</h5>
                            <div className="priority-bars">
                                <div className="priority-bar low" style={{ width: `${(statistics.priorityDistribution.low / statistics.totalPatients) * 100}%` }}>
                                    Low ({statistics.priorityDistribution.low})
                                </div>
                                <div className="priority-bar medium" style={{ width: `${(statistics.priorityDistribution.medium / statistics.totalPatients) * 100}%` }}>
                                    Medium ({statistics.priorityDistribution.medium})
                                </div>
                                <div className="priority-bar high" style={{ width: `${(statistics.priorityDistribution.high / statistics.totalPatients) * 100}%` }}>
                                    High ({statistics.priorityDistribution.high})
                                </div>
                                <div className="priority-bar emergency" style={{ width: `${(statistics.priorityDistribution.emergency / statistics.totalPatients) * 100}%` }}>
                                    Emergency ({statistics.priorityDistribution.emergency})
                                </div>
                            </div>
                        </div>
                    )}
                </Card.Body>
            </Card>

            {/* Queue Management */}
            <div className="queues-container">
                <div className="queues-grid">
                    <QueueSection
                        title="Check-in"
                        queueType="checkin"
                        patients={queues.checkin || []}
                    />

                    <QueueSection
                        title="Waiting"
                        queueType="waiting"
                        patients={queues.waiting || []}
                    />

                    <QueueSection
                        title="In Progress"
                        queueType="inprogress"
                        patients={queues.inprogress || []}
                    />

                    <QueueSection
                        title="Ready"
                        queueType="ready"
                        patients={queues.ready || []}
                    />
                </div>
            </div>

            {/* Resource Status */}
            <div className="resources-container">
                <Card className="rooms-card">
                    <Card.Header>
                        <h4>Room Status</h4>
                    </Card.Header>
                    <Card.Body>
                        <div className="rooms-grid">
                            {rooms.map(room => (
                                <div
                                    key={room.id}
                                    className={`room-status ${room.available ? 'available' : 'occupied'}`}
                                    data-testid={`room-${room.id}`}
                                >
                                    <div className="room-header">
                                        <span className="room-name">{room.name}</span>
                                        <span className={`room-indicator ${room.available ? 'available' : 'occupied'}`}>
                                            {room.available ? 'Available' : 'Occupied'}
                                        </span>
                                    </div>
                                    <div className="room-details">
                                        <span className="room-type">{room.type}</span>
                                        <span className="room-utilization">{room.utilizationToday}% today</span>
                                    </div>
                                    {room.currentPatient && (
                                        <div className="current-patient">
                                            Patient: {room.currentPatient}
                                            {room.estimatedFreeTime && (
                                                <div className="estimated-free">
                                                    Free: {room.estimatedFreeTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </Card.Body>
                </Card>

                <Card className="staff-card">
                    <Card.Header>
                        <h4>Staff Status</h4>
                    </Card.Header>
                    <Card.Body>
                        <div className="staff-grid">
                            {staff.map(person => (
                                <div
                                    key={person.id}
                                    className={`staff-status ${person.available ? 'available' : 'busy'}`}
                                    data-testid={`staff-${person.id}`}
                                >
                                    <div className="staff-header">
                                        <span className="staff-name">{person.name}</span>
                                        <span className={`staff-indicator ${person.available ? 'available' : 'busy'}`}>
                                            {person.available ? 'Available' : 'Busy'}
                                        </span>
                                    </div>
                                    <div className="staff-details">
                                        <span className="staff-role">{person.role}</span>
                                        <span className="staff-workload">{person.workloadToday} patients today</span>
                                    </div>
                                    {person.currentRoom && (
                                        <div className="current-assignment">
                                            In: {rooms.find(r => r.id === person.currentRoom)?.name || person.currentRoom}
                                        </div>
                                    )}
                                    <div className="staff-expertise">
                                        Expertise: {person.expertise?.join(', ') || 'General'}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </Card.Body>
                </Card>
            </div>

            {/* Patient Details Modal */}
            {selectedPatient && (
                <div className="patient-details-overlay" onClick={() => setSelectedPatient(null)}>
                    <Card className="patient-details-modal" onClick={(e) => e.stopPropagation()}>
                        <Card.Header>
                            <h4>Patient Details</h4>
                            <Button
                                variant="secondary"
                                size="small"
                                onClick={() => setSelectedPatient(null)}
                            >
                                Close
                            </Button>
                        </Card.Header>
                        <Card.Body>
                            <div className="patient-full-details">
                                <div className="detail-section">
                                    <h5>Patient Information</h5>
                                    <div className="detail-grid">
                                        <div className="detail-item">
                                            <span className="detail-label">Name:</span>
                                            <span className="detail-value">{selectedPatient.patient.name}</span>
                                        </div>
                                        <div className="detail-item">
                                            <span className="detail-label">Species:</span>
                                            <span className="detail-value">{selectedPatient.patient.species}</span>
                                        </div>
                                        <div className="detail-item">
                                            <span className="detail-label">Age:</span>
                                            <span className="detail-value">{selectedPatient.patient.age} years</span>
                                        </div>
                                        <div className="detail-item">
                                            <span className="detail-label">Owner:</span>
                                            <span className="detail-value">{selectedPatient.patient.owner?.name}</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="detail-section">
                                    <h5>Appointment Details</h5>
                                    <div className="detail-grid">
                                        <div className="detail-item">
                                            <span className="detail-label">Scheduled:</span>
                                            <span className="detail-value">
                                                {selectedPatient.appointmentTime.toLocaleString()}
                                            </span>
                                        </div>
                                        <div className="detail-item">
                                            <span className="detail-label">Arrived:</span>
                                            <span className="detail-value">
                                                {selectedPatient.actualArrivalTime.toLocaleString()}
                                            </span>
                                        </div>
                                        <div className="detail-item">
                                            <span className="detail-label">Wait Time:</span>
                                            <span className="detail-value">{formatWaitTime(selectedPatient.waitTime)}</span>
                                        </div>
                                        <div className="detail-item">
                                            <span className="detail-label">Priority:</span>
                                            <span className={`detail-value priority-${getPriorityColor(selectedPatient.priority)}`}>
                                                Priority {selectedPatient.priority}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                <div className="detail-section">
                                    <h5>Visit Information</h5>
                                    <div className="detail-item">
                                        <span className="detail-label">Reason:</span>
                                        <span className="detail-value">{selectedPatient.reasonForVisit}</span>
                                    </div>
                                    <div className="detail-item">
                                        <span className="detail-label">Estimated Duration:</span>
                                        <span className="detail-value">{selectedPatient.estimatedDuration} minutes</span>
                                    </div>
                                </div>

                                {selectedPatient.notes && selectedPatient.notes.length > 0 && (
                                    <div className="detail-section">
                                        <h5>Notes & History</h5>
                                        <div className="notes-list">
                                            {selectedPatient.notes.map((note, index) => (
                                                <div key={index} className="note-item">
                                                    <span className="note-timestamp">
                                                        {note.timestamp.toLocaleTimeString()}
                                                    </span>
                                                    <span className={`note-type ${note.type}`}>{note.type}</span>
                                                    <span className="note-message">{note.message}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </Card.Body>
                    </Card>
                </div>
            )}
        </div>
    );
};

export default QueueDashboard; 