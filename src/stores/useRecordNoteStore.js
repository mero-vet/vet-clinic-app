import { create } from 'zustand';

const initialDraft = {
  date: new Date().toISOString(),
  author: 'Dr. Smith',
  template: '',
  title: '',
  body: '',
  charges: [],
};

export const useRecordNoteStore = create(set => ({
  draft: initialDraft,
  dirty: false,
  setField: (k, v) => set(s => ({ draft: { ...s.draft, [k]: v }, dirty: true })),
  save: () => {
    // In a real app, persist somewhere; we just reset dirty.
    set(s => ({ dirty: false }));
    return Date.now();
  },
  postCharges: () => set(s => ({ draft: { ...s.draft, postedAt: Date.now() } })),
})); 