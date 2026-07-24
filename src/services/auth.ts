import type { Session, User } from "@supabase/supabase-js";
import { apiClient, clearAuthToken, setAuthToken } from "@/lib/axios";

export type AdminSession = {
  session: Session | null;
  user: User | null;
};

type AdminSignInResponse = {
  session: Session;
  user: User;
};

type AdminSessionResponse = {
  user: User;
};

const ADMIN_EMAIL = process.env.NEXT_PUBLIC_ADMIN_EMAIL?.trim().toLowerCase();
const ADMIN_SESSION_STORAGE_KEY = "child-center.admin.session";
const authStateListeners = new Set<(session: Session | null) => void>();

export async function signInAdmin(password: string) {
  const { data } = await apiClient.post<AdminSignInResponse>("/auth/admin/sign-in", { password });

  persistAdminSession(data.session);
  notifyAuthStateChange(data.session);

  return data;
}

export async function getAdminSession(): Promise<AdminSession> {
  const session = readStoredAdminSession();

  if (!session) {
    return {
      session: null,
      user: null,
    };
  }

  try {
    const { data } = await apiClient.get<AdminSessionResponse>("/auth/admin/session");
    const verifiedSession = {
      ...session,
      user: data.user,
    };

    persistAdminSession(verifiedSession);

    return {
      session: verifiedSession,
      user: data.user,
    };
  } catch (error) {
    clearStoredAdminSession();
    notifyAuthStateChange(null);
    throw error;
  }
}

export async function signOutAdmin() {
  try {
    await apiClient.post("/auth/admin/sign-out");
  } finally {
    clearStoredAdminSession();
    notifyAuthStateChange(null);
  }
}

export function onAdminAuthStateChange(onChange: (session: Session | null) => void) {
  authStateListeners.add(onChange);

  return () => {
    authStateListeners.delete(onChange);
  };
}

export function isAdminEmail(email: string | null | undefined) {
  return Boolean(ADMIN_EMAIL && email?.trim().toLowerCase() === ADMIN_EMAIL);
}

function persistAdminSession(session: Session) {
  if (typeof window === "undefined") {
    return;
  }

  setAuthToken(session.access_token);
  window.localStorage.setItem(ADMIN_SESSION_STORAGE_KEY, JSON.stringify(session));
}

function readStoredAdminSession() {
  if (typeof window === "undefined") {
    return null;
  }

  const storedValue = window.localStorage.getItem(ADMIN_SESSION_STORAGE_KEY);

  if (!storedValue) {
    return null;
  }

  try {
    const session = JSON.parse(storedValue) as Session;

    if (!session.access_token || isExpired(session.expires_at)) {
      clearStoredAdminSession();
      return null;
    }

    setAuthToken(session.access_token);
    return session;
  } catch {
    clearStoredAdminSession();
    return null;
  }
}

function clearStoredAdminSession() {
  if (typeof window === "undefined") {
    return;
  }

  clearAuthToken();
  window.localStorage.removeItem(ADMIN_SESSION_STORAGE_KEY);
}

function isExpired(expiresAt: number | undefined) {
  if (!expiresAt) {
    return false;
  }

  return expiresAt * 1000 <= Date.now();
}

function notifyAuthStateChange(session: Session | null) {
  authStateListeners.forEach((listener) => {
    listener(session);
  });
}
