import type { Notice } from "@/data/notices";
import { apiClient } from "@/lib/axios";

export async function getAdminNotices(): Promise<Notice[]> {
  const { data } = await apiClient.get<Notice[]>("/notices");

  return data;
}
