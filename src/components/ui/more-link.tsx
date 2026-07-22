import { ArrowRight } from "lucide-react";
import Link from "next/link";

const ICON_STROKE = 1.8;

type MoreLinkProps = {
  href: string;
  children: React.ReactNode;
  className?: string;
};

export function MoreLink({ href, children, className = "" }: MoreLinkProps) {
  return (
    <Link
      href={href}
      className={`group inline-flex min-h-11 items-center justify-center gap-2 rounded-md px-3 text-sm font-semibold text-teal-800 transition hover:text-teal-950 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-700 active:bg-teal-100 ${className}`}>
      {children}
      <ArrowRight
        aria-hidden="true"
        size={18}
        strokeWidth={ICON_STROKE}
        className="transition-transform duration-200 group-hover:translate-x-1"
      />
    </Link>
  );
}
