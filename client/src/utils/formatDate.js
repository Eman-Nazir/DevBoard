import { formatDistanceToNow, format } from "date-fns";

export const timeAgo = (date) =>
  formatDistanceToNow(new Date(date), { addSuffix: true });

export const formatDate = (date) =>
  format(new Date(date), "MMM d, yyyy");

export const formatDateTime = (date) =>
  format(new Date(date), "MMM d, yyyy · h:mm a");