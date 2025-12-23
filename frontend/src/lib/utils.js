import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Merges Tailwind CSS classes with clsx
 * This is the cn() utility function used by shadcn/ui components
 */
export function cn(...inputs) {
  return twMerge(clsx(inputs));
}
