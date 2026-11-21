import React, { useState } from 'react';
import { Building2, Stethoscope, Plus, Edit, Trash2, CheckCircle, Clock } from 'lucide-react';

export default function DoctorDeptView({
  doctors,
  setDoctors,
  departments,
  setDepartments,
  currentUser
}) {
  const [activeTab, setActiveTab] = useState('doctors');
  const [showDocModal, setShowDocModal] = useState(false);
  const [showDeptModal, setShowDeptModal] = useState(false);

  // New Doctor Form
  const [docForm, setDocForm] = useState({
    name: '',
    department: 'Cardiology',
    specialization: '',
    qualification: '',
    fee: 500,
    phone: '',
    schedule: 'Mon - Fri (09:00 AM - 02:00 PM)'
  });

  // New Dept Form
  const [deptForm, setDeptForm] = useState({
    name: '',
    head: '',
    beds: 20
  });

  const handleSaveDoctor = () => {
    if (!docForm.name.trim() || !docForm.specialization.trim()) return;
    const newDoc = {
      ...docForm,
      id: `DOC-0${doctors.length + 1}`,
      active: true
    };
    setDoctors([...doctors, newDoc]);
    setShowDocModal(false);
    setDocForm({
      name: '',
      department: 'Cardiology',
      specialization: '',
      qualification: '',
      fee: 500,
      phone: '',
      schedule: 'Mon - Fri (09:00 AM - 02:00 PM)'
    });
  };

  const handleSaveDepartment = () => {
    if (!deptForm.name.trim()) return;
    const newDept = {
      ...deptForm,
      id: `DEP-0${departments.length + 1}`,
      active: true
    };
    setDepartments([...departments, newDept]);
    setShowDeptModal(false);
    setDeptForm({ name: '', head: '', beds: 20 });
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
        <div>
          <h2 className="text-xl font-extrabold text-slate-800 tracking-tight flex items-center gap-2">
            <Building2 className="w-6 h-6 text-blue-600" />
            <span>Doctor & Department Management</span>
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Configure clinical departments, medical specialists, fee structures & availability schedules per SRS Section 3.3
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowDeptModal(true)}
            className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs rounded-2xl transition-colors"
          >
            + Add Department
          </button>
          <button
            onClick={() => setShowDocModal(true)}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs rounded-2xl shadow-md transition-colors"
          >
            + Add Doctor
          </button>
        </div>
      </div>

      {/* Selector Tabs */}
      <div className="flex gap-2">
        <button
          onClick={() => setActiveTab('doctors')}
          className={`px-4 py-2 rounded-2xl font-bold text-xs transition-colors ${
            activeTab === 'doctors' ? 'bg-[#0d2146] text-white shadow-xs' : 'bg-white text-slate-600 border border-slate-100'
          }`}
        >
          Doctors Directory ({doctors.length})
        </button>
        <button
          onClick={() => setActiveTab('departments')}
          className={`px-4 py-2 rounded-2xl font-bold text-xs transition-colors ${
            activeTab === 'departments' ? 'bg-[#0d2146] text-white shadow-xs' : 'bg-white text-slate-600 border border-slate-100'
          }`}
        >
          Hospital Departments ({departments.length})
        </button>
      </div>

      {/* Doctors Grid */}
      {activeTab === 'doctors' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-xs">
          {doctors.map((doc) => (
            <div key={doc.id} className="bg-white p-5 rounded-3xl border border-slate-100 shadow-sm space-y-3">
              <div className="flex items-center justify-between">
                <div className="w-10 h-10 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
                  <Stethoscope className="w-5 h-5" />
                </div>
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 font-bold text-[10px] border border-emerald-200">
                  Fee: ₹ {doc.fee}
                </span>
              </div>

              <div>
                <h4 className="font-bold text-slate-800 text-sm">{doc.name}</h4>
                <div className="text-[11px] text-blue-600 font-semibold">{doc.department}</div>
                <div className="text-[11px] text-slate-500 mt-1">{doc.qualification}</div>
                <div className="text-[11px] text-slate-600 font-medium italic">{doc.specialization}</div>
              </div>

              <div className="pt-2 border-t border-slate-100 text-[11px] text-slate-500 flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-slate-400" />
                <span>{doc.schedule}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Departments Grid */}
      {activeTab === 'departments' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-xs">
          {departments.map((dept) => (
            <div key={dept.id} className="bg-white p-5 rounded-3xl border border-slate-100 shadow-sm space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-mono text-[10px] text-blue-600 font-bold">{dept.id}</span>
                <span className="px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 font-semibold text-[10px]">
                  {dept.beds} Beds Allocated
                </span>
              </div>
              <h4 className="font-bold text-slate-800 text-base">{dept.name}</h4>
              <div className="text-slate-500">Department Head: <strong className="text-slate-700">{dept.head}</strong></div>
            </div>
          ))}
        </div>
      )}

      {/* Add Doctor Modal */}
      {showDocModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-100 space-y-4 text-xs animate-in zoom-in-95">
            <h3 className="text-base font-extrabold text-slate-800">Add Medical Practitioner</h3>
            <div className="space-y-3">
              <div>
                <label className="font-semibold text-slate-700 block mb-1">Doctor Name *</label>
                <input
                  type="text"
                  value={docForm.name}
                  onChange={(e) => setDocForm({ ...docForm, name: e.target.value })}
                  placeholder="e.g. Dr. Priya Rao"
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Department</label>
                <select
                  value={docForm.department}
                  onChange={(e) => setDocForm({ ...docForm, department: e.target.value })}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                >
                  {departments.map((d) => (
                    <option key={d.id} value={d.name}>{d.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Specialization</label>
                <input
                  type="text"
                  value={docForm.specialization}
                  onChange={(e) => setDocForm({ ...docForm, specialization: e.target.value })}
                  placeholder="e.g. Pediatric Surgeon"
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Consultation Fee (₹)</label>
                  <input
                    type="number"
                    value={docForm.fee}
                    onChange={(e) => setDocForm({ ...docForm, fee: Number(e.target.value) })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Contact Phone</label>
                  <input
                    type="text"
                    value={docForm.phone}
                    onChange={(e) => setDocForm({ ...docForm, phone: e.target.value })}
                    placeholder="9845012345"
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                  />
                </div>
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Weekly Schedule</label>
                <input
                  type="text"
                  value={docForm.schedule}
                  onChange={(e) => setDocForm({ ...docForm, schedule: e.target.value })}
                  placeholder="Mon - Sat (09:00 AM - 02:00 PM)"
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
              <button
                onClick={() => setShowDocModal(false)}
                className="px-4 py-2 border border-slate-200 rounded-xl font-semibold text-slate-600"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveDoctor}
                className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold shadow-md"
              >
                Save Doctor
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Department Modal */}
      {showDeptModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 shadow-2xl border border-slate-100 space-y-4 text-xs animate-in zoom-in-95">
            <h3 className="text-base font-extrabold text-slate-800">Add Clinical Department</h3>
            <div className="space-y-3">
              <div>
                <label className="font-semibold text-slate-700 block mb-1">Department Name *</label>
                <input
                  type="text"
                  value={deptForm.name}
                  onChange={(e) => setDeptForm({ ...deptForm, name: e.target.value })}
                  placeholder="e.g. Oncology, Nephrology"
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                />
              </div>
              <div>
                <label className="font-semibold text-slate-700 block mb-1">Department Head</label>
                <input
                  type="text"
                  value={deptForm.head}
                  onChange={(e) => setDeptForm({ ...deptForm, head: e.target.value })}
                  placeholder="e.g. Dr. Rajesh Kumar"
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                />
              </div>
              <div>
                <label className="font-semibold text-slate-700 block mb-1">Bed Capacity</label>
                <input
                  type="number"
                  value={deptForm.beds}
                  onChange={(e) => setDeptForm({ ...deptForm, beds: Number(e.target.value) })}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
              <button
                onClick={() => setShowDeptModal(false)}
                className="px-4 py-2 border border-slate-200 rounded-xl font-semibold text-slate-600"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveDepartment}
                className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold shadow-md"
              >
                Add Department
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
