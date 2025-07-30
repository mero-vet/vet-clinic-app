import { create } from 'zustand';
import { sampleReminders, sampleAppointments, sampleInvoices } from '../data/sampleData';

/**
 * Global application store – dashboard level data.
 */
export const useAppStore = create(set => ({
  reminders: sampleReminders,
  appointments: sampleAppointments,
  invoices: sampleInvoices,
  // Extend with setters or async actions as needed
})); 