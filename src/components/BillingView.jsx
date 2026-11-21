import React, { useState } from 'react';
import { CreditCard, Receipt, Plus, Search, Filter, Printer, CheckCircle, AlertCircle, Trash2, ArrowUpRight } from 'lucide-react';
import { CareNovaLogo } from './HospitalImages';

export default function BillingView({
  invoices,
  setInvoices,
  patients,
  currentUser
}) {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [paymentModal, setPaymentModal] = useState(null);
  const [printInvoiceData, setPrintInvoiceData] = useState(null);

  // New Invoice State
  const [newInvoice, setNewInvoice] = useState({
    patientUhid: '',
    items: [{ desc: 'Doctor Consultation Fee', qty: 1, rate: 800, amount: 800 }],
    discount: 0,
    taxPercent: 5 // 5% GST or hospital service cess
  });

  // Payment Recording State
  const [paymentAmount, setPaymentAmount] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('UPI / Digital Payment');

  // Filter invoices
  const filteredInvoices = invoices.filter((inv) => {
    const matchSearch =
      inv.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      inv.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      inv.uhid.toLowerCase().includes(searchTerm.toLowerCase());
    if (!matchSearch) return false;
    if (statusFilter !== 'ALL' && inv.status !== statusFilter) return false;
    return true;
  });

  // Calculate invoice subtotal, tax, grand total
  const calculateTotals = (items, discount, taxPercent) => {
    const subtotal = items.reduce((acc, it) => acc + (Number(it.amount) || 0), 0);
    const disc = Number(discount) || 0;
    const taxable = Math.max(0, subtotal - disc);
    const tax = Math.round((taxable * (Number(taxPercent) || 0)) / 100);
    const total = taxable + tax;
    return { subtotal, disc, tax, total };
  };

  const handleAddItem = () => {
    setNewInvoice({
      ...newInvoice,
      items: [...newInvoice.items, { desc: '', qty: 1, rate: 500, amount: 500 }]
    });
  };

  const handleUpdateItem = (index, field, value) => {
    const updated = [...newInvoice.items];
    updated[index][field] = value;
    if (field === 'qty' || field === 'rate') {
      const q = Number(updated[index].qty) || 0;
      const r = Number(updated[index].rate) || 0;
      updated[index].amount = q * r;
    }
    setNewInvoice({ ...newInvoice, items: updated });
  };

  const handleRemoveItem = (index) => {
    setNewInvoice({
      ...newInvoice,
      items: newInvoice.items.filter((_, i) => i !== index)
    });
  };

  const handleSaveInvoice = () => {
    if (!newInvoice.patientUhid) {
      alert('Please select a patient');
      return;
    }
    const patient = patients.find((p) => p.uhid === newInvoice.patientUhid);
    if (!patient) return;

    const { subtotal, disc, tax, total } = calculateTotals(
      newInvoice.items,
      newInvoice.discount,
      newInvoice.taxPercent
    );

    const invId = `INV-2026-${(invoices.length + 50).toString().padStart(4, '0')}`;
    const invoiceRecord = {
      id: invId,
      patientName: `${patient.firstName} ${patient.lastName}`,
      uhid: patient.uhid,
      date: new Date().toISOString().replace('T', ' ').slice(0, 10),
      items: newInvoice.items,
      subtotal,
      discount: disc,
      tax,
      total,
      paid: 0,
      balance: total,
      paymentMethod: 'Unpaid',
      status: 'Unpaid'
    };

    setInvoices([invoiceRecord, ...invoices]);
    setShowCreateModal(false);
    setNewInvoice({
      patientUhid: '',
      items: [{ desc: 'Doctor Consultation Fee', qty: 1, rate: 800, amount: 800 }],
      discount: 0,
      taxPercent: 5
    });
  };

  // Record payment (FR-6.3)
  const handleConfirmPayment = () => {
    if (!paymentModal || !paymentAmount || Number(paymentAmount) <= 0) return;
    const amt = Number(paymentAmount);

    setInvoices((prev) =>
      prev.map((inv) => {
        if (inv.id === paymentModal.id) {
          const newPaid = inv.paid + amt;
          const newBalance = Math.max(0, inv.total - newPaid);
          const newStatus = newBalance === 0 ? 'Paid' : 'Partially Paid';
          return {
            ...inv,
            paid: newPaid,
            balance: newBalance,
            status: newStatus,
            paymentMethod: `${paymentMethod} (₹ ${amt})`
          };
        }
        return inv;
      })
    );

    setPaymentModal(null);
    setPaymentAmount('');
  };

  // Metrics
  const totalRevenue = invoices.reduce((acc, inv) => acc + (inv.paid || 0), 0);
  const totalPending = invoices.reduce((acc, inv) => acc + (inv.balance || 0), 0);

  return (
    <div className="space-y-6 pb-12">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
        <div>
          <h2 className="text-xl font-extrabold text-slate-800 tracking-tight flex items-center gap-2">
            <CreditCard className="w-6 h-6 text-blue-600" />
            <span>Billing & Invoices</span>
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Generate itemized invoices, track payments, and print GST receipts per SRS Section 3.6
          </p>
        </div>

        <button
          onClick={() => setShowCreateModal(true)}
          className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 text-white font-semibold text-xs px-5 py-2.5 rounded-2xl shadow-md transition-all hover:scale-105 active:scale-95"
        >
          <Plus className="w-4 h-4" />
          <span>Create New Invoice</span>
        </button>
      </div>

      {/* Metrics Row (Matching UI revenue figures) */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-3xl border border-slate-100 shadow-sm">
          <div className="text-[11px] font-semibold text-slate-500">Total Collected Revenue</div>
          <div className="text-2xl font-black text-slate-800 mt-1">₹ {totalRevenue.toLocaleString('en-IN')}</div>
          <div className="text-[10px] text-emerald-600 font-bold mt-1">↑ 12% Growth this month</div>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-slate-100 shadow-sm">
          <div className="text-[11px] font-semibold text-slate-500">Pending Receivables</div>
          <div className="text-2xl font-black text-rose-600 mt-1">₹ {totalPending.toLocaleString('en-IN')}</div>
          <div className="text-[10px] text-rose-500 font-bold mt-1">↑ 5% Pending settlement</div>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-slate-100 shadow-sm">
          <div className="text-[11px] font-semibold text-slate-500">Total Invoices Tracked</div>
          <div className="text-2xl font-black text-blue-600 mt-1">{invoices.length} Invoices</div>
          <div className="text-[10px] text-slate-400 mt-1">Cash, UPI, Card & Insurance TPA</div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search invoice number, patient, or UHID..."
            className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl outline-none"
          />
        </div>

        <div className="flex items-center gap-2 overflow-x-auto">
          {['ALL', 'Paid', 'Partially Paid', 'Unpaid'].map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1.5 rounded-xl font-semibold transition-colors ${
                statusFilter === st
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* Invoice Table */}
      <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden text-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-50 text-slate-500 uppercase font-semibold text-[10px] border-b border-slate-100">
              <tr>
                <th className="py-3 px-4">Invoice #</th>
                <th className="py-3 px-4">Patient / UHID</th>
                <th className="py-3 px-3">Date</th>
                <th className="py-3 px-3">Grand Total</th>
                <th className="py-3 px-3">Paid Amount</th>
                <th className="py-3 px-3">Balance</th>
                <th className="py-3 px-3">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredInvoices.map((inv) => (
                <tr key={inv.id} className="hover:bg-slate-50 transition-colors">
                  <td className="py-3 px-4 font-mono font-bold text-blue-600">{inv.id}</td>
                  <td className="py-3 px-4">
                    <div className="font-bold text-slate-800">{inv.patientName}</div>
                    <div className="text-[10px] text-slate-400 font-mono">{inv.uhid}</div>
                  </td>
                  <td className="py-3 px-3 text-slate-500">{inv.date}</td>
                  <td className="py-3 px-3 font-bold text-slate-800">₹ {inv.total.toLocaleString('en-IN')}</td>
                  <td className="py-3 px-3 text-emerald-600 font-semibold">₹ {inv.paid.toLocaleString('en-IN')}</td>
                  <td className="py-3 px-3 font-bold text-rose-600">₹ {inv.balance.toLocaleString('en-IN')}</td>
                  <td className="py-3 px-3">
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${
                        inv.status === 'Paid'
                          ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                          : inv.status === 'Partially Paid'
                          ? 'bg-amber-50 text-amber-700 border-amber-200'
                          : 'bg-rose-50 text-rose-700 border-rose-200'
                      }`}
                    >
                      {inv.status}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right space-x-1">
                    {inv.balance > 0 && (
                      <button
                        onClick={() => {
                          setPaymentModal(inv);
                          setPaymentAmount(inv.balance.toString());
                        }}
                        className="px-2.5 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold"
                      >
                        Record Pay
                      </button>
                    )}
                    <button
                      onClick={() => setPrintInvoiceData(inv)}
                      className="p-1.5 text-slate-600 hover:bg-slate-100 rounded-lg inline-flex items-center"
                      title="Print Invoice"
                    >
                      <Printer className="w-3.5 h-3.5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create Invoice Modal (FR-6.1 & FR-6.2) */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 shadow-2xl border border-slate-100 space-y-4 max-h-[90vh] overflow-y-auto text-xs animate-in zoom-in-95">
            <h3 className="text-base font-extrabold text-slate-800">Create New Patient Invoice</h3>

            <div>
              <label className="font-semibold text-slate-700 block mb-1">Select Patient *</label>
              <select
                value={newInvoice.patientUhid}
                onChange={(e) => setNewInvoice({ ...newInvoice, patientUhid: e.target.value })}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
              >
                <option value="">-- Choose Patient --</option>
                {patients.map((p) => (
                  <option key={p.uhid} value={p.uhid}>
                    {p.firstName} {p.lastName} ({p.uhid})
                  </option>
                ))}
              </select>
            </div>

            {/* Line Items */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-700">Billing Charges / Services</span>
                <button
                  type="button"
                  onClick={handleAddItem}
                  className="text-blue-600 font-bold hover:underline"
                >
                  + Add Service Item
                </button>
              </div>

              {newInvoice.items.map((item, idx) => (
                <div key={idx} className="grid grid-cols-12 gap-2 items-center">
                  <input
                    type="text"
                    value={item.desc}
                    onChange={(e) => handleUpdateItem(idx, 'desc', e.target.value)}
                    placeholder="Description (Consultation, Room charge, Test)"
                    className="col-span-6 p-2 bg-slate-50 border border-slate-200 rounded-xl"
                  />
                  <input
                    type="number"
                    value={item.qty}
                    onChange={(e) => handleUpdateItem(idx, 'qty', e.target.value)}
                    placeholder="Qty"
                    className="col-span-2 p-2 bg-slate-50 border border-slate-200 rounded-xl text-center"
                  />
                  <input
                    type="number"
                    value={item.rate}
                    onChange={(e) => handleUpdateItem(idx, 'rate', e.target.value)}
                    placeholder="Rate"
                    className="col-span-3 p-2 bg-slate-50 border border-slate-200 rounded-xl text-right"
                  />
                  <button
                    onClick={() => handleRemoveItem(idx)}
                    className="col-span-1 text-rose-500 font-bold hover:text-rose-700 text-center"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>

            {/* Subtotal, Discount & Tax */}
            <div className="p-3 bg-slate-50 rounded-2xl space-y-2 text-slate-700">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="font-semibold block mb-1">Discount (₹)</label>
                  <input
                    type="number"
                    value={newInvoice.discount}
                    onChange={(e) => setNewInvoice({ ...newInvoice, discount: e.target.value })}
                    className="w-full p-2 bg-white border border-slate-200 rounded-xl"
                  />
                </div>
                <div>
                  <label className="font-semibold block mb-1">Tax Rate (%)</label>
                  <input
                    type="number"
                    value={newInvoice.taxPercent}
                    onChange={(e) => setNewInvoice({ ...newInvoice, taxPercent: e.target.value })}
                    className="w-full p-2 bg-white border border-slate-200 rounded-xl"
                  />
                </div>
              </div>

              {(() => {
                const { subtotal, disc, tax, total } = calculateTotals(
                  newInvoice.items,
                  newInvoice.discount,
                  newInvoice.taxPercent
                );
                return (
                  <div className="pt-2 border-t border-slate-200 space-y-1 font-semibold text-right">
                    <div>Subtotal: ₹ {subtotal}</div>
                    <div>Discount: -₹ {disc}</div>
                    <div>Tax ({newInvoice.taxPercent}%): +₹ {tax}</div>
                    <div className="text-sm font-black text-slate-900">Grand Total: ₹ {total}</div>
                  </div>
                );
              })()}
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
              <button
                onClick={() => setShowCreateModal(false)}
                className="px-4 py-2 border border-slate-200 rounded-xl font-semibold text-slate-600"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveInvoice}
                className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold shadow-md"
              >
                Generate Invoice
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Record Payment Modal (FR-6.3) */}
      {paymentModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 shadow-2xl border border-slate-100 space-y-4 text-xs animate-in zoom-in-95">
            <h3 className="text-base font-extrabold text-slate-800">Record Payment</h3>
            <div className="p-3 bg-slate-50 rounded-2xl space-y-1">
              <div><span className="font-bold">Invoice:</span> {paymentModal.id}</div>
              <div><span className="font-bold">Patient:</span> {paymentModal.patientName}</div>
              <div className="text-rose-600 font-bold">Outstanding Balance: ₹ {paymentModal.balance}</div>
            </div>

            <div>
              <label className="font-semibold text-slate-700 block mb-1">Payment Amount (₹) *</label>
              <input
                type="number"
                value={paymentAmount}
                onChange={(e) => setPaymentAmount(e.target.value)}
                max={paymentModal.balance}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-800 text-base"
              />
            </div>

            <div>
              <label className="font-semibold text-slate-700 block mb-1">Payment Method</label>
              <select
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value)}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
              >
                <option value="UPI / Digital Payment">UPI / QR Code</option>
                <option value="Credit / Debit Card">Credit / Debit Card</option>
                <option value="Cash Counter">Cash Counter</option>
                <option value="Insurance TPA Direct">Insurance TPA Direct</option>
              </select>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
              <button
                onClick={() => setPaymentModal(null)}
                className="px-4 py-2 border border-slate-200 rounded-xl font-semibold text-slate-600"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmPayment}
                className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-semibold shadow-md"
              >
                Confirm Payment
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Print Invoice Receipt Modal (FR-6.5) */}
      {printInvoiceData && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-xl w-full p-8 shadow-2xl border border-slate-200 text-xs space-y-4 max-h-[90vh] overflow-y-auto print:p-0">
            <div className="border-b-2 border-slate-800 pb-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <CareNovaLogo size={42} />
                <div>
                  <h1 className="text-lg font-black text-slate-900">CARENOVA HOSPITAL</h1>
                  <p className="text-[10px] text-slate-500 font-semibold tracking-wider uppercase">
                    Tax Invoice & Official Receipt
                  </p>
                </div>
              </div>
              <div className="text-right">
                <div className="font-mono font-bold text-blue-600 text-sm">{printInvoiceData.id}</div>
                <div className="text-[10px] text-slate-400">{printInvoiceData.date}</div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 py-2 border-b border-slate-100">
              <div>
                <div className="font-bold text-slate-800">Billed To:</div>
                <div className="font-semibold text-slate-700">{printInvoiceData.patientName}</div>
                <div className="font-mono text-slate-500">UHID: {printInvoiceData.uhid}</div>
              </div>
              <div className="text-right">
                <div className="font-bold text-slate-800">Payment Status:</div>
                <span className={`px-2.5 py-0.5 rounded-full font-bold text-[10px] ${
                  printInvoiceData.status === 'Paid' ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'
                }`}>
                  {printInvoiceData.status}
                </span>
                <div className="text-[10px] text-slate-500 mt-1">{printInvoiceData.paymentMethod}</div>
              </div>
            </div>

            <table className="w-full text-left">
              <thead className="border-b border-slate-200 text-[10px] uppercase text-slate-400">
                <tr>
                  <th className="py-2">Item Description</th>
                  <th className="py-2 text-center">Qty</th>
                  <th className="py-2 text-right">Rate</th>
                  <th className="py-2 text-right">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {printInvoiceData.items.map((it, idx) => (
                  <tr key={idx}>
                    <td className="py-2 font-medium">{it.desc}</td>
                    <td className="py-2 text-center">{it.qty}</td>
                    <td className="py-2 text-right">₹ {it.rate}</td>
                    <td className="py-2 text-right font-semibold">₹ {it.amount}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div className="pt-2 border-t border-slate-200 space-y-1 text-right font-medium">
              <div>Subtotal: ₹ {printInvoiceData.subtotal}</div>
              {printInvoiceData.discount > 0 && <div>Discount: -₹ {printInvoiceData.discount}</div>}
              {printInvoiceData.tax > 0 && <div>Tax: +₹ {printInvoiceData.tax}</div>}
              <div className="text-base font-black text-slate-900">Total Billed: ₹ {printInvoiceData.total}</div>
              <div className="text-emerald-600 font-bold">Amount Paid: ₹ {printInvoiceData.paid}</div>
              <div className="text-rose-600 font-bold">Balance Due: ₹ {printInvoiceData.balance}</div>
            </div>

            <div className="pt-6 border-t border-slate-100 flex items-center justify-between print:hidden">
              <button
                onClick={() => setPrintInvoiceData(null)}
                className="px-4 py-2 border border-slate-200 rounded-xl font-semibold text-slate-600"
              >
                Close
              </button>
              <button
                onClick={() => window.print()}
                className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold flex items-center gap-1.5 shadow-md"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Print Receipt</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
