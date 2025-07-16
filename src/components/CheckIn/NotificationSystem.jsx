import React, { useEffect, useState } from 'react';
import { useCheckIn } from '../../context/CheckInContext';
import './NotificationSystem.css';

const NotificationSystem = () => {
  const { activeCheckIns, queueStats } = useCheckIn();
  const [alerts, setAlerts] = useState([]);
  const [soundEnabled, setSoundEnabled] = useState(true);

  useEffect(() => {
    // Monitor for emergency cases
    const emergencies = activeCheckIns.filter(
      checkIn => checkIn.priority === 'emergency' && checkIn.status === 'arrival'
    );

    if (emergencies.length > 0) {
      emergencies.forEach(emergency => {
        addAlert({
          type: 'emergency',
          title: 'EMERGENCY CHECK-IN',
          message: `${emergency.patientName || `Patient ${emergency.patientId}`} requires immediate attention`,
          checkInId: emergency.checkInId
        });
      });
    }

    // Monitor wait times
    const longWaits = activeCheckIns.filter(checkIn => {
      const waitTime = Math.floor((new Date() - new Date(checkIn.checkInTime)) / 60000);
      return waitTime > 30 && checkIn.status !== 'in_room' && checkIn.status !== 'with_doctor';
    });

    longWaits.forEach(checkIn => {
      const waitTime = Math.floor((new Date() - new Date(checkIn.checkInTime)) / 60000);
      addAlert({
        type: 'warning',
        title: 'Long Wait Time',
        message: `${checkIn.patientName || `Patient ${checkIn.patientId}`} has been waiting ${waitTime} minutes`,
        checkInId: checkIn.checkInId
      });
    });

  }, [activeCheckIns]);

  const addAlert = (alert) => {
    const alertId = `${alert.type}-${alert.checkInId}-${Date.now()}`;
    const existingAlert = alerts.find(a =>
      a.checkInId === alert.checkInId && a.type === alert.type
    );

    if (!existingAlert) {
      setAlerts(prev => [...prev, { ...alert, id: alertId }]);

      if (soundEnabled && alert.type === 'emergency') {
        playNotificationSound();
      }

      // Auto-dismiss non-emergency alerts after 30 seconds
      if (alert.type !== 'emergency') {
        setTimeout(() => dismissAlert(alertId), 30000);
      }
    }
  };

  const dismissAlert = (alertId) => {
    setAlerts(prev => prev.filter(alert => alert.id !== alertId));
  };

  const playNotificationSound = () => {
    // In a real app, would play an actual sound
    // Emergency notification sound triggered
  };

  const getAlertIcon = (type) => {
    switch (type) {
      case 'emergency':
        return '🚨';
      case 'warning':
        return '⚠️';
      case 'info':
        return 'ℹ️';
      default:
        return '📢';
    }
  };

  return (
    <div className="notification-system">
      <div className="notification-header">
        <h3>Staff Notifications</h3>
        <button
          className="sound-toggle"
          onClick={() => setSoundEnabled(!soundEnabled)}
          title={soundEnabled ? 'Mute notifications' : 'Unmute notifications'}
        >
          {soundEnabled ? '🔔' : '🔕'}
        </button>
      </div>

      <div className="queue-summary">
        <div className="summary-item">
          <span className="summary-label">Waiting:</span>
          <span className="summary-value">{queueStats.waiting}</span>
        </div>
        <div className="summary-item">
          <span className="summary-label">In Room:</span>
          <span className="summary-value">{queueStats.inRoom}</span>
        </div>
        <div className="summary-item">
          <span className="summary-label">Avg Wait:</span>
          <span className="summary-value">{queueStats.averageWaitTime}m</span>
        </div>
      </div>

      <div className="alerts-list">
        {alerts.length === 0 ? (
          <div className="no-alerts">
            <p>No active alerts</p>
          </div>
        ) : (
          alerts.map(alert => (
            <div key={alert.id} className={`alert alert-${alert.type}`}>
              <div className="alert-icon">{getAlertIcon(alert.type)}</div>
              <div className="alert-content">
                <h4>{alert.title}</h4>
                <p>{alert.message}</p>
              </div>
              <button
                className="alert-dismiss"
                onClick={() => dismissAlert(alert.id)}
              >
                ×
              </button>
            </div>
          ))
        )}
      </div>

      <div className="room-status">
        <h4>Room Availability</h4>
        <div className="room-grid">
          {[1, 2, 3, 4, 5, 6].map(roomNum => {
            const roomName = `Exam ${roomNum}`;
            const isOccupied = activeCheckIns.some(c => c.roomNumber === roomName);
            return (
              <div
                key={roomNum}
                className={`room-indicator ${isOccupied ? 'occupied' : 'available'}`}
                title={isOccupied ? 'Occupied' : 'Available'}
              >
                {roomNum}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default NotificationSystem;