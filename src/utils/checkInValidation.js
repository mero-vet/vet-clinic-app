// Check-In Validation Utilities

export const validateCheckInData = (checkInData) => {
  const errors = {};

  // Required fields validation
  if (!checkInData.patientId) {
    errors.patientId = 'Patient selection is required';
  }

  if (!checkInData.clientId) {
    errors.clientId = 'Client information is required';
  }

  if (!checkInData.reasonForVisit || checkInData.reasonForVisit.trim() === '') {
    errors.reasonForVisit = 'Reason for visit is required';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};

export const validateWeight = (weight, unit = 'lbs') => {
  const weightNum = parseFloat(weight);
  
  if (isNaN(weightNum) || weightNum <= 0) {
    return { isValid: false, error: 'Please enter a valid weight' };
  }

  // Convert to lbs for validation if needed
  const weightInLbs = unit === 'kg' ? weightNum * 2.20462 : weightNum;

  // Reasonable weight ranges for pets (in lbs)
  if (weightInLbs < 0.5) {
    return { isValid: false, error: 'Weight seems too low. Please verify.' };
  }

  if (weightInLbs > 300) {
    return { isValid: false, error: 'Weight seems too high. Please verify.' };
  }

  return { isValid: true };
};

export const validateVitals = (vitals) => {
  const errors = {};

  // Temperature validation (normal range: 99.5-102.5°F for dogs/cats)
  if (vitals.temperature) {
    const temp = parseFloat(vitals.temperature);
    if (isNaN(temp)) {
      errors.temperature = 'Invalid temperature value';
    } else if (temp < 95 || temp > 106) {
      errors.temperature = 'Temperature out of reasonable range';
    }
  }

  // Pulse validation (normal: 60-140 bpm for dogs, 140-220 for cats)
  if (vitals.pulse) {
    const pulse = parseInt(vitals.pulse);
    if (isNaN(pulse)) {
      errors.pulse = 'Invalid pulse value';
    } else if (pulse < 40 || pulse > 300) {
      errors.pulse = 'Pulse out of reasonable range';
    }
  }

  // Respiration validation (normal: 10-30 rpm for dogs/cats)
  if (vitals.respiration) {
    const resp = parseInt(vitals.respiration);
    if (isNaN(resp)) {
      errors.respiration = 'Invalid respiration value';
    } else if (resp < 5 || resp > 100) {
      errors.respiration = 'Respiration out of reasonable range';
    }
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};

export const validateInsurance = (insuranceData) => {
  const errors = {};

  if (insuranceData.hasInsurance) {
    if (!insuranceData.provider) {
      errors.provider = 'Insurance provider is required';
    }

    if (!insuranceData.policyNumber || insuranceData.policyNumber.trim() === '') {
      errors.policyNumber = 'Policy number is required';
    }

    if (insuranceData.copayAmount) {
      const copay = parseFloat(insuranceData.copayAmount.replace(/[^0-9.-]/g, ''));
      if (isNaN(copay) || copay < 0) {
        errors.copayAmount = 'Invalid copay amount';
      }
    }
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};

export const calculateWeightChange = (currentWeight, previousWeight) => {
  if (!previousWeight || previousWeight === 0) {
    return null;
  }

  const change = currentWeight - previousWeight;
  const percentageChange = (change / previousWeight) * 100;

  return {
    absoluteChange: Math.abs(change),
    percentageChange: percentageChange,
    direction: change > 0 ? 'gain' : 'loss',
    isSignificant: Math.abs(percentageChange) > 10,
    isCritical: Math.abs(percentageChange) > 20
  };
};

export const determineTriagePriority = (symptoms, vitals) => {
  // Emergency symptoms
  const emergencySymptoms = [
    'difficulty-breathing',
    'seizures',
    'bleeding',
    'collapse',
    'toxin-ingestion',
    'urinary-blockage'
  ];

  // Check for emergency symptoms
  const hasEmergency = symptoms.some(symptom => 
    emergencySymptoms.includes(symptom.id)
  );

  if (hasEmergency) {
    return 'emergency';
  }

  // Check vital signs for critical values
  if (vitals.temperature) {
    const temp = parseFloat(vitals.temperature);
    if (temp < 98 || temp > 104) {
      return 'urgent';
    }
  }

  if (vitals.pulse) {
    const pulse = parseInt(vitals.pulse);
    if (pulse < 50 || pulse > 200) {
      return 'urgent';
    }
  }

  if (vitals.respiration) {
    const resp = parseInt(vitals.respiration);
    if (resp < 10 || resp > 40) {
      return 'urgent';
    }
  }

  // Check for multiple moderate symptoms
  const moderateSymptoms = symptoms.filter(s => s.severity === 'moderate');
  if (moderateSymptoms.length >= 2) {
    return 'urgent';
  }

  if (moderateSymptoms.length === 1) {
    return 'normal';
  }

  return 'routine';
};

export const calculateEstimatedWaitTime = (queuePosition, avgServiceTime = 15) => {
  // Base calculation on queue position and average service time
  const baseWaitTime = queuePosition * avgServiceTime;
  
  // Add some variability (±20%)
  const variability = baseWaitTime * 0.2;
  const minWait = Math.max(5, baseWaitTime - variability);
  const maxWait = baseWaitTime + variability;
  
  return {
    estimated: Math.round(baseWaitTime),
    range: {
      min: Math.round(minWait),
      max: Math.round(maxWait)
    }
  };
};

export const validateRequiredConsents = (consents, visitType) => {
  const requiredConsents = ['treatment', 'emergency'];
  
  // Add visit-specific required consents
  if (visitType === 'surgery') {
    requiredConsents.push('surgery', 'anesthesia');
  } else if (visitType === 'dental') {
    requiredConsents.push('anesthesia');
  }
  
  const missingConsents = requiredConsents.filter(consent => 
    !consents[consent]
  );
  
  return {
    isValid: missingConsents.length === 0,
    missingConsents
  };
};

export const formatCheckInTime = (date) => {
  const now = new Date();
  const checkInDate = new Date(date);
  const diffInMinutes = Math.floor((now - checkInDate) / 60000);
  
  if (diffInMinutes < 1) {
    return 'Just now';
  } else if (diffInMinutes < 60) {
    return `${diffInMinutes}m ago`;
  } else if (diffInMinutes < 1440) {
    const hours = Math.floor(diffInMinutes / 60);
    return `${hours}h ago`;
  } else {
    return checkInDate.toLocaleDateString();
  }
};