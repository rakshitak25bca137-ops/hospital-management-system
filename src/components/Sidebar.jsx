import React, { useState } from 'react';
import {
  LayoutDashboard,
  Users,
  BedDouble,
  FileBarChart2,
  Package,
  CreditCard,
  Settings,
  LogOut,
  ChevronRight,
  ChevronDown,
  Calendar,
  Stethoscope,
  Building2
} from 'lucide-react';
import { CareNovaLogo, EcgPulseLine } from './HospitalImages';

export default function Sidebar({
  activeTab,
  setActiveTab,
  userRole,
  onLogout,
  onOpenSettings
}) {
  const [reportsOpen, setReportsOpen] = useState(true);
  const [inventoryOpen, setInventoryOpen] = useState(false);

  // Check role-based access for menu items according to SRS Section 3.1 & 5
  // Admin: full access
  // Receptionist: Dashboard, Patient Management, Admissions, Appointments, Billing
  // Doctor: Dashboard, Patient Management, Appointments, Consultation, Reports
  // Nurse: Dashboard, Patient Management, Admissions, Consultation
  // Billing Clerk: Dashboard, Patient Management, Billing, Reports

  const canAccess = (tab) => {
    if (userRole === 'Admin') return true;
    if (userRole === 'Receptionist') {
      return ['dashboard', 'patients', 'admissions', 'appointments', 'billing'].includes(tab);
    }
    if (userRole === 'Doctor') {
      return ['dashboard', 'patients', 'appointments', 'consultation', 'reports', 'patient-status', 'medical-reports'].includes(tab);
    }
    if (userRole === 'Nurse') {
      return ['dashboard', 'patients', 'admissions', 'consultation', 'bed-allotment'].includes(tab);
    }
    if (userRole === 'BillingClerk') {
      return ['dashboard', 'patients', 'billing', 'reports', 'billing-reports'].includes(tab);
    }
    return true;
  };

  return (
    <aside className="w-64 bg-[#0a152b] text-slate-300 flex flex-col shrink-0 min-h-screen border-r border-slate-800/60 select-none shadow-xl transition-all">
      {/* Brand Header */}
      <div className="p-5 pb-4 flex items-center gap-3 border-b border-slate-800/40">
        <CareNovaLogo size={42} />
        <div>
          <div className="text-xl font-bold tracking-tight text-white leading-tight flex items-center gap-1">
            Care<span className="text-blue-400">Nova</span>
          </div>
          <div className="text-xs font-semibold tracking-wider text-slate-400 uppercase">Hospital</div>
          <div className="text-[10px] text-blue-300/80 tracking-wide mt-0.5">Heal • Care • Live Better</div>
        </div>
      </div>

      {/* Navigation List */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto text-sm">
        {/* Dashboard */}
        <button
          onClick={() => setActiveTab('dashboard')}
          className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl font-medium transition-all duration-200 ${
            activeTab === 'dashboard'
              ? 'bg-gradient-to-r from-blue-600 to-blue-500 text-white shadow-lg shadow-blue-600/30 font-semibold'
              : 'text-slate-300 hover:bg-slate-800/60 hover:text-white'
          }`}
        >
          <LayoutDashboard className="w-5 h-5 shrink-0" />
          <span>Dashboard</span>
        </button>

        {/* Patient Management */}
        {canAccess('patients') && (
          <button
            onClick={() => setActiveTab('patients')}
            className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl font-medium transition-all ${
              activeTab === 'patients'
                ? 'bg-gradient-to-r from-blue-600 to-blue-500 text-white shadow-lg shadow-blue-600/30 font-semibold'
                : 'text-slate-300 hover:bg-slate-800/60 hover:text-white'
            }`}
          >
            <div className="flex items-center gap-3">
              <Users className="w-5 h-5 shrink-0" />
              <span>Patient Management</span>
            </div>
            <ChevronRight className="w-4 h-4 opacity-70" />
          </button>
        )}

        {/* Admissions */}
        {canAccess('admissions') && (
          <button
            onClick={() => setActiveTab('admissions')}
            className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl font-medium transition-all ${
              activeTab === 'admissions'
                ? 'bg-gradient-to-r from-blue-600 to-blue-500 text-white shadow-lg shadow-blue-600/30 font-semibold'
                : 'text-slate-300 hover:bg-slate-800/60 hover:text-white'
            }`}
          >
            <BedDouble className="w-5 h-5 shrink-0" />
            <span>Admissions</span>
          </button>
        )}

        {/* Appointments (SRS Feature) */}
        {canAccess('appointments') && (
          <button
            onClick={() => setActiveTab('appointments')}
            className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl font-medium transition-all ${
              activeTab === 'appointments'
                ? 'bg-gradient-to-r from-blue-600 to-blue-500 text-white shadow-lg shadow-blue-600/30 font-semibold'
                : 'text-slate-300 hover:bg-slate-800/60 hover:text-white'
            }`}
          >
            <Calendar className="w-5 h-5 shrink-0" />
            <span>Appointments</span>
          </button>
        )}

        {/* Consultation / EMR (SRS Feature) */}
        {canAccess('consultation') && (
          <button
            onClick={() => setActiveTab('consultation')}
            className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl font-medium transition-all ${
              activeTab === 'consultation'
                ? 'bg-gradient-to-r from-blue-600 to-blue-500 text-white shadow-lg shadow-blue-600/30 font-semibold'
                : 'text-slate-300 hover:bg-slate-800/60 hover:text-white'
            }`}
          >
            <Stethoscope className="w-5 h-5 shrink-0" />
            <span>Consultation & EMR</span>
          </button>
        )}

        {/* Reports with Submenu (Matching screenshot) */}
        {canAccess('reports') && (
          <div className="space-y-0.5">
            <button
              onClick={() => {
                setReportsOpen(!reportsOpen);
                setActiveTab('reports');
              }}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl font-medium transition-all ${
                activeTab.startsWith('report')
                  ? 'text-blue-400 bg-slate-800/50'
                  : 'text-slate-300 hover:bg-slate-800/60 hover:text-white'
              }`}
            >
              <div className="flex items-center gap-3">
                <FileBarChart2 className="w-5 h-5 shrink-0" />
                <span>Reports</span>
              </div>
              <ChevronDown
                className={`w-4 h-4 transition-transform duration-200 opacity-70 ${
                  reportsOpen ? 'rotate-180' : ''
                }`}
              />
            </button>

            {reportsOpen && (
              <div className="pl-9 pr-1 py-1 space-y-1 text-xs">
                <button
                  onClick={() => setActiveTab('patient-status')}
                  className={`w-full text-left py-1.5 px-3 rounded-lg transition-colors ${
                    activeTab === 'patient-status'
                      ? 'text-white bg-blue-600/40 font-medium'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
                  }`}
                >
                  Patient Status
                </button>
                <button
                  onClick={() => setActiveTab('medical-reports')}
                  className={`w-full text-left py-1.5 px-3 rounded-lg transition-colors ${
                    activeTab === 'medical-reports'
                      ? 'text-white bg-blue-600/40 font-medium'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
                  }`}
                >
                  Medical Reports
                </button>
                <button
                  onClick={() => setActiveTab('billing-reports')}
                  className={`w-full text-left py-1.5 px-3 rounded-lg transition-colors ${
                    activeTab === 'billing-reports'
                      ? 'text-white bg-blue-600/40 font-medium'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
                  }`}
                >
                  Billing Reports
                </button>
                <button
                  onClick={() => setActiveTab('stock-reports')}
                  className={`w-full text-left py-1.5 px-3 rounded-lg transition-colors ${
                    activeTab === 'stock-reports'
                      ? 'text-white bg-blue-600/40 font-medium'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
                  }`}
                >
                  Stock Reports
                </button>
                <button
                  onClick={() => setActiveTab('bed-allotment')}
                  className={`w-full text-left py-1.5 px-3 rounded-lg transition-colors ${
                    activeTab === 'bed-allotment'
                      ? 'text-white bg-blue-600/40 font-medium'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
                  }`}
                >
                  Bed Allotment
                </button>
              </div>
            )}
          </div>
        )}

        {/* Inventory */}
        <div className="space-y-0.5">
          <button
            onClick={() => {
              setInventoryOpen(!inventoryOpen);
              setActiveTab('inventory');
            }}
            className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl font-medium transition-all ${
              activeTab === 'inventory'
                ? 'bg-gradient-to-r from-blue-600 to-blue-500 text-white shadow-lg shadow-blue-600/30 font-semibold'
                : 'text-slate-300 hover:bg-slate-800/60 hover:text-white'
            }`}
          >
            <div className="flex items-center gap-3">
              <Package className="w-5 h-5 shrink-0" />
              <span>Inventory</span>
            </div>
            <ChevronDown
              className={`w-4 h-4 opacity-70 transition-transform ${
                inventoryOpen ? 'rotate-180' : ''
              }`}
            />
          </button>
        </div>

        {/* Billing */}
        {canAccess('billing') && (
          <button
            onClick={() => setActiveTab('billing')}
            className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl font-medium transition-all ${
              activeTab === 'billing'
                ? 'bg-gradient-to-r from-blue-600 to-blue-500 text-white shadow-lg shadow-blue-600/30 font-semibold'
                : 'text-slate-300 hover:bg-slate-800/60 hover:text-white'
            }`}
          >
            <CreditCard className="w-5 h-5 shrink-0" />
            <span>Billing</span>
          </button>
        )}

        {/* Doctors & Depts (Admin only per SRS) */}
        {userRole === 'Admin' && (
          <button
            onClick={() => setActiveTab('doctors-dept')}
            className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl font-medium transition-all ${
              activeTab === 'doctors-dept'
                ? 'bg-gradient-to-r from-blue-600 to-blue-500 text-white shadow-lg shadow-blue-600/30 font-semibold'
                : 'text-slate-300 hover:bg-slate-800/60 hover:text-white'
            }`}
          >
            <Building2 className="w-5 h-5 shrink-0" />
            <span>Doctors & Depts</span>
          </button>
        )}

        {/* Settings */}
        <button
          onClick={onOpenSettings}
          className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl font-medium transition-all text-slate-300 hover:bg-slate-800/60 hover:text-white`}
        >
          <Settings className="w-5 h-5 shrink-0" />
          <span>Settings</span>
        </button>

        {/* Logout */}
        <button
          onClick={onLogout}
          className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl font-medium text-slate-300 hover:bg-rose-500/20 hover:text-rose-300 transition-all"
        >
          <LogOut className="w-5 h-5 shrink-0" />
          <span>Logout</span>
        </button>
      </nav>

      {/* Bottom Health Priority Card (Exact replica from the UI image) */}
      <div className="p-3 m-3 rounded-2xl bg-gradient-to-b from-[#13274f] to-[#0c1a36] border border-blue-500/20 shadow-lg relative overflow-hidden group">
        <EcgPulseLine className="w-full h-5 mb-1.5" />
        <h4 className="text-white text-xs font-semibold leading-tight mb-2 tracking-wide">
          Your Health,<br />Our Priority
        </h4>
        <div className="h-16 w-full rounded-xl overflow-hidden relative border border-blue-400/20 shadow-inner">
          <img
            src="https://images.unsplash.com/photo-1587351021759-3e566b6af7cc?auto=format&fit=crop&q=80&w=400"
            alt="CareNova Building"
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
          <div className="absolute inset-0 bg-blue-900/30 mix-blend-overlay" />
        </div>
      </div>
    </aside>
  );
}
