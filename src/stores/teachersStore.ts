"use client";

import { create } from "zustand";
import { getTeachers } from "@/services/teachers";
import type { Teacher } from "@/types/teacher";

type TeachersState = {
  teachers: Teacher[];
  isLoading: boolean;
  isInitialized: boolean;
  error: string | null;
  initialize: () => Promise<void>;
  refetch: () => Promise<void>;
};

let initializePromise: Promise<void> | null = null;
let refetchPromise: Promise<void> | null = null;

async function fetchTeachers(set: (state: Partial<TeachersState>) => void) {
  set({ isLoading: true, error: null });

  try {
    const teachers = await getTeachers();

    set({
      teachers,
      isInitialized: true,
      error: null,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "선생님 정보를 불러오지 못했습니다.";

    set({
      error: message,
      isInitialized: true,
    });
  } finally {
    set({ isLoading: false });
  }
}

export const useTeachersStore = create<TeachersState>((set, get) => ({
  teachers: [],
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

    initializePromise = fetchTeachers(set).finally(() => {
      initializePromise = null;
    });

    return initializePromise;
  },

  refetch: async () => {
    if (refetchPromise) {
      return refetchPromise;
    }

    refetchPromise = fetchTeachers(set).finally(() => {
      refetchPromise = null;
    });

    return refetchPromise;
  },
}));
