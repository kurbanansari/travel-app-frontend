"use client";

import { Toaster } from "react-hot-toast";
import { ReactNode } from "react";

interface ToasterProviderProps {
  children: ReactNode;
}

export function ToasterProvider({ children }: ToasterProviderProps) {
  return <Toaster position="top-center" reverseOrder={false} />;
}
