'use client';

import React from 'react';
import { useApp } from '../../context/AppContext';
import { CheckCircle2, AlertTriangle, Info, XCircle, X } from 'lucide-react';

export const ToastContainer: React.FC = () => {
  const { toasts, removeToast } = useApp();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed top-5 right-5 z-50 flex flex-col gap-2.5 max-w-sm sm:max-w-md w-full pointer-events-none select-none">
      {toasts.map((toast) => {
        const typeStyles = {
          success: 'border-l-4 border-l-emerald-600 bg-white/95 text-slate-900 shadow-lg shadow-emerald-950/10',
          warning: 'border-l-4 border-l-amber-500 bg-white/95 text-slate-900 shadow-lg shadow-amber-950/10',
          error: 'border-l-4 border-l-rose-600 bg-white/95 text-slate-900 shadow-lg shadow-rose-950/10',
          info: 'border-l-4 border-l-teal-600 bg-white/95 text-slate-900 shadow-lg shadow-teal-950/10'
        };

        const icons = {
          success: <CheckCircle2 size={18} className="text-emerald-600 shrink-0" />,
          warning: <AlertTriangle size={18} className="text-amber-500 shrink-0" />,
          error: <XCircle size={18} className="text-rose-600 shrink-0" />,
          info: <Info size={18} className="text-teal-600 shrink-0" />
        };

        return (
          <div
            key={toast.id}
            className={`pointer-events-auto flex items-start gap-3 p-4 rounded-xl border border-slate-200/90 backdrop-blur-md animate-in slide-in-from-right duration-200 ${typeStyles[toast.type]}`}
          >
            <div className="mt-0.5">{icons[toast.type]}</div>
            <div className="flex-1 min-w-0">
              <h5 className="text-xs font-bold text-slate-900">{toast.title}</h5>
              {toast.description && (
                <p className="text-xs text-slate-600 mt-1 leading-relaxed">{toast.description}</p>
              )}
            </div>
            <button
              onClick={() => removeToast(toast.id)}
              className="text-slate-400 hover:text-slate-800 p-1 rounded-md hover:bg-slate-100 transition-colors cursor-pointer"
            >
              <X size={14} />
            </button>
          </div>
        );
      })}
    </div>
  );
};
