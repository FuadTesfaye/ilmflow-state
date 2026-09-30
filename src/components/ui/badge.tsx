import * as React from "react";
import { cn } from "../../lib/utils";

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "secondary" | "destructive" | "outline" | "success" | "warning" | "info" | "neon" | "gradient";
}

export function Badge({ className, variant = "default", ...props }: BadgeProps) {
  const variants = {
    default: "border-transparent bg-emerald-600 text-white shadow-2xs hover:bg-emerald-700",
    gradient: "border-emerald-400/30 bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 text-white shadow-[0_0_15px_rgba(16,185,129,0.35)]",
    neon: "border-emerald-500/40 bg-slate-950 text-emerald-400 shadow-[0_0_12px_rgba(16,185,129,0.3)] ring-1 ring-emerald-500/20",
    secondary: "border-transparent bg-slate-100 text-slate-800 hover:bg-slate-200/80",
    destructive: "border-transparent bg-red-100 text-red-700 hover:bg-red-200/80",
    outline: "text-slate-800 border-slate-200",
    success: "border-emerald-200 bg-emerald-50 text-emerald-800",
    warning: "border-amber-200 bg-amber-50 text-amber-900",
    info: "border-blue-200 bg-blue-50 text-blue-800"
  };

  return (
    <div
      className={cn(
        "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-all focus:outline-none focus:ring-2 focus:ring-emerald-500/20 select-none",
        variants[variant],
        className
      )}
      {...props}
    />
  );
}
