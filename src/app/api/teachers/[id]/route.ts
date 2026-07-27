import { getAdminMutationErrorMessage, getAdminMutationSupabaseClient } from "@/lib/admin-auth";
import type { Teacher } from "@/types/teacher";

type UpdateTeacherBody = Partial<Pick<Teacher, "name" | "position" | "group_name" | "is_visible">>;

type TeacherRouteContext = {
  params: Promise<{ id: string }>;
};

export async function PATCH(request: Request, context: TeacherRouteContext) {
  try {
    const adminSupabase = await getAdminMutationSupabaseClient(request);

    if (!adminSupabase) {
      return Response.json({ message: "로그인이 필요합니다." }, { status: 401 });
    }

    const { id } = await context.params;
    const teacherId = parseTeacherId(id);
    const input = parseUpdateTeacherBody(await request.json());
    const { data, error } = await adminSupabase
      .from("teachers")
      .update(input)
      .eq("id", teacherId)
      .select("*")
      .maybeSingle();

    if (error) {
      throw error;
    }

    if (!data) {
      return Response.json({ message: "수정할 선생님 정보가 없습니다." }, { status: 404 });
    }

    return Response.json(data as Teacher);
  } catch (error) {
    return Response.json(
      { message: getAdminMutationErrorMessage(error, "선생님 정보를 수정하지 못했습니다.") },
      { status: 400 },
    );
  }
}

export async function DELETE(_request: Request, context: TeacherRouteContext) {
  try {
    const adminSupabase = await getAdminMutationSupabaseClient(_request);

    if (!adminSupabase) {
      return Response.json({ message: "로그인이 필요합니다." }, { status: 401 });
    }

    const { id } = await context.params;
    const { error } = await adminSupabase.from("teachers").delete().eq("id", parseTeacherId(id));

    if (error) {
      throw error;
    }

    return Response.json({ ok: true });
  } catch (error) {
    return Response.json(
      { message: getAdminMutationErrorMessage(error, "선생님 정보를 삭제하지 못했습니다.") },
      { status: 400 },
    );
  }
}

function parseUpdateTeacherBody(body: unknown): UpdateTeacherBody {
  if (!body || typeof body !== "object") {
    throw new Error("수정할 선생님 정보가 올바르지 않습니다.");
  }

  const value = body as Record<string, unknown>;
  const input: UpdateTeacherBody = {};

  if ("name" in value) {
    input.name = parseRequiredString(value.name, "이름을 입력해 주세요.");
  }

  if ("position" in value) {
    input.position = parseRequiredString(value.position, "직책을 입력해 주세요.");
  }

  if ("group_name" in value) {
    input.group_name = parseRequiredString(value.group_name, "그룹을 선택해 주세요.");
  }

  if ("is_visible" in value) {
    input.is_visible = typeof value.is_visible === "boolean" ? value.is_visible : true;
  }

  if (Object.keys(input).length === 0) {
    throw new Error("수정할 선생님 정보가 없습니다.");
  }

  return input;
}

function parseTeacherId(value: string) {
  const id = Number(value);

  if (!Number.isInteger(id) || id < 1) {
    throw new Error("선생님 ID가 올바르지 않습니다.");
  }

  return id;
}

function parseRequiredString(value: unknown, message: string) {
  if (typeof value !== "string" || !value.trim()) {
    throw new Error(message);
  }

  return value.trim();
}
