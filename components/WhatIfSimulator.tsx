import React, { useState, useEffect, useRef } from 'react';

interface WhatIfSimulatorProps {
  basePrice: number;
  min: number;
  max: number;
  currency: string;
  onChange: (value: number) => void;
}

export const WhatIfSimulator: React.FC<WhatIfSimulatorProps> = ({ basePrice, min, max, currency, onChange }) => {
  const [value, setValue] = useState(basePrice);
  // Fixed: Replaced NodeJS.Timeout with ReturnType<typeof setTimeout> to fix implicit namespace error
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVal = parseInt(e.target.value, 10);
    setValue(newVal);

    // Debounce the parent update
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => {
      onChange(newVal);
    }, 400);
  };

  return (
    <div className="w-full px-2">
      <div className="relative pt-6 pb-2">
        <div className="flex justify-between mb-2 text-xs font-medium text-slate-400 uppercase tracking-wider">
          <span>{currency}{min}</span>
          <span>{currency}{max}</span>
        </div>
        <input
          type="range"
          min={min}
          max={max}
          step={1}
          value={value}
          onChange={handleChange}
          className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600 hover:accent-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/30"
        />
        <div 
          className="absolute top-0 transform -translate-x-1/2 bg-slate-900 text-white text-xs font-bold py-1 px-2 rounded opacity-100 transition-all"
          style={{ left: `${((value - min) / (max - min)) * 100}%` }}
        >
          {currency}{value}
        </div>
      </div>
    </div>
  );
};