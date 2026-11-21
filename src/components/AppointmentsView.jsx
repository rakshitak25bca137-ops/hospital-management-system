import React, { useState } from 'react';
import { Calendar as CalendarIcon, Clock, User, Stethoscope, Plus, CheckCircle, XCircle, AlertCircle, Search, Filter } from 'lucide-react';

export default function AppointmentsView({
  appointments,
  setAppointments,
  patients,
  doctors,
  departments,
  currentUser
}) {
  const [filterDoc, setFilterDoc] = useState('ALL');
  const [filterDate, setFilterDate] = useState('2026-11-20');
  const [showBookModal, setShowBookModal] = useState(false);
  const [cancelModal, setCancelModal] = useState(null);
  const [cancelReason, setCancelReason] = useState('');

  // Booking Form State
  const [bookForm, setBookForm] = useState({
    patientUhid: '',
    department: 'Cardiology',
    doctor: 'Dr. Arvind Patel',
    date: '2026-11-20',
    time: '10:00 AM',
    reason: '',
    type: 'Consultation'
  });

  const [bookingError, setBookingError] = useState('');

  const timeSlots = [
    '09:00 AM', '09:30 AM', '10:00 AM', '10:30 AM', '11:00 AM',
    '11:30 AM', '12:00 PM', '02:00 PM', '02:30 PM', '03:00 PM', '03:30 PM'
  ];

  // Filter appointments
  const filteredAppointments = appointments.filter((apt) => {
    if (filterDoc !== 'ALL' && apt.doctor !== filterDoc) return false;
    if (filterDate && apt.date !== filterDate) return false;
    return true;
  });

  // Check if slot is booked for this doctor & date (FR-4.2)
  const isSlotTaken = (doctor, date, time) => {
    return appointments.some(
      (a) => a.doctor === doctor && a.date === date && a.time === time && a.status !== 'Cancelled'
    );
  };

  const handleBookAppointment = () => {
    setBookingError('');
    if (!bookForm.patientUhid) {
      setBookingError('Please select a patient');
      return;
    }

    // Verify double booking (FR-4.2)
    if (isSlotTaken(bookForm.doctor, bookForm.date, bookForm.time)) {
      setBookingError(`Slot ${bookForm.time} on ${bookForm.date} is already booked for ${bookForm.doctor}. Please select another time.`);
      return;
    }

    const patient = patients.find((p) => p.uhid === bookForm.patientUhid);
    if (!patient) return;

    const newApt = {
      id: `APT-2026-${(appointments.length + 1).toString().padStart(3, '0')}`,
      patientName: `${patient.firstName} ${patient.lastName}`,
      uhid: patient.uhid,
      doctor: bookForm.doctor,
      department: bookForm.department,
      date: bookForm.date,
      time: bookForm.time,
      status: 'Scheduled',
      reason: bookForm.reason || 'Routine Consultation',
      type: bookForm.type
    };

    setAppointments([newApt, ...appointments]);
    setShowBookModal(false);
    setBookForm({
      patientUhid: '',
      department: 'Cardiology',
      doctor: 'Dr. Arvind Patel',
      date: '2026-11-20',
      time: '10:00 AM',
      reason: '',
      type: 'Consultation'
    });
  };

  // Status transitions (FR-4.4)
  const handleUpdateStatus = (id, newStatus) => {
    setAppointments((prev) =>
      prev.map((a) => (a.id === id ? { ...a, status: newStatus } : a))
    );
  };

  // Cancellation with reason (FR-4.3)
  const handleConfirmCancel = () => {
    if (!cancelModal) return;
    setAppointments((prev) =>
      prev.map((a) =>
        a.id === cancelModal.id
          ? { ...a, status: 'Cancelled', cancelReason: cancelReason || 'Patient request' }
          : a
      )
    );
    setCancelModal(null);
    setCancelReason('');
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
        <div>
          <h2 className="text-xl font-extrabold text-slate-800 tracking-tight flex items-center gap-2">
            <CalendarIcon className="w-6 h-6 text-blue-600" />
            <span>Appointment Management</span>
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Bookings, slot conflict prevention, and daily doctor schedules per SRS Section 3.4
          </p>
        </div>

        <button
          onClick={() => setShowBookModal(true)}
          className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 text-white font-semibold text-xs px-5 py-2.5 rounded-2xl shadow-md transition-all hover:scale-105 active:scale-95"
        >
          <Plus className="w-4 h-4" />
          <span>Book Appointment</span>
        </button>
      </div>

      {/* Filter by Doctor and Date */}
      <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <span className="font-semibold text-slate-700">Doctor:</span>
          <select
            value={filterDoc}
            onChange={(e) => setFilterDoc(e.target.value)}
            className="p-2 bg-slate-50 border border-slate-200 rounded-xl outline-none"
          >
            <option value="ALL">All Doctors</option>
            {doctors.map((d) => (
              <option key={d.id} value={d.name}>
                {d.name} ({d.department})
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <span className="font-semibold text-slate-700">Schedule Date:</span>
          <input
            type="date"
            value={filterDate}
            onChange={(e) => setFilterDate(e.target.value)}
            className="p-2 bg-slate-50 border border-slate-200 rounded-xl outline-none font-medium text-slate-800"
          />
        </div>
      </div>

      {/* Appointment Cards / Table */}
      <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex items-center justify-between">
          <span className="text-xs font-bold text-slate-800">
            Appointments for {filterDate} ({filteredAppointments.length})
          </span>
          <span className="text-[11px] text-slate-400">Total Booked: {appointments.length}</span>
        </div>

        <div className="divide-y divide-slate-100 text-xs">
          {filteredAppointments.map((apt) => (
            <div
              key={apt.id}
              className="p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 hover:bg-slate-50/70 transition-colors"
            >
              <div className="flex items-center gap-3.5">
                <div className="w-11 h-11 rounded-2xl bg-blue-50 text-blue-600 font-bold flex flex-col items-center justify-center border border-blue-100 shrink-0">
                  <Clock className="w-4 h-4 mb-0.5" />
                  <span className="text-[9px] font-mono leading-none">{apt.time.split(' ')[0]}</span>
                </div>
                <div>
                  <div className="font-bold text-slate-800 text-sm flex items-center gap-2">
                    <span>{apt.patientName}</span>
                    <span className="text-[10px] font-mono text-blue-600 bg-blue-50 px-2 py-0.5 rounded">
                      {apt.uhid}
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-500 mt-0.5">
                    {apt.doctor} • <span className="font-semibold text-slate-600">{apt.department}</span>
                  </div>
                  <div className="text-[11px] text-slate-600 italic mt-0.5">Reason: {apt.reason}</div>
                </div>
              </div>

              {/* Status and Action Buttons */}
              <div className="flex items-center gap-2 self-end sm:self-center">
                <span
                  className={`px-3 py-1 rounded-full text-[11px] font-bold border ${
                    apt.status === 'Completed'
                      ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                      : apt.status === 'Checked-in'
                      ? 'bg-blue-50 text-blue-700 border-blue-200'
                      : apt.status === 'Cancelled'
                      ? 'bg-rose-50 text-rose-700 border-rose-200 line-through'
                      : 'bg-amber-50 text-amber-700 border-amber-200'
                  }`}
                >
                  {apt.status}
                </span>

                {apt.status === 'Scheduled' && (
                  <button
                    onClick={() => handleUpdateStatus(apt.id, 'Checked-in')}
                    className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-[11px] font-semibold transition-colors"
                  >
                    Check In
                  </button>
                )}

                {apt.status === 'Checked-in' && (
                  <button
                    onClick={() => handleUpdateStatus(apt.id, 'Completed')}
                    className="px-3 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-[11px] font-semibold transition-colors"
                  >
                    Mark Done
                  </button>
                )}

                {apt.status !== 'Completed' && apt.status !== 'Cancelled' && (
                  <button
                    onClick={() => setCancelModal(apt)}
                    className="px-2.5 py-1 text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded-xl text-[11px] font-semibold transition-colors"
                  >
                    Cancel
                  </button>
                )}
              </div>
            </div>
          ))}

          {filteredAppointments.length === 0 && (
            <div className="p-8 text-center text-slate-400">
              No appointments scheduled for this date and doctor.
            </div>
          )}
        </div>
      </div>

      {/* Book Appointment Modal (FR-4.1 & FR-4.2) */}
      {showBookModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-100 space-y-4 animate-in zoom-in-95 text-xs">
            <h3 className="text-base font-extrabold text-slate-800">Book Doctor Appointment</h3>

            {bookingError && (
              <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 rounded-xl flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{bookingError}</span>
              </div>
            )}

            <div className="space-y-3">
              <div>
                <label className="font-semibold text-slate-700 block mb-1">Select Patient *</label>
                <select
                  value={bookForm.patientUhid}
                  onChange={(e) => setBookForm({ ...bookForm, patientUhid: e.target.value })}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                >
                  <option value="">-- Choose Patient --</option>
                  {patients.map((p) => (
                    <option key={p.uhid} value={p.uhid}>
                      {p.firstName} {p.lastName} ({p.uhid} - {p.phone})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Department</label>
                  <select
                    value={bookForm.department}
                    onChange={(e) => {
                      const dept = e.target.value;
                      const matchedDoc = doctors.find((d) => d.department === dept)?.name || doctors[0].name;
                      setBookForm({ ...bookForm, department: dept, doctor: matchedDoc });
                    }}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                  >
                    {departments.map((d) => (
                      <option key={d.id} value={d.name}>{d.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Doctor</label>
                  <select
                    value={bookForm.doctor}
                    onChange={(e) => setBookForm({ ...bookForm, doctor: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                  >
                    {doctors
                      .filter((d) => d.department === bookForm.department)
                      .map((d) => (
                        <option key={d.id} value={d.name}>{d.name}</option>
                      ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Appointment Date</label>
                  <input
                    type="date"
                    value={bookForm.date}
                    onChange={(e) => setBookForm({ ...bookForm, date: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium"
                  />
                </div>

                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Select Time Slot</label>
                  <select
                    value={bookForm.time}
                    onChange={(e) => setBookForm({ ...bookForm, time: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                  >
                    {timeSlots.map((slot) => {
                      const taken = isSlotTaken(bookForm.doctor, bookForm.date, slot);
                      return (
                        <option key={slot} value={slot} disabled={taken}>
                          {slot} {taken ? '(Unavailable / Booked)' : '(Available)'}
                        </option>
                      );
                    })}
                  </select>
                </div>
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Reason / Symptoms</label>
                <input
                  type="text"
                  value={bookForm.reason}
                  onChange={(e) => setBookForm({ ...bookForm, reason: e.target.value })}
                  placeholder="e.g. Chest pain follow-up, migraine..."
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
              <button
                onClick={() => setShowBookModal(false)}
                className="px-4 py-2 border border-slate-200 rounded-xl font-semibold text-slate-600 hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                onClick={handleBookAppointment}
                className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold shadow-md"
              >
                Confirm Appointment
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Cancel Appointment Reason Prompt (FR-4.3) */}
      {cancelModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 shadow-2xl border border-slate-100 space-y-4 text-xs animate-in zoom-in-95">
            <h3 className="text-base font-extrabold text-slate-800">Cancel Appointment</h3>
            <p className="text-slate-500">
              Please enter the recorded reason for cancelling {cancelModal.id} for {cancelModal.patientName}:
            </p>
            <textarea
              rows={2}
              value={cancelReason}
              onChange={(e) => setCancelReason(e.target.value)}
              placeholder="e.g. Patient rescheduled, doctor emergency..."
              className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none"
            />
            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => setCancelModal(null)}
                className="px-4 py-2 border border-slate-200 rounded-xl font-semibold text-slate-600"
              >
                Keep
              </button>
              <button
                onClick={handleConfirmCancel}
                className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl font-semibold"
              >
                Confirm Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
