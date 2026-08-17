import { colors, glucoseRange } from '../constants/theme';

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
  const time = date.toLocaleTimeString(undefined, { hour: 'numeric', minute: '2-digit' });
  if (isSameDay(date, new Date())) return `Today · ${time}`;
  const day = date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
  return `${day} · ${time}`;
}
