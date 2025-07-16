const FEATURE_FLAGS = {
  USE_SPLIT_PATIENT_CONTEXT: process.env.NODE_ENV === 'development' ? false : false
};

export const isFeatureEnabled = (featureName) => {
  return FEATURE_FLAGS[featureName] || false;
};

export const enableFeature = (featureName) => {
  FEATURE_FLAGS[featureName] = true;
};

export const disableFeature = (featureName) => {
  FEATURE_FLAGS[featureName] = false;
};