'use client';

import * as React from "react";
import { cn } from "../../lib/utils";

interface TooltipProps {
  content: React.ReactNode;
  children: React.ReactNode;
  side?: "top" | "bottom" | "left" | "right";
  className?: string;
}

export const Tooltip: React.FC<TooltipProps> = ({
  content,
  children,
  side = "top",
  className
}) => {
  const [isOpen, setIsOpen] = React.useState(false);

  const sideClasses = {
    top: "bottom-full left-1/2 -translate-x-1/2 mb-1.5",
    bottom: "top-full left-1/2 -translate-x-1/2 mt-1.5",
    left: "right-full top-1/2 -translate-y-1/2 mr-1.5",
    right: "left-full top-1/2 -translate-y-1/2 ml-1.5"
  };

  return (
    <div
      className="relative inline-flex items-center"
      onMouseEnter={() => setIsOpen(true)}
      onMouseLeave={() => setIsOpen(false)}
      onFocus={() => setIsOpen(true)}
      onBlur={() => setIsOpen(false)}
    >
      {children}
      {isOpen && (
        <div
          role="tooltip"
          className={cn(
            "absolute z-50 px-2.5 py-1 text-xs font-medium text-white bg-slate-900 rounded-md shadow-md pointer-events-none whitespace-nowrap animate-in fade-in-0 zoom-in-95 duration-100",
            sideClasses[side],
            className
          )}
        >
          {content}
        </div>
      )}
    </div>
  );
};
