"use client";

import { ChevronLeft, ChevronRight, Pin, Search, X } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { FormEvent, useEffect, useMemo, useRef } from "react";
import {
  getNoticeDisplayNumber,
  getNoticeList,
  NOTICES_PAGE_SIZE,
} from "@/lib/notices";
import { useNoticesStore } from "@/stores/noticesStore";

const ICON_STROKE = 1.8;

export function NoticeList() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const notices = useNoticesStore((state) => state.notices);
  const isLoading = useNoticesStore((state) => state.isLoading);
  const error = useNoticesStore((state) => state.error);
  const refetch = useNoticesStore((state) => state.refetch);
  const listTopRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const query = searchParams.get("q")?.trim() ?? "";
  const pageParam = Number(searchParams.get("page") ?? "1");

  const result = useMemo(
    () =>
      getNoticeList({
        query,
        page: pageParam,
        pageSize: NOTICES_PAGE_SIZE,
        source: notices,
      }),
    [notices, pageParam, query],
  );

  useEffect(() => {
    if (pageParam !== result.currentPage) {
      router.replace(buildNoticeUrl(pathname, query, result.currentPage), {
        scroll: false,
      });
    }
  }, [pageParam, pathname, query, result.currentPage, router]);

  const submitSearch = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const nextQuery = String(formData.get("q") ?? "").trim();

    router.push(buildNoticeUrl(pathname, nextQuery, 1));
  };

  const resetSearch = () => {
    if (searchInputRef.current) {
      searchInputRef.current.value = "";
    }

    router.push(buildNoticeUrl(pathname, "", 1));
  };

  const movePage = (page: number) => {
    router.push(buildNoticeUrl(pathname, query, page), { scroll: false });
    window.requestAnimationFrame(() => {
      listTopRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  };

  const pages = getVisiblePages(result.currentPage, result.totalPages);

  return (
    <div ref={listTopRef} className="mt-10 scroll-mt-32">
      <form
        onSubmit={submitSearch}
        className="rounded-lg border border-stone-200 bg-white p-4 shadow-sm"
      >
        <label htmlFor="notice-search" className="sr-only">
          공지사항 검색
        </label>
        <div className="grid gap-3 sm:grid-cols-[1fr_auto]">
          <div className="relative">
            <Search
              aria-hidden="true"
              size={18}
              strokeWidth={ICON_STROKE}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400"
            />
            <input
              id="notice-search"
              key={query}
              ref={searchInputRef}
              name="q"
              defaultValue={query}
              placeholder="제목 또는 본문 검색"
              className="h-11 w-full rounded-md border border-stone-300 bg-white pl-10 pr-11 text-sm text-stone-900 focus:border-teal-600 focus:outline-none"
            />
            {query ? (
              <button
                type="button"
                onClick={resetSearch}
                aria-label="검색어 초기화"
                className="absolute right-2 top-1/2 inline-flex size-8 -translate-y-1/2 items-center justify-center rounded-md text-stone-500 hover:bg-stone-100 hover:text-stone-800 focus-visible:outline-2 focus-visible:outline-teal-700"
              >
                <X aria-hidden="true" size={16} strokeWidth={ICON_STROKE} />
              </button>
            ) : null}
          </div>
          <button
            type="submit"
            className="inline-flex h-11 items-center justify-center rounded-md bg-teal-700 px-5 text-sm font-bold text-white hover:bg-teal-800"
          >
            검색
          </button>
        </div>
      </form>

      <div className="mt-5 flex flex-wrap items-center justify-between gap-3 text-sm text-stone-600">
        <p>
          총 <strong className="text-stone-950">{result.totalCount}</strong>건
        </p>
        {query ? <p>검색어: {query}</p> : null}
      </div>

      <div className="mt-4 overflow-hidden rounded-lg border border-stone-200 bg-white shadow-sm">
        {isLoading && notices.length === 0 ? (
          <div className="px-5 py-16 text-center text-sm font-medium text-stone-600">
            공지사항을 불러오는 중입니다.
          </div>
        ) : null}

        {!isLoading && error ? (
          <div className="grid gap-3 px-5 py-10 text-center">
            <p className="text-sm font-medium text-red-700">{error}</p>
            <button
              type="button"
              onClick={() => void refetch()}
              className="mx-auto h-10 rounded-md border border-stone-300 bg-white px-4 text-sm font-bold text-stone-700 hover:border-teal-500 hover:text-teal-800">
              다시 시도
            </button>
          </div>
        ) : null}

        {!isLoading && !error && result.items.length > 0 ? (
          <>
            <table className="hidden w-full border-collapse text-left md:table">
              <caption className="sr-only">공지사항 목록</caption>
              <thead className="bg-stone-100 text-sm text-stone-700">
                <tr>
                  <th scope="col" className="w-24 px-5 py-4 font-semibold">
                    번호
                  </th>
                  <th scope="col" className="px-5 py-4 font-semibold">
                    제목
                  </th>
                  <th scope="col" className="w-40 px-5 py-4 font-semibold">
                    작성일
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-200">
                {result.items.map((notice) => (
                  <tr
                    key={notice.id}
                    className={
                      notice.isPinned
                        ? "bg-teal-50/55"
                        : "hover:bg-stone-50"
                    }
                  >
                    <td className="px-5 py-4 text-sm text-stone-500">
                      {notice.isPinned ? (
                        <span className="inline-flex items-center rounded-md bg-white px-2 py-1 text-teal-800">
                          <PinIconLabel />
                        </span>
                      ) : (
                        getNoticeDisplayNumber(notice.id, notices)
                      )}
                    </td>
                    <td className="min-w-0 px-5 py-4">
                      <Link
                        href={`/notices/${notice.id}`}
                        className={`block truncate focus-visible:rounded-sm focus-visible:outline-2 focus-visible:outline-teal-700 ${
                          notice.isPinned
                            ? "font-bold text-stone-950"
                            : "font-semibold text-stone-900 hover:text-teal-800"
                        }`}
                      >
                        {notice.title}
                      </Link>
                    </td>
                    <td className="px-5 py-4 text-sm text-stone-500">
                      {notice.createdAt}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            <ul className="divide-y divide-stone-200 md:hidden">
              {result.items.map((notice) => (
                <li
                  key={notice.id}
                  className={
                    notice.isPinned
                      ? "bg-teal-50/55 p-5"
                      : "p-5"
                  }
                >
                  <Link
                    href={`/notices/${notice.id}`}
                    className="block focus-visible:rounded-sm focus-visible:outline-2 focus-visible:outline-teal-700"
                  >
                    <div className="flex items-start gap-2">
                      {notice.isPinned ? (
                        <span className="mt-0.5 inline-flex rounded-md bg-white px-2 py-1 text-teal-800">
                          <PinIconLabel />
                        </span>
                      ) : null}
                      <p
                        className={`leading-6 ${
                          notice.isPinned
                            ? "font-bold text-stone-950"
                            : "font-semibold text-stone-950"
                        }`}
                      >
                        {notice.title}
                      </p>
                    </div>
                    <time className="mt-2 block text-sm text-stone-500">
                      {notice.createdAt}
                    </time>
                  </Link>
                </li>
              ))}
            </ul>
          </>
        ) : !isLoading && !error ? (
          <div className="px-5 py-16 text-center">
            <p className="text-base font-bold text-stone-950">
              검색 결과가 없습니다.
            </p>
            <p className="mt-2 text-sm text-stone-600">
              다른 검색어를 입력하거나 검색어를 초기화해 주세요.
            </p>
          </div>
        ) : null}
      </div>

      <nav
        aria-label="공지사항 페이지네이션"
        className="mt-8 flex items-center justify-center gap-2"
      >
        <button
          type="button"
          onClick={() => movePage(result.currentPage - 1)}
          disabled={result.currentPage <= 1}
          className="inline-flex h-10 items-center gap-1 rounded-md border border-stone-300 px-3 text-sm font-bold text-stone-700 hover:border-teal-500 hover:text-teal-800 disabled:cursor-not-allowed disabled:opacity-45"
        >
          <ChevronLeft aria-hidden="true" size={16} strokeWidth={ICON_STROKE} />
          이전
        </button>
        {pages.map((page) => (
          <button
            key={page}
            type="button"
            aria-current={page === result.currentPage ? "page" : undefined}
            onClick={() => movePage(page)}
            className={`inline-flex size-10 items-center justify-center rounded-md text-sm font-bold ${
              page === result.currentPage
                ? "bg-teal-700 text-white"
                : "border border-stone-300 text-stone-700 hover:border-teal-500 hover:text-teal-800"
            }`}
          >
            {page}
          </button>
        ))}
        <span className="px-2 text-sm font-bold text-stone-700 sm:hidden">
          {result.currentPage} / {result.totalPages}
        </span>
        <button
          type="button"
          onClick={() => movePage(result.currentPage + 1)}
          disabled={result.currentPage >= result.totalPages}
          className="inline-flex h-10 items-center gap-1 rounded-md border border-stone-300 px-3 text-sm font-bold text-stone-700 hover:border-teal-500 hover:text-teal-800 disabled:cursor-not-allowed disabled:opacity-45"
        >
          다음
          <ChevronRight aria-hidden="true" size={16} strokeWidth={ICON_STROKE} />
        </button>
      </nav>
    </div>
  );
}

function PinIconLabel() {
  return (
    <>
      <Pin aria-hidden="true" size={14} strokeWidth={ICON_STROKE} />
      <span className="sr-only">고정 공지</span>
    </>
  );
}

function buildNoticeUrl(pathname: string, query: string, page: number) {
  const params = new URLSearchParams();
  const trimmedQuery = query.trim();

  if (trimmedQuery) {
    params.set("q", trimmedQuery);
  }

  params.set("page", String(page));

  return `${pathname}?${params.toString()}`;
}

function getVisiblePages(currentPage: number, totalPages: number) {
  if (totalPages <= 5) {
    return Array.from({ length: totalPages }, (_, index) => index + 1);
  }

  const pages = new Set<number>();

  pages.add(1);
  pages.add(totalPages);

  for (let page = currentPage - 1; page <= currentPage + 1; page += 1) {
    if (page >= 1 && page <= totalPages) {
      pages.add(page);
    }
  }

  return [...pages].sort((a, b) => a - b);
}
