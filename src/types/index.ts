export type MealContext = 'fasting' | 'before_meal' | 'after_meal' | 'other';

export interface GlucoseReading {
  id: string;
  value: number; // mg/dL
  context: MealContext;
  note?: string;
  takenAt: string; // ISO timestamp
}
