"use client";

import { useCallback, useEffect, useState } from "react";

const STORAGE_KEY = "writing-editor-token";

interface Session {
  token: string;
  exp: number;
}

function readStoredSession(): Session | null {
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Session;
    return parsed.exp > Date.now() ? parsed : null;
  } catch {
    return null;
  }
}

/** Holds the short-lived editor token. sessionStorage (not localStorage) so it
 *  dies with the tab; the token is only a bearer for this device's session and
 *  the server re-verifies it on every call. */
export function useEditorSession() {
  const [session, setSession] = useState<Session | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setSession(readStoredSession());
    setReady(true);
  }, []);

  const signIn = useCallback(async (password: string) => {
    const res = await fetch("/api/admin/verify", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    });

    const body = (await res.json().catch(() => ({}))) as { token?: string; exp?: number; error?: string };
    if (!res.ok || !body.token || !body.exp) {
      throw new Error(body.error ?? "Sign-in failed.");
    }

    const next = { token: body.token, exp: body.exp };
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    setSession(next);
  }, []);

  const signOut = useCallback(() => {
    sessionStorage.removeItem(STORAGE_KEY);
    setSession(null);
  }, []);

  /** fetch with the bearer header attached; clears the session on a 401 so the
   *  UI falls back to the password prompt instead of failing silently. */
  const authedFetch = useCallback(
    async (input: string, init: RequestInit = {}) => {
      if (!session) throw new Error("Not signed in.");

      const res = await fetch(input, {
        ...init,
        headers: {
          ...(init.headers ?? {}),
          "Content-Type": "application/json",
          Authorization: `Bearer ${session.token}`,
        },
      });

      if (res.status === 401) {
        sessionStorage.removeItem(STORAGE_KEY);
        setSession(null);
      }

      return res;
    },
    [session]
  );

  return { session, ready, signIn, signOut, authedFetch };
}
