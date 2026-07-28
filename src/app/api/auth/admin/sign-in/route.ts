import { toApiMessageResponse } from "@/lib/api-error";
import { supabase } from "@/lib/supabase/client";

const ADMIN_EMAIL = process.env.NEXT_PUBLIC_ADMIN_EMAIL?.trim().toLowerCase();

export async function POST(request: Request) {
  try {
    if (!ADMIN_EMAIL) {
      return toApiMessageResponse("관리자 이메일 환경변수가 설정되지 않았습니다.", 500);
    }

    const body = (await request.json()) as { password?: unknown };
    const password = typeof body.password === "string" ? body.password : "";

    if (!password) {
      return toApiMessageResponse("비밀번호를 입력해 주세요.", 400);
    }

    const { data, error } = await supabase.auth.signInWithPassword({
      email: ADMIN_EMAIL,
      password,
    });

    if (error) {
      throw error;
    }

    if (!data.user || data.user.email?.trim().toLowerCase() !== ADMIN_EMAIL) {
      return toApiMessageResponse("관리자 계정이 아닙니다.", 403);
    }

    return Response.json({
      session: data.session,
      user: data.user,
    });
  } catch (error) {
    return toApiMessageResponse(getAdminSignInErrorMessage(error), 401);
  }
}

function getAdminSignInErrorMessage(error: unknown) {
  if (!(error instanceof Error)) {
    return "비밀번호를 확인해 주세요.";
  }

  const normalizedMessage = error.message.toLowerCase();

  if (normalizedMessage.includes("invalid") || normalizedMessage.includes("credential")) {
    return "비밀번호를 확인해 주세요.";
  }

  if (normalizedMessage.includes("email not confirmed")) {
    return "관리자 이메일 인증이 완료되지 않았습니다.";
  }

  return "로그인 중 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.";
}
