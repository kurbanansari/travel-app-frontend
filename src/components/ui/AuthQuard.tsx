"use client";

import { useAuth } from "@/hooks/useAuth";

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const { loading, isAuthenticated } = useAuth();

  if (loading) {
    return <div className="text-center p-6">Checking authentication...</div>;
  }

  if (!isAuthenticated) {
    // 🚀 While redirect happens, don't render children
    return <div className="text-center p-6">Redirecting to login...</div>;
  }

  return <>{children}</>;
}
