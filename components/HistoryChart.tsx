import React from 'react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';
import { HistoricalTransaction } from '../types';

interface HistoryChartProps {
  data: HistoricalTransaction[];
  suggestedPrice: number;
  currency: string;
}

export const HistoryChart: React.FC<HistoryChartProps> = ({ data, suggestedPrice, currency }) => {
  // Sort data by date to ensure timeline flows correctly
  const sortedData = [...data].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  // Helper to format dates from timestamps using user's locale
  const formatDateLabel = (timestamp: number) => {
    const date = new Date(timestamp);
    // Use user's locale (undefined) but force UTC to keep the date consistent with the input string
    // Shows "Jan 28" or "28 Jan" depending on locale
    return new Intl.DateTimeFormat(undefined, { 
      month: 'short', 
      day: 'numeric', 
      timeZone: 'UTC' 
    }).format(date);
  };

  const formatFullTooltipDate = (timestamp: number) => {
    const date = new Date(timestamp);
    // Use dateStyle: 'long' for a verbose, culturally appropriate full date format
    // e.g., "January 28, 2026" or "28 January 2026"
    return new Intl.DateTimeFormat(undefined, { 
      dateStyle: 'long', 
      timeZone: 'UTC' 
    }).format(date);
  };

  // Process data for chart - convert date to timestamp for X-axis accuracy
  const chartData = sortedData.map(item => ({
    timestamp: new Date(item.date).getTime(),
    amount: item.amount,
    desc: item.description
  }));

  return (
    <div className="h-64 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
          <defs>
            <linearGradient id="colorAmount" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#6366f1" stopOpacity={0.1} />
              <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
            </linearGradient>
          </defs>
          <XAxis 
            dataKey="timestamp" 
            type="number"
            domain={['dataMin', 'dataMax']}
            tickFormatter={formatDateLabel}
            axisLine={false} 
            tickLine={false} 
            tick={{ fill: '#94a3b8', fontSize: 12 }} 
            tickCount={5}
            interval="preserveStartEnd"
          />
          <YAxis 
            axisLine={false} 
            tickLine={false} 
            tick={{ fill: '#94a3b8', fontSize: 12 }} 
            domain={['auto', 'auto']}
          />
          <Tooltip 
            contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
            formatter={(value: number) => [`${currency}${value}`, 'Amount']}
            labelFormatter={(label: number) => formatFullTooltipDate(label)}
          />
          <ReferenceLine y={suggestedPrice} stroke="#818cf8" strokeDasharray="3 3" label={{ position: 'right',  value: 'Fair', fill: '#818cf8', fontSize: 10 }} />
          <Area 
            type="monotone" 
            dataKey="amount" 
            stroke="#6366f1" 
            strokeWidth={2}
            fillOpacity={1} 
            fill="url(#colorAmount)" 
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};