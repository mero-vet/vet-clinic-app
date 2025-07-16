import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

const usePatientStore = create(
  devtools(
    (set, get) => ({
      patients: [],
      selectedPatientId: null,
      patientRelationships: new Map(),
      temporalData: new Map(),

      addPatient: (patient) =>
        set((state) => ({
          patients: [...state.patients, patient],
        })),

      updatePatient: (patientId, updates) =>
        set((state) => ({
          patients: state.patients.map((patient) =>
            patient.id === patientId ? { ...patient, ...updates } : patient
          ),
        })),

      deletePatient: (patientId) =>
        set((state) => ({
          patients: state.patients.filter((patient) => patient.id !== patientId),
          selectedPatientId:
            state.selectedPatientId === patientId ? null : state.selectedPatientId,
        })),

      selectPatient: (patientId) =>
        set({ selectedPatientId: patientId }),

      getSelectedPatient: () => {
        const state = get();
        return state.patients.find((p) => p.id === state.selectedPatientId);
      },

      addPatientRelationship: (patientId, relatedPatientId, relationshipType) =>
        set((state) => {
          const newRelationships = new Map(state.patientRelationships);
          const relationships = newRelationships.get(patientId) || [];
          relationships.push({ relatedPatientId, relationshipType });
          newRelationships.set(patientId, relationships);
          return { patientRelationships: newRelationships };
        }),

      addTemporalData: (patientId, dataType, dataPoint) =>
        set((state) => {
          const newTemporalData = new Map(state.temporalData);
          const patientData = newTemporalData.get(patientId) || {};
          const typeData = patientData[dataType] || [];
          typeData.push({
            ...dataPoint,
            timestamp: new Date().toISOString(),
          });
          patientData[dataType] = typeData;
          newTemporalData.set(patientId, patientData);
          return { temporalData: newTemporalData };
        }),

      getPatientHistory: (patientId, dataType) => {
        const state = get();
        const patientData = state.temporalData.get(patientId);
        return patientData ? patientData[dataType] || [] : [];
      },

      bulkImportPatients: (patients) =>
        set({ patients }),

      clearAllPatients: () =>
        set({
          patients: [],
          selectedPatientId: null,
          patientRelationships: new Map(),
          temporalData: new Map(),
        }),
    }),
    {
      name: 'PatientStore',
    }
  )
);

export default usePatientStore;