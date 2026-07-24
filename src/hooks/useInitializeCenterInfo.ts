"use client";

import { useEffect } from "react";
import { useCenterInfoStore } from "@/stores/centerInfoStore";

export function useInitializeCenterInfo() {
  const initialize = useCenterInfoStore((state) => state.initialize);

  useEffect(() => {
    void initialize();
  }, [initialize]);
}
