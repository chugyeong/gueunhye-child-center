import { Suspense } from "react";
import { NoticeList } from "@/components/notices/notice-list";

export const metadata = {
  title: "공지사항",
  description: "구은혜아동발달센터 공지사항 안내",
};

export default function NoticesPage() {
  return (
    <section>
      <div className="mx-auto max-w-7xl px-5 py-14 md:py-20">
        <div className="max-w-3xl" data-aos="fade-up">
          <p className="text-sm font-semibold uppercase tracking-wide text-teal-700">Notices</p>
          <h1 className="mt-4 text-4xl font-bold leading-tight text-stone-950 md:text-5xl">
            공지사항
          </h1>
          <p className="mt-5 text-lg leading-8 text-stone-600">
            센터 운영 안내와 주요 공지를 확인하는 게시판입니다.
          </p>
        </div>

        <Suspense
          fallback={
            <div className="mt-10 rounded-lg border border-stone-200 bg-white p-8 text-sm text-stone-600 shadow-sm">
              공지사항을 불러오는 중입니다.
            </div>
          }>
          <NoticeList />
        </Suspense>
      </div>
    </section>
  );
}
