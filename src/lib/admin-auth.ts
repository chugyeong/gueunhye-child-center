import { createClient } from "@supabase/supabase-js";
import { supabase } from "@/lib/supabase/client";

const ADMIN_EMAIL = process.env.NEXT_PUBLIC_ADMIN_EMAIL?.trim().toLowerCase();
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_PUBLISHABLE_KEY = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY ?? process.env.SUPABASE_SERVICE_ROLE;

export function getBearerToken(request: Request) {
  const authorization = request.headers.get("authorization");

  if (!authorization?.startsWith("Bearer ")) {
    return null;
  }

  return authorization.slice("Bearer ".length).trim();
}

export async function verifyAdminToken(token: string) {
  if (!ADMIN_EMAIL) {
    throw new Error("관리자 이메일 환경변수가 설정되지 않았습니다.");
  }

  const { data, error } = await supabase.auth.getUser(token);

  if (error) {
    throw error;
  }

  if (!data.user || data.user.email?.trim().toLowerCase() !== ADMIN_EMAIL) {
    throw new Error("관리자 계정이 아닙니다.");
  }
}

export async function getAdminSupabaseClient(request: Request) {
  const token = getBearerToken(request);

  if (!token) {
    return null;
  }

  await verifyAdminToken(token);

  if (!SUPABASE_URL) {
    throw new Error("Supabase 환경변수가 설정되지 않았습니다.");
  }

  if (SUPABASE_SERVICE_ROLE_KEY) {
    return createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);
  }

  if (!SUPABASE_PUBLISHABLE_KEY) {
    throw new Error("Supabase 환경변수가 설정되지 않았습니다.");
  }

  return createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
    global: {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  });
}
