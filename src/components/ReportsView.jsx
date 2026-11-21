import React, { useState } from 'react';
import { FileBarChart2, Download, Printer, Users, BedDouble, CreditCard, Package, ArrowRight } from 'lucide-react';

export default function ReportsView({
  subType = 'all', // all, patient-status, medical-reports, billing-reports, stock-reports, bed-allotment
  patients = [],
  invoices = [],
  medicines = [],
  beds = []
}) {
  const [activeReport, setActiveReport] = useState(
    subType !== 'all' ? subType : 'patient-status'
  );

  // Export to CSV per FR-7.3
  const handleExportCSV = (filename, dataRows, headers) => {
    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [headers.join(','), ...dataRows.map((r) => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `${filename}_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const exportPatientCSV = () => {
    const headers = ['UHID', 'Name', 'Age', 'Gender', 'BloodGroup', 'Status', 'Room', 'Phone'];
    const rows = patients.map((p) => [
      p.uhid,
      `"${p.firstName} ${p.lastName}"`,
      p.age,
      p.gender,
      p.bloodGroup,
      p.status,
      `"${p.roomNumber}"`,
      p.phone
    ]);
    handleExportCSV('CareNova_Patient_Report', rows, headers);
  };

  const exportBillingCSV = () => {
    const headers = ['InvoiceID', 'UHID', 'Patient', 'Date', 'Total', 'Paid', 'Balance', 'Status'];
    const rows = invoices.map((inv) => [
      inv.id,
      inv.uhid,
      `"${inv.patientName}"`,
      inv.date,
      inv.total,
      inv.paid,
      inv.balance,
      inv.status
    ]);
    handleExportCSV('CareNova_Billing_Report', rows, headers);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
        <div>
          <h2 className="text-xl font-extrabold text-slate-800 tracking-tight flex items-center gap-2">
            <FileBarChart2 className="w-6 h-6 text-blue-600" />
            <span>Hospital Reports & Analytics</span>
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Compliant medical, billing, stock, and bed occupancy analytics with CSV export (FR-7.2 & FR-7.3)
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              if (activeReport === 'billing-reports') exportBillingCSV();
              else exportPatientCSV();
            }}
            className="inline-flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs px-4 py-2.5 rounded-2xl shadow-sm transition-all"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export CSV</span>
          </button>
          <button
            onClick={() => window.print()}
            className="inline-flex items-center gap-1.5 bg-[#0d2146] hover:bg-[#122c5d] text-white font-semibold text-xs px-4 py-2.5 rounded-2xl shadow-sm transition-all"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print View</span>
          </button>
        </div>
      </div>

      {/* Report Selector Pills */}
      <div className="bg-white p-3 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-2 overflow-x-auto text-xs font-semibold">
        {[
          { id: 'patient-status', label: 'Patient Status Report' },
          { id: 'medical-reports', label: 'Medical Reports (+12)' },
          { id: 'billing-reports', label: 'Billing & Revenue' },
          { id: 'stock-reports', label: 'Stock Reports' },
          { id: 'bed-allotment', label: 'Bed Allotment Report' }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveReport(tab.id)}
            className={`px-3.5 py-1.5 rounded-xl transition-colors whitespace-nowrap ${
              activeReport === tab.id
                ? 'bg-blue-600 text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Patient Status Report */}
      {activeReport === 'patient-status' && (
        <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-6 space-y-4">
          <h3 className="font-bold text-slate-800 text-base">Inpatient & Outpatient Distribution</h3>
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 text-center">
            <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-100">
              <div className="text-2xl font-black text-emerald-700">68</div>
              <div className="text-xs font-semibold text-emerald-600 mt-1">Stable Patients (55%)</div>
            </div>
            <div className="p-4 bg-amber-50 rounded-2xl border border-amber-100">
              <div className="text-2xl font-black text-amber-700">34</div>
              <div className="text-xs font-semibold text-amber-600 mt-1">Under Observation (27%)</div>
            </div>
            <div className="p-4 bg-rose-50 rounded-2xl border border-rose-100">
              <div className="text-2xl font-black text-rose-700">14</div>
              <div className="text-xs font-semibold text-rose-600 mt-1">Critical ICU (11%)</div>
            </div>
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
              <div className="text-2xl font-black text-slate-700">8</div>
              <div className="text-xs font-semibold text-slate-600 mt-1">Others / Daycare (7%)</div>
            </div>
          </div>
        </div>
      )}

      {/* Medical Reports */}
      {activeReport === 'medical-reports' && (
        <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-6 space-y-4">
          <h3 className="font-bold text-slate-800 text-base">Diagnostic & Pathology Reports Queue (+12 New)</h3>
          <div className="divide-y divide-slate-100 text-xs">
            {patients.flatMap((p) => p.visits?.flatMap((v) => v.labTests?.map((t) => ({ patient: p, visit: v, test: t })) || [])).map((item, idx) => (
              <div key={idx} className="py-3 flex items-center justify-between">
                <div>
                  <div className="font-bold text-slate-800">{item.test}</div>
                  <div className="text-slate-500">{item.patient.firstName} {item.patient.lastName} ({item.patient.uhid})</div>
                </div>
                <span className="px-3 py-1 bg-blue-100 text-blue-700 font-semibold rounded-full text-[10px]">
                  Verified & Synced
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Billing Reports */}
      {activeReport === 'billing-reports' && (
        <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-slate-800 text-base">Revenue & Receivables Audit</h3>
            <span className="text-xs font-bold text-emerald-600">Total Billed: ₹ 2,48,750</span>
          </div>
          <div className="divide-y divide-slate-100 text-xs">
            {invoices.map((inv) => (
              <div key={inv.id} className="py-3 flex items-center justify-between">
                <div>
                  <div className="font-mono font-bold text-slate-800">{inv.id} • {inv.patientName}</div>
                  <div className="text-slate-400">{inv.date} • {inv.paymentMethod}</div>
                </div>
                <div className="text-right">
                  <div className="font-bold text-slate-800">₹ {inv.total}</div>
                  <div className="text-rose-600 font-semibold">Balance: ₹ {inv.balance}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Stock Reports */}
      {activeReport === 'stock-reports' && (
        <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-6 space-y-4">
          <h3 className="font-bold text-slate-800 text-base">Pharmacy Consumption & Buffer Stock</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            {medicines.map((m) => (
              <div key={m.id} className="p-3 bg-slate-50 rounded-2xl border border-slate-100 flex items-center justify-between">
                <div>
                  <div className="font-bold text-slate-800">{m.name}</div>
                  <div className="text-slate-400">{m.dosage}</div>
                </div>
                <div className="text-right">
                  <div className="font-bold text-emerald-600">{m.stock} units</div>
                  <div className="text-[10px] text-slate-400">Max: {m.maxCapacity}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Bed Allotment */}
      {activeReport === 'bed-allotment' && (
        <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-6 space-y-4">
          <h3 className="font-bold text-slate-800 text-base">Bed Allotment & Ward Census</h3>
          <div className="divide-y divide-slate-100 text-xs">
            {beds.map((b) => (
              <div key={b.id} className="py-3 flex items-center justify-between">
                <div>
                  <div className="font-bold text-slate-800">{b.room} ({b.ward})</div>
                  <div className="text-slate-500">{b.patient ? `Occupied by: ${b.patient} (${b.uhid})` : 'Unassigned / Available'}</div>
                </div>
                <span className={`px-2.5 py-0.5 rounded-full font-bold text-[10px] ${
                  b.status === 'Available' ? 'bg-emerald-100 text-emerald-700' : 'bg-blue-100 text-blue-700'
                }`}>
                  {b.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
