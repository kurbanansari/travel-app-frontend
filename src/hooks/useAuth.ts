"use client";
import { useSelector, useDispatch } from "react-redux";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { RootState } from "@/redux/store";
// import { loadFromStorage } from "@/redux/slices/authSlice";

export function useAuth() {
  const dispatch = useDispatch();
  const { isAuthenticated, loading } = useSelector(
    (state: RootState) => state.auth
  );
  const router = useRouter();

  // useEffect(() => {
  //   // 🔑 Always hydrate auth state from localStorage
  //   dispatch(loadFromStorage() as any);
  // }, [dispatch]);

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push("/login");
    }
  }, [loading, isAuthenticated, router]);

  return { loading, isAuthenticated };
}
