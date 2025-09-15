// // components/AuthRedirect.tsx
// "use client";

// import { ReactNode, useEffect } from "react";
// import { useRouter } from "next/navigation";
// import { useAuth } from "@/providers/AuthProvider";

// interface AuthRedirectProps {
//   children: ReactNode;
//   redirectIfAuthenticated?: string; // default: feed page
// }

// export default function AuthRedirect({
//   children,
//   redirectIfAuthenticated = "/",
// }: AuthRedirectProps) {
//   const { isAuthenticated } = useAuth();
//   const router = useRouter();

//   useEffect(() => {
//     if (isAuthenticated) {
//       router.replace(redirectIfAuthenticated); // redirect logged-in user
//     }
//   }, [isAuthenticated, router, redirectIfAuthenticated]);

//   return <>{!isAuthenticated && children}</>; // only render children if not logged in
// }

// "use client";

// import { ReactNode, useEffect } from "react";
// import { useRouter } from "next/navigation";
// import { useSelector } from "react-redux";
// import { RootState } from "@/redux/store";

// interface AuthRedirectProps {
//   children: ReactNode;
//   redirectIfAuthenticated?: string; // default feed page
// }

// export default function AuthRedirect({
//   children,
//   redirectIfAuthenticated = "/",
// }: AuthRedirectProps) {
//    const { isAuthenticated ,loading,token} = useSelector((state: RootState) => state.auth);
//   const router = useRouter();

// //   useEffect(() => {
// //     if (!loading && isAuthenticated) {
// //       router.replace(redirectIfAuthenticated); // redirect logged-in user
// //     }
// //   }, [isAuthenticated, loading, router, redirectIfAuthenticated]);

//  useEffect(() => {
//     if ( isAuthenticated && token)  {
//       router.replace(redirectIfAuthenticated);
//     }
//   }, [isAuthenticated, token ,router, redirectIfAuthenticated]);

// // useEffect(() => {
// //     if (!loading && isAuthenticated && token) {
// //       // small delay → lets toast render before redirect
// //       const timer = setTimeout(() => {
// //         router.replace(redirectIfAuthenticated);
// //       }, 1200);
// //       return () => clearTimeout(timer);
// //     }
// //   }, [isAuthenticated, token, loading, router, redirectIfAuthenticated]);


//   if (loading) return null; // ✅ don't render anything until token is checked

//   return <>{!isAuthenticated && children}</>;
// }

// "use client";

// import { ReactNode, useEffect } from "react";
// import { useRouter } from "next/navigation";
// import { useSelector, useDispatch } from "react-redux";
// import { RootState, AppDispatch } from "@/redux/store";
// import { checkAuth } from "@/redux/slices/authSlice";

// interface AuthRedirectProps {
//   children: ReactNode;
//   requireAuth?: boolean; // true = must be logged in, false = must be logged out
//   redirectTo?: string; // where to go if check fails
// }

// export default function AuthRedirect({
//   children,
//   requireAuth = true,
//   redirectTo = "/login",
// }: AuthRedirectProps) {
//   const dispatch = useDispatch<AppDispatch>();
//   const { isAuthenticated, loading } = useSelector((state: RootState) => state.auth);
//   const router = useRouter();

//   // ✅ on mount → check token in localStorage
//   useEffect(() => {
//     dispatch(checkAuth());
//   }, [dispatch]);

//   useEffect(() => {
//     if (!loading) {
//       if (requireAuth && !isAuthenticated) {
//         router.replace(redirectTo); // needs login
//       } else if (!requireAuth && isAuthenticated) {
//         router.replace("/"); // already logged in → go home
//       }
//     }
//   }, [isAuthenticated, requireAuth, redirectTo, loading, router]);

//   if (loading) return null; // wait until we know auth state

//   return <>{children}</>;
// }

