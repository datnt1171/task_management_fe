import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDateToUTC7(dateString: string) {
  const date = new Date(dateString);
  const options: Intl.DateTimeFormatOptions = {
    timeZone: "Asia/Ho_Chi_Minh",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  };

  return new Intl.DateTimeFormat("en-US", options).format(date);
}

export const getStatusColor = (stateType: string) => {
  switch (stateType) {
    case "pending_approve":
      return "bg-yellow-100 text-yellow-800";
    case "analyze":
      return "bg-blue-100 text-blue-800";
    case "working":
      return "bg-blue-100 text-blue-800";
    case "pending_review":
      return "bg-orange-100 text-orange-800";
    case "start":
      return "bg-gray-100 text-gray-800";
    case "denied":
      return "bg-red-100 text-red-800";
    case "closed":
      return "bg-green-100 text-green-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

export const getActionColor = (actionType: string) => {
  switch (actionType.toLowerCase()) {
    case "approve":
      return "bg-green-100 text-green-800";
    case "adjust":
      return "bg-blue-100 text-blue-800";
    case "reject":
      return "bg-red-100 text-red-800";
    case "complete":
      return "bg-blue-100 text-blue-800";
    case "confirm":
      return "bg-green-100 text-green-800";
    case "close":
      return "bg-gray-100 text-gray-800";
    case "cancel":
      return "bg-red-100 text-red-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};