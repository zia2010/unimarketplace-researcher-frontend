import dayjs from 'dayjs';

export const formatTime = (time: string) => {
  const parsed = dayjs(`2000-01-01 ${time}`);
  const minutes = parsed.minute();
  if (minutes === 0) {
    return parsed.format('h a').toLowerCase();
  }
  return parsed.format('h:mm a').toLowerCase();
};
