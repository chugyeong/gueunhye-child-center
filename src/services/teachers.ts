import { apiClient } from "@/lib/axios";
import type { Teacher } from "@/types/teacher";

export type CreateTeacherPayload = {
  name: string;
  position: string;
  group_name: string;
  display_order: number;
  is_visible: boolean;
};

export type UpdateTeacherPayload = Partial<Omit<CreateTeacherPayload, "display_order">>;

export type UpdateTeacherOrderPayload = {
  id: number;
  display_order: number;
};

export async function getTeachers(): Promise<Teacher[]> {
  const { data } = await apiClient.get<Teacher[]>("/teachers");

  return data;
}

export async function createTeacher(payload: CreateTeacherPayload): Promise<Teacher> {
  const { data } = await apiClient.post<Teacher>("/teachers", payload);

  return data;
}

export async function updateTeacher(id: number, payload: UpdateTeacherPayload): Promise<Teacher> {
  const { data } = await apiClient.patch<Teacher>(`/teachers/${id}`, payload);

  return data;
}

export async function deleteTeacher(id: number): Promise<void> {
  await apiClient.delete(`/teachers/${id}`);
}

export async function updateTeacherOrders(items: UpdateTeacherOrderPayload[]): Promise<Teacher[]> {
  const { data } = await apiClient.patch<Teacher[]>("/teachers/orders", { items });

  return data;
}
