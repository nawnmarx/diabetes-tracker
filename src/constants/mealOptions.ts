import { MealContext } from '../types';

export const whenOptions: { label: string; value: MealContext }[] = [
  { label: 'Fasting', value: 'fasting' },
  { label: 'Before meal', value: 'before_meal' },
  { label: 'After meal', value: 'after_meal' },
  { label: 'Other', value: 'other' },
];

const labelByContext = Object.fromEntries(
  whenOptions.map((option) => [option.value, option.label])
) as Record<MealContext, string>;

export function mealContextLabel(context: MealContext): string {
  return labelByContext[context];
}
