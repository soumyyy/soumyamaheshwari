"use client";

import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";

export default function VideoLightbox({
  src, open, onClose,
}: { src: string; open: boolean; onClose: () => void }) {
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;
    const prevFocus = document.activeElement as HTMLElement | null;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeRef.current?.focus();

    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", onKey);

    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
      prevFocus?.focus();
    };
  }, [open, onClose]);

  if (!open) return null;

  // Rendered via portal directly under <body> — not as a JSX descendant of the
  // triggering card. A `position: fixed` element is positioned relative to the
  // nearest ancestor with a transform/filter/will-change instead of the
  // viewport, and card surfaces here apply `md:scale-[1.02]` on hover, so
  // mounting in place could pin this to the card's box instead of the screen.
  return createPortal(
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Project demo video"
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4"
    >
      <button
        ref={closeRef}
        onClick={onClose}
        aria-label="Close video"
        className="absolute top-6 right-6 text-white/60 hover:text-[var(--accent)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)] rounded"
      >
        <X className="w-6 h-6" />
      </button>
      <video
        src={src}
        controls
        autoPlay
        playsInline
        onClick={(e) => e.stopPropagation()}
        className="max-h-[85vh] max-w-[90vw] rounded-lg"
      />
    </div>,
    document.body
  );
}
