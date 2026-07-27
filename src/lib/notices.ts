import { notices, type Notice } from "@/data/notices";

export const NOTICES_PAGE_SIZE = 10;

export type NoticeListResult = {
  items: Notice[];
  totalCount: number;
  totalPages: number;
  currentPage: number;
};

export function getSortedNotices(source: Notice[] = notices) {
  return [...source].sort((a, b) => {
    if (a.isPinned !== b.isPinned) {
      return a.isPinned ? -1 : 1;
    }

    return parseNoticeDate(b.createdAt) - parseNoticeDate(a.createdAt);
  });
}

export function searchNotices(query: string, source: Notice[] = notices) {
  const normalizedQuery = normalizeSearchText(query);

  if (!normalizedQuery) {
    return source;
  }

  return source.filter((notice) => {
    const haystack = normalizeSearchText(`${notice.title} ${notice.content}`);

    return haystack.includes(normalizedQuery);
  });
}

export function getNoticeList({
  query = "",
  page = 1,
  pageSize = NOTICES_PAGE_SIZE,
  source = notices,
}: {
  query?: string;
  page?: number;
  pageSize?: number;
  source?: Notice[];
}): NoticeListResult {
  const filtered = getSortedNotices(searchNotices(query, source));
  const totalCount = filtered.length;
  const totalPages = Math.max(1, Math.ceil(totalCount / pageSize));
  const currentPage = clampPage(page, totalPages);
  const startIndex = (currentPage - 1) * pageSize;

  return {
    items: filtered.slice(startIndex, startIndex + pageSize),
    totalCount,
    totalPages,
    currentPage,
  };
}

export function getNoticeById(id: string) {
  return notices.find((notice) => notice.id === id) ?? null;
}

export function getAdjacentNotices(id: string) {
  const sorted = getSortedNotices();
  const currentIndex = sorted.findIndex((notice) => notice.id === id);

  return {
    previous: currentIndex > 0 ? sorted[currentIndex - 1] : null,
    next: currentIndex >= 0 && currentIndex < sorted.length - 1 ? sorted[currentIndex + 1] : null,
  };
}

export function getNoticeDisplayNumber(id: string, source: Notice[] = notices) {
  const regularNotices = getSortedNotices(source).filter((notice) => !notice.isPinned);
  const index = regularNotices.findIndex((notice) => notice.id === id);

  if (index === -1) {
    return null;
  }

  return regularNotices.length - index;
}

export function formatFileSize(size?: number) {
  if (!size) {
    return null;
  }

  if (size < 1024 * 1024) {
    return `${Math.ceil(size / 1024)}KB`;
  }

  return `${(size / (1024 * 1024)).toFixed(1)}MB`;
}

function normalizeSearchText(value: string) {
  return value.trim().toLocaleLowerCase("ko-KR");
}

function parseNoticeDate(date: string) {
  return new Date(date.replaceAll(".", "-")).getTime();
}

function clampPage(page: number, totalPages: number) {
  if (!Number.isFinite(page) || page < 1) {
    return 1;
  }

  return Math.min(Math.floor(page), totalPages);
}
