import React, { useState, useMemo } from 'react';
import { useCheckIn } from '../../context/CheckInContext';
import { usePIMS } from '../../context/PIMSContext';
import './CheckInQueue.css';

const CheckInQueue = ({ onSelectPatient }) => {
  const { activeCheckIns, queueStats, CHECK_IN_STATUS, TRIAGE_PRIORITY } = useCheckIn();
  const { currentPIMS } = usePIMS();
  const [sortBy, setSortBy] = useState('waitTime');
  const [filterBy, setFilterBy] = useState('all');

  // Sort and filter check-ins
  const displayCheckIns = useMemo(() => {
    let filtered = [...activeCheckIns];

    // Apply filters
    if (filterBy !== 'all') {
      filtered = filtered.filter(checkIn => {
        switch (filterBy) {
          case 'waiting':
            return [CHECK_IN_STATUS.ARRIVAL, CHECK_IN_STATUS.VERIFICATION, CHECK_IN_STATUS.READY].includes(checkIn.status);
          case 'inProgress':
            return [CHECK_IN_STATUS.IN_ROOM, CHECK_IN_STATUS.WITH_DOCTOR].includes(checkIn.status);
          case 'emergency':
            return checkIn.priority === TRIAGE_PRIORITY.EMERGENCY;
          case 'urgent':
            return checkIn.priority === TRIAGE_PRIORITY.URGENT;
          default:
            return true;
        }
      });
    }

    // Apply sorting
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'waitTime':
          const waitA = new Date() - new Date(a.checkInTime);
          const waitB = new Date() - new Date(b.checkInTime);
          return waitB - waitA;
        case 'priority':
          const priorityOrder = {
            [TRIAGE_PRIORITY.EMERGENCY]: 0,
            [TRIAGE_PRIORITY.URGENT]: 1,
            [TRIAGE_PRIORITY.NORMAL]: 2,
            [TRIAGE_PRIORITY.ROUTINE]: 3
          };
          return priorityOrder[a.priority] - priorityOrder[b.priority];
        case 'status':
          return a.status.localeCompare(b.status);
        default:
          return 0;
      }
    });

    return filtered;
  }, [activeCheckIns, sortBy, filterBy, CHECK_IN_STATUS, TRIAGE_PRIORITY]);

  const getStatusColor = (status) => {
    switch (status) {
      case CHECK_IN_STATUS.ARRIVAL:
      case CHECK_IN_STATUS.VERIFICATION:
        return 'status-pending';
      case CHECK_IN_STATUS.CLINICAL_INFO:
      case CHECK_IN_STATUS.CONSENTS:
      case CHECK_IN_STATUS.PAYMENT:
        return 'status-processing';
      case CHECK_IN_STATUS.READY:
        return 'status-ready';
      case CHECK_IN_STATUS.IN_ROOM:
      case CHECK_IN_STATUS.WITH_DOCTOR:
        return 'status-active';
      case CHECK_IN_STATUS.CHECKOUT:
      case CHECK_IN_STATUS.COMPLETED:
        return 'status-completed';
      default:
        return '';
    }
  };

  const getPriorityBadge = (priority) => {
    switch (priority) {
      case TRIAGE_PRIORITY.EMERGENCY:
        return <span className="priority-badge priority-emergency">EMERGENCY</span>;
      case TRIAGE_PRIORITY.URGENT:
        return <span className="priority-badge priority-urgent">URGENT</span>;
      case TRIAGE_PRIORITY.NORMAL:
        return <span className="priority-badge priority-normal">NORMAL</span>;
      case TRIAGE_PRIORITY.ROUTINE:
        return <span className="priority-badge priority-routine">ROUTINE</span>;
      default:
        return null;
    }
  };

  const formatWaitTime = (checkInTime) => {
    const minutes = Math.floor((new Date() - new Date(checkInTime)) / 60000);
    if (minutes < 60) {
      return `${minutes}m`;
    }
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    return `${hours}h ${remainingMinutes}m`;
  };

  const getStatusDisplay = (status) => {
    const statusMap = {
      [CHECK_IN_STATUS.ARRIVAL]: 'Arrived',
      [CHECK_IN_STATUS.VERIFICATION]: 'Verifying',
      [CHECK_IN_STATUS.CLINICAL_INFO]: 'Clinical Info',
      [CHECK_IN_STATUS.CONSENTS]: 'Consents',
      [CHECK_IN_STATUS.PAYMENT]: 'Payment',
      [CHECK_IN_STATUS.READY]: 'Ready',
      [CHECK_IN_STATUS.IN_ROOM]: 'In Room',
      [CHECK_IN_STATUS.WITH_DOCTOR]: 'With Doctor',
      [CHECK_IN_STATUS.CHECKOUT]: 'Checkout',
      [CHECK_IN_STATUS.COMPLETED]: 'Completed'
    };
    return statusMap[status] || status;
  };

  return (
    <div className={`check-in-queue ${currentPIMS.toLowerCase()}-theme`}>
      <div className="queue-header">
        <h2>Check-In Queue</h2>
        <div className="queue-stats">
          <div className="stat">
            <span className="stat-value">{queueStats.total}</span>
            <span className="stat-label">Total</span>
          </div>
          <div className="stat">
            <span className="stat-value">{queueStats.waiting}</span>
            <span className="stat-label">Waiting</span>
          </div>
          <div className="stat">
            <span className="stat-value">{queueStats.inRoom}</span>
            <span className="stat-label">In Room</span>
          </div>
          <div className="stat">
            <span className="stat-value">{queueStats.averageWaitTime}m</span>
            <span className="stat-label">Avg Wait</span>
          </div>
          <div className="stat">
            <span className="stat-value">{queueStats.roomsAvailable}</span>
            <span className="stat-label">Rooms Free</span>
          </div>
        </div>
      </div>

      <div className="queue-controls">
        <div className="filter-controls">
          <label>Filter:</label>
          <select value={filterBy} onChange={(e) => setFilterBy(e.target.value)}>
            <option value="all">All Patients</option>
            <option value="waiting">Waiting</option>
            <option value="inProgress">In Progress</option>
            <option value="emergency">Emergency</option>
            <option value="urgent">Urgent</option>
          </select>
        </div>
        <div className="sort-controls">
          <label>Sort by:</label>
          <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
            <option value="waitTime">Wait Time</option>
            <option value="priority">Priority</option>
            <option value="status">Status</option>
          </select>
        </div>
      </div>

      <div className="queue-list">
        {displayCheckIns.length === 0 ? (
          <div className="empty-queue">
            <p>No patients in queue</p>
          </div>
        ) : (
          <table className="queue-table">
            <thead>
              <tr>
                <th>Time</th>
                <th>Patient</th>
                <th>Owner</th>
                <th>Reason</th>
                <th>Status</th>
                <th>Room</th>
                <th>Priority</th>
                <th>Wait</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {displayCheckIns.map((checkIn) => (
                <tr 
                  key={checkIn.checkInId}
                  className={`queue-row ${getStatusColor(checkIn.status)}`}
                  onClick={() => onSelectPatient?.(checkIn)}
                >
                  <td>{new Date(checkIn.checkInTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</td>
                  <td className="patient-name">
                    {checkIn.patientName || `Patient ${checkIn.patientId}`}
                  </td>
                  <td>{checkIn.clientName || `Client ${checkIn.clientId}`}</td>
                  <td className="reason-cell">
                    {checkIn.reasonForVisit || 'Not specified'}
                  </td>
                  <td>
                    <span className={`status-badge ${getStatusColor(checkIn.status)}`}>
                      {getStatusDisplay(checkIn.status)}
                    </span>
                  </td>
                  <td>{checkIn.roomNumber || '-'}</td>
                  <td>{getPriorityBadge(checkIn.priority)}</td>
                  <td className="wait-time">
                    {formatWaitTime(checkIn.checkInTime)}
                  </td>
                  <td>
                    <button 
                      className="action-btn"
                      onClick={(e) => {
                        e.stopPropagation();
                        onSelectPatient?.(checkIn);
                      }}
                    >
                      View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default CheckInQueue;