import type { LucideIcon } from "lucide-react";

const ICON_STROKE = 1.8;

type InfoItemProps = {
  icon: LucideIcon;
  label: string;
  value: string;
};

export function InfoItem({ icon: Icon, label, value }: InfoItemProps) {
  if (!value) {
    return null;
  }

  return (
    <div className="grid min-w-0 grid-cols-[32px_minmax(70px,82px)_minmax(0,1fr)] items-start gap-3 rounded-md bg-slate-50 p-3">
      <span className="flex size-8 items-center justify-center rounded-md bg-teal-50 text-teal-800">
        <Icon aria-hidden="true" size={16} strokeWidth={ICON_STROKE} />
      </span>
      <dt className="pt-1.5 font-bold text-slate-700">{label}</dt>
      <dd className="min-w-0 break-keep pt-1.5 leading-6 text-slate-600">{value}</dd>
    </div>
  );
}
