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
