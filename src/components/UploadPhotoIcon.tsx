"use client";

import { User } from "lucide-react"; // You can use any icon here
import Link from "next/link";
import { cn } from "@/lib/utils"; // shadcn utility for conditional classes

export default function UploadPhotoIcon({ className }: { className?: string }) {
  return (
    <Link
      href="/uploadFile" // route where your CompleteProfile.tsx is
      className={cn(
        className="flex-1 transition-transform duration-300 hover:scale-110 hover:text-green-600 mx-1",
        className
      )}
    >
      <User className="h-6 w-6 text-gray-700" />
    </Link>
  );
}
