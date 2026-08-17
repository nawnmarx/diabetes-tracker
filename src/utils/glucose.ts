import { colors, glucoseRange } from '../constants/theme';

const MONTHS_SHORT = [
  'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
  'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec',
];

const MONTHS_LONG = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];

const WEEKDAYS_LONG = [
  'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday',
];

// Hermes's Intl support for Date.prototype.toLocaleTimeString/toLocaleDateString
// is unreliable on-device (often blank or ignoring the options object), so all
// date/time display in this app is formatted manually instead.
function formatTime12h(date: Date): string {
  const minutes = date.getMinutes();
  let hours = date.getHours();
  const period = hours >= 12 ? 'PM' : 'AM';
  hours = hours % 12;
  if (hours === 0) hours = 12;
  const minutesStr = minutes < 10 ? `0${minutes}` : `${minutes}`;
  return `${hours}:${minutesStr} ${period}`;
}

export function isSameDay(a: Date, b: Date): boolean {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

export function isInRange(value: number): boolean {
  return value >= glucoseRange.lowMax && value < glucoseRange.highMin;
}

// Binary emphasis for the Quick Log entry number: neutral, or flagged.
export function glucoseStatusColor(value: number): string {
  if (value < glucoseRange.lowMax || value >= glucoseRange.highMin) return colors.rust;
  return colors.ink;
}

// Three-tier severity for history/dashboard dots: in range, borderline, critical.
export function glucoseDotColor(value: number): string {
  if (value < glucoseRange.criticalLowMax || value >= glucoseRange.criticalHighMin) {
    return colors.rust;
  }
  if (value < glucoseRange.lowMax || value >= glucoseRange.highMin) return colors.amber;
  return colors.sage;
}

export function formatQuickTimestamp(date: Date): string {
  const time = formatTime12h(date);
  if (isSameDay(date, new Date())) return `Today · ${time}`;
  const day = `${MONTHS_SHORT[date.getMonth()]} ${date.getDate()}`;
  return `${day} · ${time}`;
}

export function formatFullDate(date: Date): string {
  return `${WEEKDAYS_LONG[date.getDay()]}, ${MONTHS_LONG[date.getMonth()]} ${date.getDate()}`;
}
