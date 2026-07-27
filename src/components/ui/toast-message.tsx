"use client";

import { CheckCircle2, X, XCircle } from "lucide-react";
import { useEffect } from "react";

const ICON_STROKE = 1.8;

type ToastMessageProps = {
  message: string | null;
  tone?: "success" | "error";
  onClose: () => void;
};

export function ToastMessage({ message, tone = "success", onClose }: ToastMessageProps) {
  useEffect(() => {
    if (!message) {
      return;
    }

    const timer = window.setTimeout(onClose, 3600);

    return () => window.clearTimeout(timer);
  }, [message, onClose]);

  if (!message) {
    return null;
  }

  const Icon = tone === "success" ? CheckCircle2 : XCircle;
  const classNameByTone = {
    success: "border-teal-100 bg-white text-teal-800 shadow-teal-950/10",
    error: "border-red-100 bg-white text-red-700 shadow-red-950/10",
  };

  return (
    <div
      role="status"
      aria-live="polite"
      className={`fixed right-4 top-4 z-[90] flex w-[min(calc(100vw-32px),380px)] items-start gap-3 rounded-lg border px-4 py-3 text-sm font-semibold shadow-xl ${classNameByTone[tone]}`}>
      <Icon aria-hidden="true" className="mt-0.5 shrink-0" size={18} strokeWidth={ICON_STROKE} />
      <p className="min-w-0 flex-1 leading-6">{message}</p>
      <button
        type="button"
        onClick={onClose}
        aria-label="알림 닫기"
        className="inline-flex size-7 shrink-0 items-center justify-center rounded-md text-slate-400 hover:bg-slate-100 hover:text-slate-700">
        <X aria-hidden="true" size={15} strokeWidth={ICON_STROKE} />
      </button>
    </div>
  );
}
