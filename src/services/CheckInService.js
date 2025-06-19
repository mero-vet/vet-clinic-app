// Check-In Service - Manages patient check-in workflow and state
export const CHECK_IN_STATUS = {
  ARRIVAL: 'arrival',
  VERIFICATION: 'verification',
  CLINICAL_INFO: 'clinical_info',
  CONSENTS: 'consents',
  PAYMENT: 'payment',
  READY: 'ready',
  IN_ROOM: 'in_room',
  WITH_DOCTOR: 'with_doctor',
  CHECKOUT: 'checkout',
  COMPLETED: 'completed'
};

export const TRIAGE_PRIORITY = {
  EMERGENCY: 'emergency',
  URGENT: 'urgent',
  NORMAL: 'normal',
  ROUTINE: 'routine'
};

export const ROOM_STATUS = {
  AVAILABLE: 'available',
  OCCUPIED: 'occupied',
  CLEANING: 'cleaning',
  RESERVED: 'reserved'
};

class CheckInService {
  constructor() {
    this.checkInQueue = new Map();
    this.roomStatus = new Map();
    this.checkInHistory = new Map();
    this.listeners = new Set();
    
    // Initialize rooms
    this.initializeRooms();
  }

  initializeRooms() {
    // Initialize exam rooms
    for (let i = 1; i <= 6; i++) {
      this.roomStatus.set(`Exam ${i}`, {
        roomNumber: `Exam ${i}`,
        status: ROOM_STATUS.AVAILABLE,
        assignedTo: null,
        lastCleaned: new Date(),
        specialEquipment: i <= 2 ? ['X-Ray'] : []
      });
    }
    
    // Surgery and treatment rooms
    this.roomStatus.set('Surgery 1', {
      roomNumber: 'Surgery 1',
      status: ROOM_STATUS.AVAILABLE,
      assignedTo: null,
      lastCleaned: new Date(),
      specialEquipment: ['Anesthesia', 'Monitors', 'Surgical']
    });
    
    this.roomStatus.set('Treatment', {
      roomNumber: 'Treatment',
      status: ROOM_STATUS.AVAILABLE,
      assignedTo: null,
      lastCleaned: new Date(),
      specialEquipment: ['IV', 'Fluids']
    });
  }

  // Create a new check-in
  createCheckIn(appointmentData) {
    const checkInId = `CHK-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const checkIn = {
      checkInId,
      appointmentId: appointmentData.appointmentId,
      patientId: appointmentData.patientId,
      clientId: appointmentData.clientId,
      checkInTime: new Date(),
      checkInBy: appointmentData.staffId || 'system',
      status: CHECK_IN_STATUS.ARRIVAL,
      priority: TRIAGE_PRIORITY.NORMAL,
      roomNumber: null,
      weight: {
        value: null,
        unit: 'lbs',
        previousValue: appointmentData.previousWeight || null,
        changeFromLast: null
      },
      reasonForVisit: appointmentData.reasonForVisit || '',
      symptoms: [],
      vitals: {
        temperature: null,
        pulse: null,
        respiration: null
      },
      verifiedInfo: {
        contact: false,
        insurance: false,
        medications: false
      },
      consentsObtained: [],
      paymentStatus: 'pending',
      notes: '',
      waitStartTime: new Date(),
      estimatedWaitTime: 15, // minutes
      actualWaitTime: 0,
      notifications: []
    };
    
    this.checkInQueue.set(checkInId, checkIn);
    this.notifyListeners('checkInCreated', checkIn);
    
    return checkIn;
  }

  // Update check-in status
  updateCheckInStatus(checkInId, newStatus) {
    const checkIn = this.checkInQueue.get(checkInId);
    if (!checkIn) {
      throw new Error('Check-in not found');
    }
    
    const oldStatus = checkIn.status;
    checkIn.status = newStatus;
    
    // Handle status-specific updates
    switch (newStatus) {
      case CHECK_IN_STATUS.IN_ROOM:
        checkIn.roomEntryTime = new Date();
        checkIn.actualWaitTime = Math.floor((checkIn.roomEntryTime - checkIn.waitStartTime) / 60000);
        break;
      case CHECK_IN_STATUS.WITH_DOCTOR:
        checkIn.doctorStartTime = new Date();
        break;
      case CHECK_IN_STATUS.COMPLETED:
        checkIn.completedTime = new Date();
        this.moveToHistory(checkInId);
        break;
    }
    
    this.notifyListeners('statusUpdated', { checkIn, oldStatus, newStatus });
    return checkIn;
  }

  // Update weight with comparison
  updateWeight(checkInId, weight, unit = 'lbs') {
    const checkIn = this.checkInQueue.get(checkInId);
    if (!checkIn) {
      throw new Error('Check-in not found');
    }
    
    const previousWeight = checkIn.weight.previousValue;
    checkIn.weight.value = weight;
    checkIn.weight.unit = unit;
    
    if (previousWeight) {
      const change = ((weight - previousWeight) / previousWeight) * 100;
      checkIn.weight.changeFromLast = change;
      
      // Alert if significant weight change (>10%)
      if (Math.abs(change) > 10) {
        this.addNotification(checkInId, {
          type: 'alert',
          message: `Significant weight change: ${change > 0 ? '+' : ''}${change.toFixed(1)}%`,
          severity: 'warning'
        });
      }
    }
    
    this.notifyListeners('weightUpdated', checkIn);
    return checkIn;
  }

  // Assign room to patient
  assignRoom(checkInId, roomNumber) {
    const checkIn = this.checkInQueue.get(checkInId);
    if (!checkIn) {
      throw new Error('Check-in not found');
    }
    
    const room = this.roomStatus.get(roomNumber);
    if (!room) {
      throw new Error('Room not found');
    }
    
    if (room.status !== ROOM_STATUS.AVAILABLE) {
      throw new Error('Room not available');
    }
    
    // Update room status
    room.status = ROOM_STATUS.OCCUPIED;
    room.assignedTo = checkInId;
    
    // Update check-in
    checkIn.roomNumber = roomNumber;
    checkIn.status = CHECK_IN_STATUS.IN_ROOM;
    checkIn.roomEntryTime = new Date();
    
    this.notifyListeners('roomAssigned', { checkIn, room });
    return checkIn;
  }

  // Release room
  releaseRoom(roomNumber) {
    const room = this.roomStatus.get(roomNumber);
    if (!room) {
      throw new Error('Room not found');
    }
    
    room.status = ROOM_STATUS.CLEANING;
    room.assignedTo = null;
    
    // Schedule room available after cleaning (mock 5 minutes)
    setTimeout(() => {
      room.status = ROOM_STATUS.AVAILABLE;
      room.lastCleaned = new Date();
      this.notifyListeners('roomAvailable', room);
    }, 5 * 60 * 1000);
    
    this.notifyListeners('roomReleased', room);
  }

  // Update triage priority
  updatePriority(checkInId, priority, reason) {
    const checkIn = this.checkInQueue.get(checkInId);
    if (!checkIn) {
      throw new Error('Check-in not found');
    }
    
    checkIn.priority = priority;
    this.addNotification(checkInId, {
      type: 'triage',
      message: `Priority changed to ${priority}: ${reason}`,
      severity: priority === TRIAGE_PRIORITY.EMERGENCY ? 'critical' : 'info'
    });
    
    this.notifyListeners('priorityUpdated', checkIn);
    return checkIn;
  }

  // Add clinical information
  addClinicalInfo(checkInId, info) {
    const checkIn = this.checkInQueue.get(checkInId);
    if (!checkIn) {
      throw new Error('Check-in not found');
    }
    
    if (info.symptoms) {
      checkIn.symptoms = [...checkIn.symptoms, ...info.symptoms];
    }
    
    if (info.vitals) {
      Object.assign(checkIn.vitals, info.vitals);
    }
    
    if (info.reasonForVisit) {
      checkIn.reasonForVisit = info.reasonForVisit;
    }
    
    this.notifyListeners('clinicalInfoUpdated', checkIn);
    return checkIn;
  }

  // Verify information
  verifyInfo(checkInId, verificationType) {
    const checkIn = this.checkInQueue.get(checkInId);
    if (!checkIn) {
      throw new Error('Check-in not found');
    }
    
    checkIn.verifiedInfo[verificationType] = true;
    
    // Check if all required verifications are complete
    const allVerified = Object.values(checkIn.verifiedInfo).every(v => v);
    if (allVerified && checkIn.status === CHECK_IN_STATUS.VERIFICATION) {
      this.updateCheckInStatus(checkInId, CHECK_IN_STATUS.CLINICAL_INFO);
    }
    
    this.notifyListeners('infoVerified', { checkIn, verificationType });
    return checkIn;
  }

  // Add consent
  addConsent(checkInId, consentType, signature) {
    const checkIn = this.checkInQueue.get(checkInId);
    if (!checkIn) {
      throw new Error('Check-in not found');
    }
    
    checkIn.consentsObtained.push({
      type: consentType,
      timestamp: new Date(),
      signature: signature || null
    });
    
    this.notifyListeners('consentAdded', { checkIn, consentType });
    return checkIn;
  }

  // Update payment status
  updatePaymentStatus(checkInId, status, details) {
    const checkIn = this.checkInQueue.get(checkInId);
    if (!checkIn) {
      throw new Error('Check-in not found');
    }
    
    checkIn.paymentStatus = status;
    checkIn.paymentDetails = details;
    
    this.notifyListeners('paymentUpdated', checkIn);
    return checkIn;
  }

  // Add notification
  addNotification(checkInId, notification) {
    const checkIn = this.checkInQueue.get(checkInId);
    if (!checkIn) {
      throw new Error('Check-in not found');
    }
    
    checkIn.notifications.push({
      ...notification,
      timestamp: new Date(),
      id: `NOTIF-${Date.now()}`
    });
    
    this.notifyListeners('notificationAdded', { checkIn, notification });
  }

  // Get queue statistics
  getQueueStats() {
    const activeCheckIns = Array.from(this.checkInQueue.values());
    const waitingCount = activeCheckIns.filter(c => 
      c.status === CHECK_IN_STATUS.READY || 
      c.status === CHECK_IN_STATUS.ARRIVAL ||
      c.status === CHECK_IN_STATUS.VERIFICATION
    ).length;
    
    const inRoomCount = activeCheckIns.filter(c => 
      c.status === CHECK_IN_STATUS.IN_ROOM
    ).length;
    
    const withDoctorCount = activeCheckIns.filter(c => 
      c.status === CHECK_IN_STATUS.WITH_DOCTOR
    ).length;
    
    const avgWaitTime = activeCheckIns
      .filter(c => c.actualWaitTime > 0)
      .reduce((sum, c) => sum + c.actualWaitTime, 0) / 
      (activeCheckIns.filter(c => c.actualWaitTime > 0).length || 1);
    
    return {
      total: activeCheckIns.length,
      waiting: waitingCount,
      inRoom: inRoomCount,
      withDoctor: withDoctorCount,
      averageWaitTime: Math.round(avgWaitTime),
      roomsAvailable: Array.from(this.roomStatus.values())
        .filter(r => r.status === ROOM_STATUS.AVAILABLE).length
    };
  }

  // Get available rooms
  getAvailableRooms(requiresEquipment = []) {
    return Array.from(this.roomStatus.values()).filter(room => {
      if (room.status !== ROOM_STATUS.AVAILABLE) return false;
      
      if (requiresEquipment.length > 0) {
        return requiresEquipment.every(eq => 
          room.specialEquipment.includes(eq)
        );
      }
      
      return true;
    });
  }

  // Move to history
  moveToHistory(checkInId) {
    const checkIn = this.checkInQueue.get(checkInId);
    if (checkIn) {
      this.checkInHistory.set(checkInId, checkIn);
      this.checkInQueue.delete(checkInId);
      
      // Release room if assigned
      if (checkIn.roomNumber) {
        this.releaseRoom(checkIn.roomNumber);
      }
    }
  }

  // Event listeners
  addListener(callback) {
    this.listeners.add(callback);
  }

  removeListener(callback) {
    this.listeners.delete(callback);
  }

  notifyListeners(event, data) {
    this.listeners.forEach(callback => {
      try {
        callback(event, data);
      } catch (error) {
        console.error('Error in check-in listener:', error);
      }
    });
  }

  // Get all check-ins
  getAllCheckIns() {
    return Array.from(this.checkInQueue.values());
  }

  // Get check-in by ID
  getCheckIn(checkInId) {
    return this.checkInQueue.get(checkInId);
  }

  // Search check-ins
  searchCheckIns(criteria) {
    return Array.from(this.checkInQueue.values()).filter(checkIn => {
      if (criteria.patientId && checkIn.patientId !== criteria.patientId) {
        return false;
      }
      if (criteria.status && checkIn.status !== criteria.status) {
        return false;
      }
      if (criteria.priority && checkIn.priority !== criteria.priority) {
        return false;
      }
      return true;
    });
  }
}

// Export singleton instance
export const checkInService = new CheckInService();