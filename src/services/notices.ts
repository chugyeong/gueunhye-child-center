import type { Notice } from "@/data/notices";
import { apiClient } from "@/lib/axios";

export async function getAdminNotices(): Promise<Notice[]> {
  const { data } = await apiClient.get<Notice[]>("/notices");

  return data;
}

export type CreateNoticePayload = {
  title: string;
  content: string;
};

export type UpdateNoticePayload = Partial<CreateNoticePayload>;

export async function createNotice(payload: CreateNoticePayload): Promise<Notice> {
  const { data } = await apiClient.post<Notice>("/notices", payload);

  return data;
}

export async function updateNotice(id: string, payload: UpdateNoticePayload): Promise<Notice> {
  const { data } = await apiClient.patch<Notice>(`/notices/${id}`, payload);

  return data;
}

export async function deleteNotice(id: string): Promise<void> {
  await apiClient.delete(`/notices/${id}`);
}
