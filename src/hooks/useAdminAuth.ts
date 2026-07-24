"use client";

import { useCallback, useEffect, useState } from "react";
import type { Session, User } from "@supabase/supabase-js";
import {
  getAdminSession,
  isAdminEmail,
  onAdminAuthStateChange,
  signOutAdmin,
} from "@/services/auth";

type AdminAuthState = {
  session: Session | null;
  user: User | null;
  isLoading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
};

export function useAdminAuth(): AdminAuthState {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const nextSession = await getAdminSession();
      setSession(nextSession.session);
      setUser(nextSession.user);
    } catch (authError) {
      const message =
        authError instanceof Error ? authError.message : "로그인 상태를 확인하지 못했습니다.";

      setSession(null);
      setUser(null);
      setError(message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    let isMounted = true;

    getAdminSession()
      .then((nextSession) => {
        if (!isMounted) {
          return;
        }

        setSession(nextSession.session);
        setUser(nextSession.user);
        setError(null);
      })
      .catch((authError) => {
        if (!isMounted) {
          return;
        }

        const message =
          authError instanceof Error ? authError.message : "로그인 상태를 확인하지 못했습니다.";

        setSession(null);
        setUser(null);
        setError(message);
      })
      .finally(() => {
        if (isMounted) {
          setIsLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    return onAdminAuthStateChange((nextSession) => {
      if (nextSession && !isAdminEmail(nextSession.user.email)) {
        setSession(null);
        setUser(null);
        setError("관리자 계정이 아닙니다.");
        setIsLoading(false);
        void signOutAdmin();
        return;
      }

      setSession(nextSession);
      setUser(nextSession?.user ?? null);
      setError(null);
      setIsLoading(false);
    });
  }, []);

  return {
    session,
    user,
    isLoading,
    error,
    refresh,
  };
}
