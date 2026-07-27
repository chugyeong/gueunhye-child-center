import { createClient } from "@supabase/supabase-js";
import { supabase } from "@/lib/supabase/client";

const ADMIN_EMAIL = process.env.NEXT_PUBLIC_ADMIN_EMAIL?.trim().toLowerCase();
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_PUBLISHABLE_KEY = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY ?? process.env.SUPABASE_SERVICE_ROLE;
const SERVICE_ROLE_KEY_MESSAGE =
  "관리자 저장 권한이 없습니다. SUPABASE_SERVICE_ROLE_KEY가 서버 런타임에 반영됐는지, Supabase secret/service_role 키인지 확인해 주세요.";
const SERVICE_ROLE_GRANT_MESSAGE =
  "Supabase service_role 키는 읽혔지만 테이블 권한이 부족합니다. SQL Editor에서 service_role에 필요한 테이블 권한을 GRANT해 주세요.";

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
    return createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
      },
    });
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

export async function getAdminMutationSupabaseClient(request: Request) {
  const token = getBearerToken(request);

  if (!token) {
    return null;
  }

  await verifyAdminToken(token);

  if (!SUPABASE_URL) {
    throw new Error("Supabase 환경변수가 설정되지 않았습니다.");
  }

  if (!SUPABASE_SERVICE_ROLE_KEY) {
    throw new Error(SERVICE_ROLE_KEY_MESSAGE);
  }

  return createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });
}

export function getAdminMutationErrorMessage(error: unknown, fallbackMessage: string) {
  logAdminMutationError(error);

  const details = getErrorDetails(error);
  const message = details.message;

  if (
    details.code === "42501" ||
    message?.includes("permission denied") ||
    message?.includes("row-level security") ||
    message?.includes("row level security")
  ) {
    return SERVICE_ROLE_GRANT_MESSAGE;
  }

  return message ?? fallbackMessage;
}

function logAdminMutationError(error: unknown) {
  const details = getErrorDetails(error);

  console.error("[admin mutation error]", {
    code: details.code,
    message: details.message,
    hint: details.hint,
    hasServiceRoleKey: Boolean(SUPABASE_SERVICE_ROLE_KEY),
    serviceRoleKeyPrefix: SUPABASE_SERVICE_ROLE_KEY?.slice(0, 10),
  });
}

function getErrorDetails(error: unknown) {
  if (error instanceof Error) {
    return {
      message: error.message,
      code: undefined,
      hint: undefined,
    };
  }

  if (error && typeof error === "object") {
    const value = error as { message?: unknown; code?: unknown; hint?: unknown };

    return {
      message: typeof value.message === "string" ? value.message : null,
      code: typeof value.code === "string" ? value.code : undefined,
      hint: typeof value.hint === "string" ? value.hint : undefined,
    };
  }

  return {
    message: null,
    code: undefined,
    hint: undefined,
  };
}
