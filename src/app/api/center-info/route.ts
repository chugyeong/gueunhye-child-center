import { getAdminSupabaseClient } from "@/lib/admin-auth";
import { toApiErrorResponse } from "@/lib/api-error";
import { supabase } from "@/lib/supabase/client";
import type { CenterInfo, OperatingHours } from "@/types/centerInfo";

type CenterInfoUpdateBody = Pick<
  CenterInfo,
  | "address"
  | "address_detail"
  | "center_phone"
  | "mobile_phone"
  | "business_number"
  | "operating_hours"
>;

const CENTER_INFO_SELECT =
  "id, center_name, address, address_detail, center_phone, mobile_phone, business_number, operating_hours, updated_at";

export async function GET() {
  try {
    const { data, error } = await supabase
      .from("center_info")
      .select(CENTER_INFO_SELECT)
      .limit(1)
      .maybeSingle();

    if (error) {
      throw error;
    }

    return Response.json((data ?? null) as CenterInfo | null);
  } catch (error) {
    return toApiErrorResponse(error, "센터 정보를 불러오지 못했습니다.");
  }
}

export async function PATCH(request: Request) {
  try {
    const adminSupabase = await getAdminSupabaseClient(request);

    if (!adminSupabase) {
      return Response.json({ message: "로그인이 필요합니다." }, { status: 401 });
    }

    const input = parseCenterInfoUpdateBody(await request.json());
    const { data: currentCenterInfo, error: readError } = await adminSupabase
      .from("center_info")
      .select("id")
      .limit(1)
      .maybeSingle();

    if (readError) {
      throw readError;
    }

    if (!currentCenterInfo) {
      return Response.json({ message: "수정할 센터 정보가 없습니다." }, { status: 404 });
    }

    const { data, error } = await adminSupabase
      .from("center_info")
      .update(input)
      .eq("id", currentCenterInfo.id)
      .select(CENTER_INFO_SELECT)
      .maybeSingle();

    if (error) {
      throw error;
    }

    if (!data) {
      return Response.json({ message: "수정할 센터 정보가 없습니다." }, { status: 404 });
    }

    return Response.json(data as CenterInfo);
  } catch (error) {
    return Response.json({ message: getErrorMessage(error) }, { status: 400 });
  }
}

function parseCenterInfoUpdateBody(body: unknown): CenterInfoUpdateBody {
  if (!body || typeof body !== "object") {
    throw new Error("저장할 센터 정보가 올바르지 않습니다.");
  }

  const value = body as Record<string, unknown>;

  return {
    address: parseRequiredString(value.address, "주소를 입력해 주세요."),
    address_detail: parseNullableString(value.address_detail),
    center_phone: parseRequiredString(value.center_phone, "대표번호를 입력해 주세요."),
    mobile_phone: parseRequiredString(value.mobile_phone, "휴대폰번호를 입력해 주세요."),
    business_number: parseOptionalString(value.business_number),
    operating_hours: parseOperatingHours(value.operating_hours),
  };
}

function parseRequiredString(value: unknown, message: string) {
  if (typeof value !== "string" || !value.trim()) {
    throw new Error(message);
  }

  return value.trim();
}

function parseNullableString(value: unknown) {
  if (value === null || value === undefined) {
    return null;
  }

  if (typeof value !== "string") {
    throw new Error("상세주소가 올바르지 않습니다.");
  }

  return value.trim() || null;
}

function parseOptionalString(value: unknown) {
  if (value === null || value === undefined) {
    return "";
  }

  if (typeof value !== "string") {
    throw new Error("문자 입력값이 올바르지 않습니다.");
  }

  return value.trim();
}

function parseOperatingHours(value: unknown): OperatingHours {
  if (!value || typeof value !== "object") {
    throw new Error("운영시간을 입력해 주세요.");
  }

  return value as OperatingHours;
}

function getErrorMessage(error: unknown) {
  if (error instanceof Error) {
    return error.message;
  }

  if (error && typeof error === "object" && "message" in error) {
    const message = (error as { message?: unknown }).message;

    if (typeof message === "string") {
      return message;
    }
  }

  return "센터 정보를 저장하지 못했습니다.";
}
