"use client";

import { useInitializeCenterInfo } from "@/hooks/useInitializeCenterInfo";

export function CenterInfoInitializer() {
  useInitializeCenterInfo();

  return null;
}
