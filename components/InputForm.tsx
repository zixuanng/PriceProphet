import React, { useState } from 'react';
import { ArrowRight, Loader2 } from 'lucide-react';
import { UserInput } from '../types';

interface InputFormProps {
  onSubmit: (data: UserInput) => void;
  isLoading: boolean;
}

export const InputForm: React.FC<InputFormProps> = ({ onSubmit, isLoading }) => {
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('Shared Expense');
  const [participants, setParticipants] = useState('');
  const [currency, setCurrency] = useState('USD ($)');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!description || !participants) return;
    onSubmit({ description, category, participants, currency });
  };

  const suggestions = [
    { label: "Split Lunch", desc: "Lunch at Nando's", part: "Alex, Sarah" },
    { label: "Rent", desc: "Monthly Rent Share", part: "Housemates" },
    { label: "Freelance", desc: "Logo Design Project", part: "Tech Startup Client" },
  ];

  const currencies = [
    "USD ($)", "EUR (€)", "GBP (£)", "JPY (¥)", "CAD ($)", "AUD ($)", "CNY (¥)", "INR (₹)", "MYR (RM)"
  ];

  const applySuggestion = (s: typeof suggestions[0]) => {
    setDescription(s.desc);
    setCategory(s.label === "Freelance" ? "Freelance Service" : "Food & Dining");
    setParticipants(s.part);
  };

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
      <div className="mb-6">
        <h2 className="text-lg font-semibold text-slate-800 mb-1">New Prediction</h2>
        <p className="text-slate-500 text-sm">Enter details to analyze fair pricing before you pay.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
          <div className="md:col-span-8 space-y-1.5">
            <label className="text-xs font-semibold uppercase tracking-wider text-slate-500">Expense Description</label>
            <input
              type="text"
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all outline-none"
              placeholder="e.g. Dinner at Italian Restaurant"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              disabled={isLoading}
            />
          </div>
          
           <div className="md:col-span-4 space-y-1.5">
             <label className="text-xs font-semibold uppercase tracking-wider text-slate-500">Currency</label>
            <select
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all outline-none appearance-none"
              value={currency}
              onChange={(e) => setCurrency(e.target.value)}
              disabled={isLoading}
            >
              {currencies.map(c => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1.5">
             <label className="text-xs font-semibold uppercase tracking-wider text-slate-500">Category</label>
            <select
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all outline-none appearance-none"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              disabled={isLoading}
            >
              <option>Shared Expense</option>
              <option>Food & Dining</option>
              <option>Freelance Service</option>
              <option>Rent & Utilities</option>
              <option>Shopping</option>
              <option>Travel</option>
            </select>
          </div>

          <div className="space-y-1.5">
             <label className="text-xs font-semibold uppercase tracking-wider text-slate-500">Participants / Context</label>
            <input
              type="text"
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all outline-none"
              placeholder="e.g. With Alex and Sam"
              value={participants}
              onChange={(e) => setParticipants(e.target.value)}
              disabled={isLoading}
            />
          </div>
        </div>

        <div className="pt-2">
          <button
            type="submit"
            disabled={isLoading || !description || !participants}
            className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-300 text-white font-semibold py-3.5 px-6 rounded-xl shadow-lg shadow-indigo-500/20 flex items-center justify-center gap-2 transition-all transform hover:scale-[1.01]"
          >
            {isLoading ? (
              <>
                <Loader2 className="animate-spin" size={20} />
                Analyzing Context...
              </>
            ) : (
              <>
                Predict Fair Price
                <ArrowRight size={20} />
              </>
            )}
          </button>
        </div>
      </form>

      {!isLoading && (
        <div className="mt-6 pt-6 border-t border-slate-100">
          <p className="text-xs text-slate-400 mb-3">Or try a quick example:</p>
          <div className="flex flex-wrap gap-2">
            {suggestions.map((s, i) => (
              <button
                key={i}
                onClick={() => applySuggestion(s)}
                className="text-xs bg-slate-100 hover:bg-slate-200 text-slate-600 px-3 py-1.5 rounded-full transition-colors"
              >
                {s.label}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};