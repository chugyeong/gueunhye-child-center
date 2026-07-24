import { toApiMessageResponse } from "@/lib/api-error";
import { supabase } from "@/lib/supabase/client";

const ADMIN_EMAIL = process.env.NEXT_PUBLIC_ADMIN_EMAIL?.trim().toLowerCase();
const ADMIN_EMAIL_NOT_CONFIGURED_MESSAGE = "관리자 이메일 환경변수가 설정되지 않았습니다.";
const INVALID_PASSWORD_MESSAGE = "비밀번호를 입력해 주세요.";
const NOT_ADMIN_MESSAGE = "관리자 계정이 아닙니다.";
const SIGN_IN_FAILED_MESSAGE = "비밀번호를 확인해 주세요.";

export async function POST(request: Request) {
  try {
    if (!ADMIN_EMAIL) {
      return toApiMessageResponse(ADMIN_EMAIL_NOT_CONFIGURED_MESSAGE, 500);
    }

    const body = (await request.json()) as { password?: unknown };
    const password = typeof body.password === "string" ? body.password : "";

    if (!password) {
      return toApiMessageResponse(INVALID_PASSWORD_MESSAGE, 400);
    }

    const { data, error } = await supabase.auth.signInWithPassword({
      email: ADMIN_EMAIL,
      password,
    });

    if (error) {
      throw error;
    }

    if (!data.user || data.user.email?.trim().toLowerCase() !== ADMIN_EMAIL) {
      return toApiMessageResponse(NOT_ADMIN_MESSAGE, 403);
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
    return SIGN_IN_FAILED_MESSAGE;
  }

  const normalizedMessage = error.message.toLowerCase();

  if (normalizedMessage.includes("invalid") || normalizedMessage.includes("credential")) {
    return SIGN_IN_FAILED_MESSAGE;
  }

  if (normalizedMessage.includes("email not confirmed")) {
    return "관리자 이메일 인증이 완료되지 않았습니다.";
  }

  return "로그인 중 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.";
}
