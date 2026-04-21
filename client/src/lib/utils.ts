import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { format, parseISO } from "date-fns";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(dateStr: string, pattern = "MMM dd, yyyy") {
  try {
    return format(parseISO(dateStr), pattern);
  } catch {
    return dateStr;
  }
}

export function formatCurrency(amount: number, currency = "INR") {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatMonth(yyyymm: string) {
  const [year, month] = yyyymm.split("-");
  const date = new Date(Number(year), Number(month) - 1, 1);
  return format(date, "MMMM yyyy");
}

export function getInitials(name: string) {
  return name
    .split(" ")
    .map((n) => n[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}