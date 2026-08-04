const IST_TIMEZONE = 'Asia/Kolkata';

/**
 * Robustly parses a date string into a JavaScript Date object,
 * correctly preserving any timezone offset embedded in the string.
 * Uses new Date() which handles ISO strings with offsets (e.g. +05:30) natively.
 */
const getISTDate = (date: string | null | undefined): Date | null => {
  if (!date) return null;

  // new Date() correctly handles:
  //   - ISO strings with Z (UTC): "2026-02-12T11:51:00Z"
  //   - ISO strings with offset: "2026-02-12T17:21:00+05:30"
  //   - Naive strings (treated as LOCAL time by JS engine): "2026-02-12 17:21:00"
  // For naive strings without any offset, replace the space with T so JS parses them
  // as local time (which is IST on the server/client running in IST).
  const normalised =
    date.includes('T') || date.includes('Z') || date.includes('+')
      ? date
      : date.replace(' ', 'T');

  const d = new Date(normalised);
  if (isNaN(d.getTime())) return null;

  return d;
};

/**
 * Formats a date value into a readable format in IST.
 */
export const formatDate = (
  date: string | null | undefined,
  year: boolean = true
): string => {
  const d = getISTDate(date);
  if (!d) return 'N/A';

  return new Intl.DateTimeFormat('en-US', {
    timeZone: IST_TIMEZONE,
    month: 'short',
    day: '2-digit',
    year: year ? 'numeric' : undefined,
  }).format(d);
};

/**
 * Formats a date value into a readable format in IST (alias for formatDate).
 */
export const formatDate2 = (date: string, year: boolean = true): string => {
  return formatDate(date, year);
};

/**
 * Formats a date/time string into a readable time format in IST.
 */
export const formatTime = (date: string | null | undefined): string => {
  const d = getISTDate(date);
  if (!d) return 'N/A';

  return new Intl.DateTimeFormat('en-US', {
    timeZone: IST_TIMEZONE,
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  })
    .format(d)
    .toUpperCase();
};
