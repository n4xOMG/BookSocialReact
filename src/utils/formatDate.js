import { format, formatDistanceToNow } from 'date-fns';

export const formatExactTime = (timestamp) => {
  if (!timestamp) return "";
  const date = new Date(timestamp);
  return format(date, 'dd/MM/yyyy \'at\' HH:mm:ss'); 
};

export const formatRelativeTime = (timestamp) => {
  if (!timestamp) return "";
  return formatDistanceToNow(new Date(timestamp), { addSuffix: true });
};

export function formatLastReadDate(dateString) {
  const now = new Date();
  const lastRead = new Date(dateString);
  const diffTime = Math.abs(now - lastRead);
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays === 0) {
    const diffHours = Math.floor(diffTime / (1000 * 60 * 60));
    if (diffHours === 0) {
      const diffMinutes = Math.floor(diffTime / (1000 * 60));
      return `${diffMinutes} min ago`;
    }
    return `${diffHours} hour${diffHours > 1 ? "s" : ""} ago`;
  } else if (diffDays === 1) {
    return "Yesterday";
  } else if (diffDays < 7) {
    return `${diffDays} day${diffDays > 1 ? "s" : ""} ago`;
  } else {
    return lastRead.toLocaleDateString();
  }
}