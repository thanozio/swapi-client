"use client";

import { useState, useEffect, PropsWithChildren } from "react";
import { createPortal } from "react-dom";

interface ModalProps extends PropsWithChildren {
  isOpen: boolean;
  onClose: () => void;
}

export default function Modal({ isOpen, onClose, children }: ModalProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted || !isOpen) return null;

  return createPortal(
    <div
      className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-70"
      onClick={onClose}
    >
      <div
        className="bg-white p-6 rounded-lg text-black shadow-lg flex flex-col items-center justify-center"
        // Without this, the parent's onClose event will fire (event bubbling)
        onClick={(e) => e.stopPropagation()}
      >
        {children}
      </div>
    </div>,
    document.body
  );
}
