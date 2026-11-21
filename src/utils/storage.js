// Storage helper with fallback to initial data
import {
  INITIAL_PATIENTS,
  INITIAL_BEDS,
  INITIAL_MEDICINES,
  INITIAL_APPOINTMENTS,
  INITIAL_INVOICES,
  INITIAL_DEPARTMENTS,
  INITIAL_DOCTORS,
  INITIAL_USER,
  INITIAL_NOTIFICATIONS
} from '../data/initialData';

const PREFIX = 'carenova_hms_';

export const getStoredData = (key, fallback) => {
  try {
    const item = localStorage.getItem(PREFIX + key);
    return item ? JSON.parse(item) : fallback;
  } catch (e) {
    console.error(`Error reading ${key} from localStorage`, e);
    return fallback;
  }
};

export const setStoredData = (key, value) => {
  try {
    localStorage.setItem(PREFIX + key, JSON.stringify(value));
  } catch (e) {
    console.error(`Error saving ${key} to localStorage`, e);
  }
};

export const initializeStorage = () => {
  if (!localStorage.getItem(PREFIX + 'patients')) {
    setStoredData('patients', INITIAL_PATIENTS);
  }
  if (!localStorage.getItem(PREFIX + 'beds')) {
    setStoredData('beds', INITIAL_BEDS);
  }
  if (!localStorage.getItem(PREFIX + 'medicines')) {
    setStoredData('medicines', INITIAL_MEDICINES);
  }
  if (!localStorage.getItem(PREFIX + 'appointments')) {
    setStoredData('appointments', INITIAL_APPOINTMENTS);
  }
  if (!localStorage.getItem(PREFIX + 'invoices')) {
    setStoredData('invoices', INITIAL_INVOICES);
  }
  if (!localStorage.getItem(PREFIX + 'departments')) {
    setStoredData('departments', INITIAL_DEPARTMENTS);
  }
  if (!localStorage.getItem(PREFIX + 'doctors')) {
    setStoredData('doctors', INITIAL_DOCTORS);
  }
  if (!localStorage.getItem(PREFIX + 'currentUser')) {
    setStoredData('currentUser', INITIAL_USER);
  }
  if (!localStorage.getItem(PREFIX + 'notifications')) {
    setStoredData('notifications', INITIAL_NOTIFICATIONS);
  }
};
