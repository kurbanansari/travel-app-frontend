
"use client";

import { AuthGuard } from "@/components/ui/AuthQuard";
import Footer from "@/components/ui/Footer";

export default function HomeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
          <AuthGuard>{children}</AuthGuard>
          <Footer />
     </>   
  );
}

