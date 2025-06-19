export const validationRules = {
  email: {
    pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    message: 'Please enter a valid email address'
  },
  
  phone: {
    pattern: /^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/,
    message: 'Please enter a valid phone number (e.g., 555-123-4567)'
  },
  
  required: {
    validate: (value) => value && value.trim().length > 0,
    message: 'This field is required'
  },
  
  zipCode: {
    pattern: /^\d{5}(-\d{4})?$/,
    message: 'Please enter a valid ZIP code'
  },
  
  minLength: (min) => ({
    validate: (value) => !value || value.length >= min,
    message: `Must be at least ${min} characters`
  }),
  
  maxLength: (max) => ({
    validate: (value) => !value || value.length <= max,
    message: `Must be no more than ${max} characters`
  }),
  
  alphaOnly: {
    pattern: /^[a-zA-Z\s'-]+$/,
    message: 'Only letters, spaces, hyphens, and apostrophes are allowed'
  },
  
  numeric: {
    pattern: /^\d+(\.\d+)?$/,
    message: 'Must be a valid number'
  }
};

export const formatters = {
  phone: (value) => {
    const numbers = value.replace(/\D/g, '');
    if (numbers.length <= 3) return numbers;
    if (numbers.length <= 6) return `(${numbers.slice(0, 3)}) ${numbers.slice(3)}`;
    return `(${numbers.slice(0, 3)}) ${numbers.slice(3, 6)}-${numbers.slice(6, 10)}`;
  },
  
  zipCode: (value) => {
    const numbers = value.replace(/\D/g, '');
    if (numbers.length <= 5) return numbers;
    return `${numbers.slice(0, 5)}-${numbers.slice(5, 9)}`;
  },
  
  capitalize: (value) => {
    return value
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' ');
  }
};

export const validateField = (value, rules) => {
  const errors = [];
  
  if (!rules) return errors;
  
  rules.forEach(rule => {
    if (rule.pattern && value) {
      if (!rule.pattern.test(value)) {
        errors.push(rule.message);
      }
    } else if (rule.validate) {
      if (!rule.validate(value)) {
        errors.push(rule.message);
      }
    }
  });
  
  return errors;
};

export const validateForm = (formData, fieldRules) => {
  const errors = {};
  let isValid = true;
  
  Object.keys(fieldRules).forEach(field => {
    const fieldErrors = validateField(formData[field], fieldRules[field]);
    if (fieldErrors.length > 0) {
      errors[field] = fieldErrors[0];
      isValid = false;
    }
  });
  
  return { isValid, errors };
};