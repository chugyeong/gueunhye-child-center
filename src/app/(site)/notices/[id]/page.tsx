import { FileText, Pin } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { notices } from "@/data/notices";
import { formatFileSize, getAdjacentNotices, getNoticeById } from "@/lib/notices";

const ICON_STROKE = 1.8;

type NoticeDetailPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export function generateStaticParams() {
  return notices.map((notice) => ({
    id: notice.id,
  }));
}

export async function generateMetadata({ params }: NoticeDetailPageProps) {
  const { id } = await params;
  const notice = getNoticeById(id);

  return {
    title: notice?.title ?? "공지사항",
    description: notice?.content.slice(0, 120) ?? "구은혜아동발달센터 공지사항",
  };
}

export default async function NoticeDetailPage({ params }: NoticeDetailPageProps) {
  const { id } = await params;
  const notice = getNoticeById(id);

  if (!notice) {
    notFound();
  }

  const adjacent = getAdjacentNotices(notice.id);

  return (
    <section>
      <div className="mx-auto max-w-4xl px-5 py-14 md:py-20">
        <Link href="/notices" className="text-sm font-bold text-teal-800 hover:text-teal-950">
          목록으로 돌아가기
        </Link>

        <article className="mt-6 rounded-lg border border-stone-200 bg-white p-6 shadow-sm md:p-10">
          {notice.isPinned ? (
            <div className="mb-5 inline-flex items-center gap-2 rounded-md bg-teal-50 px-3 py-2 text-sm font-bold text-teal-800">
              <Pin aria-hidden="true" size={16} strokeWidth={ICON_STROKE} />
              고정 공지
            </div>
          ) : null}
          <h1 className="text-3xl font-bold leading-tight text-stone-950 md:text-4xl">
            {notice.title}
          </h1>
          <div className="mt-5 flex flex-wrap gap-x-4 gap-y-2 text-sm text-stone-500">
            <time>작성일 {notice.createdAt}</time>
            {notice.updatedAt ? <time>수정일 {notice.updatedAt}</time> : null}
          </div>
          <div className="notice-body-scroll mt-10 max-h-[58vh] overflow-y-auto whitespace-pre-wrap break-words rounded-lg border border-stone-200 bg-stone-50/60 p-5 text-base leading-8 text-stone-700 md:max-h-[46vh] md:p-6">
            {notice.content}
          </div>

          {notice.attachments?.length ? (
            <section className="mt-10 rounded-lg border border-stone-200 bg-stone-50 p-5">
              <h2 className="text-base font-bold text-stone-950">첨부파일</h2>
              <ul className="mt-4 grid gap-2">
                {notice.attachments.map((attachment) => {
                  const fileSize = formatFileSize(attachment.size);
                  const content = (
                    <>
                      <FileText aria-hidden="true" size={18} strokeWidth={ICON_STROKE} />
                      <span className="min-w-0 flex-1 truncate">{attachment.name}</span>
                      {fileSize ? <span className="text-xs text-stone-500">{fileSize}</span> : null}
                    </>
                  );

                  return (
                    <li key={attachment.id}>
                      {attachment.url ? (
                        <a
                          href={attachment.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-3 rounded-md bg-white px-3 py-3 text-sm font-medium text-stone-700 hover:text-teal-800">
                          {content}
                        </a>
                      ) : (
                        <div className="flex items-center gap-3 rounded-md bg-white px-3 py-3 text-sm font-medium text-stone-500">
                          {content}
                        </div>
                      )}
                    </li>
                  );
                })}
              </ul>
            </section>
          ) : null}
        </article>

        <nav aria-label="이전글 다음글" className="mt-8 grid gap-3 border-y border-stone-200 py-4">
          <AdjacentLink label="이전글" notice={adjacent.previous} />
          <AdjacentLink label="다음글" notice={adjacent.next} />
        </nav>
      </div>
    </section>
  );
}

type AdjacentLinkProps = {
  label: string;
  notice: ReturnType<typeof getAdjacentNotices>["previous"];
};

function AdjacentLink({ label, notice }: AdjacentLinkProps) {
  return (
    <div className="grid grid-cols-[72px_1fr] gap-4 text-sm">
      <span className="font-bold text-stone-500">{label}</span>
      {notice ? (
        <Link
          href={`/notices/${notice.id}`}
          className="truncate font-semibold text-stone-800 hover:text-teal-800">
          {notice.title}
        </Link>
      ) : (
        <span className="text-stone-400">{label}이 없습니다.</span>
      )}
    </div>
  );
}
