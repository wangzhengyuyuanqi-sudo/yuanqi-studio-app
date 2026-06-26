"use client";

import { useState, useEffect, type ReactNode } from "react";
import { createPortal } from "react-dom";

interface ModalProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
}

export default function Modal({ open, onClose, title, children }: ModalProps) {
  const [visible, setVisible] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => { setMounted(true); }, []);

  useEffect(() => {
    if (open) {
      const t = setTimeout(() => setVisible(true), 20);
      return () => clearTimeout(t);
    } else {
      setVisible(false);
    }
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", handler);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handler);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  if (!mounted || !open) return null;

  return createPortal(
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center p-6 transition-all duration-600 ${
        visible ? "bg-black/60 backdrop-blur-xl" : "bg-transparent"
      }`}
      onClick={onClose}
    >
      <div
        className={`neumorph-raised rounded-3xl w-full max-w-md shadow-neumorph shadow-gold-glow transition-all duration-600 ease-[cubic-bezier(0.16,1,0.3,1)] ${
          visible ? "opacity-100 scale-100 translate-y-0" : "opacity-0 scale-95 translate-y-8"
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-7 pt-6 pb-3">
          {title ? (
            <h2 className="text-lg font-bold text-champagne-300 tracking-wide">{title}</h2>
          ) : <span />}
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-xl neumorph-inset flex items-center justify-center text-noir-400 hover:text-champagne-300 transition-colors duration-200"
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>
        <div className="px-7 pb-7">{children}</div>
      </div>
    </div>,
    document.body
  );
}
