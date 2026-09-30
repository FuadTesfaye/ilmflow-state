import * as React from "react";
import { cn } from "../../lib/utils";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link" | "gradient" | "neon";
  size?: "default" | "sm" | "lg" | "icon";
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "default", size = "default", ...props }, ref) => {
    const variants = {
      default: "bg-emerald-600 text-white hover:bg-emerald-700 shadow-xs",
      gradient: "bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-500 text-white shadow-[0_0_20px_rgba(16,185,129,0.35)] hover:shadow-[0_0_28px_rgba(16,185,129,0.5)] hover:from-emerald-500 hover:to-teal-500 border border-emerald-400/30",
      neon: "bg-slate-950 text-emerald-400 border border-emerald-500/50 shadow-[0_0_15px_rgba(16,185,129,0.25)] hover:bg-slate-900 hover:border-emerald-400 hover:shadow-[0_0_25px_rgba(16,185,129,0.45)] hover:text-emerald-300",
      destructive: "bg-red-600 text-white hover:bg-red-700 shadow-xs",
      outline: "border border-slate-200 bg-white hover:bg-slate-50 text-slate-800 shadow-2xs hover:border-slate-300",
      secondary: "bg-slate-100 text-slate-900 hover:bg-slate-200/80 shadow-2xs",
      ghost: "hover:bg-slate-100 text-slate-700",
      link: "text-emerald-600 underline-offset-4 hover:underline"
    };

    const sizes = {
      default: "h-9 px-4 py-2 text-sm",
      sm: "h-8 rounded-md px-3 text-xs",
      lg: "h-11 rounded-lg px-8 text-base",
      icon: "h-9 w-9 p-0"
    };

    return (
      <button
        ref={ref}
        className={cn(
          "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500/20 disabled:pointer-events-none disabled:opacity-50 cursor-pointer select-none",
          variants[variant],
          sizes[size],
          className
        )}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";
