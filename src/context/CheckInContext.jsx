import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { checkInService, CHECK_IN_STATUS, TRIAGE_PRIORITY } from '../services/CheckInService';

const CheckInContext = createContext();

export const useCheckIn = () => {
  const context = useContext(CheckInContext);
  if (!context) {
    throw new Error('useCheckIn must be used within CheckInProvider');
  }
  return context;
};

export const CheckInProvider = ({ children }) => {
  const [activeCheckIns, setActiveCheckIns] = useState([]);
  const [currentCheckIn, setCurrentCheckIn] = useState(null);
  const [queueStats, setQueueStats] = useState({
    total: 0,
    waiting: 0,
    inRoom: 0,
    withDoctor: 0,
    averageWaitTime: 0,
    roomsAvailable: 0
  });
  const [availableRooms, setAvailableRooms] = useState([]);
  const [notifications, setNotifications] = useState([]);

  // Handle service events
  useEffect(() => {
    const handleServiceEvent = (event, data) => {
      switch (event) {
        case 'checkInCreated':
        case 'statusUpdated':
        case 'weightUpdated':
        case 'clinicalInfoUpdated':
        case 'roomAssigned':
        case 'priorityUpdated':
        case 'infoVerified':
        case 'consentAdded':
        case 'paymentUpdated':
          updateCheckInsList();
          updateQueueStats();
          break;
        case 'roomAvailable':
        case 'roomReleased':
          updateAvailableRooms();
          updateQueueStats();
          break;
        case 'notificationAdded':
          if (data.notification.severity === 'critical' || data.notification.severity === 'warning') {
            addNotification(data.notification);
          }
          break;
        default:
          break;
      }
    };

    checkInService.addListener(handleServiceEvent);
    
    // Initial load
    updateCheckInsList();
    updateQueueStats();
    updateAvailableRooms();

    return () => {
      checkInService.removeListener(handleServiceEvent);
    };
  }, []);

  const updateCheckInsList = useCallback(() => {
    const checkIns = checkInService.getAllCheckIns();
    setActiveCheckIns(checkIns);
  }, []);

  const updateQueueStats = useCallback(() => {
    const stats = checkInService.getQueueStats();
    setQueueStats(stats);
  }, []);

  const updateAvailableRooms = useCallback(() => {
    const rooms = checkInService.getAvailableRooms();
    setAvailableRooms(rooms);
  }, []);

  const addNotification = useCallback((notification) => {
    setNotifications(prev => [...prev, {
      ...notification,
      id: `${Date.now()}-${Math.random()}`
    }]);
    
    // Auto-dismiss non-critical notifications after 10 seconds
    if (notification.severity !== 'critical') {
      setTimeout(() => {
        dismissNotification(notification.id);
      }, 10000);
    }
  }, []);

  const dismissNotification = useCallback((notificationId) => {
    setNotifications(prev => prev.filter(n => n.id !== notificationId));
  }, []);

  // Check-in operations
  const createCheckIn = useCallback((appointmentData) => {
    const checkIn = checkInService.createCheckIn(appointmentData);
    setCurrentCheckIn(checkIn);
    return checkIn;
  }, []);

  const updateCheckInStatus = useCallback((checkInId, newStatus) => {
    const checkIn = checkInService.updateCheckInStatus(checkInId, newStatus);
    if (currentCheckIn?.checkInId === checkInId) {
      setCurrentCheckIn(checkIn);
    }
    return checkIn;
  }, [currentCheckIn]);

  const updateWeight = useCallback((checkInId, weight, unit) => {
    const checkIn = checkInService.updateWeight(checkInId, weight, unit);
    if (currentCheckIn?.checkInId === checkInId) {
      setCurrentCheckIn(checkIn);
    }
    return checkIn;
  }, [currentCheckIn]);

  const assignRoom = useCallback((checkInId, roomNumber) => {
    const checkIn = checkInService.assignRoom(checkInId, roomNumber);
    if (currentCheckIn?.checkInId === checkInId) {
      setCurrentCheckIn(checkIn);
    }
    return checkIn;
  }, [currentCheckIn]);

  const updatePriority = useCallback((checkInId, priority, reason) => {
    const checkIn = checkInService.updatePriority(checkInId, priority, reason);
    if (currentCheckIn?.checkInId === checkInId) {
      setCurrentCheckIn(checkIn);
    }
    return checkIn;
  }, [currentCheckIn]);

  const addClinicalInfo = useCallback((checkInId, info) => {
    const checkIn = checkInService.addClinicalInfo(checkInId, info);
    if (currentCheckIn?.checkInId === checkInId) {
      setCurrentCheckIn(checkIn);
    }
    return checkIn;
  }, [currentCheckIn]);

  const verifyInfo = useCallback((checkInId, verificationType) => {
    const checkIn = checkInService.verifyInfo(checkInId, verificationType);
    if (currentCheckIn?.checkInId === checkInId) {
      setCurrentCheckIn(checkIn);
    }
    return checkIn;
  }, [currentCheckIn]);

  const addConsent = useCallback((checkInId, consentType, signature) => {
    const checkIn = checkInService.addConsent(checkInId, consentType, signature);
    if (currentCheckIn?.checkInId === checkInId) {
      setCurrentCheckIn(checkIn);
    }
    return checkIn;
  }, [currentCheckIn]);

  const updatePaymentStatus = useCallback((checkInId, status, details) => {
    const checkIn = checkInService.updatePaymentStatus(checkInId, status, details);
    if (currentCheckIn?.checkInId === checkInId) {
      setCurrentCheckIn(checkIn);
    }
    return checkIn;
  }, [currentCheckIn]);

  const getCheckIn = useCallback((checkInId) => {
    return checkInService.getCheckIn(checkInId);
  }, []);

  const searchCheckIns = useCallback((criteria) => {
    return checkInService.searchCheckIns(criteria);
  }, []);

  const selectCheckIn = useCallback((checkInId) => {
    const checkIn = checkInService.getCheckIn(checkInId);
    setCurrentCheckIn(checkIn);
    return checkIn;
  }, []);

  const clearCurrentCheckIn = useCallback(() => {
    setCurrentCheckIn(null);
  }, []);

  const value = {
    // State
    activeCheckIns,
    currentCheckIn,
    queueStats,
    availableRooms,
    notifications,
    
    // Actions
    createCheckIn,
    updateCheckInStatus,
    updateWeight,
    assignRoom,
    updatePriority,
    addClinicalInfo,
    verifyInfo,
    addConsent,
    updatePaymentStatus,
    getCheckIn,
    searchCheckIns,
    selectCheckIn,
    clearCurrentCheckIn,
    dismissNotification,
    
    // Constants
    CHECK_IN_STATUS,
    TRIAGE_PRIORITY
  };

  return (
    <CheckInContext.Provider value={value}>
      {children}
    </CheckInContext.Provider>
  );
};