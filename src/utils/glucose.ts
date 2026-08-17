import { colors, glucoseRange } from '../constants/theme';

export function glucoseStatusColor(value: number): string {
  if (value < glucoseRange.lowMax || value >= glucoseRange.highMin) return colors.rust;
  return colors.ink;
}

export function formatQuickTimestamp(date: Date): string {
  const time = date.toLocaleTimeString(undefined, { hour: 'numeric', minute: '2-digit' });
  const now = new Date();
  const isToday =
    date.getFullYear() === now.getFullYear() &&
    date.getMonth() === now.getMonth() &&
    date.getDate() === now.getDate();

  if (isToday) return `Today · ${time}`;
  const day = date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
  return `${day} · ${time}`;
}
