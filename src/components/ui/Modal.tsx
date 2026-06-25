"use client";

import type { ReactNode } from "react";
import { useState, useEffect } from "react";
import { createPortal } from "react-dom";

interface ModalProps {
  open: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
}

export default function Modal({ open, onClose, title, children }: ModalProps) {
  const [mounted, setMounted] = useState(false);
  const [visible, setVisible] = useState(false);

  useEffect(() => { setMounted(true); }, []);

  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
      requestAnimationFrame(() => setVisible(true));
    } else {
      document.body.style.overflow = "";
      setVisible(false);
    }
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (open) document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [open, onClose]);

  if (!mounted || !open) return null;

  return createPortal(
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center p-6 transition-colors duration-500 ${
        visible ? "bg-black/50 backdrop-blur-md" : "bg-transparent"
      }`}
      onClick={onClose}
    >
      <div
        className={`bg-[#101018] border border-white/[0.08] rounded-2xl w-full max-w-md shadow-2xl shadow-black/40 transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
          visible ? "opacity-100 scale-100 translate-y-0" : "opacity-0 scale-96 translate-y-6"
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/[0.05]">
          <h2 className="text-noir-100 font-semibold text-base">{title}</h2>
          <button
            onClick={onClose}
            className="text-noir-500 hover:text-noir-200 transition-colors text-xl leading-none w-7 h-7 flex items-center justify-center rounded-lg hover:bg-white/[0.04]"
          >
            &times;
          </button>
        </div>
        <div className="p-6 max-h-[65vh] overflow-y-auto">{children}</div>
      </div>
    </div>,
    document.body
  );
}
