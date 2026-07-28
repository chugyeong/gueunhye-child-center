import {
  getAdminMutationErrorMessage,
  getAdminMutationSupabaseClient,
  getAdminSupabaseClient,
  getBearerToken,
} from "@/lib/admin-auth";
import { parseRequiredString } from "@/lib/api-validation";
import { getNoticesFromSupabase, getPublicNotices, NOTICE_SELECT } from "@/lib/notice-repository";
import type { Notice } from "@/data/notices";

type CreateNoticeBody = Pick<Notice, "title" | "content">;

export async function GET(request: Request) {
  const token = getBearerToken(request);

  if (token) {
    try {
      const adminSupabase = await getAdminSupabaseClient(request);

      if (!adminSupabase) {
        return Response.json({ message: "로그인이 필요합니다." }, { status: 401 });
      }

      return Response.json(await getNoticesFromSupabase(adminSupabase));
    } catch (error) {
      return Response.json(
        { message: getAdminMutationErrorMessage(error, "공지사항을 불러오지 못했습니다.") },
        { status: 400 },
      );
    }
  }

  try {
    return Response.json(await getPublicNotices());
  } catch {
    return Response.json([]);
  }
}

export async function POST(request: Request) {
  try {
    const adminSupabase = await getAdminMutationSupabaseClient(request);

    if (!adminSupabase) {
      return Response.json({ message: "로그인이 필요합니다." }, { status: 401 });
    }

    const input = parseNoticeBody(await request.json());
    const { data, error } = await adminSupabase
      .from("notices")
      .insert(input)
      .select(NOTICE_SELECT)
      .single();

    if (error) {
      throw error;
    }

    const [notice] = await getNoticesFromSupabase(adminSupabase).then((items) =>
      items.filter((item) => item.id === String(data.id)),
    );

    if (!notice) {
      throw new Error("저장한 공지사항을 다시 불러오지 못했습니다.");
    }

    return Response.json(notice);
  } catch (error) {
    return Response.json(
      { message: getAdminMutationErrorMessage(error, "공지사항을 저장하지 못했습니다.") },
      { status: 400 },
    );
  }
}

function parseNoticeBody(body: unknown): CreateNoticeBody {
  if (!body || typeof body !== "object") {
    throw new Error("저장할 공지사항 정보가 올바르지 않습니다.");
  }

  const value = body as Record<string, unknown>;

  return {
    title: parseRequiredString(value.title, "제목을 입력해 주세요."),
    content: parseRequiredString(value.content, "내용을 입력해 주세요."),
  };
}
