"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "./useUser";

/**
 * Redirects to /login if not authenticated.
 * Returns user/profile/loading from useUser.
 */
export function useRequireAuth() {
  const router = useRouter();
  const userState = useUser();

  useEffect(() => {
    if (!userState.loading && !userState.user) {
      router.push("/login");
    }
  }, [userState.loading, userState.user, router]);

  return userState;
}
