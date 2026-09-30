'use client';

import * as React from "react";
import { cn } from "../../lib/utils";
import { X } from "lucide-react";

interface SheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  children: React.ReactNode;
  side?: "right" | "left" | "top" | "bottom";
}

export const Sheet: React.FC<SheetProps> = ({
  open,
  onOpenChange,
  children,
  side = "right"
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

  const sideClasses = {
    right: "inset-y-0 right-0 h-full w-full sm:max-w-md md:max-w-lg border-l border-slate-200 animate-in slide-in-from-right duration-200",
    left: "inset-y-0 left-0 h-full w-full sm:max-w-md md:max-w-lg border-r border-slate-200 animate-in slide-in-from-left duration-200",
    top: "inset-x-0 top-0 w-full border-b border-slate-200 animate-in slide-in-from-top duration-200",
    bottom: "inset-x-0 bottom-0 w-full border-t border-slate-200 animate-in slide-in-from-bottom duration-200"
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/40 backdrop-blur-xs transition-opacity animate-in fade-in-0 duration-150"
        onClick={() => onOpenChange(false)}
      />
      {/* Sliding Sheet */}
      <div
        className={cn(
          "fixed bg-white shadow-2xl flex flex-col z-50 p-6 overflow-y-auto",
          sideClasses[side]
        )}
      >
        <button
          onClick={() => onOpenChange(false)}
          className="absolute top-4 right-4 p-1.5 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
          aria-label="Close sheet"
        >
          <X size={18} />
        </button>
        {children}
      </div>
    </div>
  );
};

export const SheetHeader = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn("flex flex-col space-y-1.5 text-left pb-4 border-b border-slate-100", className)}
    {...props}
  />
);
SheetHeader.displayName = "SheetHeader";

export const SheetTitle = React.forwardRef<
  HTMLHeadingElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h3
    ref={ref}
    className={cn("text-lg font-bold text-slate-900 tracking-tight", className)}
    {...props}
  />
));
SheetTitle.displayName = "SheetTitle";

export const SheetDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn("text-xs sm:text-sm text-slate-500", className)}
    {...props}
  />
));
SheetDescription.displayName = "SheetDescription";

export const SheetFooter = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn("flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2 pt-4 border-t border-slate-100 mt-auto", className)}
    {...props}
  />
);
SheetFooter.displayName = "SheetFooter";
