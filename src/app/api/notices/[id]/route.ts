import { getAdminMutationErrorMessage, getAdminMutationSupabaseClient } from "@/lib/admin-auth";
import { getNoticesFromSupabase } from "@/lib/notice-repository";
import type { Notice } from "@/data/notices";

type NoticeRouteContext = {
  params: Promise<{ id: string }>;
};

type UpdateNoticeBody = Partial<Pick<Notice, "title" | "content">>;

export async function PATCH(request: Request, context: NoticeRouteContext) {
  try {
    const adminSupabase = await getAdminMutationSupabaseClient(request);

    if (!adminSupabase) {
      return Response.json({ message: "로그인이 필요합니다." }, { status: 401 });
    }

    const { id } = await context.params;
    const input = parseUpdateNoticeBody(await request.json());
    const { data, error } = await adminSupabase
      .from("notices")
      .update(input)
      .eq("id", id)
      .select("id")
      .maybeSingle();

    if (error) {
      throw error;
    }

    if (!data) {
      return Response.json({ message: "수정할 공지사항이 없습니다." }, { status: 404 });
    }

    const notice = (await getNoticesFromSupabase(adminSupabase)).find((item) => item.id === id);

    return Response.json(notice);
  } catch (error) {
    return Response.json(
      { message: getAdminMutationErrorMessage(error, "공지사항을 수정하지 못했습니다.") },
      { status: 400 },
    );
  }
}

export async function DELETE(request: Request, context: NoticeRouteContext) {
  try {
    const adminSupabase = await getAdminMutationSupabaseClient(request);

    if (!adminSupabase) {
      return Response.json({ message: "로그인이 필요합니다." }, { status: 401 });
    }

    const { id } = await context.params;
    const { error } = await adminSupabase.from("notices").delete().eq("id", id);

    if (error) {
      throw error;
    }

    return Response.json({ ok: true });
  } catch (error) {
    return Response.json(
      { message: getAdminMutationErrorMessage(error, "공지사항을 삭제하지 못했습니다.") },
      { status: 400 },
    );
  }
}

function parseUpdateNoticeBody(body: unknown): UpdateNoticeBody {
  if (!body || typeof body !== "object") {
    throw new Error("수정할 공지사항 정보가 올바르지 않습니다.");
  }

  const value = body as Record<string, unknown>;
  const input: UpdateNoticeBody = {};

  if ("title" in value) {
    input.title = parseRequiredString(value.title, "제목을 입력해 주세요.");
  }

  if ("content" in value) {
    input.content = parseRequiredString(value.content, "내용을 입력해 주세요.");
  }

  if (Object.keys(input).length === 0) {
    throw new Error("수정할 공지사항 정보가 없습니다.");
  }

  return input;
}

function parseRequiredString(value: unknown, message: string) {
  if (typeof value !== "string" || !value.trim()) {
    throw new Error(message);
  }

  return value.trim();
}
