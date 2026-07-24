"use client";

import { useInitializeTeachers } from "@/hooks/useInitializeTeachers";

export function TeachersInitializer() {
  useInitializeTeachers();

  return null;
}
