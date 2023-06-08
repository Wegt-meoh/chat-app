import clsx, { ClassValue } from "clsx";
import { format } from "date-fns";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function chatHrefConstructor(userId1: string, userId2: string) {
  const sortedId = [userId1, userId2].sort();
  return `${sortedId[0]}--${sortedId[1]}`;
}

export function toPusherKey(key: string) {
  return key.replace(/:/g, "__");
}

export function formatTimestamp(timestamp: number) {
  return format(timestamp, "HH:mm");
}
