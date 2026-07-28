import { getAdminMutationErrorMessage, getAdminMutationSupabaseClient } from "@/lib/admin-auth";
import { toApiErrorResponse } from "@/lib/api-error";
import { parseRequiredString } from "@/lib/api-validation";
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
const dayKeys = [
  "monday",
  "tuesday",
  "wednesday",
  "thursday",
  "friday",
  "saturday",
  "sunday",
] as const;
const areaCodes = [
  "02",
  "031",
  "032",
  "033",
  "041",
  "042",
  "043",
  "044",
  "051",
  "052",
  "053",
  "054",
  "055",
  "061",
  "062",
  "063",
  "064",
] as const;

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
    const adminSupabase = await getAdminMutationSupabaseClient(request);

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
    return Response.json(
      { message: getAdminMutationErrorMessage(error, "센터 정보를 저장하지 못했습니다.") },
      { status: 400 },
    );
  }
}

function parseCenterInfoUpdateBody(body: unknown): CenterInfoUpdateBody {
  if (!body || typeof body !== "object") {
    throw new Error("저장할 센터 정보가 올바르지 않습니다.");
  }

  const value = body as Record<string, unknown>;

  const input = {
    address: parseRequiredString(value.address, "주소를 입력해 주세요."),
    address_detail: parseNullableString(value.address_detail),
    center_phone: parseRequiredString(value.center_phone, "대표번호를 입력해 주세요."),
    mobile_phone: parseRequiredString(value.mobile_phone, "휴대폰번호를 입력해 주세요."),
    business_number: parseOptionalString(value.business_number),
    operating_hours: parseOperatingHours(value.operating_hours),
  };

  if (!isValidCenterPhone(input.center_phone)) {
    throw new Error("대표번호를 확인해 주세요.");
  }

  if (!/^010\d{8}$/.test(onlyDigits(input.mobile_phone))) {
    throw new Error("휴대폰번호는 010으로 시작하는 11자리 번호로 입력해 주세요.");
  }

  return {
    ...input,
    center_phone: onlyDigits(input.center_phone),
    mobile_phone: onlyDigits(input.mobile_phone),
  };
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

  const record = value as Record<string, unknown>;

  return dayKeys.reduce((nextHours, day) => {
    const dayHours = record[day];

    if (!dayHours || typeof dayHours !== "object") {
      throw new Error("운영시간을 입력해 주세요.");
    }

    const dayRecord = dayHours as Record<string, unknown>;

    if (typeof dayRecord.open !== "boolean") {
      throw new Error("운영 여부가 올바르지 않습니다.");
    }

    if (!dayRecord.open) {
      nextHours[day] = { open: false, start: null, end: null };
      return nextHours;
    }

    const start = dayRecord.start;
    const end = dayRecord.end;

    if (!isTimeString(start) || !isTimeString(end)) {
      throw new Error("운영 시작 시간과 종료 시간을 입력해 주세요.");
    }

    if (start >= end) {
      throw new Error("운영 종료 시간은 시작 시간보다 늦어야 합니다.");
    }

    nextHours[day] = {
      open: true,
      start,
      end,
    };

    return nextHours;
  }, {} as OperatingHours);
}

function isTimeString(value: unknown): value is string {
  return typeof value === "string" && /^([01]\d|2[0-3]):[0-5]\d$/.test(value);
}

function onlyDigits(value: string) {
  return value.replace(/\D/g, "");
}

function isValidCenterPhone(value: string) {
  const digits = onlyDigits(value);

  return areaCodes.some((areaCode) => {
    if (!digits.startsWith(areaCode)) {
      return false;
    }

    const localLength = digits.length - areaCode.length;

    return localLength === 7 || localLength === 8;
  });
}
