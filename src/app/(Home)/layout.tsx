
"use client";

import { AuthGuard } from "@/components/ui/AuthQuard";
import Footer from "@/components/ui/Footer";

import React, { useEffect, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState, AppDispatch } from "@/redux/store";
import { fetchProfile } from "@/redux/thunk/userThunk";

export default function HomeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  
  
const dispatch = useDispatch<AppDispatch>();
   const { user} = useSelector((state: RootState) => state.user);
const effectRan = useRef(false);

  useEffect(() => {
      if (effectRan.current) return;
      if (!user?.id) {
        dispatch(fetchProfile());
      }
      effectRan.current = true;
    }, [dispatch, user?.id]);
  return (
    <>
          <AuthGuard>{children}</AuthGuard>
          <Footer />
     </>   
  );
}

