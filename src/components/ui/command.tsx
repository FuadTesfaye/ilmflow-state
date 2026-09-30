'use client';

import * as React from "react";
import { cn } from "../../lib/utils";
import { Search } from "lucide-react";

interface CommandDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  children: React.ReactNode;
}

export const CommandDialog: React.FC<CommandDialogProps> = ({
  open,
  onOpenChange,
  children
}) => {
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onOpenChange(false);
    };
    if (open) {
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", handleKeyDown);
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [open, onOpenChange]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 p-4">
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-xs transition-opacity animate-in fade-in-0 duration-150"
        onClick={() => onOpenChange(false)}
      />
      <div className="relative z-50 w-full max-w-xl rounded-2xl bg-white border border-slate-200/90 shadow-2xl overflow-hidden animate-in fade-in-0 zoom-in-95 duration-150">
        {children}
      </div>
    </div>
  );
};

export const CommandInput = React.forwardRef<
  HTMLInputElement,
  React.InputHTMLAttributes<HTMLInputElement>
>(({ className, ...props }, ref) => (
  <div className="flex items-center px-4 py-3.5 border-b border-slate-100 bg-slate-50/50">
    <Search size={18} className="text-slate-400 shrink-0 mr-3" />
    <input
      ref={ref}
      className={cn(
        "w-full bg-transparent text-sm font-medium text-slate-800 placeholder:text-slate-400 outline-none",
        className
      )}
      autoFocus
      {...props}
    />
    <kbd className="hidden sm:inline-block px-1.5 py-0.5 text-[10px] font-mono text-slate-400 bg-slate-100 border border-slate-200 rounded">
      ESC
    </kbd>
  </div>
));
CommandInput.displayName = "CommandInput";

export const CommandList = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn("max-h-80 overflow-y-auto p-2 divide-y divide-slate-50", className)}
    {...props}
  />
);
CommandList.displayName = "CommandList";

export const CommandGroup = ({
  heading,
  children,
  className
}: {
  heading: string;
  children: React.ReactNode;
  className?: string;
}) => (
  <div className={cn("py-1 space-y-1", className)}>
    <div className="px-3 py-1 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
      {heading}
    </div>
    {children}
  </div>
);

export const CommandItem = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, children, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-medium text-slate-700 hover:bg-emerald-50 hover:text-[#135B3E] cursor-pointer transition-colors select-none",
      className
    )}
    {...props}
  >
    {children}
  </div>
));
CommandItem.displayName = "CommandItem";

export const CommandEmpty = ({ children }: { children: React.ReactNode }) => (
  <div className="py-8 text-center text-xs text-slate-400">
    {children}
  </div>
);
