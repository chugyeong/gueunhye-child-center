"use client";

import { create } from "zustand";
import type { Notice } from "@/data/notices";
import { getAdminNotices } from "@/services/notices";

type NoticesState = {
  notices: Notice[];
  isLoading: boolean;
  isInitialized: boolean;
  error: string | null;
  initialize: () => Promise<void>;
  refetch: () => Promise<void>;
};

let initializePromise: Promise<void> | null = null;
let refetchPromise: Promise<void> | null = null;
const EMPTY_RESULT_RETRY_COUNT = 1;

async function fetchNoticesWithRetry() {
  for (let attempt = 0; attempt <= EMPTY_RESULT_RETRY_COUNT; attempt += 1) {
    const notices = await getAdminNotices();

    if (notices.length > 0) {
      return notices;
    }
  }

  return [];
}

async function fetchNotices(set: (state: Partial<NoticesState>) => void) {
  set({ isLoading: true, error: null });

  try {
    const notices = await fetchNoticesWithRetry();
    set({ notices, isInitialized: true, error: null });
  } catch (error) {
    const message = error instanceof Error ? error.message : "공지사항을 불러오지 못했습니다.";

    set({ error: message });
  } finally {
    set({ isLoading: false });
  }
}

export const useNoticesStore = create<NoticesState>((set, get) => ({
  notices: [],
  isLoading: false,
  isInitialized: false,
  error: null,
  initialize: async () => {
    const { isInitialized, isLoading } = get();

    if (isInitialized || isLoading) {
      return;
    }

    if (initializePromise) {
      return initializePromise;
    }

    initializePromise = fetchNotices(set).finally(() => {
      initializePromise = null;
    });

    return initializePromise;
  },
  refetch: async () => {
    if (refetchPromise) {
      return refetchPromise;
    }

    refetchPromise = fetchNotices(set).finally(() => {
      refetchPromise = null;
    });

    return refetchPromise;
  },
}));
