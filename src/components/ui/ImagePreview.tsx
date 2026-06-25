"use client";

import { useState, useCallback, useEffect } from "react";

interface ImagePreviewProps {
  src: string;
  alt: string;
  className?: string;
}

export function ImageWithPreview({ src, alt, className = "" }: ImagePreviewProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (isOpen) {
      requestAnimationFrame(() => setVisible(true));
    } else {
      setVisible(false);
    }
  }, [isOpen]);

  const handleClose = useCallback(() => setIsOpen(false), []);

  return (
    <>
      <div
        className={`cursor-pointer overflow-hidden rounded-lg ${className}`}
        onClick={() => setIsOpen(true)}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={src}
          alt={alt}
          className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
          loading="lazy"
        />
      </div>

      {isOpen && (
        <div
          className={`fixed inset-0 z-50 flex items-center justify-center p-4 transition-all duration-300 ${
            visible ? "bg-black/80 backdrop-blur-sm" : "bg-black/0"
          }`}
          onClick={handleClose}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={src}
            alt={alt}
            className={`max-w-full max-h-[90vh] object-contain rounded-lg transition-all duration-300 ${
              visible ? "opacity-100 scale-100" : "opacity-0 scale-95"
            }`}
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </>
  );
}
