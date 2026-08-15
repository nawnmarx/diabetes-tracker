import { colors, glucoseRange } from '../constants/theme';

export function glucoseStatusColor(value: number): string {
  if (value < glucoseRange.lowMax) return colors.low;
  if (value >= glucoseRange.highMin) return colors.high;
  return colors.inRange;
}

export function formatReadingTime(isoTimestamp: string): string {
  const date = new Date(isoTimestamp);
  return date.toLocaleString(undefined, {
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  });
}
