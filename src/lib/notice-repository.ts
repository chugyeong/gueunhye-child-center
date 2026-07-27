import { notices as fallbackNotices, type Notice } from "@/data/notices";
import { supabase } from "@/lib/supabase/client";
import type { SupabaseClient } from "@supabase/supabase-js";

export const NOTICE_SELECT = "id, title, content, created_at, updated_at";

type NoticeRow = {
  id: string | number;
  title: string | null;
  content: string | null;
  created_at: string | null;
  updated_at: string | null;
};

export async function getNoticesFromSupabase(client: SupabaseClient = supabase) {
  const { data, error } = await client
    .from("notices")
    .select(NOTICE_SELECT)
    .order("created_at", { ascending: false });

  if (error) {
    throw error;
  }

  return (data ?? []).map(mapNoticeRow);
}

export async function getPublicNotices() {
  try {
    const notices = await getNoticesFromSupabase();

    return notices.length > 0 ? notices : fallbackNotices;
  } catch {
    return fallbackNotices;
  }
}

export async function getPublicNoticeById(id: string) {
  const notices = await getPublicNotices();

  return notices.find((notice) => notice.id === id) ?? null;
}

export async function getAdjacentPublicNotices(id: string) {
  const { getSortedNotices } = await import("@/lib/notices");
  const notices = getSortedNotices(await getPublicNotices());
  const currentIndex = notices.findIndex((notice) => notice.id === id);

  return {
    previous: currentIndex > 0 ? notices[currentIndex - 1] : null,
    next: currentIndex >= 0 && currentIndex < notices.length - 1 ? notices[currentIndex + 1] : null,
  };
}

function mapNoticeRow(row: NoticeRow): Notice {
  const createdAt = formatNoticeDate(row.created_at);
  const updatedAt = row.updated_at ? formatNoticeDate(row.updated_at) : undefined;

  return {
    id: String(row.id),
    title: row.title ?? "",
    content: row.content ?? "",
    createdAt,
    updatedAt: updatedAt && updatedAt !== createdAt ? updatedAt : undefined,
    isPinned: false,
  };
}

function formatNoticeDate(value: string | null) {
  if (!value) {
    return formatDate(new Date());
  }

  return formatDate(new Date(value));
}

function formatDate(date: Date) {
  if (Number.isNaN(date.getTime())) {
    return "";
  }

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}.${month}.${day}`;
}
