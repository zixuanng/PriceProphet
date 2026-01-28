import React, { useState, useMemo } from 'react';
import { Trash2, Plus, X, Upload } from 'lucide-react';
import { HistoricalTransaction } from '../types';

interface HistoryManagerProps {
  isOpen: boolean;
  onClose: () => void;
  transactions: HistoricalTransaction[];
  onAdd: (t: Omit<HistoricalTransaction, 'id'>) => void;
  onClear: () => void;
}

export const HistoryManager: React.FC<HistoryManagerProps> = ({
  isOpen, onClose, transactions, onAdd, onClear
}) => {
  const [newDesc, setNewDesc] = useState('');
  const [newAmount, setNewAmount] = useState('');
  // Default to the simulated current date: 2026-01-28
  const [newDate, setNewDate] = useState('2026-01-28');

  // Calculate averages grouped by description
  const averages = useMemo(() => {
    const groups: Record<string, number[]> = {};
    transactions.forEach(t => {
      // Normalize to handle case sensitivity loosely for better UX
      const key = t.description.trim().toLowerCase();
      if (!groups[key]) groups[key] = [];
      groups[key].push(t.amount);
    });
    
    const result: Record<string, number> = {};
    Object.keys(groups).forEach(k => {
      const amounts = groups[k];
      const sum = amounts.reduce((a, b) => a + b, 0);
      result[k] = sum / amounts.length;
    });
    return result;
  }, [transactions]);

  const getAverage = (desc: string) => {
    return averages[desc.trim().toLowerCase()] || 0;
  };

  // Helper for locale-aware date formatting
  const formatDate = (dateStr: string) => {
    try {
      // Treat YYYY-MM-DD as UTC to prevent date shifting based on local timezone
      // Using dateStyle: 'medium' allows the locale to determine the best format 
      // e.g. "Jan 28, 2026" (US) vs "28 Jan 2026" (UK)
      return new Intl.DateTimeFormat(undefined, { 
        dateStyle: 'medium',
        timeZone: 'UTC'
      }).format(new Date(dateStr));
    } catch (e) {
      return dateStr;
    }
  };

  if (!isOpen) return null;

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (newDesc && newAmount) {
      onAdd({
        description: newDesc,
        amount: parseFloat(newAmount),
        date: newDate
      });
      setNewDesc('');
      setNewAmount('');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl max-h-[80vh] flex flex-col animate-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between p-6 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <div className="bg-indigo-100 p-2 rounded-lg text-indigo-600">
              <Upload size={20} />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-800">My Transaction History</h2>
              <p className="text-xs text-slate-500">Add past expenses to improve AI accuracy</p>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 p-1 hover:bg-slate-100 rounded-lg transition-colors">
            <X size={24} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 bg-slate-50/50">
             {transactions.length === 0 ? (
                <div className="text-center py-12 text-slate-400 border-2 border-dashed border-slate-200 rounded-xl">
                  <p className="mb-2 font-medium">No personal history added yet.</p>
                  <p className="text-sm max-w-xs mx-auto">Add transactions manually below to help PriceProphet understand your spending habits.</p>
                </div>
             ) : (
                <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                  <table className="w-full text-left text-sm">
                    <thead className="bg-slate-50 text-slate-500 font-medium border-b border-slate-100">
                      <tr>
                        <th className="px-4 py-3">Date</th>
                        <th className="px-4 py-3">Description</th>
                        <th className="px-4 py-3 text-right text-slate-400 font-normal">Avg. (Hist.)</th>
                        <th className="px-4 py-3 text-right">Amount</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                      {transactions.map(t => (
                        <tr key={t.id} className="group hover:bg-slate-50 transition-colors">
                          <td className="px-4 py-3 text-slate-500 whitespace-nowrap">{formatDate(t.date)}</td>
                          <td className="px-4 py-3 text-slate-800 font-medium">{t.description}</td>
                          <td className="px-4 py-3 text-right text-slate-400 font-mono text-xs">
                             ${getAverage(t.description).toFixed(2)}
                          </td>
                          <td className="px-4 py-3 text-right text-slate-800 font-mono">${t.amount.toFixed(2)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
             )}
        </div>

        <div className="p-6 bg-white border-t border-slate-100 rounded-b-2xl">
           <form onSubmit={handleAdd} className="flex flex-col md:flex-row gap-3 items-end">
             <div className="w-full md:w-32">
               <label className="text-xs font-semibold text-slate-500 mb-1 block">Date</label>
               <input 
                 type="date" 
                 className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                 value={newDate}
                 onChange={e => setNewDate(e.target.value)}
                 required
               />
             </div>
             <div className="flex-1 w-full">
                <label className="text-xs font-semibold text-slate-500 mb-1 block">Description</label>
               <input 
                 type="text" 
                 placeholder="e.g. Lunch with team" 
                 className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                 value={newDesc}
                 onChange={e => setNewDesc(e.target.value)}
                 required
               />
             </div>
             <div className="w-full md:w-24">
               <label className="text-xs font-semibold text-slate-500 mb-1 block">Amount</label>
               <input 
                 type="number" 
                 placeholder="0.00" 
                 step="0.01"
                 className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                 value={newAmount}
                 onChange={e => setNewAmount(e.target.value)}
                 required
               />
             </div>
             <button type="submit" className="w-full md:w-auto bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg flex items-center justify-center gap-2 transition-colors h-[38px]">
               <Plus size={18} />
               <span className="md:hidden">Add Transaction</span>
             </button>
           </form>
           
           <div className="mt-4 flex justify-between items-center pt-4 border-t border-slate-50">
              <span className="text-xs text-slate-400">Data is stored securely in your browser's local storage.</span>
              {transactions.length > 0 && (
                <button onClick={onClear} className="text-red-500 text-xs hover:text-red-700 font-medium flex items-center gap-1 px-2 py-1 hover:bg-red-50 rounded transition-colors">
                  <Trash2 size={12} /> Clear History
                </button>
              )}
           </div>
        </div>
      </div>
    </div>
  );
};