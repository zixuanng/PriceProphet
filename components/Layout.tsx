import React, { useState, useEffect } from 'react';
import { Sparkles, Activity, Menu, History, X, BarChart2, Maximize, Minimize, Home } from 'lucide-react';

export type ViewState = 'landing' | 'analytics';

interface LayoutProps {
  children: React.ReactNode;
  currentView: ViewState;
  onNavigate: (view: ViewState) => void;
  onOpenHistory?: () => void;
}

export const Layout: React.FC<LayoutProps> = ({ children, currentView, onNavigate, onOpenHistory }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
    };
  }, []);

  const handleHistoryClick = () => {
    if (onOpenHistory) onOpenHistory();
    setIsMobileMenuOpen(false);
  };

  const toggleFullScreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch((err) => {
        console.error(`Error attempting to enable full-screen mode: ${err.message} (${err.name})`);
      });
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900">
      <header className="sticky top-0 z-50 w-full backdrop-blur-md bg-white/70 border-b border-slate-200">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div 
            className="flex items-center gap-2 cursor-pointer group"
            onClick={() => onNavigate('landing')}
          >
            <div className="bg-indigo-600 p-2 rounded-lg text-white shadow-lg shadow-indigo-500/20 group-hover:scale-105 transition-transform">
              <Sparkles size={20} strokeWidth={2.5} />
            </div>
            <span className="font-bold text-xl tracking-tight text-slate-800">
              PriceProphet
            </span>
          </div>
          
          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-2 text-sm font-medium text-slate-600">
             <button 
              onClick={() => onNavigate('landing')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-colors ${currentView === 'landing' ? 'bg-indigo-50 text-indigo-600' : 'hover:bg-slate-100'}`}
            >
              <Home size={16} />
              Home
            </button>
            <button 
              onClick={() => onNavigate('analytics')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-colors ${currentView === 'analytics' ? 'bg-indigo-50 text-indigo-600' : 'hover:bg-slate-100'}`}
            >
              <BarChart2 size={16} />
              Analytics
            </button>
            <div className="w-px h-4 bg-slate-300 mx-2" />
            <button 
              onClick={onOpenHistory}
              className="hover:text-indigo-600 transition-colors flex items-center gap-1.5 px-3 py-1.5 rounded-lg hover:bg-indigo-50/50"
            >
              <History size={16} />
              My History
            </button>
            <button 
              onClick={toggleFullScreen}
              className="hover:text-indigo-600 transition-colors flex items-center gap-1.5 px-3 py-1.5 rounded-lg hover:bg-indigo-50/50"
            >
              {isFullscreen ? <Minimize size={16} /> : <Maximize size={16} />}
              {isFullscreen ? 'Exit Full Screen' : 'Full Screen'}
            </button>
          </nav>

          {/* Mobile Menu Toggle */}
          <button 
            className="md:hidden p-2 text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Menu Dropdown */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-slate-200 bg-white/95 backdrop-blur-md absolute w-full left-0 shadow-lg animate-in slide-in-from-top-2">
            <div className="p-4 flex flex-col gap-2">
               <button 
                onClick={() => {
                  onNavigate('landing');
                  setIsMobileMenuOpen(false);
                }}
                className={`flex items-center gap-3 p-3 rounded-xl text-left font-medium ${currentView === 'landing' ? 'bg-indigo-50 text-indigo-600' : 'text-slate-700 hover:bg-slate-50'}`}
              >
                <Home size={20} />
                Home
              </button>
              <button 
                onClick={() => {
                  onNavigate('analytics');
                  setIsMobileMenuOpen(false);
                }}
                className={`flex items-center gap-3 p-3 rounded-xl text-left font-medium ${currentView === 'analytics' ? 'bg-indigo-50 text-indigo-600' : 'text-slate-700 hover:bg-slate-50'}`}
              >
                <BarChart2 size={20} />
                Analytics Dashboard
              </button>
              <hr className="border-slate-100 my-1"/>
              <button 
                onClick={handleHistoryClick}
                className="flex items-center gap-3 p-3 rounded-xl hover:bg-slate-50 text-left text-slate-700 font-medium active:bg-slate-100"
              >
                <History size={20} className="text-slate-400" />
                My History
              </button>
              <button 
                onClick={() => {
                  toggleFullScreen();
                  setIsMobileMenuOpen(false);
                }}
                className="flex items-center gap-3 p-3 rounded-xl hover:bg-slate-50 text-left text-slate-700 font-medium active:bg-slate-100"
              >
                {isFullscreen ? <Minimize size={20} className="text-slate-400" /> : <Maximize size={20} className="text-slate-400" />}
                {isFullscreen ? 'Exit Full Screen' : 'Full Screen'}
              </button>
            </div>
          </div>
        )}
      </header>

      <main className="flex-1 w-full max-w-6xl mx-auto px-4 py-8">
        {children}
      </main>

      <footer className="py-6 text-center text-slate-400 text-xs border-t border-slate-200 mt-auto bg-white">
        <div className="flex justify-center items-center gap-1 mb-2">
          <Activity size={12} />
          <span>Powered by Gemini 3 Flash Intelligence</span>
        </div>
        <p>&copy; 2024 PriceProphet. Decision Support System.</p>
      </footer>
    </div>
  );
};