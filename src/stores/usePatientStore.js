import { create } from 'zustand';
import { samplePatients } from '../data/sampleData';

export const usePatientStore = create((set, get) => ({
  patients: samplePatients,
  current: null,
  recentPatients: samplePatients.slice(0, 3), // Initialize with first 3 patients
  
  setCurrent: id => set({ current: id }),
  
  addToRecent: (patient) => set(state => {
    const existing = state.recentPatients.findIndex(p => p.id === patient.id);
    let newRecent = [...state.recentPatients];
    
    if (existing !== -1) {
      // Move to front
      newRecent.splice(existing, 1);
    }
    
    newRecent.unshift(patient);
    
    // Keep only last 6
    if (newRecent.length > 6) {
      newRecent = newRecent.slice(0, 6);
    }
    
    return { recentPatients: newRecent };
  }),
})); 