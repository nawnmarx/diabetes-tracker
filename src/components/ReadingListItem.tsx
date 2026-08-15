import { StyleSheet, Text, View } from 'react-native';
import { colors } from '../constants/theme';
import { GlucoseReading } from '../types';
import { formatReadingTime, glucoseStatusColor } from '../utils/glucose';

const contextLabels: Record<GlucoseReading['context'], string> = {
  before_meal: 'Before meal',
  after_meal: 'After meal',
  fasting: 'Fasting',
  bedtime: 'Bedtime',
  other: 'Other',
};

export default function ReadingListItem({ reading }: { reading: GlucoseReading }) {
  return (
    <View style={styles.row}>
      <View style={[styles.dot, { backgroundColor: glucoseStatusColor(reading.value) }]} />
      <View style={styles.details}>
        <Text style={styles.value}>{reading.value} mg/dL</Text>
        <Text style={styles.meta}>
          {contextLabels[reading.context]} · {formatReadingTime(reading.takenAt)}
        </Text>
        {reading.note ? <Text style={styles.note}>{reading.note}</Text> : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: 14,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: colors.border,
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: 12,
  },
  details: {
    flex: 1,
  },
  value: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
  },
  meta: {
    fontSize: 13,
    color: colors.textMuted,
    marginTop: 2,
  },
  note: {
    fontSize: 13,
    color: colors.textMuted,
    marginTop: 4,
    fontStyle: 'italic',
  },
});
