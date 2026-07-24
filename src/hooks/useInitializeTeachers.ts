"use client";

import { useEffect } from "react";
import { useTeachersStore } from "@/stores/teachersStore";

export function useInitializeTeachers() {
  const initialize = useTeachersStore((state) => state.initialize);

  useEffect(() => {
    void initialize();
  }, [initialize]);
}
