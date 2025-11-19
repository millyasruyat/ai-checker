import React, { useState } from 'react';
import { Header } from './components/Header';
import { InputSection } from './components/InputSection';
import { AnalysisReport } from './components/AnalysisReport';
import { AnalysisResult, AnalysisStatus } from './types';
import { analyzeText } from './services/geminiService';
import { Loader2 } from 'lucide-react';

const App: React.FC = () => {
  const [status, setStatus] = useState<AnalysisStatus>(AnalysisStatus.IDLE);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [fileName, setFileName] = useState<string | undefined>(undefined);

  const handleAnalyze = async (text: string, name?: string) => {
    setStatus(AnalysisStatus.ANALYZING);
    setFileName(name);
    try {
      const analysisData = await analyzeText(text);
      setResult(analysisData);
      setStatus(AnalysisStatus.COMPLETE);
    } catch (error) {
      console.error(error);
      setStatus(AnalysisStatus.ERROR);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Header />
      
      <main className="flex-1 max-w-5xl mx-auto w-full px-4 sm:px-6 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-slate-900 mb-4">
            Is your content <span className="text-indigo-600">Authentic</span>?
          </h1>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Upload your Word document (.docx) or paste text to detect AI-generated patterns using our advanced linguistic analysis engine.
          </p>
        </div>

        <div className="max-w-3xl mx-auto space-y-8">
          <InputSection 
            onAnalyze={handleAnalyze} 
            isAnalyzing={status === AnalysisStatus.ANALYZING} 
          />

          {status === AnalysisStatus.ANALYZING && (
             <div className="text-center py-12 animate-pulse">
                <Loader2 className="w-10 h-10 text-indigo-600 animate-spin mx-auto mb-4" />
                <h3 className="text-lg font-medium text-slate-900">Scanning document patterns...</h3>
                <p className="text-slate-500">Checking perplexity and sentence structure</p>
             </div>
          )}

          {status === AnalysisStatus.ERROR && (
            <div className="p-4 bg-red-50 text-red-700 rounded-xl text-center border border-red-100">
              An error occurred during analysis. Please verify your API key and try again.
            </div>
          )}

          {status === AnalysisStatus.COMPLETE && result && (
            <AnalysisReport data={result} fileName={fileName} />
          )}
        </div>
      </main>

      <footer className="bg-white border-t border-slate-200 py-8 mt-auto">
        <div className="max-w-5xl mx-auto px-4 text-center text-slate-400 text-sm">
          <p>&copy; 2024 Veritas AI Detector. Powered by Google Gemini models.</p>
        </div>
      </footer>
    </div>
  );
};

export default App;