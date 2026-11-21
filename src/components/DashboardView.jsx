import React from 'react';
import {
  Users,
  BedDouble,
  FileText,
  AlertTriangle,
  Activity,
  ArrowRight,
  TrendingUp,
  TrendingDown,
  Pill,
  Sparkles,
  CreditCard,
  FileCheck,
  Package,
  CheckCircle2,
  Receipt,
  UserPlus
} from 'lucide-react';
import { HospitalBuildingGraphic, StethoscopeGraphic } from './HospitalImages';

export default function DashboardView({
  onNavigate,
  onAdmitPatient,
  onGenerateBill,
  patients = [],
  medicines = [],
  beds = []
}) {
  return (
    <div className="space-y-6 pb-12">
      {/* Top Row: Hero Banner & Patient Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        {/* Welcome Hero Banner (Matching Screenshot) */}
        <div className="lg:col-span-7 bg-gradient-to-r from-[#dbebfa] via-[#e8f1fc] to-[#f4f8fe] rounded-3xl p-6 sm:p-7 border border-blue-100/80 shadow-sm flex flex-col justify-between relative overflow-hidden group">
          <div className="relative z-10 max-w-md">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0d234a] tracking-tight leading-tight">
              Welcome to <br />
              <span className="text-blue-600">CareNova Hospital</span>
            </h1>
            <p className="text-slate-600 text-xs sm:text-sm mt-2 font-medium">
              Compassionate Care. Advanced Treatment.
            </p>
            <div className="mt-5">
              <button
                onClick={() => onNavigate('patients')}
                className="inline-flex items-center gap-2 bg-[#0d2146] hover:bg-[#122c5d] text-white text-xs font-semibold px-5 py-2.5 rounded-full shadow-md transition-all duration-200 transform hover:scale-105 active:scale-95"
              >
                <span>View Details</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Hospital Building Graphic on Right (Matching Screenshot) */}
          <div className="absolute right-0 bottom-0 top-0 w-2/5 sm:w-1/2 flex items-center justify-end pointer-events-none pr-3 py-3">
            <div className="h-full w-full max-w-[280px] rounded-2xl overflow-hidden shadow-lg border-2 border-white/80 transform rotate-1 group-hover:rotate-0 transition-transform duration-500">
              <img
                src="https://images.unsplash.com/photo-1587351021759-3e566b6af7cc?auto=format&fit=crop&q=80&w=800"
                alt="CareNova Hospital Exterior"
                className="w-full h-full object-cover object-center"
              />
              <div className="absolute top-2 left-2 bg-blue-600/90 text-white text-[9px] font-bold px-2 py-0.5 rounded-md shadow-xs">
                + HOSPITAL
              </div>
            </div>
          </div>
        </div>

        {/* Patient Overview Card (Matching Screenshot with 4 colorful stat cards) */}
        <div className="lg:col-span-5 bg-white rounded-3xl p-6 border border-slate-100 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-bold text-slate-800 tracking-tight">Patient Overview</h2>
            <button
              onClick={() => onNavigate('patients')}
              className="text-xs font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1 transition-colors"
            >
              <span>View All</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>

          {/* 4 Stat Cards in a row */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {/* Total Patients - Blue */}
            <div className="bg-[#eaf2ff] rounded-2xl p-3.5 flex flex-col items-center justify-center text-center transition-transform hover:-translate-y-0.5">
              <div className="w-9 h-9 rounded-full bg-blue-500/15 flex items-center justify-center mb-2">
                <Users className="w-5 h-5 text-blue-600" />
              </div>
              <div className="text-xl font-extrabold text-slate-800">124</div>
              <div className="text-[11px] font-medium text-slate-500 mt-0.5">Total Patients</div>
            </div>

            {/* Admitted - Green */}
            <div className="bg-[#e9f8f0] rounded-2xl p-3.5 flex flex-col items-center justify-center text-center transition-transform hover:-translate-y-0.5">
              <div className="w-9 h-9 rounded-full bg-emerald-500/15 flex items-center justify-center mb-2">
                <BedDouble className="w-5 h-5 text-emerald-600" />
              </div>
              <div className="text-xl font-extrabold text-slate-800">78</div>
              <div className="text-[11px] font-medium text-slate-500 mt-0.5">Admitted</div>
            </div>

            {/* Discharged - Purple */}
            <div className="bg-[#f4ebff] rounded-2xl p-3.5 flex flex-col items-center justify-center text-center transition-transform hover:-translate-y-0.5">
              <div className="w-9 h-9 rounded-full bg-purple-500/15 flex items-center justify-center mb-2">
                <FileText className="w-5 h-5 text-purple-600" />
              </div>
              <div className="text-xl font-extrabold text-slate-800">46</div>
              <div className="text-[11px] font-medium text-slate-500 mt-0.5">Discharged</div>
            </div>

            {/* Critical - Red / Coral */}
            <div className="bg-[#feebee] rounded-2xl p-3.5 flex flex-col items-center justify-center text-center transition-transform hover:-translate-y-0.5">
              <div className="w-9 h-9 rounded-full bg-rose-500/15 flex items-center justify-center mb-2">
                <AlertTriangle className="w-5 h-5 text-rose-600" />
              </div>
              <div className="text-xl font-extrabold text-slate-800">2</div>
              <div className="text-[11px] font-medium text-slate-500 mt-0.5">Critical</div>
            </div>
          </div>
        </div>
      </div>

      {/* Second Row: Patient Status, Recent Admissions, Reports Summary */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Card 1: Patient Status Donut Chart (Matching Screenshot) */}
        <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Activity className="w-4 h-4 text-blue-500" />
              <h3 className="font-bold text-slate-800 text-sm">Patient Status</h3>
            </div>
            <button
              onClick={() => onNavigate('patient-status')}
              className="text-xs font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1"
            >
              <span>View Details</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>

          <div className="flex items-center justify-between gap-4 py-2">
            {/* Donut Chart */}
            <div className="relative w-36 h-36 flex items-center justify-center shrink-0">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                {/* Background Ring */}
                <circle cx="50" cy="50" r="38" stroke="#f1f5f9" strokeWidth="11" fill="none" />
                {/* Green Segment (Stable 55%) */}
                <circle
                  cx="50"
                  cy="50"
                  r="38"
                  stroke="#10b981"
                  strokeWidth="11"
                  fill="none"
                  strokeDasharray="238.76"
                  strokeDashoffset="107.44"
                  strokeLinecap="round"
                />
                {/* Orange Segment (Under Observation 27%) */}
                <circle
                  cx="50"
                  cy="50"
                  r="38"
                  stroke="#f59e0b"
                  strokeWidth="11"
                  fill="none"
                  strokeDasharray="238.76"
                  strokeDashoffset="174.29"
                  strokeLinecap="round"
                  className="transform origin-center rotate-[198deg]"
                />
                {/* Red Segment (Critical 11%) */}
                <circle
                  cx="50"
                  cy="50"
                  r="38"
                  stroke="#ef4444"
                  strokeWidth="11"
                  fill="none"
                  strokeDasharray="238.76"
                  strokeDashoffset="212.5"
                  strokeLinecap="round"
                  className="transform origin-center rotate-[295deg]"
                />
                {/* Grey Segment (Others 7%) */}
                <circle
                  cx="50"
                  cy="50"
                  r="38"
                  stroke="#94a3b8"
                  strokeWidth="11"
                  fill="none"
                  strokeDasharray="238.76"
                  strokeDashoffset="222.04"
                  strokeLinecap="round"
                  className="transform origin-center rotate-[335deg]"
                />
              </svg>
              {/* Inner Center Text */}
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                <span className="text-2xl font-black text-slate-800 leading-none">124</span>
                <span className="text-[10px] text-slate-400 font-medium mt-0.5">Patients</span>
              </div>
            </div>

            {/* Legend on right */}
            <div className="space-y-2 text-xs flex-1">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                  <span className="text-slate-600 font-medium">Stable</span>
                </div>
                <span className="font-bold text-slate-800">68 <span className="text-slate-400 font-normal text-[11px]">(55%)</span></span>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                  <span className="text-slate-600 font-medium">Under Observation</span>
                </div>
                <span className="font-bold text-slate-800">34 <span className="text-slate-400 font-normal text-[11px]">(27%)</span></span>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
                  <span className="text-slate-600 font-medium">Critical</span>
                </div>
                <span className="font-bold text-slate-800">14 <span className="text-slate-400 font-normal text-[11px]">(11%)</span></span>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-slate-400" />
                  <span className="text-slate-600 font-medium">Others</span>
                </div>
                <span className="font-bold text-slate-800">8 <span className="text-slate-400 font-normal text-[11px]">(7%)</span></span>
              </div>
            </div>
          </div>
        </div>

        {/* Card 2: Recent Admissions (Matching Screenshot) */}
        <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <BedDouble className="w-4 h-4 text-blue-500" />
              <h3 className="font-bold text-slate-800 text-sm">Recent Admissions</h3>
            </div>
            <button
              onClick={() => onNavigate('admissions')}
              className="text-xs font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1"
            >
              <span>View All</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>

          <div className="space-y-3.5">
            {/* Ananya S */}
            <div className="flex items-center justify-between p-2 rounded-2xl hover:bg-slate-50 transition-colors">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-xs shadow-xs">
                  AS
                </div>
                <div>
                  <div className="font-bold text-slate-800 text-xs">Ananya S</div>
                  <div className="text-[11px] text-slate-400">Room 101 • 2 hrs ago</div>
                </div>
              </div>
              <span className="px-2.5 py-1 bg-emerald-50 text-emerald-700 border border-emerald-200/80 rounded-full text-[11px] font-semibold">
                Admitted
              </span>
            </div>

            {/* Vignesh R */}
            <div className="flex items-center justify-between p-2 rounded-2xl hover:bg-slate-50 transition-colors">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center font-bold text-xs shadow-xs">
                  VR
                </div>
                <div>
                  <div className="font-bold text-slate-800 text-xs">Vignesh R</div>
                  <div className="text-[11px] text-slate-400">Room 205 • 3 hrs ago</div>
                </div>
              </div>
              <span className="px-2.5 py-1 bg-emerald-50 text-emerald-700 border border-emerald-200/80 rounded-full text-[11px] font-semibold">
                Admitted
              </span>
            </div>

            {/* Priya M */}
            <div className="flex items-center justify-between p-2 rounded-2xl hover:bg-slate-50 transition-colors">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center font-bold text-xs shadow-xs">
                  PM
                </div>
                <div>
                  <div className="font-bold text-slate-800 text-xs">Priya M</div>
                  <div className="text-[11px] text-slate-400">Room 308 • 4 hrs ago</div>
                </div>
              </div>
              <span className="px-2.5 py-1 bg-emerald-50 text-emerald-700 border border-emerald-200/80 rounded-full text-[11px] font-semibold">
                Admitted
              </span>
            </div>
          </div>
        </div>

        {/* Card 3: Reports Summary (Matching Screenshot) */}
        <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <FileCheck className="w-4 h-4 text-blue-500" />
              <h3 className="font-bold text-slate-800 text-sm">Reports Summary</h3>
            </div>
            <button
              onClick={() => onNavigate('reports')}
              className="text-xs font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1"
            >
              <span>View All</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>

          <div className="space-y-3">
            {/* Medical Reports */}
            <div
              onClick={() => onNavigate('medical-reports')}
              className="flex items-center justify-between p-2.5 rounded-2xl bg-slate-50/60 hover:bg-blue-50/50 cursor-pointer transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center">
                  <FileText className="w-4 h-4" />
                </div>
                <span className="text-xs font-semibold text-slate-800">Medical Reports</span>
              </div>
              <span className="px-2.5 py-0.5 bg-blue-100 text-blue-700 font-semibold text-[11px] rounded-full">
                +12 New
              </span>
            </div>

            {/* Billing Reports */}
            <div
              onClick={() => onNavigate('billing-reports')}
              className="flex items-center justify-between p-2.5 rounded-2xl bg-slate-50/60 hover:bg-purple-50/50 cursor-pointer transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-purple-100 text-purple-600 flex items-center justify-center font-bold text-xs">
                  ₹
                </div>
                <span className="text-xs font-semibold text-slate-800">Billing Reports</span>
              </div>
              <span className="px-2.5 py-0.5 bg-purple-100 text-purple-700 font-semibold text-[11px] rounded-full">
                +5 New
              </span>
            </div>

            {/* Stock Reports */}
            <div
              onClick={() => onNavigate('stock-reports')}
              className="flex items-center justify-between p-2.5 rounded-2xl bg-slate-50/60 hover:bg-emerald-50/50 cursor-pointer transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center">
                  <Package className="w-4 h-4" />
                </div>
                <span className="text-xs font-semibold text-slate-800">Stock Reports</span>
              </div>
              <span className="px-2.5 py-0.5 bg-emerald-100 text-emerald-700 font-semibold text-[11px] rounded-full">
                Updated
              </span>
            </div>

            {/* Bed Allotment */}
            <div
              onClick={() => onNavigate('bed-allotment')}
              className="flex items-center justify-between p-2.5 rounded-2xl bg-slate-50/60 hover:bg-emerald-50/50 cursor-pointer transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center">
                  <BedDouble className="w-4 h-4" />
                </div>
                <span className="text-xs font-semibold text-slate-800">Bed Allotment</span>
              </div>
              <span className="px-2.5 py-0.5 bg-emerald-100 text-emerald-700 font-semibold text-[11px] rounded-full">
                Updated
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Third Row: Medicine Stock, Bed Availability, Billing Details */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Card 1: Medicine Stock (Matching Screenshot) */}
        <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Pill className="w-4 h-4 text-blue-500" />
              <h3 className="font-bold text-slate-800 text-sm">Medicine Stock</h3>
            </div>
            <button
              onClick={() => onNavigate('inventory')}
              className="text-xs font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1"
            >
              <span>View Inventory</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>

          <div className="grid grid-cols-12 gap-3 items-center">
            {/* Left 4 Progress Bars */}
            <div className="col-span-8 space-y-3 text-xs">
              {/* Paracetamol */}
              <div>
                <div className="flex items-center justify-between text-[11px] font-semibold text-slate-700 mb-1">
                  <span>Paracetamol</span>
                  <span className="text-slate-500">1200 units</span>
                </div>
                <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full bg-emerald-500 rounded-full" style={{ width: '80%' }} />
                </div>
              </div>

              {/* Amoxicillin */}
              <div>
                <div className="flex items-center justify-between text-[11px] font-semibold text-slate-700 mb-1">
                  <span>Amoxicillin</span>
                  <span className="text-slate-500">850 units</span>
                </div>
                <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full bg-blue-500 rounded-full" style={{ width: '70%' }} />
                </div>
              </div>

              {/* Ibuprofen */}
              <div>
                <div className="flex items-center justify-between text-[11px] font-semibold text-slate-700 mb-1">
                  <span>Ibuprofen</span>
                  <span className="text-slate-500">640 units</span>
                </div>
                <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full bg-amber-500 rounded-full" style={{ width: '64%' }} />
                </div>
              </div>

              {/* ORS */}
              <div>
                <div className="flex items-center justify-between text-[11px] font-semibold text-slate-700 mb-1">
                  <span>ORS</span>
                  <span className="text-slate-500">1000 units</span>
                </div>
                <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full bg-purple-500 rounded-full" style={{ width: '83%' }} />
                </div>
              </div>
            </div>

            {/* Right Mini Card: Stock Healthy (Matching Screenshot) */}
            <div className="col-span-4 bg-blue-50/70 border border-blue-100 rounded-2xl p-3 flex flex-col items-center justify-center text-center">
              <div className="w-10 h-10 rounded-xl bg-blue-500/15 flex items-center justify-center text-blue-600 mb-1.5">
                <Pill className="w-5 h-5" />
              </div>
              <div className="text-xs font-bold text-slate-800 leading-tight">Stock</div>
              <div className="text-[11px] font-bold text-emerald-600 flex items-center gap-1 mt-0.5">
                <span>Healthy</span>
                <CheckCircle2 className="w-3.5 h-3.5" />
              </div>
            </div>
          </div>
        </div>

        {/* Card 2: Bed Availability (Matching Screenshot) */}
        <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <BedDouble className="w-4 h-4 text-blue-500" />
              <h3 className="font-bold text-slate-800 text-sm">Bed Availability</h3>
            </div>
            <button
              onClick={() => onNavigate('admissions')}
              className="text-xs font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1"
            >
              <span>View Details</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>

          <div className="flex items-center justify-between gap-4">
            {/* Radial Percentage Gauge: 85% Available */}
            <div className="relative w-28 h-28 flex items-center justify-center shrink-0">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="40" stroke="#f1f5f9" strokeWidth="10" fill="none" />
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  stroke="#10b981"
                  strokeWidth="10"
                  fill="none"
                  strokeDasharray="251.2"
                  strokeDashoffset="37.68"
                  strokeLinecap="round"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                <span className="text-xl font-black text-slate-800 leading-none">85%</span>
                <span className="text-[10px] text-slate-500 font-semibold mt-0.5">Available</span>
              </div>
            </div>

            {/* Legend */}
            <div className="space-y-1.5 text-xs flex-1">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                  <span className="text-slate-600 font-medium">Available</span>
                </div>
                <span className="font-bold text-slate-800">68</span>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-blue-600" />
                  <span className="text-slate-600 font-medium">Occupied</span>
                </div>
                <span className="font-bold text-slate-800">114</span>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                  <span className="text-slate-600 font-medium">Reserved</span>
                </div>
                <span className="font-bold text-slate-800">18</span>
              </div>
            </div>
          </div>

          {/* Hospital Bed Illustration Graphic (Matching Screenshot) */}
          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-center">
            <svg className="w-32 h-10 text-blue-500" viewBox="0 0 160 50" fill="none">
              <path d="M10 40H150" stroke="#3b82f6" strokeWidth="4" strokeLinecap="round" />
              <path d="M20 40V15C20 12 23 10 26 10H35V40" stroke="#3b82f6" strokeWidth="3" />
              <path d="M35 25H140C143 25 145 27 145 30V40" stroke="#3b82f6" strokeWidth="3" />
              <circle cx="30" cy="43" r="3" fill="#1e3a8a" />
              <circle cx="140" cy="43" r="3" fill="#1e3a8a" />
              <rect x="42" y="16" width="24" height="9" rx="3" fill="#93c5fd" />
              <rect x="70" y="20" width="70" height="5" rx="2" fill="#bfdbfe" />
            </svg>
          </div>
        </div>

        {/* Card 3: Billing Details (Matching Screenshot) */}
        <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <CreditCard className="w-4 h-4 text-blue-500" />
              <h3 className="font-bold text-slate-800 text-sm">Billing Details</h3>
            </div>
            <button
              onClick={() => onNavigate('billing')}
              className="text-xs font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1"
            >
              <span>View All</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>

          <div className="space-y-4">
            {/* Total Revenue */}
            <div className="flex items-center justify-between">
              <div>
                <div className="text-[11px] font-medium text-slate-500">Total Revenue</div>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className="text-xl font-black text-slate-800 tracking-tight">₹ 2,48,750</span>
                  <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700 text-[10px] font-bold flex items-center gap-0.5">
                    <TrendingUp className="w-3 h-3" />
                    12%
                  </span>
                </div>
              </div>
              {/* Mini Blue Sparkline */}
              <div className="w-20 h-8 flex items-center">
                <svg className="w-full h-full text-blue-500" viewBox="0 0 100 40">
                  <path
                    d="M5 30 Q 30 10, 50 25 T 95 10"
                    fill="none"
                    stroke="#3b82f6"
                    strokeWidth="3"
                    strokeLinecap="round"
                  />
                </svg>
              </div>
            </div>

            {/* Pending Bills */}
            <div className="flex items-center justify-between">
              <div>
                <div className="text-[11px] font-medium text-slate-500">Pending Bills</div>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className="text-xl font-black text-slate-800 tracking-tight">₹ 62,320</span>
                  <span className="px-2 py-0.5 rounded-full bg-rose-100 text-rose-700 text-[10px] font-bold flex items-center gap-0.5">
                    <TrendingUp className="w-3 h-3" />
                    5%
                  </span>
                </div>
              </div>
              {/* Mini Red Sparkline */}
              <div className="w-20 h-8 flex items-center">
                <svg className="w-full h-full text-rose-500" viewBox="0 0 100 40">
                  <path
                    d="M5 25 Q 30 35, 60 15 T 95 20"
                    fill="none"
                    stroke="#ef4444"
                    strokeWidth="3"
                    strokeLinecap="round"
                  />
                </svg>
              </div>
            </div>

            {/* View Billing Report Button (Matching Screenshot) */}
            <div className="pt-2">
              <button
                onClick={() => onNavigate('billing')}
                className="w-full py-2.5 px-4 bg-[#0d2146] hover:bg-[#122c5d] text-white text-xs font-semibold rounded-2xl flex items-center justify-center gap-2 shadow-sm transition-all"
              >
                <span>View Billing Report</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Fourth Row: Quick Actions & Stethoscope Inspiration Banner (Matching Screenshot) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
        {/* Quick Actions (5 Pastel Action Buttons) */}
        <div className="lg:col-span-8 bg-white rounded-3xl p-6 border border-slate-100 shadow-sm">
          <div className="flex items-center gap-2 mb-4">
            <span className="text-blue-600 font-bold">⚡</span>
            <h3 className="font-bold text-slate-800 text-sm">Quick Actions</h3>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
            {/* Admit Patient - Light Blue */}
            <button
              onClick={onAdmitPatient}
              className="bg-[#e9f2ff] hover:bg-[#dbe9ff] p-3.5 rounded-2xl flex flex-col items-center text-center transition-all group"
            >
              <div className="w-10 h-10 rounded-xl bg-blue-500/15 flex items-center justify-center text-blue-600 mb-2 group-hover:scale-110 transition-transform">
                <BedDouble className="w-5 h-5" />
              </div>
              <span className="text-xs font-bold text-slate-800">Admit Patient</span>
            </button>

            {/* Check Reports - Light Green */}
            <button
              onClick={() => onNavigate('reports')}
              className="bg-[#e9f8f0] hover:bg-[#d5f3e2] p-3.5 rounded-2xl flex flex-col items-center text-center transition-all group"
            >
              <div className="w-10 h-10 rounded-xl bg-emerald-500/15 flex items-center justify-center text-emerald-600 mb-2 group-hover:scale-110 transition-transform">
                <FileCheck className="w-5 h-5" />
              </div>
              <span className="text-xs font-bold text-slate-800">Check Reports</span>
            </button>

            {/* View Medicine Stock - Light Purple */}
            <button
              onClick={() => onNavigate('inventory')}
              className="bg-[#f3e8ff] hover:bg-[#e9d5ff] p-3.5 rounded-2xl flex flex-col items-center text-center transition-all group"
            >
              <div className="w-10 h-10 rounded-xl bg-purple-500/15 flex items-center justify-center text-purple-600 mb-2 group-hover:scale-110 transition-transform">
                <Package className="w-5 h-5" />
              </div>
              <span className="text-xs font-bold text-slate-800">View Medicine Stock</span>
            </button>

            {/* Check Bed Status - Light Peach / Orange */}
            <button
              onClick={() => onNavigate('admissions')}
              className="bg-[#fff1e6] hover:bg-[#ffe3cf] p-3.5 rounded-2xl flex flex-col items-center text-center transition-all group"
            >
              <div className="w-10 h-10 rounded-xl bg-amber-500/15 flex items-center justify-center text-amber-600 mb-2 group-hover:scale-110 transition-transform">
                <BedDouble className="w-5 h-5" />
              </div>
              <span className="text-xs font-bold text-slate-800">Check Bed Status</span>
            </button>

            {/* Generate Bill - Light Teal / Cyan */}
            <button
              onClick={onGenerateBill}
              className="bg-[#e6faf8] hover:bg-[#cff5f2] p-3.5 rounded-2xl flex flex-col items-center text-center transition-all group col-span-2 sm:col-span-1"
            >
              <div className="w-10 h-10 rounded-xl bg-teal-500/15 flex items-center justify-center text-teal-600 mb-2 group-hover:scale-110 transition-transform">
                <Receipt className="w-5 h-5" />
              </div>
              <span className="text-xs font-bold text-slate-800">Generate Bill</span>
            </button>
          </div>
        </div>

        {/* Promo / Inspiration Card with Stethoscope (Matching Screenshot) */}
        <div className="lg:col-span-4 bg-gradient-to-r from-[#e3effd] to-[#edf5ff] rounded-3xl p-5 border border-blue-100 shadow-sm relative overflow-hidden flex items-center justify-between h-full min-h-[120px]">
          <div className="z-10 max-w-[190px]">
            <div className="text-sm font-serif italic text-slate-700">Better Care.</div>
            <div className="text-base font-serif italic font-bold text-[#0d2146] mt-0.5">
              A Healthier Tomorrow.
            </div>
          </div>
          <div className="absolute right-0 top-0 bottom-0 w-1/2 flex items-center justify-end pointer-events-none">
            <img
              src="https://images.unsplash.com/photo-1584982751601-97dcc096659c?auto=format&fit=crop&q=80&w=400"
              alt="CareNova Stethoscope"
              className="w-full h-full object-cover rounded-2xl opacity-85 mix-blend-multiply"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
