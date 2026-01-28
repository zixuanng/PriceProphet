import React, { useState } from 'react';
import { PredictionResult, SimulationState, UserInput } from '../types';
import { simulatePriceImpact } from '../services/geminiService';
import { HistoryChart } from './HistoryChart';
import { WhatIfSimulator } from './WhatIfSimulator';
import { 
  CheckCircle2, AlertTriangle, HelpCircle, TrendingUp, ShieldCheck, 
  FileText, History, Globe, Users, BarChart3, Info, Tag
} from 'lucide-react';

interface AnalysisResultProps {
  prediction: PredictionResult;
  input: UserInput;
}

export const AnalysisResult: React.FC<AnalysisResultProps> = ({ prediction, input }) => {
  const [simulation, setSimulation] = useState<SimulationState>({
    isActive: false,
    simulatedPrice: prediction.suggestedPrice,
    simulatedFairness: prediction.fairnessLevel,
    impactDescription: ""
  });
  const [isSimulating, setIsSimulating] = useState(false);

  const handleSimulateChange = async (price: number) => {
    setIsSimulating(true);
    // Optimistic update for slider UI responsiveness
    setSimulation(prev => ({ ...prev, simulatedPrice: price }));
    
    // Debounce or direct call? For this demo, direct call is okay but might be jittery if we don't debounce.
    try {
      const result = await simulatePriceImpact(prediction, price, input);
      setSimulation(result);
    } catch (e) {
      console.error(e);
    } finally {
      setIsSimulating(false);
    }
  };

  const currentPrice = simulation.isActive ? simulation.simulatedPrice : prediction.suggestedPrice;
  const currentFairness = simulation.isActive ? simulation.simulatedFairness : prediction.fairnessLevel;
  const currency = prediction.currency || "$";

  const getFairnessColor = (level: string) => {
    switch (level) {
      case 'Fair': return 'text-emerald-600 bg-emerald-50 border-emerald-200';
      case 'Slightly High': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'High': return 'text-orange-600 bg-orange-50 border-orange-200';
      case 'Unusual': return 'text-red-600 bg-red-50 border-red-200';
      case 'Bargain': return 'text-blue-600 bg-blue-50 border-blue-200';
      default: return 'text-slate-600 bg-slate-50 border-slate-200';
    }
  };

  const getFactorIcon = (label: string) => {
    const l = label.toLowerCase();
    if (l.includes('user') || l.includes('avg') || l.includes('history') || l.includes('spending') || l.includes('personal')) return <History size={16} className="text-indigo-500" />;
    if (l.includes('market') || l.includes('global') || l.includes('rate') || l.includes('economy')) return <Globe size={16} className="text-emerald-500" />;
    if (l.includes('peer') || l.includes('similar') || l.includes('demographic') || l.includes('benchmark')) return <Users size={16} className="text-blue-500" />;
    if (l.includes('inflation') || l.includes('adjustment') || l.includes('trend')) return <TrendingUp size={16} className="text-orange-500" />;
    return <BarChart3 size={16} className="text-slate-400" />;
  };

  const getFactorType = (label: string) => {
    const l = label.toLowerCase();
    if (l.includes('user') || l.includes('history') || l.includes('spending') || l.includes('personal')) return { type: 'Personal', color: 'bg-indigo-50 text-indigo-700 border-indigo-100' };
    if (l.includes('market') || l.includes('peer') || l.includes('global') || l.includes('benchmark')) return { type: 'Market', color: 'bg-emerald-50 text-emerald-700 border-emerald-100' };
    return { type: 'Analysis', color: 'bg-slate-50 text-slate-600 border-slate-100' };
  };

  const getRefinedLabel = (label: string) => {
    // If the label is already descriptive/long (contains parentheses), return it as is.
    if (label.includes('(') && label.includes(')')) return label;
    
    const l = label.toLowerCase();
    // Map common short labels to descriptive ones
    if (l.includes('market') || l.includes('benchmark')) return "Market Benchmark (2026)";
    if (l.includes('peer') || l.includes('similar')) return "Peer Group Average (Similar Users)";
    if (l.includes('spending') || l.includes('history')) return "Historical Spending Pattern (Est.)";
    if (l.includes('inflation')) return "Inflation Adjustment (2026)";
    
    return label;
  };

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* LEFT COLUMN (Reasoning & Confidence) */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 flex flex-col h-full">
            {/* Confidence Section */}
            <div className="mb-6 pb-6 border-b border-slate-100">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-slate-500 font-medium text-sm uppercase tracking-wider">Confidence</h3>
                <span className="font-bold text-indigo-600">{prediction.confidenceScore}%</span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-2">
                <div 
                  className="bg-indigo-600 h-2 rounded-full transition-all duration-1000 ease-out"
                  style={{ width: `${prediction.confidenceScore}%` }}
                ></div>
              </div>
            </div>

            <div className="flex-1">
              {/* Reasoning Section */}
              <h3 className="text-slate-500 font-medium text-sm mb-3 uppercase tracking-wider flex items-center gap-2">
                <ShieldCheck size={14} /> Reasoning
              </h3>
              <ul className="space-y-3 mb-8">
                {prediction.reasoning.map((reason, idx) => (
                  <li key={idx} className="text-sm text-slate-700 flex items-start gap-2 leading-relaxed">
                    <span className="text-indigo-400 mt-1.5 shrink-0">•</span>
                    <span>{reason}</span>
                  </li>
                ))}
              </ul>

              {/* Key Factors Section */}
              <h3 className="text-slate-500 font-medium text-sm mb-3 uppercase tracking-wider flex items-center gap-2">
                <FileText size={14} /> Key Factors
              </h3>
              <div className="grid grid-cols-1 gap-2">
                {prediction.keyFactors && prediction.keyFactors.map((f, idx) => {
                  const { type, color } = getFactorType(f.label);
                  return (
                    <div key={idx} className="bg-slate-50 px-3 py-3 rounded-lg border border-slate-100 flex justify-between items-start group hover:bg-white hover:shadow-sm transition-all hover:border-slate-200">
                      <div className="flex items-start gap-3 w-full">
                        <div className="shrink-0 mt-0.5 p-1 bg-white rounded-full border border-slate-100 shadow-sm">
                          {getFactorIcon(f.label)}
                        </div>
                        <div className="flex flex-col w-full">
                          <div className="flex justify-between items-center">
                            <span className="text-xs text-slate-500 font-medium group-hover:text-slate-800 transition-colors leading-tight uppercase tracking-wide">
                              {getRefinedLabel(f.label)}
                            </span>
                            <span className={`text-[10px] px-1.5 py-0.5 rounded border ${color} font-medium`}>{type}</span>
                          </div>
                          <span className="text-sm font-bold text-slate-800 mt-0.5">{f.value}</span>
                        </div>
                      </div>
                    </div>
                  )
                })}
                {(!prediction.keyFactors || prediction.keyFactors.length === 0) && (
                  <div className="text-xs text-slate-400 italic flex items-center gap-2">
                    <Info size={12} /> No specific key factors available.
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN (Price, Sim, History) */}
        <div className="lg:col-span-8 space-y-6">
          
          {/* Main Price Card */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-10">
              <TrendingUp size={120} />
            </div>
            
            <div className="relative z-10">
              <h3 className="text-slate-500 font-medium text-sm mb-1 uppercase tracking-wider">
                {simulation.isActive ? "Simulated Price" : "Recommended Price"}
              </h3>
              <div className="flex flex-col sm:flex-row sm:items-baseline gap-2 sm:gap-4 mb-4">
                <span className="text-5xl md:text-6xl font-bold text-slate-900 tracking-tight">
                  {currency}{currentPrice}
                </span>
                {!simulation.isActive && (
                  <span className="text-slate-400 font-medium text-lg">
                    Fair Range: {currency}{prediction.minPrice} - {currency}{prediction.maxPrice}
                  </span>
                )}
              </div>

              <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-semibold border ${getFairnessColor(currentFairness)}`}>
                {currentFairness === 'Fair' ? <CheckCircle2 size={16} /> : <AlertTriangle size={16} />}
                {currentFairness}
              </div>

              {simulation.isActive && simulation.impactDescription && (
                <div className="mt-6 animate-in fade-in slide-in-from-top-2">
                   <p className="text-slate-700 bg-indigo-50/50 p-4 rounded-xl text-sm border-l-4 border-indigo-500 shadow-sm">
                    {simulation.impactDescription}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Simulator Section */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
            <h3 className="text-slate-800 font-semibold mb-4 flex items-center gap-2">
              <HelpCircle size={18} className="text-indigo-500" />
              What-If Simulator
            </h3>
            <WhatIfSimulator 
              basePrice={prediction.suggestedPrice} 
              min={Math.floor(prediction.minPrice * 0.5)}
              max={Math.ceil(prediction.maxPrice * 1.5)}
              currency={currency}
              onChange={handleSimulateChange}
            />
            <div className="mt-3 flex justify-between items-center text-xs text-slate-400">
               <span>Slide to adjust price</span>
               <span>Observe fairness changes</span>
            </div>
          </div>

          {/* History Chart */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
            <h3 className="text-slate-800 font-semibold mb-6 flex items-center gap-2">
              <TrendingUp size={18} className="text-indigo-500" />
              Historical Context (Simulated)
            </h3>
            <HistoryChart 
              data={prediction.historicalContext} 
              suggestedPrice={prediction.suggestedPrice}
              currency={currency}
            />
            <div className="mt-4 text-xs text-slate-400 text-center">
              Chart shows generated historical data points relevant to "{input.category}" used for this prediction.
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};