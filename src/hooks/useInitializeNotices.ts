"use client";

import { useEffect } from "react";
import { useNoticesStore } from "@/stores/noticesStore";

export function useInitializeNotices() {
  const initialize = useNoticesStore((state) => state.initialize);

  useEffect(() => {
    void initialize();
  }, [initialize]);
}
