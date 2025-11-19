import React, { useState } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Label } from 'recharts';
import { AnalysisResult } from '../types';
import { AlertTriangle, CheckCircle2, BookOpen, Search, BrainCircuit, Info, Type as TypeIcon, Sparkles } from 'lucide-react';

interface AnalysisReportProps {
  data: AnalysisResult;
  fileName?: string;
}

export const AnalysisReport: React.FC<AnalysisReportProps> = ({ data, fileName }) => {
  const [activeTab, setActiveTab] = useState<'patterns' | 'segments' | 'typos'>('segments');

  const chartData = [
    { name: 'Human', value: data.humanScore },
    { name: 'AI', value: data.aiScore },
  ];

  const isHuman = data.humanScore > 50;
  const COLORS = ['#10b981', '#ef4444']; // Emerald for human, Red for AI

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
      
      {/* Main Score Card */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 sm:p-8 flex flex-col md:flex-row items-center gap-8">
        <div className="w-48 h-48 flex-shrink-0 relative">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                fill="#8884d8"
                paddingAngle={5}
                dataKey="value"
                startAngle={90}
                endAngle={-270}
              >
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} strokeWidth={0} />
                ))}
                <Label 
                    value={`${data.humanScore}%`} 
                    position="center" 
                    fill={isHuman ? '#10b981' : '#ef4444'}
                    style={{ fontSize: '24px', fontWeight: 'bold' }}
                />
              </Pie>
            </PieChart>
          </ResponsiveContainer>
          <div className="absolute inset-0 flex items-center justify-center pt-8 pointer-events-none">
              <span className="text-xs font-medium text-slate-400">Human</span>
          </div>
        </div>

        <div className="flex-1 text-center md:text-left">
          <div className="flex items-center justify-center md:justify-start gap-2 mb-2">
             {isHuman ? (
                <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-sm font-bold flex items-center gap-1">
                    <CheckCircle2 className="w-4 h-4" /> Highly Human
                </span>
             ) : (
                <span className="px-3 py-1 rounded-full bg-red-100 text-red-800 text-sm font-bold flex items-center gap-1">
                    <AlertTriangle className="w-4 h-4" /> AI Detected
                </span>
             )}
             {fileName && <span className="text-sm text-slate-400">analyzing {fileName}</span>}
          </div>
          <h2 className="text-3xl font-bold text-slate-900 mb-2">{data.verdict}</h2>
          <p className="text-slate-600 leading-relaxed mb-4">
            {data.explanation}
          </p>
          
          {/* Resources / Methodology Blurb */}
          <div className="bg-slate-50 p-3 rounded-lg border border-slate-200 text-xs text-slate-500 flex gap-2 items-start">
            <BookOpen className="w-4 h-4 mt-0.5 flex-shrink-0" />
            <div>
              <span className="font-semibold text-slate-700 block mb-1">Resources & Methodology:</span>
              {data.methodology}
            </div>
          </div>
        </div>
      </div>

      {/* Tabbed Analysis Section */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="flex border-b border-slate-200">
           <button 
             onClick={() => setActiveTab('segments')}
             className={`flex-1 py-4 text-sm font-medium flex items-center justify-center gap-2 transition-colors ${activeTab === 'segments' ? 'text-indigo-600 border-b-2 border-indigo-600 bg-indigo-50/50' : 'text-slate-600 hover:bg-slate-50'}`}
           >
             <Sparkles className="w-4 h-4" />
             AI Highlights
           </button>
           <button 
             onClick={() => setActiveTab('typos')}
             className={`flex-1 py-4 text-sm font-medium flex items-center justify-center gap-2 transition-colors ${activeTab === 'typos' ? 'text-indigo-600 border-b-2 border-indigo-600 bg-indigo-50/50' : 'text-slate-600 hover:bg-slate-50'}`}
           >
             <TypeIcon className="w-4 h-4" />
             Typos & Grammar
           </button>
           <button 
             onClick={() => setActiveTab('patterns')}
             className={`flex-1 py-4 text-sm font-medium flex items-center justify-center gap-2 transition-colors ${activeTab === 'patterns' ? 'text-indigo-600 border-b-2 border-indigo-600 bg-indigo-50/50' : 'text-slate-600 hover:bg-slate-50'}`}
           >
             <BrainCircuit className="w-4 h-4" />
             Linguistic Patterns
           </button>
        </div>

        <div className="p-6">
           {/* AI Segments Tab */}
           {activeTab === 'segments' && (
              <div className="space-y-4">
                 <div className="flex items-center gap-2 mb-2 text-sm text-slate-500">
                    <Info className="w-4 h-4" />
                    <span>These sections demonstrate high probability of AI generation (low perplexity).</span>
                 </div>
                 {data.aiSegments.length > 0 ? (
                   data.aiSegments.map((segment, i) => (
                     <div key={i} className="p-4 rounded-lg border border-red-100 bg-red-50/50">
                        <p className="text-slate-800 italic mb-2">"{segment.text}"</p>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-red-600 uppercase tracking-wider">AI Signal</span>
                          <span className="text-xs text-red-700">{segment.reason}</span>
                        </div>
                     </div>
                   ))
                 ) : (
                   <div className="text-center py-8 text-slate-500">
                      <CheckCircle2 className="w-8 h-8 mx-auto mb-2 text-emerald-500" />
                      <p>No specific AI segments were flagged. The text feels organic.</p>
                   </div>
                 )}
              </div>
           )}

           {/* Typos Tab */}
           {activeTab === 'typos' && (
              <div className="space-y-4">
                <div className="flex items-center gap-2 mb-2 text-sm text-slate-500">
                    <Info className="w-4 h-4" />
                    <span>Human writing often contains small errors. AI is usually grammatically perfect.</span>
                 </div>
                 {data.typos.length > 0 ? (
                   <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {data.typos.map((typo, i) => (
                        <div key={i} className="p-3 rounded-lg border border-amber-200 bg-amber-50">
                           <div className="flex justify-between items-start mb-1">
                              <span className="font-medium text-red-600 line-through decoration-red-400 decoration-2">{typo.text}</span>
                              <span className="font-bold text-emerald-600">{typo.suggestion}</span>
                           </div>
                           <p className="text-xs text-slate-500 mt-1">Context: "...{typo.context}..."</p>
                        </div>
                      ))}
                   </div>
                 ) : (
                   <div className="text-center py-8 text-slate-500">
                      <p>No typos detected. This can sometimes indicate AI involvement if the text is complex.</p>
                   </div>
                 )}
              </div>
           )}

           {/* Patterns Tab */}
           {activeTab === 'patterns' && (
              <div className="space-y-6">
                 <div>
                    <h4 className="text-sm font-semibold text-slate-900 uppercase tracking-wider mb-3">Tone Analysis</h4>
                    <p className="text-slate-700 bg-slate-50 p-3 rounded-lg border border-slate-100">{data.toneAnalysis}</p>
                 </div>
                 <div>
                    <h4 className="text-sm font-semibold text-slate-900 uppercase tracking-wider mb-3">Detected Features</h4>
                    <ul className="space-y-2">
                      {data.linguisticPatterns.map((pattern, i) => (
                        <li key={i} className="flex items-start gap-2 text-sm text-slate-600 p-2 hover:bg-slate-50 rounded transition-colors">
                            <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-indigo-500 flex-shrink-0"></div>
                            {pattern}
                        </li>
                      ))}
                    </ul>
                 </div>
              </div>
           )}
        </div>
      </div>

    </div>
  );
};