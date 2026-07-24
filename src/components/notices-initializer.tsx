"use client";

import { useInitializeNotices } from "@/hooks/useInitializeNotices";

export function NoticesInitializer() {
  useInitializeNotices();

  return null;
}
