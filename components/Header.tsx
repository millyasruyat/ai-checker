import React from 'react';
import { ShieldCheck, Github } from 'lucide-react';

export const Header: React.FC = () => {
  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        <div className="flex items-center gap-2 text-indigo-600">
          <ShieldCheck className="w-8 h-8" />
          <span className="text-xl font-bold tracking-tight text-slate-900">Veritas</span>
        </div>
        <nav className="flex items-center gap-6 text-sm font-medium text-slate-600">
          <a href="#" className="hover:text-indigo-600 transition-colors">How it Works</a>
          <a href="#" className="hover:text-indigo-600 transition-colors">Pricing</a>
          <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-slate-900">
            <Github className="w-5 h-5" />
          </a>
        </nav>
      </div>
    </header>
  );
};