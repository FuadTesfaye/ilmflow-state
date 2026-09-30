'use client';

import * as React from "react";
import { cn } from "../../lib/utils";
import { ChevronDown } from "lucide-react";

export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
}

export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, children, label, error, ...props }, ref) => {
    return (
      <div className="relative w-full space-y-1">
        {label && (
          <label className="text-xs font-semibold text-slate-700 block">
            {label}
          </label>
        )}
        <div className="relative">
          <select
            ref={ref}
            className={cn(
              "flex h-9 w-full appearance-none rounded-lg border border-slate-200/90 bg-white px-3 py-1.5 pr-8 text-xs font-medium text-slate-900 shadow-2xs transition-colors placeholder:text-slate-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500/20 focus-visible:border-emerald-500 disabled:cursor-not-allowed disabled:opacity-50 cursor-pointer",
              error && "border-red-500 focus-visible:ring-red-500/20",
              className
            )}
            {...props}
          >
            {children}
          </select>
          <ChevronDown
            size={14}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
          />
        </div>
        {error && <p className="text-[11px] text-red-500">{error}</p>}
      </div>
    );
  }
);
Select.displayName = "Select";
