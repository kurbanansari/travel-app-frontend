"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const { token, isAuthenticated, loading } = useSelector(
    (state: RootState) => state.auth
  );

  useEffect(() => {
    if (loading) return;

    const publicRoutes = ["/login", "/register"];

    // if user is already logged in → block /login
    if (isAuthenticated && pathname === "/login") {
      router.replace("/");
      return;
    }

    // if user is not logged in → block private routes
    if (!isAuthenticated && !publicRoutes.includes(pathname)) {
      router.replace("/login");
    }
  }, [isAuthenticated, loading, pathname, router]);

  if (loading) return null;

  return <>{children}</>;
}
