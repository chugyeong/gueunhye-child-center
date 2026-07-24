import { getAdminSupabaseClient } from "@/lib/admin-auth";
import { toApiErrorResponse } from "@/lib/api-error";
import { supabase } from "@/lib/supabase/client";
import type { Teacher } from "@/types/teacher";

type CreateTeacherBody = Pick<
  Teacher,
  "name" | "position" | "group_name" | "display_order" | "is_visible"
>;

export async function GET(request: Request) {
  try {
    const adminSupabase = await getAdminSupabaseClient(request);
    const query = (adminSupabase ?? supabase)
      .from("teachers")
      .select("*")
      .order("display_order", { ascending: true });
    const { data, error } = adminSupabase ? await query : await query.eq("is_visible", true);

    if (error) {
      throw error;
    }

    return Response.json((data ?? []) as Teacher[]);
  } catch (error) {
    return toApiErrorResponse(error, "선생님 정보를 불러오지 못했습니다.");
  }
}

export async function POST(request: Request) {
  try {
    const adminSupabase = await getAdminSupabaseClient(request);

    if (!adminSupabase) {
      return Response.json({ message: "로그인이 필요합니다." }, { status: 401 });
    }

    const input = parseCreateTeacherBody(await request.json());
    const { data, error } = await adminSupabase.from("teachers").insert(input).select("*").single();

    if (error) {
      throw error;
    }

    return Response.json(data as Teacher);
  } catch (error) {
    return Response.json({ message: getErrorMessage(error) }, { status: 400 });
  }
}

function parseCreateTeacherBody(body: unknown): CreateTeacherBody {
  if (!body || typeof body !== "object") {
    throw new Error("저장할 선생님 정보가 올바르지 않습니다.");
  }

  const value = body as Record<string, unknown>;

  return {
    name: parseRequiredString(value.name, "이름을 입력해 주세요."),
    position: parseRequiredString(value.position, "직책을 입력해 주세요."),
    group_name: parseRequiredString(value.group_name, "그룹을 선택해 주세요."),
    display_order: parseDisplayOrder(value.display_order),
    is_visible: typeof value.is_visible === "boolean" ? value.is_visible : true,
  };
}

function parseRequiredString(value: unknown, message: string) {
  if (typeof value !== "string" || !value.trim()) {
    throw new Error(message);
  }

  return value.trim();
}

function parseDisplayOrder(value: unknown) {
  if (typeof value !== "number" || !Number.isFinite(value) || value < 1) {
    throw new Error("노출 순서가 올바르지 않습니다.");
  }

  return Math.floor(value);
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

  return "선생님 정보를 저장하지 못했습니다.";
}
