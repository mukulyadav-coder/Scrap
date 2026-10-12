import React from 'react';
import { useApp } from '../../context/AppContext';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export const Toast: React.FC = () => {
  const { toast } = useApp();

  if (!toast) return null;

  return (
    <div className="fixed bottom-16 lg:bottom-6 right-4 sm:right-6 z-50 animate-in fade-in slide-in-from-bottom-5 duration-300">
      <div className={`
        flex items-center gap-3 px-4 py-3 rounded-2xl shadow-soft-lg border backdrop-blur-md text-xs sm:text-sm font-semibold max-w-md
        ${toast.type === 'success' ? 'bg-forest-900/95 text-white border-forest-700 shadow-forest-900/20' : ''}
        ${toast.type === 'info' ? 'bg-slate-900/95 text-white border-slate-700' : ''}
        ${toast.type === 'error' ? 'bg-rose-900/95 text-white border-rose-700 shadow-rose-900/20' : ''}
      `}>
        {toast.type === 'success' && <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />}
        {toast.type === 'info' && <Info className="w-5 h-5 text-blue-400 shrink-0" />}
        {toast.type === 'error' && <AlertCircle className="w-5 h-5 text-rose-400 shrink-0" />}
        <span>{toast.message}</span>
      </div>
    </div>
  );
};

