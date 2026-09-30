'use client';

import * as React from "react";
import { cn } from "../../lib/utils";

interface DropdownMenuProps {
  trigger: React.ReactNode;
  children: React.ReactNode;
  align?: "left" | "right";
  className?: string;
}

export const DropdownMenu: React.FC<DropdownMenuProps> = ({
  trigger,
  children,
  align = "right",
  className
}) => {
  const [isOpen, setIsOpen] = React.useState(false);
  const menuRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  return (
    <div className="relative inline-block text-left" ref={menuRef}>
      <div onClick={() => setIsOpen(!isOpen)} className="cursor-pointer">
        {trigger}
      </div>

      {isOpen && (
        <div
          className={cn(
            "absolute z-50 mt-2 min-w-[180px] rounded-xl bg-white border border-slate-200/90 shadow-xl p-1.5 animate-in fade-in-0 zoom-in-95 duration-100",
            align === "right" ? "right-0" : "left-0",
            className
          )}
          onClick={() => setIsOpen(false)}
        >
          {children}
        </div>
      )}
    </div>
  );
};

export const DropdownMenuItem = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & { disabled?: boolean; destructive?: boolean }
>(({ className, disabled, destructive, children, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "flex items-center gap-2 px-3 py-2 text-xs font-medium rounded-lg cursor-pointer transition-colors select-none",
      destructive
        ? "text-red-600 hover:bg-red-50 hover:text-red-700"
        : "text-slate-700 hover:bg-slate-100 hover:text-slate-900",
      disabled && "pointer-events-none opacity-40",
      className
    )}
    {...props}
  >
    {children}
  </div>
));
DropdownMenuItem.displayName = "DropdownMenuItem";

export const DropdownMenuSeparator = () => (
  <div className="h-px bg-slate-100 my-1 -mx-1" />
);

export const DropdownMenuLabel = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn("px-3 py-1.5 text-[10px] font-semibold text-slate-400 uppercase tracking-wider", className)}
    {...props}
  />
);
