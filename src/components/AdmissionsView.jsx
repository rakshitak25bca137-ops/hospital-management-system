import React, { useState } from 'react';
import { BedDouble, CheckCircle2, Clock, AlertTriangle, UserCheck, LogOut, Plus, Search, Filter } from 'lucide-react';

export default function AdmissionsView({
  beds,
  setBeds,
  patients,
  setPatients,
  currentUser
}) {
  const [filterWard, setFilterWard] = useState('ALL');
  const [showAdmitModal, setShowAdmitModal] = useState(false);
  const [selectedBed, setSelectedBed] = useState(null);
  const [selectedPatientUhid, setSelectedPatientUhid] = useState('');
  const [admissionNotes, setAdmissionNotes] = useState('');

  const wards = ['ALL', 'General Ward - A', 'Special Deluxe - B', 'Orthopedic Ward - C', 'Intensive Care Unit', 'Pediatric Wing'];

  const filteredBeds = beds.filter((b) => {
    if (filterWard !== 'ALL' && b.ward !== filterWard) return false;
    return true;
  });

  const availableBeds = beds.filter((b) => b.status === 'Available');
  const occupiedBeds = beds.filter((b) => b.status === 'Occupied');
  const reservedBeds = beds.filter((b) => b.status === 'Reserved');

  // Admit patient to bed
  const handleConfirmAdmission = () => {
    if (!selectedBed || !selectedPatientUhid) return;
    const patient = patients.find((p) => p.uhid === selectedPatientUhid);
    if (!patient) return;

    // Update Bed
    setBeds((prev) =>
      prev.map((b) =>
        b.id === selectedBed.id
          ? {
              ...b,
              status: 'Occupied',
              patient: `${patient.firstName} ${patient.lastName}`,
              uhid: patient.uhid
            }
          : b
      )
    );

    // Update Patient
    setPatients((prev) =>
      prev.map((p) =>
        p.uhid === patient.uhid
          ? {
              ...p,
              status: 'Admitted',
              admissionStatus: selectedBed.type === 'ICU' ? 'Critical' : 'Admitted',
              roomNumber: selectedBed.room,
              timeAgo: 'Just now',
              admittedAt: new Date().toISOString().replace('T', ' ').slice(0, 16),
              visits: [
                {
                  id: `VST-${Date.now().toString().slice(-4)}`,
                  date: new Date().toISOString().replace('T', ' ').slice(0, 16),
                  type: 'IPD Admission',
                  doctor: 'Duty Medical Officer',
                  symptoms: 'Admitted to ' + selectedBed.room,
                  vitals: { temp: '98.6 °F', bp: '120/80 mmHg', pulse: '76 bpm', spo2: '99%' },
                  notes: admissionNotes || 'Routine ward admission protocol started.'
                },
                ...(p.visits || [])
              ]
            }
          : p
      )
    );

    setShowAdmitModal(false);
    setSelectedBed(null);
    setSelectedPatientUhid('');
    setAdmissionNotes('');
  };

  // Discharge patient from bed
  const handleDischarge = (bed) => {
    if (!bed.uhid) return;
    if (!window.confirm(`Are you sure you want to discharge patient ${bed.patient} from ${bed.room}?`)) return;

    // Free Bed
    setBeds((prev) =>
      prev.map((b) =>
        b.id === bed.id
          ? { ...b, status: 'Available', patient: null, uhid: null }
          : b
      )
    );

    // Update Patient status
    setPatients((prev) =>
      prev.map((p) =>
        p.uhid === bed.uhid
          ? {
              ...p,
              status: 'Discharged',
              admissionStatus: 'Discharged',
              roomNumber: `Discharged (Prev ${bed.room})`,
              timeAgo: 'Just discharged'
            }
          : p
      )
    );
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
        <div>
          <h2 className="text-xl font-extrabold text-slate-800 tracking-tight flex items-center gap-2">
            <BedDouble className="w-6 h-6 text-blue-600" />
            <span>Admissions & Bed Allotment</span>
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Real-time ward occupancy, ICU tracking, and patient admission/discharge management
          </p>
        </div>

        <button
          onClick={() => {
            setSelectedBed(availableBeds[0] || null);
            setShowAdmitModal(true);
          }}
          disabled={availableBeds.length === 0}
          className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-blue-500 text-white font-semibold text-xs px-5 py-2.5 rounded-2xl shadow-md transition-all hover:scale-105 active:scale-95 disabled:opacity-50"
        >
          <Plus className="w-4 h-4" />
          <span>Allot / Admit Patient</span>
        </button>
      </div>

      {/* Ward Occupancy Overview Metrics */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex items-center justify-between">
          <div>
            <div className="text-[11px] font-medium text-slate-500">Available Beds</div>
            <div className="text-2xl font-black text-emerald-600">{availableBeds.length}</div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
            68
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex items-center justify-between">
          <div>
            <div className="text-[11px] font-medium text-slate-500">Occupied Beds</div>
            <div className="text-2xl font-black text-blue-600">{occupiedBeds.length}</div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
            114
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex items-center justify-between">
          <div>
            <div className="text-[11px] font-medium text-slate-500">Reserved</div>
            <div className="text-2xl font-black text-amber-600">{reservedBeds.length}</div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
            18
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex items-center justify-between">
          <div>
            <div className="text-[11px] font-medium text-slate-500">Total Capacity</div>
            <div className="text-2xl font-black text-slate-800">200</div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center font-bold text-xs">
            85% Eff
          </div>
        </div>
      </div>

      {/* Ward Filter Pills */}
      <div className="bg-white p-3 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-2 overflow-x-auto text-xs font-semibold">
        {wards.map((w) => (
          <button
            key={w}
            onClick={() => setFilterWard(w)}
            className={`px-3.5 py-1.5 rounded-xl transition-colors whitespace-nowrap ${
              filterWard === w
                ? 'bg-blue-600 text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            {w}
          </button>
        ))}
      </div>

      {/* Bed Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {filteredBeds.map((bed) => {
          const isOccupied = bed.status === 'Occupied';
          const isAvailable = bed.status === 'Available';
          const isReserved = bed.status === 'Reserved';

          return (
            <div
              key={bed.id}
              className={`p-4 rounded-3xl border transition-all shadow-xs flex flex-col justify-between ${
                isOccupied
                  ? 'bg-white border-blue-200'
                  : isAvailable
                  ? 'bg-emerald-50/40 border-emerald-200'
                  : 'bg-amber-50/40 border-amber-200'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="font-bold text-slate-800 text-sm flex items-center gap-1.5">
                    <BedDouble className="w-4 h-4 text-blue-600" />
                    {bed.room}
                  </span>
                  <span
                    className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${
                      isOccupied
                        ? 'bg-blue-100 text-blue-700 border-blue-200'
                        : isAvailable
                        ? 'bg-emerald-100 text-emerald-700 border-emerald-200'
                        : 'bg-amber-100 text-amber-700 border-amber-200'
                    }`}
                  >
                    {bed.status}
                  </span>
                </div>

                <div className="text-[11px] text-slate-500 font-medium mb-3">
                  {bed.ward} • <span className="font-semibold text-slate-700">{bed.type}</span>
                </div>

                {isOccupied && (
                  <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 text-xs mb-3">
                    <div className="font-bold text-slate-800">{bed.patient}</div>
                    <div className="text-[10px] font-mono text-blue-600">{bed.uhid}</div>
                  </div>
                )}
              </div>

              <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                {isAvailable ? (
                  <button
                    onClick={() => {
                      setSelectedBed(bed);
                      setShowAdmitModal(true);
                    }}
                    className="w-full py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-semibold shadow-xs transition-colors"
                  >
                    Allot Bed
                  </button>
                ) : isOccupied ? (
                  <button
                    onClick={() => handleDischarge(bed)}
                    className="w-full py-1.5 bg-slate-100 hover:bg-rose-50 text-slate-700 hover:text-rose-600 rounded-xl font-semibold transition-colors flex items-center justify-center gap-1.5"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>Discharge</span>
                  </button>
                ) : (
                  <span className="text-slate-400 text-[11px] italic py-1 text-center w-full">
                    Pre-booked for elective admission
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Admission Modal */}
      {showAdmitModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-100 space-y-4 animate-in zoom-in-95">
            <h3 className="text-base font-extrabold text-slate-800">Admit Patient to Bed</h3>

            <div className="space-y-3 text-xs">
              <div>
                <label className="font-semibold text-slate-700 block mb-1">Select Bed</label>
                <select
                  value={selectedBed?.id || ''}
                  onChange={(e) => setSelectedBed(beds.find((b) => b.id === e.target.value))}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                >
                  {availableBeds.map((b) => (
                    <option key={b.id} value={b.id}>
                      {b.room} ({b.ward} - {b.type})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Select Patient *</label>
                <select
                  value={selectedPatientUhid}
                  onChange={(e) => setSelectedPatientUhid(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                >
                  <option value="">-- Choose Patient --</option>
                  {patients
                    .filter((p) => p.status !== 'Admitted')
                    .map((p) => (
                      <option key={p.uhid} value={p.uhid}>
                        {p.firstName} {p.lastName} ({p.uhid})
                      </option>
                    ))}
                </select>
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Admission Notes</label>
                <textarea
                  rows={2}
                  value={admissionNotes}
                  onChange={(e) => setAdmissionNotes(e.target.value)}
                  placeholder="Reason for IPD admission, triage observation..."
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
              <button
                onClick={() => setShowAdmitModal(false)}
                className="px-4 py-2 border border-slate-200 rounded-xl font-semibold text-xs text-slate-600 hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmAdmission}
                disabled={!selectedPatientUhid}
                className="px-5 py-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white rounded-xl font-semibold text-xs shadow-md"
              >
                Confirm Admission
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
