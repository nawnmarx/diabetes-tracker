export type MealContext = 'before_meal' | 'after_meal' | 'fasting' | 'bedtime' | 'other';

export interface GlucoseReading {
  id: string;
  value: number; // mg/dL
  context: MealContext;
  note?: string;
  takenAt: string; // ISO timestamp
}
