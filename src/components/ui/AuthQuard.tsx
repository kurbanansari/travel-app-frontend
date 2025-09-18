"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useSelector ,useDispatch} from "react-redux";

import { AppDispatch, RootState } from "@/redux/store";

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const { token, isAuthenticated, loading ,user} = useSelector(
    (state: RootState) => state.auth
  );
   const [checked, setChecked] = useState(false); 

const dispatch = useDispatch<AppDispatch>();
  // const { user} = useSelector((state: RootState) => state.user);
  const hasFetched = useRef(false);
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
    else {
      // Auth status ok → render children
      setChecked(true);
    }
  }, [isAuthenticated, loading, pathname, router]);
  
// useEffect(() => {
//     if (!hasFetched.current) {
//       dispatch(fetchProfile()); // ✅ fetch /me
//       hasFetched.current = true;
//     }
//   }, [dispatch]);


  if (loading || !checked) return null;

  return <>{children}</>;
}
