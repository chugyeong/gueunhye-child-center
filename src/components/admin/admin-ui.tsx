"use client";

import { X } from "lucide-react";

const ICON_STROKE = 1.8;

export function AdminModalShell({
  title,
  titleId,
  maxWidth = "max-w-lg",
  maxHeight = "max-h-[min(720px,calc(100vh-48px))]",
  children,
  onClose,
}: {
  title: string;
  titleId: string;
  maxWidth?: string;
  maxHeight?: string;
  children: React.ReactNode;
  onClose: () => void;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/45 px-4 py-6">
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className={`${maxHeight} w-full ${maxWidth} overflow-y-auto rounded-lg bg-white p-5 shadow-xl`}>
        <div className="mb-5 flex items-center justify-between gap-3">
          <h2 id={titleId} className="text-xl font-bold text-slate-950">
            {title}
          </h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="모달 닫기"
            className="inline-flex size-9 items-center justify-center rounded-md border border-slate-200 text-slate-600 hover:border-teal-300 hover:text-teal-700">
            <X aria-hidden="true" size={18} strokeWidth={ICON_STROKE} />
          </button>
        </div>
        {children}
      </section>
    </div>
  );
}

export function AdminFormField({
  label,
  error,
  children,
}: {
  label: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <label className="grid gap-2 text-sm font-bold text-slate-800">
      {label}
      {children}
      {error ? <span className="text-xs font-semibold text-red-600">{error}</span> : null}
    </label>
  );
}

export function AdminStatusPanel({
  tone,
  children,
}: {
  tone: "success" | "error";
  children: React.ReactNode;
}) {
  const classNameByTone = {
    success: "border-teal-100 bg-teal-50 text-teal-800",
    error: "border-red-100 bg-red-50 text-red-700",
  };

  return (
    <p className={`rounded-md border px-4 py-3 text-sm font-semibold ${classNameByTone[tone]}`}>
      {children}
    </p>
  );
}

export function AdminTableLoadingState() {
  return (
    <div className="grid gap-3 p-5">
      {Array.from({ length: 5 }, (_, index) => (
        <div key={index} className="h-12 animate-pulse rounded-md bg-slate-100" />
      ))}
    </div>
  );
}
