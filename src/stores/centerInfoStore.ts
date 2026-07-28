"use client";

import { create } from "zustand";
import { getCenterInfo } from "@/services/centerInfo";
import type { CenterInfo } from "@/types/centerInfo";

type CenterInfoState = {
  centerInfo: CenterInfo | null;
  isLoading: boolean;
  isInitialized: boolean;
  error: string | null;
  initialize: () => Promise<void>;
  refetch: () => Promise<void>;
};

let initializePromise: Promise<void> | null = null;
let refetchPromise: Promise<void> | null = null;
const EMPTY_RESULT_RETRY_COUNT = 1;

async function fetchCenterInfoWithRetry() {
  for (let attempt = 0; attempt <= EMPTY_RESULT_RETRY_COUNT; attempt += 1) {
    const centerInfo = await getCenterInfo();

    if (centerInfo) {
      return centerInfo;
    }
  }

  return null;
}

export const useCenterInfoStore = create<CenterInfoState>((set, get) => ({
  centerInfo: null,
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

    initializePromise = (async () => {
      set({ isLoading: true, error: null });

      try {
        const nextCenterInfo = await fetchCenterInfoWithRetry();
        set({
          centerInfo: nextCenterInfo,
          isInitialized: true,
          error: null,
        });
      } catch (error) {
        const message =
          error instanceof Error ? error.message : "센터 정보를 불러오지 못했습니다.";

        set({ error: message });
      } finally {
        set({ isLoading: false });
        initializePromise = null;
      }
    })();

    return initializePromise;
  },
  refetch: async () => {
    if (refetchPromise) {
      return refetchPromise;
    }

    refetchPromise = (async () => {
      set({ isLoading: true, error: null });

      try {
        const nextCenterInfo = await getCenterInfo();
        set({
          centerInfo: nextCenterInfo,
          isInitialized: true,
          error: null,
        });
      } catch (error) {
        const message =
          error instanceof Error ? error.message : "센터 정보를 다시 불러오지 못했습니다.";

        set({ error: message });
      } finally {
        set({ isLoading: false });
        refetchPromise = null;
      }
    })();

    return refetchPromise;
  },
}));
