import { apiClient } from "@/lib/axios";
import type { CenterInfo } from "@/types/centerInfo";

export type UpdateCenterInfoInput = Pick<
  CenterInfo,
  | "address"
  | "address_detail"
  | "center_phone"
  | "mobile_phone"
  | "business_number"
  | "operating_hours"
>;

export async function getCenterInfo(): Promise<CenterInfo | null> {
  const { data } = await apiClient.get<CenterInfo | null>("/center-info");

  return data;
}

export async function updateCenterInfo(input: UpdateCenterInfoInput): Promise<CenterInfo> {
  const { data } = await apiClient.patch<CenterInfo>("/center-info", input);

  return data;
}
