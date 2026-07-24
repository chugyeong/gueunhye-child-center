import type { Notice } from "@/data/notices";

type NoticeListPreviewProps = {
  notices: Notice[];
};

export function NoticeListPreview({ notices }: NoticeListPreviewProps) {
  return (
    <ul className="divide-y divide-slate-100">
      {notices.map((notice) => (
        <li key={notice.id} className="grid gap-1 py-3 first:pt-0 last:pb-0">
          <div className="flex items-center justify-between gap-3">
            <p className="min-w-0 truncate text-sm font-semibold text-slate-950">
              {notice.title}
            </p>
            {notice.isPinned ? (
              <span className="shrink-0 rounded bg-teal-50 px-2 py-1 text-xs font-bold text-teal-700">
                고정
              </span>
            ) : null}
          </div>
          <p className="text-xs text-slate-500">작성일 {notice.createdAt}</p>
        </li>
      ))}
    </ul>
  );
}
