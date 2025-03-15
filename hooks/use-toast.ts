import { useState } from "react";

interface Toast {
  title: string;
  description: string;
  variant?: "default" | "destructive";
}

export function useToast() {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const toast = (newToast: Toast) => {
    setToasts([...toasts, newToast]);
  };

  const removeToast = (index: number) => {
    setToasts(toasts.filter((_, i) => i !== index));
  };

  return {
    toasts,
    toast,
    removeToast,
  };
}
