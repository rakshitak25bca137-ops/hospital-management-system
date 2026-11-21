import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import HospitalBot from './components/HospitalBot';
import DashboardView from './components/DashboardView';
import PatientManagementView from './components/PatientManagementView';
import AdmissionsView from './components/AdmissionsView';
import AppointmentsView from './components/AppointmentsView';
import ConsultationView from './components/ConsultationView';
import BillingView from './components/BillingView';
import MedicineStockView from './components/MedicineStockView';
import ReportsView from './components/ReportsView';
import DoctorDeptView from './components/DoctorDeptView';
import AuthModal from './components/AuthModal';

import {
  getStoredData,
  setStoredData,
  initializeStorage
} from './utils/storage';
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
} from './data/initialData';

export default function App() {
  // Ensure seed data in localStorage
  useEffect(() => {
    initializeStorage();
  }, []);

  // Main navigation & session state
  const [activeTab, setActiveTab] = useState('dashboard');
  const [currentUser, setCurrentUser] = useState(() => getStoredData('currentUser', INITIAL_USER));
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [isBotOpen, setIsBotOpen] = useState(false);
  const [globalSearch, setGlobalSearch] = useState('');

  // Persistent Collections
  const [patients, setPatients] = useState(() => getStoredData('patients', INITIAL_PATIENTS));
  const [beds, setBeds] = useState(() => getStoredData('beds', INITIAL_BEDS));
  const [medicines, setMedicines] = useState(() => getStoredData('medicines', INITIAL_MEDICINES));
  const [appointments, setAppointments] = useState(() => getStoredData('appointments', INITIAL_APPOINTMENTS));
  const [invoices, setInvoices] = useState(() => getStoredData('invoices', INITIAL_INVOICES));
  const [departments, setDepartments] = useState(() => getStoredData('departments', INITIAL_DEPARTMENTS));
  const [doctors, setDoctors] = useState(() => getStoredData('doctors', INITIAL_DOCTORS));
  const [notifications, setNotifications] = useState(() => getStoredData('notifications', INITIAL_NOTIFICATIONS));

  // Sync to localStorage
  useEffect(() => { setStoredData('patients', patients); }, [patients]);
  useEffect(() => { setStoredData('beds', beds); }, [beds]);
  useEffect(() => { setStoredData('medicines', medicines); }, [medicines]);
  useEffect(() => { setStoredData('appointments', appointments); }, [appointments]);
  useEffect(() => { setStoredData('invoices', invoices); }, [invoices]);
  useEffect(() => { setStoredData('departments', departments); }, [departments]);
  useEffect(() => { setStoredData('doctors', doctors); }, [doctors]);
  useEffect(() => { setStoredData('currentUser', currentUser); }, [currentUser]);

  // Role switching
  const handleChangeRole = (newRole) => {
    setCurrentUser((prev) => ({
      ...prev,
      role: newRole,
      name: newRole === 'Admin' ? 'Kyra' : newRole === 'Doctor' ? 'Dr. Arvind' : newRole
    }));
  };

  // Perform search across system
  const handlePerformSearch = (query) => {
    if (!query.trim()) return;
    setActiveTab('patients');
  };

  return (
    <div className="min-h-screen bg-[#f4f7fc] text-slate-800 flex font-sans antialiased selection:bg-blue-600 selection:text-white">
      {/* Left Sidebar (CareNova Navy Theme) */}
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        userRole={currentUser.role}
        onLogout={() => setShowAuthModal(true)}
        onOpenSettings={() => setActiveTab('doctors-dept')}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 min-h-screen">
        {/* Top Header */}
        <Header
          currentUser={currentUser}
          onChangeRole={handleChangeRole}
          searchQuery={globalSearch}
          setSearchQuery={setGlobalSearch}
          onPerformSearch={handlePerformSearch}
          notifications={notifications}
          onLogout={() => setShowAuthModal(true)}
        />

        {/* Dynamic Page Views */}
        <main className="flex-1 p-6 md:p-8 max-w-7xl w-full mx-auto">
          {/* 1. Dashboard (Exact replica of the UI image!) */}
          {activeTab === 'dashboard' && (
            <DashboardView
              onNavigate={(tab) => setActiveTab(tab)}
              onAdmitPatient={() => setActiveTab('admissions')}
              onGenerateBill={() => setActiveTab('billing')}
              patients={patients}
              medicines={medicines}
              beds={beds}
            />
          )}

          {/* 2. Patient Management (Registration & Search per SRS Section 4) */}
          {activeTab === 'patients' && (
            <PatientManagementView
              patients={patients}
              setPatients={setPatients}
              currentUser={currentUser}
              onAdmitPatient={() => setActiveTab('admissions')}
              onBookAppointment={() => setActiveTab('appointments')}
              onGenerateBill={() => setActiveTab('billing')}
            />
          )}

          {/* 3. Admissions & Bed Allotment */}
          {activeTab === 'admissions' && (
            <AdmissionsView
              beds={beds}
              setBeds={setBeds}
              patients={patients}
              setPatients={setPatients}
              currentUser={currentUser}
            />
          )}

          {/* 4. Appointments (SRS Section 3.4) */}
          {activeTab === 'appointments' && (
            <AppointmentsView
              appointments={appointments}
              setAppointments={setAppointments}
              patients={patients}
              doctors={doctors}
              departments={departments}
              currentUser={currentUser}
            />
          )}

          {/* 5. Consultation & EMR (SRS Section 3.5) */}
          {activeTab === 'consultation' && (
            <ConsultationView
              patients={patients}
              setPatients={setPatients}
              currentUser={currentUser}
              doctors={doctors}
            />
          )}

          {/* 6. Billing & Invoices (SRS Section 3.6) */}
          {activeTab === 'billing' && (
            <BillingView
              invoices={invoices}
              setInvoices={setInvoices}
              patients={patients}
              currentUser={currentUser}
            />
          )}

          {/* 7. Inventory & Medicine Stock */}
          {activeTab === 'inventory' && (
            <MedicineStockView
              medicines={medicines}
              setMedicines={setMedicines}
              currentUser={currentUser}
            />
          )}

          {/* 8. Reports & Sub-reports (Patient Status, Medical, Billing, Stock, Bed) */}
          {(activeTab === 'reports' ||
            activeTab === 'patient-status' ||
            activeTab === 'medical-reports' ||
            activeTab === 'billing-reports' ||
            activeTab === 'stock-reports' ||
            activeTab === 'bed-allotment') && (
            <ReportsView
              subType={activeTab === 'reports' ? 'all' : activeTab}
              patients={patients}
              invoices={invoices}
              medicines={medicines}
              beds={beds}
            />
          )}

          {/* 9. Doctors & Departments (Admin Management per FR-3) */}
          {activeTab === 'doctors-dept' && (
            <DoctorDeptView
              doctors={doctors}
              setDoctors={setDoctors}
              departments={departments}
              setDepartments={setDepartments}
              currentUser={currentUser}
            />
          )}
        </main>
      </div>

      {/* Interactive Floating Hospital Bot (Matching screenshot!) */}
      <HospitalBot
        isOpen={isBotOpen}
        setIsOpen={setIsBotOpen}
        patients={patients}
        medicines={medicines}
        beds={beds}
        invoices={invoices}
        onNavigate={(tab) => setActiveTab(tab)}
      />

      {/* Authentication & Role Switcher Modal (SRS FR-1) */}
      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        onLoginSuccess={(user) => {
          setCurrentUser(user);
          setShowAuthModal(false);
        }}
      />
    </div>
  );
}
