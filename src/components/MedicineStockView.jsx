import React, { useState } from 'react';
import { Package, Pill, AlertTriangle, CheckCircle2, Plus, Search, RefreshCw } from 'lucide-react';

export default function MedicineStockView({
  medicines,
  setMedicines,
  currentUser
}) {
  const [searchTerm, setSearchTerm] = useState('');
  const [restockModal, setRestockModal] = useState(null);
  const [restockQty, setRestockQty] = useState('');

  const filteredMeds = medicines.filter((m) =>
    m.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    m.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleRestock = () => {
    if (!restockModal || !restockQty || Number(restockQty) <= 0) return;
    const addUnits = Number(restockQty);

    setMedicines((prev) =>
      prev.map((m) => {
        if (m.id === restockModal.id) {
          const newStock = m.stock + addUnits;
          return {
            ...m,
            stock: newStock,
            status: newStock > 500 ? 'Healthy' : 'Low Stock'
          };
        }
        return m;
      })
    );

    setRestockModal(null);
    setRestockQty('');
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
        <div>
          <h2 className="text-xl font-extrabold text-slate-800 tracking-tight flex items-center gap-2">
            <Package className="w-6 h-6 text-purple-600" />
            <span>Pharmacy & Medicine Stock</span>
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Real-time stock monitoring, safety thresholds, and dispensing inventory
          </p>
        </div>

        <div className="relative w-full sm:w-64">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search medicine or class..."
            className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-none"
          />
        </div>
      </div>

      {/* Stock Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {filteredMeds.map((med) => {
          const pct = Math.min(100, Math.round((med.stock / med.maxCapacity) * 100));
          const isLow = med.stock < 500;

          return (
            <div
              key={med.id}
              className="bg-white p-5 rounded-3xl border border-slate-100 shadow-sm flex flex-col justify-between space-y-4"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className="w-9 h-9 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
                    <Pill className="w-5 h-5" />
                  </div>
                  <span
                    className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${
                      !isLow
                        ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                        : 'bg-rose-50 text-rose-700 border-rose-200'
                    }`}
                  >
                    {!isLow ? 'Stock Healthy' : 'Low Stock'}
                  </span>
                </div>

                <h3 className="font-bold text-slate-800 text-sm">{med.name}</h3>
                <div className="text-[11px] text-slate-400">{med.dosage} • {med.category}</div>

                <div className="mt-4">
                  <div className="flex justify-between text-xs font-semibold mb-1">
                    <span className="text-slate-800 font-bold">{med.stock} units</span>
                    <span className="text-slate-400">{pct}%</span>
                  </div>
                  <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full ${
                        pct > 60 ? 'bg-emerald-500' : pct > 30 ? 'bg-blue-500' : 'bg-rose-500'
                      }`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              </div>

              <button
                onClick={() => setRestockModal(med)}
                className="w-full py-2 bg-slate-50 hover:bg-blue-50 text-slate-700 hover:text-blue-700 rounded-xl text-xs font-semibold border border-slate-200 transition-colors flex items-center justify-center gap-1.5"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Restock Inventory</span>
              </button>
            </div>
          );
        })}
      </div>

      {/* Restock Modal */}
      {restockModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 shadow-2xl border border-slate-100 space-y-4 text-xs animate-in zoom-in-95">
            <h3 className="text-base font-extrabold text-slate-800">Restock {restockModal.name}</h3>
            <p className="text-slate-500">Current Stock: {restockModal.stock} units</p>

            <div>
              <label className="font-semibold text-slate-700 block mb-1">Units to Add *</label>
              <input
                type="number"
                value={restockQty}
                onChange={(e) => setRestockQty(e.target.value)}
                placeholder="e.g. 500"
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-800"
              />
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => setRestockModal(null)}
                className="px-4 py-2 border border-slate-200 rounded-xl font-semibold text-slate-600"
              >
                Cancel
              </button>
              <button
                onClick={handleRestock}
                className="px-5 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-xl font-semibold shadow-md"
              >
                Confirm Restock
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
