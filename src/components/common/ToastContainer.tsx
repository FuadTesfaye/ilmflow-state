'use client';

import React from 'react';
import { useApp } from '../../context/AppContext';
import { CheckCircle2, AlertTriangle, Info, XCircle, X } from 'lucide-react';
import { IslamicStarIcon } from './IslamicPattern';

export const ToastContainer: React.FC = () => {
  const { toasts, removeToast } = useApp();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed top-20 right-5 z-50 flex flex-col gap-2.5 max-w-sm sm:max-w-md w-full pointer-events-none select-none">
      {toasts.map((toast) => {
        const icons = {
          success: <CheckCircle2 size={18} className="text-[#064e3b] shrink-0" />,
          warning: <AlertTriangle size={18} className="text-[#9e782f] shrink-0" />,
          error: <XCircle size={18} className="text-red-600 shrink-0" />,
          info: <Info size={18} className="text-[#064e3b] shrink-0" />
        };

        return (
          <div
            key={toast.id}
            className="pointer-events-auto flex items-start gap-3 p-3.5 rounded-2xl bg-[#ffffff] border border-[#e7e2d6] text-[#111827] shadow-[0_10px_35px_-5px_rgba(0,0,0,0.1)] backdrop-blur-md animate-in slide-in-from-right duration-200"
          >
            <div className="mt-0.5">{icons[toast.type]}</div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1.5">
                <IslamicStarIcon size={12} className="text-[#9e782f]" />
                <h5 className="text-xs font-bold text-[#111827]">{toast.title}</h5>
              </div>
              {toast.description && (
                <p className="text-xs text-[#4b5563] mt-0.5 leading-relaxed">{toast.description}</p>
              )}
            </div>
            <button
              onClick={() => removeToast(toast.id)}
              className="text-[#9ca3af] hover:text-[#111827] p-1 rounded-lg hover:bg-[#f4f0e6] transition-colors cursor-pointer"
            >
              <X size={14} />
            </button>
          </div>
        );
      })}
    </div>
  );
};
