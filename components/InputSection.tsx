import React, { useCallback, useRef } from 'react';
import { UploadCloud, FileText, X } from 'lucide-react';
import { extractTextFromDocx, readFileAsText } from '../services/documentService';

interface InputSectionProps {
  onAnalyze: (text: string, fileName?: string) => void;
  isAnalyzing: boolean;
}

export const InputSection: React.FC<InputSectionProps> = ({ onAnalyze, isAnalyzing }) => {
  const [text, setText] = React.useState('');
  const [activeTab, setActiveTab] = React.useState<'paste' | 'upload'>('upload');
  const [error, setError] = React.useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    await processFile(file);
  };

  const processFile = async (file: File) => {
    setError(null);
    try {
      let extractedText = '';
      if (file.name.endsWith('.docx')) {
        extractedText = await extractTextFromDocx(file);
      } else if (file.type === 'text/plain') {
        extractedText = await readFileAsText(file);
      } else {
        setError("Unsupported file type. Please upload .docx or .txt");
        return;
      }

      if (extractedText.trim().length < 50) {
        setError("The document contains insufficient text to analyze.");
        return;
      }

      onAnalyze(extractedText, file.name);
    } catch (err) {
      setError("Failed to read document. Please try again.");
      console.error(err);
    }
  };

  const handleTextSubmit = () => {
    if (text.trim().length < 50) {
      setError("Please enter at least 50 characters for accurate analysis.");
      return;
    }
    setError(null);
    onAnalyze(text, "Pasted Text");
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
      {/* Tabs */}
      <div className="flex border-b border-slate-200">
        <button
          onClick={() => setActiveTab('upload')}
          className={`flex-1 py-4 text-sm font-medium flex items-center justify-center gap-2 transition-colors ${
            activeTab === 'upload' ? 'bg-indigo-50 text-indigo-700 border-b-2 border-indigo-600' : 'text-slate-600 hover:bg-slate-50'
          }`}
        >
          <UploadCloud className="w-4 h-4" />
          Upload Document
        </button>
        <button
          onClick={() => setActiveTab('paste')}
          className={`flex-1 py-4 text-sm font-medium flex items-center justify-center gap-2 transition-colors ${
            activeTab === 'paste' ? 'bg-indigo-50 text-indigo-700 border-b-2 border-indigo-600' : 'text-slate-600 hover:bg-slate-50'
          }`}
        >
          <FileText className="w-4 h-4" />
          Paste Text
        </button>
      </div>

      <div className="p-6 sm:p-8">
        {activeTab === 'upload' ? (
          <div className="text-center">
             <div 
                className="border-2 border-dashed border-slate-300 rounded-xl p-10 hover:bg-slate-50 transition-colors cursor-pointer group"
                onClick={() => fileInputRef.current?.click()}
             >
                <div className="w-16 h-16 bg-indigo-50 text-indigo-600 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                  <UploadCloud className="w-8 h-8" />
                </div>
                <h3 className="text-lg font-semibold text-slate-900 mb-1">Click to upload or drag and drop</h3>
                <p className="text-slate-500 text-sm mb-4">Support for .docx (Word) and .txt</p>
                <input 
                  type="file" 
                  ref={fileInputRef}
                  className="hidden" 
                  accept=".docx,.txt"
                  onChange={handleFileChange}
                />
                <button className="px-4 py-2 bg-white border border-slate-300 rounded-lg text-sm font-medium text-slate-700 shadow-sm hover:bg-slate-50">
                  Select File
                </button>
             </div>
          </div>
        ) : (
          <div className="relative">
             <textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Paste your text here to detect AI content..."
                className="w-full h-64 p-4 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none resize-none text-slate-700"
             />
             <div className="mt-4 flex justify-between items-center">
                <span className="text-xs text-slate-400">{text.length} characters</span>
                <button 
                  onClick={handleTextSubmit}
                  disabled={isAnalyzing || text.length === 0}
                  className="bg-indigo-600 text-white px-6 py-2.5 rounded-lg font-medium hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  {isAnalyzing ? 'Analyzing...' : 'Check for AI'}
                </button>
             </div>
          </div>
        )}
        
        {error && (
          <div className="mt-4 p-3 bg-red-50 text-red-700 text-sm rounded-lg flex items-center gap-2">
             <X className="w-4 h-4" />
             {error}
          </div>
        )}
      </div>
    </div>
  );
};