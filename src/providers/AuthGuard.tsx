import { RootState } from "@/redux/store";
import { usePathname } from "next/navigation";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { useSelector } from "react-redux";

// ✅ AuthGuard component — runs globally
export function AuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const { token, isAuthenticated, loading } = useSelector(
    (state: RootState) => state.auth
  );

  useEffect(() => {
    if (!loading) {
      if (!token && pathname !== "/login") {
        router.replace("/login"); // force login
      }
      if (token && pathname === "/login") {
        router.replace("/"); // redirect logged-in user
      }
    }
  }, [token, loading, pathname, router]);

  if (loading) return null; // wait until auth state is known

  return <>{children}</>;
}