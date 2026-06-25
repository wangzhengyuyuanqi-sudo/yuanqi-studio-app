"use client";

import type { ReactNode } from "react";
import { useState, useEffect } from "react";

interface SectionAccordionProps {
  title: string;
  badge: string;
  badgeClass: string;
  count: number;
  children: ReactNode;
  headerRight?: ReactNode;
  defaultOpen?: boolean;
}

export default function SectionAccordion({
  title,
  badge,
  badgeClass,
  count,
  children,
  headerRight,
  defaultOpen = false,
}: SectionAccordionProps) {
  const [open, setOpen] = useState(defaultOpen);

  useEffect(() => {
    setOpen(defaultOpen);
  }, [defaultOpen]);

  return (
    <div className="bg-slate-800/50 rounded-xl border border-slate-700/50 overflow-hidden">
      <div
        role="button"
        tabIndex={0}
        className="flex items-center justify-between px-5 py-4 cursor-pointer hover:bg-slate-800/70 transition-colors select-none"
        onClick={() => setOpen(!open)}
        onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); setOpen(!open); } }}
      >
        <div className="flex items-center gap-3">
          <span className={`text-xs font-medium px-2 py-1 rounded-md border ${badgeClass}`}>
            {badge}
          </span>
          <span className="text-sm font-medium text-slate-300">{title}</span>
          <span className="text-xs text-slate-600">({count})</span>
        </div>

        <div className="flex items-center gap-3">
          {headerRight && (
            <div onClick={(e) => e.stopPropagation()} role="presentation">
              {headerRight}
            </div>
          )}
          <svg
            className={`w-4 h-4 text-slate-500 transition-transform duration-300 ${open ? "rotate-180" : ""}`}
            fill="none" stroke="currentColor" viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </div>

      <div
        className="transition-all duration-300 overflow-hidden"
        style={{ maxHeight: open ? "2000px" : "0px", opacity: open ? 1 : 0 }}
      >
        <div className="px-5 pb-5">{children}</div>
      </div>
    </div>
  );
}
