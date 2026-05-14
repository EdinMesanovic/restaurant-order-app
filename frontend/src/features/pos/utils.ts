import type { OrderResponse } from "@/lib/api-orders";

export const formatPrice = (value: number) =>
  new Intl.NumberFormat("bs-BA", {
    style: "currency",
    currency: "EUR",
    minimumFractionDigits: 2,
  }).format(value);

export const formatOrderTime = (value: string) =>
  new Intl.DateTimeFormat("bs-BA", {
    hour: "2-digit",
    minute: "2-digit",
    day: "2-digit",
    month: "2-digit",
  }).format(new Date(value));

export const getStatusBadgeClass = (status: OrderResponse["status"]) =>
  status === "done"
    ? "border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-900/60 dark:bg-emerald-950/40 dark:text-emerald-300"
    : "border-orange-200 bg-orange-50 text-orange-700 dark:border-orange-900/60 dark:bg-orange-950/40 dark:text-orange-300";
