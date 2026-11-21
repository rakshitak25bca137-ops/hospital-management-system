import React, { useState } from 'react';
import { Stethoscope, Activity, FileText, Pill, Plus, Printer, CheckCircle, Search, User } from 'lucide-react';
import { CareNovaLogo } from './HospitalImages';

export default function ConsultationView({
  patients,
  setPatients,
  currentUser,
  doctors
}) {
  const [selectedUhid, setSelectedUhid] = useState(patients[0]?.uhid || '');
  const [selectedPatient, setSelectedPatient] = useState(patients[0] || null);
  const [printModalData, setPrintModalData] = useState(null);

  // Clinical Consultation Form State
  const [vitals, setVitals] = useState({
    temp: '98.6 °F',
    bp: '120/80 mmHg',
    pulse: '76 bpm',
    spo2: '99%',
    weight: '65',
    height: '168'
  });

  const [symptoms, setSymptoms] = useState('');
  const [diagnosis, setDiagnosis] = useState('');
  const [notes, setNotes] = useState('');
  const [doctorName, setDoctorName] = useState(doctors[0]?.name || 'Dr. Arvind Patel');

  // Prescriptions list
  const [prescriptions, setPrescriptions] = useState([
    { medicine: 'Paracetamol', dosage: '650mg', frequency: 'Thrice daily after food', duration: '5 days' }
  ]);
  const [newMed, setNewMed] = useState({ medicine: '', dosage: '', frequency: '', duration: '' });

  // Lab Tests list
  const [labTests, setLabTests] = useState(['Complete Blood Count (CBC)']);
  const [newLabTest, setNewLabTest] = useState('');

  const [saveSuccess, setSaveSuccess] = useState(false);

  const handleSelectPatient = (uhid) => {
    setSelectedUhid(uhid);
    const p = patients.find((pt) => pt.uhid === uhid);
    setSelectedPatient(p || null);
    if (p?.medical?.height) setVitals((v) => ({ ...v, height: p.medical.height, weight: p.medical.weight }));
  };

  const handleAddPrescription = () => {
    if (!newMed.medicine.trim()) return;
    setPrescriptions([...prescriptions, newMed]);
    setNewMed({ medicine: '', dosage: '', frequency: '', duration: '' });
  };

  const handleRemovePrescription = (index) => {
    setPrescriptions(prescriptions.filter((_, i) => i !== index));
  };

  const handleAddLabTest = () => {
    if (!newLabTest.trim()) return;
    setLabTests([...labTests, newLabTest.trim()]);
    setNewLabTest('');
  };

  const handleSaveConsultation = () => {
    if (!selectedPatient || !symptoms.trim() || !diagnosis.trim()) {
      alert('Please select a patient and fill in symptoms and diagnosis.');
      return;
    }

    const newVisit = {
      id: `VST-${Date.now().toString().slice(-4)}`,
      date: new Date().toISOString().replace('T', ' ').slice(0, 16),
      type: 'Clinical Consultation',
      doctor: doctorName,
      symptoms,
      diagnosis,
      notes,
      vitals,
      prescriptions,
      labTests
    };

    setPatients((prev) =>
      prev.map((p) => {
        if (p.uhid === selectedPatient.uhid) {
          return {
            ...p,
            visits: [newVisit, ...(p.visits || [])]
          };
        }
        return p;
      })
    );

    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
        <div>
          <h2 className="text-xl font-extrabold text-slate-800 tracking-tight flex items-center gap-2">
            <Stethoscope className="w-6 h-6 text-blue-600" />
            <span>Consultation & EMR</span>
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Nurse triage vitals, doctor clinical notes, prescription builder & lab orders per SRS Section 3.5
          </p>
        </div>

        {selectedPatient && (
          <button
            onClick={() =>
              setPrintModalData({
                patient: selectedPatient,
                doctor: doctorName,
                date: new Date().toLocaleDateString(),
                vitals,
                symptoms: symptoms || selectedPatient.visits?.[0]?.symptoms,
                diagnosis: diagnosis || selectedPatient.visits?.[0]?.diagnosis,
                prescriptions: prescriptions.length > 0 ? prescriptions : selectedPatient.visits?.[0]?.prescriptions || [],
                labTests: labTests.length > 0 ? labTests : selectedPatient.visits?.[0]?.labTests || []
              })
            }
            className="inline-flex items-center gap-2 bg-[#0d2146] hover:bg-[#122c5d] text-white font-semibold text-xs px-5 py-2.5 rounded-2xl shadow-md transition-all"
          >
            <Printer className="w-4 h-4" />
            <span>Print Prescription / Summary</span>
          </button>
        )}
      </div>

      {/* Patient Picker Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <span className="font-semibold text-slate-700">Select Patient:</span>
          <select
            value={selectedUhid}
            onChange={(e) => handleSelectPatient(e.target.value)}
            className="p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-800 outline-none"
          >
            {patients.map((p) => (
              <option key={p.uhid} value={p.uhid}>
                {p.firstName} {p.lastName} ({p.uhid} - {p.bloodGroup})
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <span className="font-semibold text-slate-700">Attending Doctor:</span>
          <select
            value={doctorName}
            onChange={(e) => setDoctorName(e.target.value)}
            className="p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium text-slate-800 outline-none"
          >
            {doctors.map((d) => (
              <option key={d.id} value={d.name}>
                {d.name} ({d.department})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Main EMR Form Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start text-xs">
        {/* Left Col: Vitals & Clinical History (Nurse & Doctor) */}
        <div className="lg:col-span-5 space-y-6">
          {/* Patient Quick Info Card */}
          {selectedPatient && (
            <div className="bg-white p-5 rounded-3xl border border-slate-100 shadow-sm space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-blue-100 text-blue-600 font-bold flex items-center justify-center">
                  {selectedPatient.firstName[0]}{selectedPatient.lastName[0]}
                </div>
                <div>
                  <div className="font-bold text-slate-800 text-sm">
                    {selectedPatient.firstName} {selectedPatient.lastName}
                  </div>
                  <div className="text-[11px] text-slate-400">
                    {selectedPatient.uhid} • {selectedPatient.age} yrs • {selectedPatient.gender}
                  </div>
                </div>
              </div>

              <div className="p-3 bg-rose-50/60 border border-rose-100 rounded-xl text-rose-800 text-[11px]">
                <span className="font-bold">Known Allergies:</span> {selectedPatient.medical?.allergies || 'None'}
              </div>
            </div>
          )}

          {/* Vitals Recording (FR-5.1) */}
          <div className="bg-white p-5 rounded-3xl border border-slate-100 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2">
              <h3 className="font-bold text-slate-800 text-sm flex items-center gap-1.5">
                <Activity className="w-4 h-4 text-emerald-600" />
                <span>Vital Signs (Nurse Recording)</span>
              </h3>
              <span className="text-[10px] text-slate-400">FR-5.1 Compliant</span>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="font-semibold text-slate-600 block mb-1">Body Temp</label>
                <input
                  type="text"
                  value={vitals.temp}
                  onChange={(e) => setVitals({ ...vitals, temp: e.target.value })}
                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl font-mono"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-600 block mb-1">Blood Pressure</label>
                <input
                  type="text"
                  value={vitals.bp}
                  onChange={(e) => setVitals({ ...vitals, bp: e.target.value })}
                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl font-mono"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-600 block mb-1">Pulse Rate</label>
                <input
                  type="text"
                  value={vitals.pulse}
                  onChange={(e) => setVitals({ ...vitals, pulse: e.target.value })}
                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl font-mono"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-600 block mb-1">Oxygen Sat (SpO2)</label>
                <input
                  type="text"
                  value={vitals.spo2}
                  onChange={(e) => setVitals({ ...vitals, spo2: e.target.value })}
                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl font-mono"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Right Col: Doctor Clinical Notes, Prescription & Lab (FR-5.2 to FR-5.4) */}
        <div className="lg:col-span-7 space-y-6">
          {/* Symptoms & Diagnosis */}
          <div className="bg-white p-5 rounded-3xl border border-slate-100 shadow-sm space-y-4">
            <h3 className="font-bold text-slate-800 text-sm flex items-center gap-1.5 border-b border-slate-100 pb-2">
              <FileText className="w-4 h-4 text-blue-600" />
              <span>Doctor Consultation & Diagnosis (FR-5.2)</span>
            </h3>

            <div>
              <label className="font-semibold text-slate-700 block mb-1">Chief Symptoms & Clinical History *</label>
              <textarea
                rows={2}
                value={symptoms}
                onChange={(e) => setSymptoms(e.target.value)}
                placeholder="e.g. Acute chest discomfort on exertion, shortness of breath, palpitation..."
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
              />
            </div>

            <div>
              <label className="font-semibold text-slate-700 block mb-1">Provisional / Confirmed Diagnosis *</label>
              <input
                type="text"
                value={diagnosis}
                onChange={(e) => setDiagnosis(e.target.value)}
                placeholder="e.g. Stable Angina Pectoris, Sinus Tachycardia"
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium"
              />
            </div>

            <div>
              <label className="font-semibold text-slate-700 block mb-1">Clinical Treatment Plan & Advice</label>
              <textarea
                rows={2}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="e.g. Low sodium diet, continuous telemetry, review after 3 days..."
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
              />
            </div>
          </div>

          {/* Prescription Builder (FR-5.3) */}
          <div className="bg-white p-5 rounded-3xl border border-slate-100 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2">
              <h3 className="font-bold text-slate-800 text-sm flex items-center gap-1.5">
                <Pill className="w-4 h-4 text-purple-600" />
                <span>e-Prescription Builder (FR-5.3)</span>
              </h3>
              <span className="text-[10px] text-slate-400">{prescriptions.length} items</span>
            </div>

            {/* Prescriptions List */}
            <div className="space-y-2">
              {prescriptions.map((rx, idx) => (
                <div key={idx} className="p-2.5 bg-purple-50/50 border border-purple-100 rounded-xl flex items-center justify-between">
                  <div>
                    <span className="font-bold text-slate-800">{rx.medicine}</span>
                    <span className="text-purple-700 font-semibold ml-2">({rx.dosage})</span>
                    <div className="text-[11px] text-slate-500">{rx.frequency} • {rx.duration}</div>
                  </div>
                  <button
                    onClick={() => handleRemovePrescription(idx)}
                    className="text-rose-500 hover:text-rose-700 font-bold px-2"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>

            {/* Add Medicine Inputs */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 border-t border-slate-100">
              <input
                type="text"
                placeholder="Medicine"
                value={newMed.medicine}
                onChange={(e) => setNewMed({ ...newMed, medicine: e.target.value })}
                className="p-2 bg-slate-50 border border-slate-200 rounded-xl"
              />
              <input
                type="text"
                placeholder="Dosage (500mg)"
                value={newMed.dosage}
                onChange={(e) => setNewMed({ ...newMed, dosage: e.target.value })}
                className="p-2 bg-slate-50 border border-slate-200 rounded-xl"
              />
              <input
                type="text"
                placeholder="Frequency (BD/TDS)"
                value={newMed.frequency}
                onChange={(e) => setNewMed({ ...newMed, frequency: e.target.value })}
                className="p-2 bg-slate-50 border border-slate-200 rounded-xl"
              />
              <div className="flex gap-1">
                <input
                  type="text"
                  placeholder="Duration (5 days)"
                  value={newMed.duration}
                  onChange={(e) => setNewMed({ ...newMed, duration: e.target.value })}
                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl"
                />
                <button
                  type="button"
                  onClick={handleAddPrescription}
                  className="px-3 bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-xl"
                >
                  +
                </button>
              </div>
            </div>
          </div>

          {/* Laboratory Tests Order (FR-5.4) */}
          <div className="bg-white p-5 rounded-3xl border border-slate-100 shadow-sm space-y-3">
            <h3 className="font-bold text-slate-800 text-sm border-b border-slate-100 pb-2">
              Laboratory Tests & Diagnostics (FR-5.4)
            </h3>
            <div className="flex flex-wrap gap-2">
              {labTests.map((t, i) => (
                <span key={i} className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full font-semibold border border-blue-200 flex items-center gap-1.5">
                  <span>{t}</span>
                  <button onClick={() => setLabTests(labTests.filter((_, idx) => idx !== i))} className="text-blue-400 hover:text-blue-800 font-bold">×</button>
                </span>
              ))}
            </div>
            <div className="flex gap-2">
              <input
                type="text"
                value={newLabTest}
                onChange={(e) => setNewLabTest(e.target.value)}
                placeholder="Order diagnostic test (e.g. Troponin-I, Serum Electrolytes, X-Ray)"
                className="flex-1 p-2 bg-slate-50 border border-slate-200 rounded-xl"
              />
              <button
                onClick={handleAddLabTest}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-900 text-white rounded-xl font-semibold"
              >
                Add Test
              </button>
            </div>
          </div>

          {/* Save Action */}
          <div className="flex items-center justify-between">
            {saveSuccess && (
              <span className="text-emerald-600 font-bold flex items-center gap-1">
                <CheckCircle className="w-4 h-4" /> Consultation record saved successfully!
              </span>
            )}
            <button
              onClick={handleSaveConsultation}
              className="ml-auto px-6 py-2.5 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 text-white font-bold rounded-2xl shadow-md transition-all"
            >
              Save Consultation Record
            </button>
          </div>
        </div>
      </div>

      {/* Printable Prescription & Visit Summary Modal (FR-5.5) */}
      {printModalData && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-8 shadow-2xl border border-slate-200 max-h-[90vh] overflow-y-auto print:m-0 print:p-0">
            {/* Hospital Header */}
            <div className="border-b-2 border-slate-800 pb-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <CareNovaLogo size={48} />
                <div>
                  <h1 className="text-xl font-black text-slate-900 leading-tight">CARENOVA HOSPITAL</h1>
                  <p className="text-[10px] text-slate-500 font-semibold tracking-wider uppercase">
                    Tertiary Care & Multispeciality Research Center
                  </p>
                  <p className="text-[10px] text-slate-400">
                    24/7 Helpline: 1800-425-CARE • Bengaluru, India
                  </p>
                </div>
              </div>
              <div className="text-right text-xs">
                <div className="font-bold text-slate-800">CLINICAL VISIT SUMMARY</div>
                <div className="text-slate-500">{printModalData.date}</div>
              </div>
            </div>

            {/* Patient Demographics */}
            <div className="grid grid-cols-2 gap-4 py-4 border-b border-slate-100 text-xs">
              <div>
                <div><span className="font-bold">Patient Name:</span> {printModalData.patient.firstName} {printModalData.patient.lastName}</div>
                <div><span className="font-bold">UHID:</span> {printModalData.patient.uhid}</div>
                <div><span className="font-bold">Age / Gender:</span> {printModalData.patient.age} yrs / {printModalData.patient.gender}</div>
              </div>
              <div>
                <div><span className="font-bold">Attending Doctor:</span> {printModalData.doctor}</div>
                <div><span className="font-bold">Blood Group:</span> {printModalData.patient.bloodGroup}</div>
                <div><span className="font-bold text-rose-600">Allergies:</span> {printModalData.patient.medical?.allergies || 'None'}</div>
              </div>
            </div>

            {/* Vitals */}
            <div className="py-3 border-b border-slate-100 text-xs flex justify-between bg-slate-50 px-3 rounded-xl font-mono">
              <span>Temp: {printModalData.vitals.temp}</span>
              <span>BP: {printModalData.vitals.bp}</span>
              <span>Pulse: {printModalData.vitals.pulse}</span>
              <span>SpO2: {printModalData.vitals.spo2}</span>
            </div>

            {/* Diagnosis */}
            <div className="py-4 border-b border-slate-100 text-xs space-y-1">
              <div className="font-bold text-slate-800">DIAGNOSIS & CLINICAL IMPRESSION:</div>
              <p className="text-slate-700 text-sm font-semibold">{printModalData.diagnosis || 'Clinical evaluation under care'}</p>
            </div>

            {/* Rx List */}
            <div className="py-4 border-b border-slate-100 text-xs space-y-2">
              <div className="font-bold text-slate-800 text-sm flex items-center gap-1">
                <span>℞ PRESCRIPTION:</span>
              </div>
              <table className="w-full text-left">
                <thead className="text-[10px] uppercase text-slate-400 border-b border-slate-100">
                  <tr>
                    <th className="py-1">#</th>
                    <th className="py-1">Medicine</th>
                    <th className="py-1">Dosage</th>
                    <th className="py-1">Frequency</th>
                    <th className="py-1">Duration</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {printModalData.prescriptions.map((rx, i) => (
                    <tr key={i}>
                      <td className="py-2">{i + 1}</td>
                      <td className="py-2 font-bold text-slate-800">{rx.medicine}</td>
                      <td className="py-2">{rx.dosage}</td>
                      <td className="py-2">{rx.frequency}</td>
                      <td className="py-2">{rx.duration}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Footer and Sign */}
            <div className="pt-8 flex items-end justify-between text-xs">
              <div className="text-[10px] text-slate-400">
                Generated via CareNova HMS EMR System • Certified Electronic Record
              </div>
              <div className="text-center">
                <div className="font-script text-slate-700 italic font-bold">Dr. Arvind Patel, MD</div>
                <div className="border-t border-slate-400 pt-1 text-[11px] font-semibold text-slate-600">
                  Doctor's Signature & Stamp
                </div>
              </div>
            </div>

            {/* Action Bar */}
            <div className="mt-8 pt-4 border-t border-slate-100 flex items-center justify-end gap-3 print:hidden">
              <button
                onClick={() => setPrintModalData(null)}
                className="px-4 py-2 border border-slate-200 rounded-xl font-semibold text-xs text-slate-600"
              >
                Close
              </button>
              <button
                onClick={() => window.print()}
                className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold text-xs shadow-md flex items-center gap-1.5"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Print Document</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
