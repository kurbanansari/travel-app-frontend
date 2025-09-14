import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const isValidPhone = (phone: string): boolean => {
  return /^[6-9]\d{9}$/.test(phone); // starts with 6-9, must be 10 digits
};