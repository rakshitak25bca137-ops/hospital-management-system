# CareNova Hospital Management System (HMS)

An enterprise-grade, web-based Hospital Management System (HMS) built in compliance with IEEE 830 / ISO/IEC/IEEE 29148 Software Requirements Specification (SRS) standards, replicating the modern CareNova Hospital UI design system.

---

## 🌟 Key Features

### 1. Dashboard (CareNova Design System)
* **Hospital Overview Banner**: Modern multistory glass hospital architecture with quick action links.
* **Patient Census & Metrics**: Real-time stats (**124 Total Patients**, **78 Admitted**, **46 Discharged**, **2 Critical**).
* **Patient Status Donut Chart**: Visual distribution of clinical acuity (Stable 55%, Under Observation 27%, Critical 11%, Others 7%).
* **Recent Admissions Roster**: Track recently admitted inpatients (Room 101, Room 205, Room 308).
* **Bed Availability Radial Gauge**: Visual representation of ward & ICU occupancy (85% available capacity, 68 available, 114 occupied, 18 reserved).
* **Medicine Stock Inventory**: Live safety stock bars for Paracetamol, Amoxicillin, Ibuprofen, ORS with health indicator alerts.
* **Billing & Financials**: Revenue tracking (₹ 2,48,750, +12% growth) and pending receivable bills (₹ 62,320, +5%) with trend sparklines.
* **Quick Actions Row**: 1-click shortcuts for Patient Admission, Diagnostic Reports, Pharmacy Stock, Bed Status, and Bill Generation.
* **Interactive AI Hospital Bot**: Floating conversational assistant supporting instant NLP queries and quick prompt chips.

### 2. Patient Management (SRS Section 4)
* **Section 4.1 Personal Details**: Automatic unique UHID generation (`HMS-2026-0001XX`), Name, DOB, automatic Age calculation, Gender, Blood Group, Marital Status, National ID/Aadhaar.
* **Section 4.2 Contact Details**: Validated 10-digit primary phone, alternate contact, email, and full address.
* **Section 4.3 Emergency Contact**: Next-of-kin contact name, relationship, and 10-digit phone number.
* **Section 4.4 Medical & Biometrics**: Mandatory allergy logging (*"None"* allowed), chronic illness tracking, past surgeries, and automatic **BMI calculation** from height and weight.
* **Section 4.5 Insurance Coverage**: TPA provider, policy number validation, and validity date tracking.
* **FR-2.6 Duplicate Prevention**: Automatic warning when Name, DOB, and Phone match an existing record.
* **FR-2.7 EMR Profile**: Complete patient record tabs for clinical visits, prescriptions, lab results, billing history, and tamper-proof audit trails.

### 3. Ward & Bed Allotment (Admissions)
* Interactive visual bed board categorized by Ward:
  * General Ward - A
  * Special Deluxe - B
  * Orthopedic Ward - C
  * Intensive Care Unit (ICU)
  * Pediatric Wing
* 1-click bed allotment and discharge workflow with automatic status synchronization.

### 4. Appointment Scheduling (SRS Section 3.4)
* Doctor and specialty slot selector.
* **Double-Booking Guard (FR-4.2)**: Intelligently locks already-booked slots for any doctor.
* Full appointment lifecycle tracking: `Scheduled` ➔ `Checked-in` ➔ `Completed` ➔ `Cancelled` (with recorded reason).

### 5. Consultation & EMR (SRS Section 3.5)
* Nurse vitals recording: Temperature, Blood Pressure, Pulse, SpO2, Weight, Height.
* Doctor clinical diagnosis, symptom entry, and treatment planning.
* e-Prescription builder: Medicine name, dosage, frequency, and duration.
* Diagnostic test orderer.
* **Printable Clinical Visit Summary & Prescription** format ready for official printing.

### 6. Billing & Invoicing (SRS Section 3.6)
* Line-item charge generator for consultations, bed stay, lab diagnostics, and pharmacy.
* Automatic calculation of subtotal, discounts, GST/tax, and grand total.
* Multi-mode payment recording: Cash, Card, UPI/QR, Insurance TPA (supports partial payments).
* **Printable Official Tax Invoice & GST Receipt**.

### 7. Reports & Analytics (SRS Section 3.7)
* Censuses for patient acuity, diagnostic queues, revenue collections, and bed allotment.
* **1-Click CSV Export** for patient directories and billing records.

### 8. Role-Based Access Control (RBAC - SRS Section 3.1)
* Seamless switching between 5 user roles with dynamic permission filtering:
  * **Admin** (Kyra Sen): Full administrative access and reports
  * **Receptionist**: Registration, appointments, and billing
  * **Doctor** (Dr. Arvind Patel): Consultations, diagnoses, prescriptions, and EMR
  * **Nurse** (Sister Mary): Triage vitals and bed admissions
  * **Billing Clerk**: Invoices, payment receipts, and financial reports
* 5-attempt security lockout simulation and secure password reset workflow.

---

## 🛠️ Technology Stack

* **Frontend**: React 19, Tailwind CSS v4, Vite 8
* **Icons & Visuals**: Lucide React, Custom SVG Medical Graphics
* **Storage & State**: Reactive LocalStorage Persistence with rich seed data
* **Print Engine**: CSS Print Media Stylesheets for hospital receipts and prescriptions

---

## 🚀 Getting Started

### Prerequisites
* Node.js (v18+)
* npm

### Installation & Run

1. Clone the repository:
```bash
git clone https://github.com/rakshitak25bca137-ops/hospital-management-system.git
cd hospital-management-system
```

2. Install dependencies:
```bash
npm install
```

3. Launch development server:
```bash
npm run dev
```

4. Open your browser and navigate to:
```
http://localhost:5173/
```
