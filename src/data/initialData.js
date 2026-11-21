// Initial seed data for CareNova Hospital Management System
// Aligned with the UI specification & SRS document requirements

export const INITIAL_USER = {
  id: 'USR-001',
  name: 'Kyra',
  fullName: 'Kyra Sen',
  role: 'Admin', // Admin, Receptionist, Doctor, Nurse, Billing Clerk
  avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=200',
  email: 'kyra.sen@carenova.health'
};

export const AVAILABLE_ROLES = [
  { id: 'Admin', name: 'Kyra (Admin)', role: 'Admin', desc: 'Full hospital administrative control & reports' },
  { id: 'Receptionist', name: 'Meena K (Receptionist)', role: 'Receptionist', desc: 'Patient registration, appointment booking, invoices' },
  { id: 'Doctor', name: 'Dr. Arvind Patel (Doctor)', role: 'Doctor', desc: 'Consultations, diagnoses, prescriptions, EMR' },
  { id: 'Nurse', name: 'Sister Mary (Nurse)', role: 'Nurse', desc: 'Record vitals, IPD bed status, admissions' },
  { id: 'BillingClerk', name: 'Rohan V (Billing Clerk)', role: 'Billing Clerk', desc: 'Invoices, payments, receipts, billing reports' },
];

export const INITIAL_DEPARTMENTS = [
  { id: 'DEP-01', name: 'Cardiology', head: 'Dr. Arvind Patel', beds: 35, active: true },
  { id: 'DEP-02', name: 'Neurology', head: 'Dr. Sneha Rao', beds: 30, active: true },
  { id: 'DEP-03', name: 'Orthopedics', head: 'Dr. Rajesh Kumar', beds: 40, active: true },
  { id: 'DEP-04', name: 'Pediatrics', head: 'Dr. Meera Nambiar', beds: 25, active: true },
  { id: 'DEP-05', name: 'General Medicine', head: 'Dr. Amit Verma', beds: 50, active: true },
  { id: 'DEP-06', name: 'Emergency & Trauma', head: 'Dr. Sarah Joseph', beds: 20, active: true }
];

export const INITIAL_DOCTORS = [
  {
    id: 'DOC-01',
    name: 'Dr. Arvind Patel',
    department: 'Cardiology',
    specialization: 'Senior Interventional Cardiologist',
    qualification: 'MBBS, MD (Med), DM (Cardiology)',
    fee: 800,
    phone: '9845012340',
    schedule: 'Mon - Sat (09:00 AM - 02:00 PM)',
    active: true
  },
  {
    id: 'DOC-02',
    name: 'Dr. Sneha Rao',
    department: 'Neurology',
    specialization: 'Consultant Neuro-physician',
    qualification: 'MBBS, MD, DM (Neurology)',
    fee: 1000,
    phone: '9845012341',
    schedule: 'Mon - Fri (10:00 AM - 03:00 PM)',
    active: true
  },
  {
    id: 'DOC-03',
    name: 'Dr. Rajesh Kumar',
    department: 'Orthopedics',
    specialization: 'Joint Replacement & Spine Surgeon',
    qualification: 'MBBS, MS (Ortho), M.Ch',
    fee: 750,
    phone: '9845012342',
    schedule: 'Mon - Sat (11:00 AM - 05:00 PM)',
    active: true
  },
  {
    id: 'DOC-04',
    name: 'Dr. Meera Nambiar',
    department: 'Pediatrics',
    specialization: 'Consultant Pediatrician',
    qualification: 'MBBS, DCH, MD (Pediatrics)',
    fee: 600,
    phone: '9845012343',
    schedule: 'Tue - Sun (09:00 AM - 01:00 PM)',
    active: true
  },
  {
    id: 'DOC-05',
    name: 'Dr. Amit Verma',
    department: 'General Medicine',
    specialization: 'General Physician & Diabetologist',
    qualification: 'MBBS, MD (Gen Med)',
    fee: 500,
    phone: '9845012344',
    schedule: 'Mon - Sat (08:00 AM - 04:00 PM)',
    active: true
  }
];

export const INITIAL_PATIENTS = [
  {
    uhid: 'HMS-2026-000101',
    firstName: 'Ananya',
    lastName: 'Sharma',
    dob: '1996-05-14',
    age: 30,
    gender: 'Female',
    bloodGroup: 'O+',
    maritalStatus: 'Married',
    nationalId: 'XXXX-XXXX-4589',
    phone: '9876543210',
    alternatePhone: '9876543211',
    email: 'ananya.s@example.com',
    address: 'Flat 402, Green Glen Heights, Bengaluru, KA - 560103',
    emergencyContact: {
      name: 'Rohan Sharma',
      relationship: 'Spouse',
      phone: '9876543212'
    },
    medical: {
      allergies: 'Penicillin, Dust mites',
      chronicConditions: 'Mild Asthma',
      currentMedications: 'Levocetirizine 5mg PRN',
      pastSurgeries: 'Appendectomy (2018)',
      familyHistory: 'Maternal Hypertension',
      height: 165,
      weight: 62,
      bmi: 22.8
    },
    insurance: {
      provider: 'Star Health Care',
      policyNumber: 'SH-2026-98124',
      validity: '2027-12-31'
    },
    status: 'Admitted',
    admissionStatus: 'Stable', // Stable, Under Observation, Critical, Discharged
    roomNumber: 'Room 101',
    admittedAt: '2026-11-20 14:00',
    timeAgo: '2 hrs ago',
    assignedDoctor: 'Dr. Arvind Patel',
    department: 'Cardiology',
    visits: [
      {
        id: 'VST-101',
        date: '2026-11-20 14:00',
        type: 'IPD',
        doctor: 'Dr. Arvind Patel',
        symptoms: 'Chest tightness, palpitations post mild exertion',
        vitals: { temp: '98.6 °F', bp: '124/82 mmHg', pulse: '78 bpm', spo2: '98%', height: 165, weight: 62 },
        diagnosis: 'Sinus Tachycardia, rule out secondary angina',
        notes: 'IV fluid hydration started, continuous cardiac monitoring initiated.',
        prescriptions: [
          { medicine: 'Metoprolol Tartrate', dosage: '25mg', frequency: 'Once daily', duration: '5 days' },
          { medicine: 'Aspirin', dosage: '75mg', frequency: 'Once daily post lunch', duration: '7 days' }
        ],
        labTests: ['ECG 12-Lead', 'Cardiac Troponin I', 'Lipid Profile']
      }
    ],
    billingRecords: [
      { invoiceId: 'INV-2026-0045', amount: 12500, paid: 12500, balance: 0, status: 'Paid' }
    ],
    createdAt: '2026-11-20 13:45',
    createdBy: 'Meena K (Receptionist)'
  },
  {
    uhid: 'HMS-2026-000102',
    firstName: 'Vignesh',
    lastName: 'Ramaswamy',
    dob: '1988-11-03',
    age: 38,
    gender: 'Male',
    bloodGroup: 'B+',
    maritalStatus: 'Married',
    nationalId: 'XXXX-XXXX-9901',
    phone: '9820123456',
    alternatePhone: '',
    email: 'vignesh.r@example.com',
    address: '12/4, 5th Cross, Indiranagar, Bengaluru, KA - 560038',
    emergencyContact: {
      name: 'Sunita Ramaswamy',
      relationship: 'Spouse',
      phone: '9820123457'
    },
    medical: {
      allergies: 'None',
      chronicConditions: 'Type 2 Diabetes',
      currentMedications: 'Metformin 500mg BD',
      pastSurgeries: 'None',
      familyHistory: 'Type 2 Diabetes (Father)',
      height: 174,
      weight: 78,
      bmi: 25.8
    },
    insurance: {
      provider: 'HDFC ERGO Health',
      policyNumber: 'HDFC-8921-99',
      validity: '2027-08-15'
    },
    status: 'Admitted',
    admissionStatus: 'Under Observation',
    roomNumber: 'Room 205',
    admittedAt: '2026-11-20 13:00',
    timeAgo: '3 hrs ago',
    assignedDoctor: 'Dr. Sneha Rao',
    department: 'Neurology',
    visits: [
      {
        id: 'VST-102',
        date: '2026-11-20 13:00',
        type: 'IPD',
        doctor: 'Dr. Sneha Rao',
        symptoms: 'Sudden migraine with aura, visual disturbances',
        vitals: { temp: '98.4 °F', bp: '138/90 mmHg', pulse: '84 bpm', spo2: '99%', height: 174, weight: 78 },
        diagnosis: 'Acute Complex Migraine with Transient Visual Aura',
        notes: 'Under neurological observation. Darkened quiet room advised.',
        prescriptions: [
          { medicine: 'Sumatriptan', dosage: '50mg', frequency: 'At onset', duration: '3 days' },
          { medicine: 'Paracetamol', dosage: '650mg', frequency: 'SOS after food', duration: '3 days' }
        ],
        labTests: ['Brain MRI Screening', 'Random Blood Glucose']
      }
    ],
    billingRecords: [
      { invoiceId: 'INV-2026-0046', amount: 8900, paid: 5000, balance: 3900, status: 'Partially Paid' }
    ],
    createdAt: '2026-11-20 12:50',
    createdBy: 'Meena K (Receptionist)'
  },
  {
    uhid: 'HMS-2026-000103',
    firstName: 'Priya',
    lastName: 'Mukherjee',
    dob: '2001-02-18',
    age: 25,
    gender: 'Female',
    bloodGroup: 'A+',
    maritalStatus: 'Single',
    nationalId: 'XXXX-XXXX-7723',
    phone: '9845199201',
    alternatePhone: '',
    email: 'priya.m@example.com',
    address: 'B-108, Palm Meadows, Whitefield, Bengaluru - 560066',
    emergencyContact: {
      name: 'Dr. S. Mukherjee',
      relationship: 'Father',
      phone: '9845199202'
    },
    medical: {
      allergies: 'Sulfa drugs',
      chronicConditions: 'None',
      currentMedications: 'None',
      pastSurgeries: 'ACL repair (2022)',
      familyHistory: 'None reported',
      height: 160,
      weight: 54,
      bmi: 21.1
    },
    insurance: {
      provider: 'ICICI Lombard',
      policyNumber: 'IL-662301-A',
      validity: '2027-05-10'
    },
    status: 'Admitted',
    admissionStatus: 'Admitted',
    roomNumber: 'Room 308',
    admittedAt: '2026-11-20 12:00',
    timeAgo: '4 hrs ago',
    assignedDoctor: 'Dr. Rajesh Kumar',
    department: 'Orthopedics',
    visits: [
      {
        id: 'VST-103',
        date: '2026-11-20 12:00',
        type: 'IPD',
        doctor: 'Dr. Rajesh Kumar',
        symptoms: 'Right ankle sprain with acute lateral swelling post-badminton',
        vitals: { temp: '98.8 °F', bp: '118/76 mmHg', pulse: '72 bpm', spo2: '99%', height: 160, weight: 54 },
        diagnosis: 'Grade II Anterior Talofibular Ligament Sprain',
        notes: 'Rest, Ice, Compression, Elevation protocol initiated with stirrup brace.',
        prescriptions: [
          { medicine: 'Ibuprofen', dosage: '400mg', frequency: 'Twice daily after food', duration: '5 days' },
          { medicine: 'Pantoprazole', dosage: '40mg', frequency: 'Once daily before breakfast', duration: '5 days' }
        ],
        labTests: ['Right Ankle Digital X-Ray (AP & Lateral)']
      }
    ],
    billingRecords: [
      { invoiceId: 'INV-2026-0047', amount: 5600, paid: 5600, balance: 0, status: 'Paid' }
    ],
    createdAt: '2026-11-20 11:45',
    createdBy: 'Meena K (Receptionist)'
  },
  {
    uhid: 'HMS-2026-000104',
    firstName: 'Devendra',
    lastName: 'Choudhary',
    dob: '1962-08-11',
    age: 64,
    gender: 'Male',
    bloodGroup: 'AB+',
    maritalStatus: 'Married',
    nationalId: 'XXXX-XXXX-1144',
    phone: '9833445566',
    alternatePhone: '',
    email: 'devendra.c@example.com',
    address: 'House 88, Koramangala 4th Block, Bengaluru - 560034',
    emergencyContact: {
      name: 'Aditi Choudhary',
      relationship: 'Daughter',
      phone: '9833445567'
    },
    medical: {
      allergies: 'Aspirin',
      chronicConditions: 'COPD, Hypertension',
      currentMedications: 'Formoterol inhaler, Amlodipine 5mg',
      pastSurgeries: 'CABG (2019)',
      familyHistory: 'CAD',
      height: 168,
      weight: 71,
      bmi: 25.2
    },
    insurance: {
      provider: 'Max Bupa / Niva Bupa',
      policyNumber: 'NB-778899',
      validity: '2027-03-31'
    },
    status: 'Admitted',
    admissionStatus: 'Critical',
    roomNumber: 'ICU Bed 02',
    admittedAt: '2026-11-19 22:30',
    timeAgo: 'Yesterday',
    assignedDoctor: 'Dr. Sarah Joseph',
    department: 'Emergency & Trauma',
    visits: [
      {
        id: 'VST-104',
        date: '2026-11-19 22:30',
        type: 'Emergency',
        doctor: 'Dr. Sarah Joseph',
        symptoms: 'Acute exacerbation of COPD with respiratory distress',
        vitals: { temp: '100.2 °F', bp: '154/96 mmHg', pulse: '112 bpm', spo2: '89%', height: 168, weight: 71 },
        diagnosis: 'Acute Severe COPD Exacerbation with Hypercapnia',
        notes: 'BiPAP non-invasive ventilation initiated. Nebulization Q4H.',
        prescriptions: [
          { medicine: 'Hydrocortisone IV', dosage: '100mg', frequency: 'Q8H', duration: '3 days' },
          { medicine: 'Amoxicillin + Clavulanate', dosage: '1.2g IV', frequency: 'BD', duration: '5 days' }
        ],
        labTests: ['Arterial Blood Gas (ABG)', 'Chest X-Ray Portable', 'CBC & CRP']
      }
    ],
    billingRecords: [
      { invoiceId: 'INV-2026-0042', amount: 48000, paid: 25000, balance: 23000, status: 'Partially Paid' }
    ],
    createdAt: '2026-11-19 22:15',
    createdBy: 'Dr. Sarah Joseph'
  },
  {
    uhid: 'HMS-2026-000105',
    firstName: 'Meenakshi',
    lastName: 'Iyer',
    dob: '1975-03-22',
    age: 51,
    gender: 'Female',
    bloodGroup: 'O-',
    maritalStatus: 'Married',
    nationalId: 'XXXX-XXXX-6602',
    phone: '9844001122',
    alternatePhone: '',
    email: 'meenakshi.i@example.com',
    address: '77, Malleshwaram 15th Cross, Bengaluru - 560003',
    emergencyContact: {
      name: 'K. Iyer',
      relationship: 'Spouse',
      phone: '9844001123'
    },
    medical: {
      allergies: 'None',
      chronicConditions: 'Hypothyroidism',
      currentMedications: 'Thyronorm 50mcg OD',
      pastSurgeries: 'Cholecystectomy (2015)',
      familyHistory: 'Thyroid disorder',
      height: 158,
      weight: 65,
      bmi: 26.0
    },
    insurance: {
      provider: 'United India Insurance',
      policyNumber: 'UII-0912-78',
      validity: '2027-01-20'
    },
    status: 'Discharged',
    admissionStatus: 'Discharged',
    roomNumber: 'Discharged (Prev Room 104)',
    admittedAt: '2026-11-18 10:00',
    timeAgo: 'Discharged 6h ago',
    assignedDoctor: 'Dr. Amit Verma',
    department: 'General Medicine',
    visits: [
      {
        id: 'VST-105',
        date: '2026-11-18 10:00',
        type: 'IPD',
        doctor: 'Dr. Amit Verma',
        symptoms: 'High grade fever with chills, body aches for 3 days',
        vitals: { temp: '98.6 °F', bp: '120/80 mmHg', pulse: '76 bpm', spo2: '99%', height: 158, weight: 65 },
        diagnosis: 'Dengue Fever without warning signs - Recovered',
        notes: 'Platelet counts stabilized at 1.8 Lakhs. Patient clinically recovered and fit for discharge.',
        prescriptions: [
          { medicine: 'Paracetamol', dosage: '650mg', frequency: 'SOS for body ache', duration: '3 days' },
          { medicine: 'ORS Solution', dosage: '200ml', frequency: 'Thrice daily', duration: '5 days' }
        ],
        labTests: ['Dengue NS1 Antigen', 'Complete Blood Count (Serial)']
      }
    ],
    billingRecords: [
      { invoiceId: 'INV-2026-0038', amount: 18400, paid: 18400, balance: 0, status: 'Paid' }
    ],
    createdAt: '2026-11-18 09:30',
    createdBy: 'Meena K (Receptionist)'
  }
];

export const INITIAL_BEDS = [
  { id: 'BED-101', room: 'Room 101', ward: 'General Ward - A', type: 'Standard', status: 'Occupied', patient: 'Ananya Sharma', uhid: 'HMS-2026-000101' },
  { id: 'BED-102', room: 'Room 102', ward: 'General Ward - A', type: 'Standard', status: 'Available', patient: null, uhid: null },
  { id: 'BED-103', room: 'Room 103', ward: 'General Ward - A', type: 'Standard', status: 'Reserved', patient: 'Suresh Menon (Elective)', uhid: 'HMS-2026-000088' },
  { id: 'BED-201', room: 'Room 201', ward: 'Special Deluxe - B', type: 'Deluxe', status: 'Available', patient: null, uhid: null },
  { id: 'BED-205', room: 'Room 205', ward: 'Special Deluxe - B', type: 'Deluxe', status: 'Occupied', patient: 'Vignesh Ramaswamy', uhid: 'HMS-2026-000102' },
  { id: 'BED-308', room: 'Room 308', ward: 'Orthopedic Ward - C', type: 'Standard', status: 'Occupied', patient: 'Priya Mukherjee', uhid: 'HMS-2026-000103' },
  { id: 'BED-ICU-01', room: 'ICU Bed 01', ward: 'Intensive Care Unit', type: 'ICU', status: 'Available', patient: null, uhid: null },
  { id: 'BED-ICU-02', room: 'ICU Bed 02', ward: 'Intensive Care Unit', type: 'ICU', status: 'Occupied', patient: 'Devendra Choudhary', uhid: 'HMS-2026-000104' },
  { id: 'BED-ICU-03', room: 'ICU Bed 03', ward: 'Intensive Care Unit', type: 'ICU', status: 'Occupied', patient: 'Laxmi Narayanan', uhid: 'HMS-2026-000095' },
  { id: 'BED-401', room: 'Room 401', ward: 'Pediatric Wing', type: 'Standard', status: 'Available', patient: null, uhid: null }
];

export const INITIAL_MEDICINES = [
  { id: 'MED-01', name: 'Paracetamol', dosage: '650mg Tabs', stock: 1200, maxCapacity: 1500, category: 'Analgesic / Antipyretic', unit: 'units', status: 'Healthy', color: 'emerald' },
  { id: 'MED-02', name: 'Amoxicillin', dosage: '500mg Caps', stock: 850, maxCapacity: 1000, category: 'Antibiotic', unit: 'units', status: 'Healthy', color: 'blue' },
  { id: 'MED-03', name: 'Ibuprofen', dosage: '400mg Tabs', stock: 640, maxCapacity: 1000, category: 'NSAID / Anti-inflammatory', unit: 'units', status: 'Healthy', color: 'amber' },
  { id: 'MED-04', name: 'ORS', dosage: 'Oral Rehydration Sachet', stock: 1000, maxCapacity: 1200, category: 'Electrolyte Balance', unit: 'units', status: 'Healthy', color: 'purple' },
  { id: 'MED-05', name: 'Pantoprazole', dosage: '40mg Tabs', stock: 920, maxCapacity: 1200, category: 'Antacid / PPI', unit: 'units', status: 'Healthy', color: 'emerald' },
  { id: 'MED-06', name: 'Azithromycin', dosage: '500mg Tabs', stock: 410, maxCapacity: 800, category: 'Antibiotic', unit: 'units', status: 'Healthy', color: 'blue' },
  { id: 'MED-07', name: 'Metformin', dosage: '500mg Tabs', stock: 780, maxCapacity: 1000, category: 'Anti-Diabetic', unit: 'units', status: 'Healthy', color: 'emerald' }
];

export const INITIAL_APPOINTMENTS = [
  {
    id: 'APT-2026-001',
    patientName: 'Ananya Sharma',
    uhid: 'HMS-2026-000101',
    doctor: 'Dr. Arvind Patel',
    department: 'Cardiology',
    date: '2026-11-20',
    time: '09:30 AM',
    status: 'Checked-in', // Scheduled, Checked-in, Completed, Cancelled, No-show
    reason: 'Follow-up ECG & Cardiac rhythm evaluation',
    type: 'Follow-up'
  },
  {
    id: 'APT-2026-002',
    patientName: 'Vignesh Ramaswamy',
    uhid: 'HMS-2026-000102',
    doctor: 'Dr. Sneha Rao',
    department: 'Neurology',
    date: '2026-11-20',
    time: '10:30 AM',
    status: 'Scheduled',
    reason: 'Frequent migraine spells and visual distortion',
    type: 'Consultation'
  },
  {
    id: 'APT-2026-003',
    patientName: 'Priya Mukherjee',
    uhid: 'HMS-2026-000103',
    doctor: 'Dr. Rajesh Kumar',
    department: 'Orthopedics',
    date: '2026-11-20',
    time: '11:45 AM',
    status: 'Completed',
    reason: 'Right ankle ligament swelling assessment',
    type: 'Consultation'
  },
  {
    id: 'APT-2026-004',
    patientName: 'Kunal Kapoor',
    uhid: 'HMS-2026-000078',
    doctor: 'Dr. Meera Nambiar',
    department: 'Pediatrics',
    date: '2026-11-20',
    time: '02:00 PM',
    status: 'Scheduled',
    reason: 'Routine 1-year developmental pediatric checkup',
    type: 'Routine Checkup'
  },
  {
    id: 'APT-2026-005',
    patientName: 'Devendra Choudhary',
    uhid: 'HMS-2026-000104',
    doctor: 'Dr. Amit Verma',
    department: 'General Medicine',
    date: '2026-11-20',
    time: '03:15 PM',
    status: 'Scheduled',
    reason: 'Diabetic routine HbA1c review and insulin adjustment',
    type: 'Follow-up'
  }
];

export const INITIAL_INVOICES = [
  {
    id: 'INV-2026-0045',
    patientName: 'Ananya Sharma',
    uhid: 'HMS-2026-000101',
    date: '2026-11-20',
    items: [
      { desc: 'Cardiology Specialist Consultation', qty: 1, rate: 800, amount: 800 },
      { desc: '12-Lead Digital Electrocardiogram (ECG)', qty: 1, rate: 1200, amount: 1200 },
      { desc: 'Cardiac Troponin I Quantitative Test', qty: 1, rate: 2500, amount: 2500 },
      { desc: 'Day Care Observation & Cardiac Monitoring (Room 101)', qty: 1, rate: 7000, amount: 7000 },
      { desc: 'Nursing & Emergency Dispensing Charges', qty: 1, rate: 1000, amount: 1000 }
    ],
    subtotal: 12500,
    discount: 0,
    tax: 0,
    total: 12500,
    paid: 12500,
    balance: 0,
    paymentMethod: 'UPI / Digital Payment',
    status: 'Paid'
  },
  {
    id: 'INV-2026-0046',
    patientName: 'Vignesh Ramaswamy',
    uhid: 'HMS-2026-000102',
    date: '2026-11-20',
    items: [
      { desc: 'Neurology Consultation (Dr. Sneha Rao)', qty: 1, rate: 1000, amount: 1000 },
      { desc: 'MRI Brain Protocol Screening', qty: 1, rate: 5500, amount: 5500 },
      { desc: 'Semi-Private Room 205 (Half Day)', qty: 1, rate: 2400, amount: 2400 }
    ],
    subtotal: 8900,
    discount: 0,
    tax: 0,
    total: 8900,
    paid: 5000,
    balance: 3900,
    paymentMethod: 'Credit Card (Partial)',
    status: 'Partially Paid'
  },
  {
    id: 'INV-2026-0047',
    patientName: 'Priya Mukherjee',
    uhid: 'HMS-2026-000103',
    date: '2026-11-20',
    items: [
      { desc: 'Orthopedic Consultation (Dr. Rajesh Kumar)', qty: 1, rate: 750, amount: 750 },
      { desc: 'Digital X-Ray Right Ankle 2 Views', qty: 1, rate: 1200, amount: 1200 },
      { desc: 'Pneumatic Stirrup Ankle Immobilizer Brace', qty: 1, rate: 2650, amount: 2650 },
      { desc: 'Pharmacy Dispensing (Analgesics & PPI)', qty: 1, rate: 1000, amount: 1000 }
    ],
    subtotal: 5600,
    discount: 0,
    tax: 0,
    total: 5600,
    paid: 5600,
    balance: 0,
    paymentMethod: 'Insurance TPA (ICICI Lombard)',
    status: 'Paid'
  },
  {
    id: 'INV-2026-0042',
    patientName: 'Devendra Choudhary',
    uhid: 'HMS-2026-000104',
    date: '2026-11-19',
    items: [
      { desc: 'Emergency Triage & Resuscitation', qty: 1, rate: 5000, amount: 5000 },
      { desc: 'ICU Bed Charges (Day 1 with BiPAP)', qty: 1, rate: 22000, amount: 22000 },
      { desc: 'Pulmonary Critical Care Specialist Visits', qty: 2, rate: 2500, amount: 5000 },
      { desc: 'Arterial Blood Gas (ABG) x 3', qty: 3, rate: 1200, amount: 3600 },
      { desc: 'ICU Drugs & IV Infusion Charges', qty: 1, rate: 12400, amount: 12400 }
    ],
    subtotal: 48000,
    discount: 0,
    tax: 0,
    total: 48000,
    paid: 25000,
    balance: 23000,
    paymentMethod: 'Cash + Insurance Deposit',
    status: 'Partially Paid'
  }
];

export const INITIAL_NOTIFICATIONS = [
  { id: 'NOTIF-1', title: 'Critical Patient Admitted', desc: 'Devendra Choudhary admitted to ICU Bed 02 under Dr. Sarah Joseph', time: '10 mins ago', type: 'critical' },
  { id: 'NOTIF-2', title: 'Low Stock Alert', desc: 'Azithromycin 500mg reached threshold level (410 units remaining)', time: '45 mins ago', type: 'warning' },
  { id: 'NOTIF-3', title: 'Bed Availability Update', desc: 'Room 104 sanitized and marked Available following discharge', time: '1 hr ago', type: 'info' }
];

export const DASHBOARD_STATS = {
  totalPatients: 124,
  admitted: 78,
  discharged: 46,
  critical: 2,
  patientStatusDistribution: [
    { label: 'Stable', count: 68, percentage: 55, color: '#10b981' }, // green
    { label: 'Under Observation', count: 34, percentage: 27, color: '#f59e0b' }, // orange
    { label: 'Critical', count: 14, percentage: 11, color: '#ef4444' }, // red
    { label: 'Others', count: 8, percentage: 7, color: '#94a3b8' } // grey
  ],
  bedAvailability: {
    percentage: 85,
    available: 68,
    occupied: 114,
    reserved: 18,
    total: 200
  },
  billing: {
    totalRevenue: '₹ 2,48,750',
    revenueGrowth: '+12%',
    pendingBills: '₹ 62,320',
    pendingGrowth: '↑ 5%'
  },
  reportsSummary: [
    { name: 'Medical Reports', badge: '+12 New', badgeType: 'blue' },
    { name: 'Billing Reports', badge: '+5 New', badgeType: 'purple' },
    { name: 'Stock Reports', badge: 'Updated', badgeType: 'green' },
    { name: 'Bed Allotment', badge: 'Updated', badgeType: 'green' }
  ]
};
