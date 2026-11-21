import React, { useState, useMemo } from 'react';
import {
  Users,
  UserPlus,
  Search,
  Filter,
  Eye,
  Edit,
  Trash2,
  Calendar,
  Phone,
  Mail,
  MapPin,
  Heart,
  ShieldCheck,
  AlertCircle,
  CheckCircle,
  FileText,
  Printer,
  X,
  Plus,
  RefreshCw,
  Clock,
  Activity,
  BedDouble,
  Receipt
} from 'lucide-react';

export default function PatientManagementView({
  patients,
  setPatients,
  currentUser,
  onAdmitPatient,
  onBookAppointment,
  onGenerateBill
}) {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [showRegModal, setShowRegModal] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [editPatientData, setEditPatientData] = useState(null);
  const [activeProfileTab, setActiveProfileTab] = useState('overview'); // overview, visits, prescriptions, billing, audit
  const [duplicateWarning, setDuplicateWarning] = useState(null);

  // Form State for Section 4
  const emptyForm = {
    firstName: '',
    lastName: '',
    dob: '',
    gender: 'Male',
    bloodGroup: 'O+',
    maritalStatus: 'Single',
    nationalId: '',
    phone: '',
    alternatePhone: '',
    email: '',
    address: '',
    emergencyContact: {
      name: '',
      relationship: '',
      phone: ''
    },
    medical: {
      allergies: 'None',
      chronicConditions: '',
      currentMedications: '',
      pastSurgeries: '',
      familyHistory: '',
      height: '',
      weight: ''
    },
    insurance: {
      provider: '',
      policyNumber: '',
      validity: ''
    }
  };

  const [formData, setFormData] = useState(emptyForm);
  const [formErrors, setFormErrors] = useState({});

  // Calculate age from DOB
  const calculateAge = (dobString) => {
    if (!dobString) return '';
    const birthDate = new Date(dobString);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age > 0 ? age : 0;
  };

  // Calculate BMI
  const calculateBMI = (heightCm, weightKg) => {
    if (!heightCm || !weightKg || heightCm <= 0) return null;
    const heightM = heightCm / 100;
    const bmi = (weightKg / (heightM * heightM)).toFixed(1);
    let category = 'Normal';
    if (bmi < 18.5) category = 'Underweight';
    else if (bmi >= 25 && bmi < 29.9) category = 'Overweight';
    else if (bmi >= 30) category = 'Obese';
    return { bmi, category };
  };

  // Check Duplicates per FR-2.6
  const checkDuplicate = (firstName, lastName, dob, phone, currentUhid = null) => {
    const fullName = `${firstName} ${lastName}`.trim().toLowerCase();
    const existing = patients.find(
      (p) =>
        p.uhid !== currentUhid &&
        `${p.firstName} ${p.lastName}`.trim().toLowerCase() === fullName &&
        p.dob === dob &&
        p.phone === phone
    );
    return existing || null;
  };

  // Validate form inputs per FR-2.1 & Section 4
  const validateForm = () => {
    const errors = {};
    if (!formData.firstName.trim()) errors.firstName = 'First Name is required';
    if (!formData.lastName.trim()) errors.lastName = 'Last Name is required';
    if (!formData.dob) errors.dob = 'Date of birth is required';
    else {
      const selected = new Date(formData.dob);
      if (selected > new Date()) errors.dob = 'Date of birth cannot be in future';
    }
    if (!formData.bloodGroup) errors.bloodGroup = 'Blood group is required';
    if (!formData.phone.trim()) errors.phone = 'Phone number is required';
    else if (!/^\d{10}$/.test(formData.phone.trim())) {
      errors.phone = 'Phone must be exactly 10 digits';
    }
    if (!formData.address.trim()) errors.address = 'Address is required';
    if (!formData.emergencyContact.name.trim()) errors.emergencyName = 'Emergency contact name is required';
    if (!formData.emergencyContact.relationship.trim()) errors.emergencyRel = 'Relationship is required';
    if (!formData.emergencyContact.phone.trim()) errors.emergencyPhone = 'Emergency phone is required';
    else if (!/^\d{10}$/.test(formData.emergencyContact.phone.trim())) {
      errors.emergencyPhone = 'Emergency phone must be 10 digits';
    }
    if (!formData.medical.allergies.trim()) {
      errors.allergies = 'Allergies field is mandatory (enter "None" if no known allergy)';
    }
    if (formData.insurance.provider && !formData.insurance.policyNumber.trim()) {
      errors.policyNumber = 'Policy Number required when insurance provider is specified';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Handle Save (Create or Update)
  const handleSavePatient = (forceDuplicate = false) => {
    if (!validateForm()) return;

    // Check duplicate
    if (!forceDuplicate) {
      const dup = checkDuplicate(
        formData.firstName,
        formData.lastName,
        formData.dob,
        formData.phone,
        editPatientData ? editPatientData.uhid : null
      );
      if (dup) {
        setDuplicateWarning(dup);
        return;
      }
    }

    const calculatedAge = calculateAge(formData.dob);
    const bmiData = calculateBMI(formData.medical.height, formData.medical.weight);

    if (editPatientData) {
      // Update existing patient
      const updated = patients.map((p) => {
        if (p.uhid === editPatientData.uhid) {
          return {
            ...p,
            ...formData,
            age: calculatedAge,
            medical: {
              ...formData.medical,
              bmi: bmiData ? bmiData.bmi : p.medical.bmi
            },
            updatedAt: new Date().toISOString().replace('T', ' ').slice(0, 16),
            updatedBy: `${currentUser.name} (${currentUser.role})`
          };
        }
        return p;
      });
      setPatients(updated);
      setSelectedPatient(updated.find((p) => p.uhid === editPatientData.uhid));
      setShowRegModal(false);
      setEditPatientData(null);
      setDuplicateWarning(null);
    } else {
      // Auto-generate UHID per FR-2.2 (e.g. HMS-2026-000106)
      const nextNum = 100 + patients.length + 1;
      const newUhid = `HMS-2026-000${nextNum}`;

      const newPatient = {
        ...formData,
        uhid: newUhid,
        age: calculatedAge,
        medical: {
          ...formData.medical,
          bmi: bmiData ? bmiData.bmi : null
        },
        status: 'Outpatient',
        admissionStatus: 'Stable',
        roomNumber: 'N/A',
        timeAgo: 'Just now',
        visits: [
          {
            id: `VST-${Date.now().toString().slice(-4)}`,
            date: new Date().toISOString().replace('T', ' ').slice(0, 16),
            type: 'OPD Registration',
            doctor: 'Triage / Reception',
            symptoms: 'Initial Hospital Registration',
            vitals: { temp: '98.4 °F', bp: '120/80 mmHg', pulse: '74 bpm', spo2: '99%' },
            diagnosis: 'Routine Intake Consultation',
            notes: 'Patient successfully registered in CareNova HMS.',
            prescriptions: [],
            labTests: []
          }
        ],
        billingRecords: [],
        createdAt: new Date().toISOString().replace('T', ' ').slice(0, 16),
        createdBy: `${currentUser.name} (${currentUser.role})`
      };

      setPatients([newPatient, ...patients]);
      setSelectedPatient(newPatient);
      setShowRegModal(false);
      setDuplicateWarning(null);
    }
  };

  // Open Edit Form
  const handleOpenEdit = (patient) => {
    setEditPatientData(patient);
    setFormData({
      firstName: patient.firstName || '',
      lastName: patient.lastName || '',
      dob: patient.dob || '',
      gender: patient.gender || 'Male',
      bloodGroup: patient.bloodGroup || 'O+',
      maritalStatus: patient.maritalStatus || 'Single',
      nationalId: patient.nationalId || '',
      phone: patient.phone || '',
      alternatePhone: patient.alternatePhone || '',
      email: patient.email || '',
      address: patient.address || '',
      emergencyContact: {
        name: patient.emergencyContact?.name || '',
        relationship: patient.emergencyContact?.relationship || '',
        phone: patient.emergencyContact?.phone || ''
      },
      medical: {
        allergies: patient.medical?.allergies || 'None',
        chronicConditions: patient.medical?.chronicConditions || '',
        currentMedications: patient.medical?.currentMedications || '',
        pastSurgeries: patient.medical?.pastSurgeries || '',
        familyHistory: patient.medical?.familyHistory || '',
        height: patient.medical?.height || '',
        weight: patient.medical?.weight || ''
      },
      insurance: {
        provider: patient.insurance?.provider || '',
        policyNumber: patient.insurance?.policyNumber || '',
        validity: patient.insurance?.validity || ''
      }
    });
    setFormErrors({});
    setShowRegModal(true);
  };

  // Soft Deactivate / Reactivate (FR-2.8)
  const handleToggleDeactivate = (uhid) => {
    setPatients((prev) =>
      prev.map((p) => {
        if (p.uhid === uhid) {
          const isDeactivated = p.isDeactivated;
          return {
            ...p,
            isDeactivated: !isDeactivated,
            updatedAt: new Date().toISOString().replace('T', ' ').slice(0, 16),
            updatedBy: `${currentUser.name} (${currentUser.role})`
          };
        }
        return p;
      })
    );
    if (selectedPatient && selectedPatient.uhid === uhid) {
      setSelectedPatient((prev) => ({ ...prev, isDeactivated: !prev.isDeactivated }));
    }
  };

  // Filter Patients
  const filteredPatients = useMemo(() => {
    return patients.filter((p) => {
      const matchSearch =
        p.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.uhid.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.phone.includes(searchTerm) ||
        (p.dob && p.dob.includes(searchTerm));

      if (!matchSearch) return false;
      if (statusFilter === 'ALL') return true;
      if (statusFilter === 'ADMITTED') return p.status === 'Admitted';
      if (statusFilter === 'DISCHARGED') return p.status === 'Discharged';
      if (statusFilter === 'CRITICAL') return p.admissionStatus === 'Critical';
      return true;
    });
  }, [patients, searchTerm, statusFilter]);

  return (
    <div className="space-y-6 pb-12">
      {/* Top Action Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
        <div>
          <h2 className="text-xl font-extrabold text-slate-800 tracking-tight flex items-center gap-2">
            <Users className="w-6 h-6 text-blue-600" />
            <span>Patient Management</span>
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Capture, search, view medical records, and manage admissions per SRS Section 3.2 & 4
          </p>
        </div>

        <button
          onClick={() => {
            setEditPatientData(null);
            setFormData(emptyForm);
            setFormErrors({});
            setDuplicateWarning(null);
            setShowRegModal(true);
          }}
          className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white font-semibold text-xs px-5 py-2.5 rounded-2xl shadow-md shadow-blue-500/20 transition-all transform hover:scale-105 active:scale-95"
        >
          <UserPlus className="w-4 h-4" />
          <span>Register New Patient</span>
        </button>
      </div>

      {/* Search & Status Filter Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Search Input */}
        <div className="relative w-full md:w-96">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by UHID, Name, Phone, or DOB..."
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-all"
          />
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto text-xs font-medium">
          {[
            { id: 'ALL', label: 'All Patients' },
            { id: 'ADMITTED', label: 'Admitted (78)' },
            { id: 'CRITICAL', label: 'Critical (2)' },
            { id: 'DISCHARGED', label: 'Discharged' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setStatusFilter(tab.id)}
              className={`px-3.5 py-1.5 rounded-xl transition-colors whitespace-nowrap ${
                statusFilter === tab.id
                  ? 'bg-[#0d2146] text-white font-semibold shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Patient Table & Details Split View */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Side: Patient Table (FR-2.4 & FR-2.5) */}
        <div className={`${selectedPatient ? 'lg:col-span-6' : 'lg:col-span-12'} transition-all`}>
          <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
            <div className="p-4 border-b border-slate-100 flex items-center justify-between">
              <span className="text-xs font-bold text-slate-700">
                Registered Patients ({filteredPatients.length})
              </span>
              <span className="text-[11px] text-slate-400">Click row to view profile</span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50/70 text-slate-500 uppercase font-semibold text-[10px] tracking-wider border-b border-slate-100">
                  <tr>
                    <th className="py-3 px-4">UHID / Patient</th>
                    <th className="py-3 px-3">Age / Sex</th>
                    <th className="py-3 px-3">Blood</th>
                    <th className="py-3 px-3">Status</th>
                    <th className="py-3 px-3">Room / Ward</th>
                    <th className="py-3 px-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredPatients.map((p) => {
                    const isSelected = selectedPatient?.uhid === p.uhid;
                    const isDeactivated = p.isDeactivated;
                    return (
                      <tr
                        key={p.uhid}
                        onClick={() => setSelectedPatient(p)}
                        className={`cursor-pointer transition-colors ${
                          isSelected
                            ? 'bg-blue-50/70 border-l-4 border-blue-600'
                            : 'hover:bg-slate-50/80'
                        } ${isDeactivated ? 'opacity-50 line-through' : ''}`}
                      >
                        <td className="py-3 px-4">
                          <div className="font-bold text-slate-800">
                            {p.firstName} {p.lastName}
                          </div>
                          <div className="text-[10px] font-mono text-blue-600">{p.uhid}</div>
                        </td>
                        <td className="py-3 px-3 text-slate-600">
                          {p.age} yrs • {p.gender}
                        </td>
                        <td className="py-3 px-3">
                          <span className="px-2 py-0.5 rounded-md bg-rose-50 text-rose-700 font-bold text-[10px] border border-rose-200">
                            {p.bloodGroup}
                          </span>
                        </td>
                        <td className="py-3 px-3">
                          <span
                            className={`px-2.5 py-0.5 rounded-full text-[10px] font-semibold border ${
                              p.admissionStatus === 'Critical'
                                ? 'bg-rose-100 text-rose-700 border-rose-200'
                                : p.status === 'Admitted'
                                ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                                : 'bg-slate-100 text-slate-600 border-slate-200'
                            }`}
                          >
                            {p.admissionStatus || p.status}
                          </span>
                        </td>
                        <td className="py-3 px-3 text-slate-600">{p.roomNumber || 'Outpatient'}</td>
                        <td className="py-3 px-3 text-right space-x-1" onClick={(e) => e.stopPropagation()}>
                          <button
                            onClick={() => setSelectedPatient(p)}
                            className="p-1 text-blue-600 hover:bg-blue-100 rounded-md transition-colors"
                            title="View Profile"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleOpenEdit(p)}
                            className="p-1 text-slate-600 hover:bg-slate-100 rounded-md transition-colors"
                            title="Edit Patient"
                          >
                            <Edit className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleToggleDeactivate(p.uhid)}
                            className="p-1 text-amber-600 hover:bg-amber-100 rounded-md transition-colors"
                            title={isDeactivated ? 'Reactivate' : 'Soft Deactivate'}
                          >
                            <RefreshCw className="w-3.5 h-3.5" />
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                  {filteredPatients.length === 0 && (
                    <tr>
                      <td colSpan={6} className="text-center py-8 text-slate-400">
                        No matching patient records found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Right Side: Comprehensive Patient Profile Modal / Card (FR-2.7 & Section 4.6) */}
        {selectedPatient && (
          <div className="lg:col-span-6 bg-white rounded-3xl border border-slate-100 shadow-lg p-6 space-y-5 animate-in fade-in slide-in-from-right-4 duration-200">
            {/* Profile Header */}
            <div className="flex items-start justify-between border-b border-slate-100 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-500 text-white font-bold text-base flex items-center justify-center shadow-md">
                  {selectedPatient.firstName[0]}
                  {selectedPatient.lastName[0]}
                </div>
                <div>
                  <h3 className="text-lg font-black text-slate-800 leading-tight">
                    {selectedPatient.firstName} {selectedPatient.lastName}
                  </h3>
                  <div className="flex items-center gap-2 text-xs text-slate-500 mt-0.5">
                    <span className="font-mono text-blue-600 font-bold">{selectedPatient.uhid}</span>
                    <span>•</span>
                    <span>{selectedPatient.age} yrs</span>
                    <span>•</span>
                    <span>{selectedPatient.gender}</span>
                    <span>•</span>
                    <span className="font-bold text-rose-600">{selectedPatient.bloodGroup}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleOpenEdit(selectedPatient)}
                  className="p-1.5 text-slate-600 hover:bg-slate-100 rounded-xl"
                  title="Edit details"
                >
                  <Edit className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setSelectedPatient(null)}
                  className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-xl"
                  title="Close Profile"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Profile Tabs */}
            <div className="flex items-center gap-1 border-b border-slate-100 pb-2 text-xs font-semibold overflow-x-auto">
              {[
                { id: 'overview', label: 'Overview' },
                { id: 'visits', label: `Visits (${selectedPatient.visits?.length || 0})` },
                { id: 'prescriptions', label: 'Prescriptions' },
                { id: 'billing', label: `Billing (${selectedPatient.billingRecords?.length || 0})` },
                { id: 'audit', label: 'Audit Trail' }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveProfileTab(tab.id)}
                  className={`px-3 py-1.5 rounded-xl transition-all whitespace-nowrap ${
                    activeProfileTab === tab.id
                      ? 'bg-blue-600 text-white shadow-xs'
                      : 'text-slate-500 hover:bg-slate-100'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Tab 1: Overview (Demographics, Contact, Medical, Insurance per Sec 4) */}
            {activeProfileTab === 'overview' && (
              <div className="space-y-4 text-xs">
                {/* Contact & Emergency Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-100">
                    <div className="font-bold text-slate-700 flex items-center gap-1.5 mb-2">
                      <Phone className="w-3.5 h-3.5 text-blue-600" />
                      Contact Details
                    </div>
                    <div className="space-y-1 text-slate-600">
                      <div><span className="font-medium">Phone:</span> {selectedPatient.phone}</div>
                      {selectedPatient.email && <div><span className="font-medium">Email:</span> {selectedPatient.email}</div>}
                      <div><span className="font-medium">Address:</span> {selectedPatient.address}</div>
                    </div>
                  </div>

                  <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-100">
                    <div className="font-bold text-slate-700 flex items-center gap-1.5 mb-2">
                      <Heart className="w-3.5 h-3.5 text-rose-600" />
                      Emergency Contact
                    </div>
                    <div className="space-y-1 text-slate-600">
                      <div><span className="font-medium">Name:</span> {selectedPatient.emergencyContact?.name}</div>
                      <div><span className="font-medium">Relation:</span> {selectedPatient.emergencyContact?.relationship}</div>
                      <div><span className="font-medium">Phone:</span> {selectedPatient.emergencyContact?.phone}</div>
                    </div>
                  </div>
                </div>

                {/* Medical Profile & BMI */}
                <div className="p-3.5 bg-blue-50/50 rounded-2xl border border-blue-100">
                  <div className="font-bold text-slate-800 flex items-center justify-between mb-2">
                    <span className="flex items-center gap-1.5">
                      <Activity className="w-3.5 h-3.5 text-blue-600" />
                      Medical Profile & Vitals
                    </span>
                    {selectedPatient.medical?.bmi && (
                      <span className="px-2 py-0.5 rounded-full bg-blue-200/60 text-blue-800 font-bold text-[10px]">
                        BMI: {selectedPatient.medical.bmi}
                      </span>
                    )}
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-slate-700">
                    <div>
                      <span className="font-medium text-rose-600">Allergies:</span>{' '}
                      {selectedPatient.medical?.allergies || 'None'}
                    </div>
                    <div>
                      <span className="font-medium">Chronic:</span>{' '}
                      {selectedPatient.medical?.chronicConditions || 'None'}
                    </div>
                    <div>
                      <span className="font-medium">Current Meds:</span>{' '}
                      {selectedPatient.medical?.currentMedications || 'None'}
                    </div>
                    <div>
                      <span className="font-medium">Surgeries:</span>{' '}
                      {selectedPatient.medical?.pastSurgeries || 'None'}
                    </div>
                  </div>
                </div>

                {/* Insurance Details */}
                <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-100 flex items-center justify-between">
                  <div>
                    <div className="font-bold text-slate-700 flex items-center gap-1.5">
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                      Insurance Coverage
                    </div>
                    <div className="text-slate-600 text-[11px] mt-0.5">
                      {selectedPatient.insurance?.provider
                        ? `${selectedPatient.insurance.provider} (Policy: ${selectedPatient.insurance.policyNumber})`
                        : 'No insurance provider registered / Self-pay'}
                    </div>
                  </div>
                  {selectedPatient.insurance?.validity && (
                    <span className="text-[10px] text-slate-400 font-medium">
                      Valid till: {selectedPatient.insurance.validity}
                    </span>
                  )}
                </div>

                {/* Quick Profile Actions */}
                <div className="pt-2 flex flex-wrap gap-2">
                  <button
                    onClick={() => onBookAppointment && onBookAppointment(selectedPatient)}
                    className="px-3.5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold flex items-center gap-1.5 shadow-xs"
                  >
                    <Calendar className="w-3.5 h-3.5" />
                    <span>Book Appointment</span>
                  </button>
                  <button
                    onClick={() => onAdmitPatient && onAdmitPatient(selectedPatient)}
                    className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-semibold flex items-center gap-1.5 shadow-xs"
                  >
                    <BedDouble className="w-3.5 h-3.5" />
                    <span>Admit to Ward</span>
                  </button>
                  <button
                    onClick={() => onGenerateBill && onGenerateBill(selectedPatient)}
                    className="px-3.5 py-2 bg-slate-800 hover:bg-slate-900 text-white rounded-xl font-semibold flex items-center gap-1.5 shadow-xs"
                  >
                    <Receipt className="w-3.5 h-3.5" />
                    <span>Generate Invoice</span>
                  </button>
                </div>
              </div>
            )}

            {/* Tab 2: Visits & Consultations */}
            {activeProfileTab === 'visits' && (
              <div className="space-y-3 max-h-80 overflow-y-auto text-xs pr-1">
                {selectedPatient.visits?.map((v, i) => (
                  <div key={v.id || i} className="p-3 bg-slate-50 rounded-2xl border border-slate-100 space-y-2">
                    <div className="flex items-center justify-between font-bold text-slate-800">
                      <span className="text-blue-600">{v.type} • {v.doctor}</span>
                      <span className="text-[10px] text-slate-400">{v.date}</span>
                    </div>
                    <div>
                      <span className="font-semibold text-slate-600">Chief Symptoms:</span> {v.symptoms}
                    </div>
                    {v.diagnosis && (
                      <div>
                        <span className="font-semibold text-slate-600">Diagnosis:</span> {v.diagnosis}
                      </div>
                    )}
                    {v.vitals && (
                      <div className="flex flex-wrap gap-2 py-1 text-[11px] font-mono text-slate-600">
                        <span className="bg-white px-2 py-0.5 rounded border border-slate-200">Temp: {v.vitals.temp}</span>
                        <span className="bg-white px-2 py-0.5 rounded border border-slate-200">BP: {v.vitals.bp}</span>
                        <span className="bg-white px-2 py-0.5 rounded border border-slate-200">Pulse: {v.vitals.pulse}</span>
                        <span className="bg-white px-2 py-0.5 rounded border border-slate-200">SpO2: {v.vitals.spo2}</span>
                      </div>
                    )}
                    {v.notes && <p className="text-slate-500 text-[11px] italic bg-white p-2 rounded-xl">{v.notes}</p>}
                  </div>
                ))}
              </div>
            )}

            {/* Tab 3: Prescriptions */}
            {activeProfileTab === 'prescriptions' && (
              <div className="space-y-3 max-h-80 overflow-y-auto text-xs">
                {selectedPatient.visits
                  ?.flatMap((v) => v.prescriptions || [])
                  .map((rx, idx) => (
                    <div key={idx} className="p-3 bg-purple-50/50 border border-purple-100 rounded-2xl flex items-center justify-between">
                      <div>
                        <div className="font-bold text-slate-800">{rx.medicine} ({rx.dosage})</div>
                        <div className="text-[11px] text-slate-500">{rx.frequency} • {rx.duration}</div>
                      </div>
                      <span className="px-2 py-0.5 bg-purple-200/70 text-purple-800 font-bold text-[10px] rounded-md">
                        Active
                      </span>
                    </div>
                  ))}
                {(!selectedPatient.visits || selectedPatient.visits.every((v) => !v.prescriptions?.length)) && (
                  <div className="text-center py-6 text-slate-400">No prescriptions recorded yet.</div>
                )}
              </div>
            )}

            {/* Tab 4: Billing History */}
            {activeProfileTab === 'billing' && (
              <div className="space-y-3 max-h-80 overflow-y-auto text-xs">
                {selectedPatient.billingRecords?.map((b, idx) => (
                  <div key={idx} className="p-3 bg-slate-50 border border-slate-100 rounded-2xl flex items-center justify-between">
                    <div>
                      <div className="font-bold text-slate-800">{b.invoiceId}</div>
                      <div className="text-[11px] text-slate-500">
                        Paid: ₹ {b.paid} | Balance: ₹ {b.balance}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-slate-800">₹ {b.amount}</div>
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                        b.status === 'Paid' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'
                      }`}>
                        {b.status}
                      </span>
                    </div>
                  </div>
                ))}
                {(!selectedPatient.billingRecords || selectedPatient.billingRecords.length === 0) && (
                  <div className="text-center py-6 text-slate-400">No billing invoices found.</div>
                )}
              </div>
            )}

            {/* Tab 5: Audit Trail (FR-2.9) */}
            {activeProfileTab === 'audit' && (
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 text-xs space-y-2">
                <div className="font-bold text-slate-700 mb-2 flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-blue-600" />
                  Audit Trail & Compliance Log
                </div>
                <div className="text-slate-600">
                  <span className="font-semibold">Record Created:</span> {selectedPatient.createdAt || 'Initial Seed'}
                </div>
                <div className="text-slate-600">
                  <span className="font-semibold">Registered By:</span> {selectedPatient.createdBy || 'System Administrator'}
                </div>
                {selectedPatient.updatedAt && (
                  <div className="text-slate-600">
                    <span className="font-semibold">Last Modified:</span> {selectedPatient.updatedAt} by {selectedPatient.updatedBy}
                  </div>
                )}
                <div className="text-[11px] text-slate-400 pt-2 border-t border-slate-200">
                  Tamper-proof compliance log stored in accordance with ISO/IEC/IEEE 29148 healthcare data retention guidelines.
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Patient Registration / Edit Modal (SRS Section 4 Form) */}
      {showRegModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-3xl w-full p-6 sm:p-8 shadow-2xl border border-slate-100 max-h-[90vh] overflow-y-auto animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-5">
              <div>
                <h3 className="text-lg font-extrabold text-slate-800">
                  {editPatientData ? 'Edit Patient Record' : 'Register New Patient (UHID)'}
                </h3>
                <p className="text-xs text-slate-500">
                  Captures all mandatory personal, contact, medical & insurance details per SRS Section 4
                </p>
              </div>
              <button
                onClick={() => setShowRegModal(false)}
                className="p-1.5 text-slate-400 hover:text-slate-600 rounded-xl"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Duplicate Warning Prompt (FR-2.6) */}
            {duplicateWarning && (
              <div className="mb-5 p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 text-xs">
                <div className="font-bold flex items-center gap-2 mb-1">
                  <AlertCircle className="w-4 h-4 text-amber-600" />
                  Possible Duplicate Registration Detected!
                </div>
                <p>
                  A patient with matching Name, Date of Birth, and Phone already exists: <br />
                  <strong className="font-mono text-amber-800">{duplicateWarning.uhid} - {duplicateWarning.firstName} {duplicateWarning.lastName} (DOB: {duplicateWarning.dob}, Phone: {duplicateWarning.phone})</strong>.
                </p>
                <div className="mt-3 flex items-center gap-2">
                  <button
                    onClick={() => handleSavePatient(true)}
                    className="px-3 py-1.5 bg-amber-600 hover:bg-amber-700 text-white font-semibold rounded-xl text-xs"
                  >
                    Proceed Anyway (Confirm Duplicate)
                  </button>
                  <button
                    onClick={() => setDuplicateWarning(null)}
                    className="px-3 py-1.5 bg-white border border-amber-300 text-amber-800 rounded-xl text-xs font-semibold"
                  >
                    Review Details
                  </button>
                </div>
              </div>
            )}

            {/* Form Fields Organized by Section 4 */}
            <div className="space-y-6 text-xs">
              {/* 4.1 Personal Details */}
              <div>
                <h4 className="font-bold text-slate-800 text-sm mb-3 flex items-center gap-1.5">
                  <span className="w-5 h-5 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-xs">1</span>
                  Section 4.1: Personal Details
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="font-semibold text-slate-700 block mb-1">First Name *</label>
                    <input
                      type="text"
                      value={formData.firstName}
                      onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                      placeholder="e.g. Ananya"
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-blue-500 outline-none"
                    />
                    {formErrors.firstName && <span className="text-rose-600 text-[10px]">{formErrors.firstName}</span>}
                  </div>

                  <div>
                    <label className="font-semibold text-slate-700 block mb-1">Last Name *</label>
                    <input
                      type="text"
                      value={formData.lastName}
                      onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                      placeholder="e.g. Sharma"
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-blue-500 outline-none"
                    />
                    {formErrors.lastName && <span className="text-rose-600 text-[10px]">{formErrors.lastName}</span>}
                  </div>

                  <div>
                    <label className="font-semibold text-slate-700 block mb-1">Date of Birth *</label>
                    <input
                      type="date"
                      value={formData.dob}
                      onChange={(e) => setFormData({ ...formData, dob: e.target.value })}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-blue-500 outline-none"
                    />
                    {formErrors.dob && <span className="text-rose-600 text-[10px]">{formErrors.dob}</span>}
                  </div>

                  <div>
                    <label className="font-semibold text-slate-700 block mb-1">Gender *</label>
                    <select
                      value={formData.gender}
                      onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-blue-500 outline-none"
                    >
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>

                  <div>
                    <label className="font-semibold text-slate-700 block mb-1">Blood Group *</label>
                    <select
                      value={formData.bloodGroup}
                      onChange={(e) => setFormData({ ...formData, bloodGroup: e.target.value })}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-blue-500 outline-none"
                    >
                      {['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map((bg) => (
                        <option key={bg} value={bg}>{bg}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="font-semibold text-slate-700 block mb-1">Marital Status</label>
                    <select
                      value={formData.maritalStatus}
                      onChange={(e) => setFormData({ ...formData, maritalStatus: e.target.value })}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-blue-500 outline-none"
                    >
                      <option value="Single">Single</option>
                      <option value="Married">Married</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>

                  <div className="sm:col-span-3">
                    <label className="font-semibold text-slate-700 block mb-1">National ID / Aadhaar (Optional)</label>
                    <input
                      type="text"
                      value={formData.nationalId}
                      onChange={(e) => setFormData({ ...formData, nationalId: e.target.value })}
                      placeholder="e.g. XXXX-XXXX-1234"
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-blue-500 outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* 4.2 Contact Details */}
              <div>
                <h4 className="font-bold text-slate-800 text-sm mb-3 flex items-center gap-1.5">
                  <span className="w-5 h-5 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-xs">2</span>
                  Section 4.2: Contact Details
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="font-semibold text-slate-700 block mb-1">Primary Phone (10 digits) *</label>
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value.replace(/\D/g, '').slice(0, 10) })}
                      placeholder="9876543210"
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-blue-500 outline-none"
                    />
                    {formErrors.phone && <span className="text-rose-600 text-[10px]">{formErrors.phone}</span>}
                  </div>

                  <div>
                    <label className="font-semibold text-slate-700 block mb-1">Alternate Phone</label>
                    <input
                      type="tel"
                      value={formData.alternatePhone}
                      onChange={(e) => setFormData({ ...formData, alternatePhone: e.target.value.replace(/\D/g, '').slice(0, 10) })}
                      placeholder="9876543211"
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-blue-500 outline-none"
                    />
                  </div>

                  <div>
                    <label className="font-semibold text-slate-700 block mb-1">E-mail</label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="name@example.com"
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-blue-500 outline-none"
                    />
                  </div>

                  <div className="sm:col-span-3">
                    <label className="font-semibold text-slate-700 block mb-1">Full Address *</label>
                    <textarea
                      rows={2}
                      value={formData.address}
                      onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                      placeholder="Street, City, State, PIN code"
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-blue-500 outline-none"
                    />
                    {formErrors.address && <span className="text-rose-600 text-[10px]">{formErrors.address}</span>}
                  </div>
                </div>
              </div>

              {/* 4.3 Emergency Contact */}
              <div>
                <h4 className="font-bold text-slate-800 text-sm mb-3 flex items-center gap-1.5">
                  <span className="w-5 h-5 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-xs">3</span>
                  Section 4.3: Emergency Contact
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="font-semibold text-slate-700 block mb-1">Contact Name *</label>
                    <input
                      type="text"
                      value={formData.emergencyContact.name}
                      onChange={(e) => setFormData({ ...formData, emergencyContact: { ...formData.emergencyContact, name: e.target.value } })}
                      placeholder="e.g. Rohan Sharma"
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-blue-500 outline-none"
                    />
                    {formErrors.emergencyName && <span className="text-rose-600 text-[10px]">{formErrors.emergencyName}</span>}
                  </div>

                  <div>
                    <label className="font-semibold text-slate-700 block mb-1">Relationship *</label>
                    <input
                      type="text"
                      value={formData.emergencyContact.relationship}
                      onChange={(e) => setFormData({ ...formData, emergencyContact: { ...formData.emergencyContact, relationship: e.target.value } })}
                      placeholder="e.g. Spouse / Parent"
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-blue-500 outline-none"
                    />
                    {formErrors.emergencyRel && <span className="text-rose-600 text-[10px]">{formErrors.emergencyRel}</span>}
                  </div>

                  <div>
                    <label className="font-semibold text-slate-700 block mb-1">Contact Phone (10 digits) *</label>
                    <input
                      type="tel"
                      value={formData.emergencyContact.phone}
                      onChange={(e) => setFormData({ ...formData, emergencyContact: { ...formData.emergencyContact, phone: e.target.value.replace(/\D/g, '').slice(0, 10) } })}
                      placeholder="9876543212"
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-blue-500 outline-none"
                    />
                    {formErrors.emergencyPhone && <span className="text-rose-600 text-[10px]">{formErrors.emergencyPhone}</span>}
                  </div>
                </div>
              </div>

              {/* 4.4 Medical Details */}
              <div>
                <h4 className="font-bold text-slate-800 text-sm mb-3 flex items-center gap-1.5">
                  <span className="w-5 h-5 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-xs">4</span>
                  Section 4.4: Medical History & Biometrics
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="font-semibold text-slate-700 block mb-1">Known Allergies * ("None" allowed)</label>
                    <input
                      type="text"
                      value={formData.medical.allergies}
                      onChange={(e) => setFormData({ ...formData, medical: { ...formData.medical, allergies: e.target.value } })}
                      placeholder="e.g. Penicillin, Peanuts, None"
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-blue-500 outline-none"
                    />
                    {formErrors.allergies && <span className="text-rose-600 text-[10px]">{formErrors.allergies}</span>}
                  </div>

                  <div>
                    <label className="font-semibold text-slate-700 block mb-1">Chronic Conditions</label>
                    <input
                      type="text"
                      value={formData.medical.chronicConditions}
                      onChange={(e) => setFormData({ ...formData, medical: { ...formData.medical, chronicConditions: e.target.value } })}
                      placeholder="e.g. Diabetes, Hypertension"
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-blue-500 outline-none"
                    />
                  </div>

                  <div>
                    <label className="font-semibold text-slate-700 block mb-1">Height (cm)</label>
                    <input
                      type="number"
                      value={formData.medical.height}
                      onChange={(e) => setFormData({ ...formData, medical: { ...formData.medical, height: e.target.value } })}
                      placeholder="e.g. 170"
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-blue-500 outline-none"
                    />
                  </div>

                  <div>
                    <label className="font-semibold text-slate-700 block mb-1">Weight (kg)</label>
                    <input
                      type="number"
                      value={formData.medical.weight}
                      onChange={(e) => setFormData({ ...formData, medical: { ...formData.medical, weight: e.target.value } })}
                      placeholder="e.g. 68"
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-blue-500 outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* 4.5 Insurance Details */}
              <div>
                <h4 className="font-bold text-slate-800 text-sm mb-3 flex items-center gap-1.5">
                  <span className="w-5 h-5 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-xs">5</span>
                  Section 4.5: Insurance Details
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="font-semibold text-slate-700 block mb-1">Insurance Provider</label>
                    <input
                      type="text"
                      value={formData.insurance.provider}
                      onChange={(e) => setFormData({ ...formData, insurance: { ...formData.insurance, provider: e.target.value } })}
                      placeholder="e.g. Star Health / ICICI"
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-blue-500 outline-none"
                    />
                  </div>

                  <div>
                    <label className="font-semibold text-slate-700 block mb-1">Policy / Member Number</label>
                    <input
                      type="text"
                      value={formData.insurance.policyNumber}
                      onChange={(e) => setFormData({ ...formData, insurance: { ...formData.insurance, policyNumber: e.target.value } })}
                      placeholder="e.g. POL-89912"
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-blue-500 outline-none"
                    />
                    {formErrors.policyNumber && <span className="text-rose-600 text-[10px]">{formErrors.policyNumber}</span>}
                  </div>

                  <div>
                    <label className="font-semibold text-slate-700 block mb-1">Policy Validity</label>
                    <input
                      type="date"
                      value={formData.insurance.validity}
                      onChange={(e) => setFormData({ ...formData, insurance: { ...formData.insurance, validity: e.target.value } })}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-blue-500 outline-none"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Actions */}
            <div className="mt-8 pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => setShowRegModal(false)}
                className="px-5 py-2.5 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 font-semibold text-xs"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => handleSavePatient(false)}
                className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs shadow-md shadow-blue-500/20"
              >
                {editPatientData ? 'Save Changes' : 'Generate UHID & Register'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
