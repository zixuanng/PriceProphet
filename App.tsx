import React, { useState, useEffect } from 'react';
import { Layout, ViewState } from './components/Layout';
import { InputForm } from './components/InputForm';
import { AnalysisResult } from './components/AnalysisResult';
import { HistoryManager } from './components/HistoryManager';
import { LandingPage } from './components/LandingPage';
import { UserInput, PredictionResult, HistoricalTransaction } from './types';
import { analyzePriceContext } from './services/geminiService';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<ViewState>('landing');
  const [prediction, setPrediction] = useState<PredictionResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [input, setInput] = useState<UserInput | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  // History Management State
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [localHistory, setLocalHistory] = useState<HistoricalTransaction[]>([]);

  // Load history from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('priceProphet_history');
    if (saved) {
      try {
        setLocalHistory(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to parse history", e);
      }
    }
  }, []);

  const handleAddTransaction = (t: Omit<HistoricalTransaction, 'id'>) => {
    const newTransaction: HistoricalTransaction = {
      ...t,
      id: crypto.randomUUID()
    };
    const updated = [newTransaction, ...localHistory];
    setLocalHistory(updated);
    localStorage.setItem('priceProphet_history', JSON.stringify(updated));
  };

  const handleClearHistory = () => {
    setLocalHistory([]);
    localStorage.removeItem('priceProphet_history');
  };

  const handleAnalyze = async (data: UserInput) => {
    setIsLoading(true);
    setInput(data);
    setError(null);
    setPrediction(null);
    
    try {
      const result = await analyzePriceContext(data, localHistory);
      setPrediction(result);
    } catch (err) {
      setError("Failed to analyze price context. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const navigateToAnalytics = () => {
    setCurrentView('analytics');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <Layout 
      currentView={currentView} 
      onNavigate={setCurrentView}
      onOpenHistory={() => setIsHistoryOpen(true)}
    >
      {currentView === 'landing' ? (
        <LandingPage onGetStarted={navigateToAnalytics} />
      ) : (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="max-w-3xl mx-auto text-center space-y-2 mb-8">
            <h2 className="text-3xl font-bold text-slate-900">Analytics Dashboard</h2>
            <p className="text-slate-500">
              Input your transaction details below to generate fair price predictions.
            </p>
          </div>

          <InputForm onSubmit={handleAnalyze} isLoading={isLoading} />

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 p-4 rounded-xl text-center animate-in fade-in">
              {error}
            </div>
          )}

          {prediction && input && (
            <AnalysisResult prediction={prediction} input={input} />
          )}
        </div>
      )}

      <HistoryManager 
        isOpen={isHistoryOpen}
        onClose={() => setIsHistoryOpen(false)}
        transactions={localHistory}
        onAdd={handleAddTransaction}
        onClear={handleClearHistory}
      />
    </Layout>
  );
};

export default App;