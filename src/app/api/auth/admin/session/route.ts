import { toApiMessageResponse } from "@/lib/api-error";
import { supabase } from "@/lib/supabase/client";

const ADMIN_EMAIL = process.env.NEXT_PUBLIC_ADMIN_EMAIL?.trim().toLowerCase();

export async function GET(request: Request) {
  try {
    if (!ADMIN_EMAIL) {
      return toApiMessageResponse("관리자 이메일 환경변수가 설정되지 않았습니다.", 500);
    }

    const token = getBearerToken(request);

    if (!token) {
      return toApiMessageResponse("로그인이 필요합니다.", 401);
    }

    const { data, error } = await supabase.auth.getUser(token);

    if (error) {
      throw error;
    }

    if (!data.user || data.user.email?.trim().toLowerCase() !== ADMIN_EMAIL) {
      return toApiMessageResponse("관리자 계정이 아닙니다.", 403);
    }

    return Response.json({ user: data.user });
  } catch {
    return toApiMessageResponse("로그인 상태를 확인하지 못했습니다.", 401);
  }
}

function getBearerToken(request: Request) {
  const authorization = request.headers.get("authorization");

  if (!authorization?.startsWith("Bearer ")) {
    return null;
  }

  return authorization.slice("Bearer ".length).trim();
}
