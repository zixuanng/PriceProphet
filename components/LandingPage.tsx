import React from 'react';
import { ArrowRight, ShieldCheck, TrendingUp, BrainCircuit, Wallet, BarChart3, Lock } from 'lucide-react';
import { ScrollReveal } from './ScrollReveal';

interface LandingPageProps {
  onGetStarted: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onGetStarted }) => {
  return (
    <div className="flex flex-col gap-20 pb-20 overflow-hidden">
      
      {/* Hero Section */}
      <section className="relative pt-10 md:pt-20 pb-16">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-indigo-500/10 rounded-full blur-3xl -z-10" />
        
        <div className="text-center max-w-4xl mx-auto px-4 space-y-6">
          <ScrollReveal>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-600 text-xs font-semibold uppercase tracking-wider mb-4">
              <BrainCircuit size={14} />
              AI-Powered Pricing Intelligence
            </div>
          </ScrollReveal>
          
          <ScrollReveal delay={100}>
            <h1 className="text-5xl md:text-7xl font-extrabold text-slate-900 tracking-tight leading-tight">
              Predict Fair Prices <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-violet-500">
                Before You Pay.
              </span>
            </h1>
          </ScrollReveal>
          
          <ScrollReveal delay={200}>
            <p className="text-lg md:text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed">
              Stop guessing. PriceProphet uses advanced Gemini AI to analyze market trends, history, and context to tell you exactly what you should be paying.
            </p>
          </ScrollReveal>
          
          <ScrollReveal delay={300}>
            <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
              <button 
                onClick={onGetStarted}
                className="group relative px-8 py-4 bg-slate-900 text-white font-bold text-lg rounded-full overflow-hidden shadow-xl shadow-indigo-500/20 hover:shadow-indigo-500/40 transition-all hover:-translate-y-1"
              >
                <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-indigo-600 to-violet-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <span className="relative flex items-center gap-2">
                  Start Analyzing <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                </span>
              </button>
              <button className="px-8 py-4 bg-white text-slate-600 font-semibold rounded-full border border-slate-200 hover:bg-slate-50 transition-colors">
                View Methodology
              </button>
            </div>
          </ScrollReveal>
        </div>

        {/* Abstract Hero Graphic */}
        <ScrollReveal delay={500}>
          <div className="mt-16 relative max-w-5xl mx-auto h-[300px] md:h-[400px] bg-gradient-to-b from-white to-slate-50 border border-slate-200 rounded-t-3xl shadow-2xl overflow-hidden flex items-center justify-center">
            <div className="absolute inset-0 grid grid-cols-[repeat(20,minmax(0,1fr))] opacity-[0.03]">
              {[...Array(200)].map((_, i) => (
                <div key={i} className="border-r border-slate-900 h-full" />
              ))}
            </div>
            
            {/* Floating Elements Animation */}
            <div className="relative z-10 grid grid-cols-1 md:grid-cols-3 gap-8 p-8 w-full max-w-4xl">
               <div className="bg-white p-6 rounded-2xl shadow-lg border border-slate-100 transform hover:scale-105 transition-transform duration-500 animate-in slide-in-from-bottom-8 fade-in duration-1000">
                  <div className="flex justify-between items-center mb-4">
                    <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center text-red-600"><Wallet size={20} /></div>
                    <span className="text-xs font-bold text-red-500 bg-red-50 px-2 py-1 rounded">Overpaying</span>
                  </div>
                  <div className="text-2xl font-bold text-slate-800">$145.00</div>
                  <div className="text-xs text-slate-400 mt-1">Market Avg: $95.00</div>
               </div>

               <div className="bg-white p-6 rounded-2xl shadow-xl border-2 border-indigo-100 transform scale-110 z-20 animate-in zoom-in-50 fade-in duration-1000 delay-300">
                  <div className="flex justify-between items-center mb-4">
                    <div className="w-10 h-10 bg-indigo-600 rounded-full flex items-center justify-center text-white"><ShieldCheck size={20} /></div>
                    <span className="text-xs font-bold text-indigo-600 bg-indigo-50 px-2 py-1 rounded">Fair Price</span>
                  </div>
                  <div className="text-3xl font-bold text-slate-900">$98.50</div>
                  <div className="text-xs text-slate-500 mt-1">Confidence Score: 94%</div>
               </div>

               <div className="bg-white p-6 rounded-2xl shadow-lg border border-slate-100 transform hover:scale-105 transition-transform duration-500 animate-in slide-in-from-bottom-8 fade-in duration-1000 delay-150">
                  <div className="flex justify-between items-center mb-4">
                    <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-600"><TrendingUp size={20} /></div>
                    <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded">Savings</span>
                  </div>
                  <div className="text-2xl font-bold text-slate-800">+$46.50</div>
                  <div className="text-xs text-slate-400 mt-1">Potential saved</div>
               </div>
            </div>
          </div>
        </ScrollReveal>
      </section>

      {/* Features Grid */}
      <section className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <ScrollReveal delay={100}>
            <div className="group p-8 bg-white rounded-3xl border border-slate-100 shadow-sm hover:shadow-xl hover:shadow-indigo-500/10 transition-all duration-300">
              <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <BrainCircuit size={24} />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">Context Aware AI</h3>
              <p className="text-slate-500 leading-relaxed">
                We don't just look at numbers. We analyze the "who, where, and why" of every transaction to give you personalized guidance.
              </p>
            </div>
          </ScrollReveal>

          <ScrollReveal delay={200}>
            <div className="group p-8 bg-white rounded-3xl border border-slate-100 shadow-sm hover:shadow-xl hover:shadow-indigo-500/10 transition-all duration-300">
              <div className="w-12 h-12 bg-violet-50 text-violet-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <BarChart3 size={24} />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">Historical Analysis</h3>
              <p className="text-slate-500 leading-relaxed">
                Upload your past transactions. Our system learns your specific spending habits to refine its future predictions.
              </p>
            </div>
          </ScrollReveal>

          <ScrollReveal delay={300}>
            <div className="group p-8 bg-white rounded-3xl border border-slate-100 shadow-sm hover:shadow-xl hover:shadow-indigo-500/10 transition-all duration-300">
              <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Lock size={24} />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">Negotiation Power</h3>
              <p className="text-slate-500 leading-relaxed">
                Arm yourself with data. Use our "Reasoning" breakdown to negotiate better rates with freelancers, landlords, or vendors.
              </p>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* How It Works */}
      <section className="bg-slate-900 text-white py-20 rounded-3xl mx-4 md:mx-10 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-indigo-600/30 rounded-full blur-[100px]" />
        
        <div className="container mx-auto px-6 relative z-10">
          <ScrollReveal>
            <h2 className="text-3xl md:text-4xl font-bold mb-16 text-center">Master your money in 3 steps</h2>
          </ScrollReveal>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <ScrollReveal delay={100}>
              <div className="flex flex-col items-center text-center">
                <div className="w-16 h-16 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-2xl font-bold text-indigo-400 mb-6 shadow-lg shadow-indigo-900/20">1</div>
                <h4 className="text-xl font-semibold mb-3">Input Details</h4>
                <p className="text-slate-400">Describe what you're paying for. Add context like "Shared Lunch" or "Web Design".</p>
              </div>
            </ScrollReveal>
            
            <ScrollReveal delay={300}>
              <div className="flex flex-col items-center text-center">
                 <div className="w-16 h-16 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-2xl font-bold text-indigo-400 mb-6 shadow-lg shadow-indigo-900/20">2</div>
                <h4 className="text-xl font-semibold mb-3">Get Analysis</h4>
                <p className="text-slate-400">AI cross-references market rates and your history to calculate a fair range.</p>
              </div>
            </ScrollReveal>

            <ScrollReveal delay={500}>
              <div className="flex flex-col items-center text-center">
                 <div className="w-16 h-16 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-2xl font-bold text-indigo-400 mb-6 shadow-lg shadow-indigo-900/20">3</div>
                <h4 className="text-xl font-semibold mb-3">Simulate & Decide</h4>
                <p className="text-slate-400">Use the simulator to see how paying more or less affects the fairness score.</p>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      <div className="text-center pt-10">
        <ScrollReveal>
          <button onClick={onGetStarted} className="text-indigo-600 font-semibold hover:text-indigo-700 flex items-center justify-center gap-2 mx-auto">
            Try the Analytics Dashboard <ArrowRight size={16} />
          </button>
        </ScrollReveal>
      </div>

    </div>
  );
};