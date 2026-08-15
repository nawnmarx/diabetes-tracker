import { useState } from 'react';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { colors } from '../constants/theme';
import { MealContext } from '../types';

const contexts: { label: string; value: MealContext }[] = [
  { label: 'Fasting', value: 'fasting' },
  { label: 'Before meal', value: 'before_meal' },
  { label: 'After meal', value: 'after_meal' },
  { label: 'Bedtime', value: 'bedtime' },
  { label: 'Other', value: 'other' },
];

export default function AddReadingScreen() {
  const [value, setValue] = useState('');
  const [context, setContext] = useState<MealContext>('fasting');
  const [note, setNote] = useState('');

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Blood glucose (mg/dL)</Text>
      <TextInput
        style={styles.input}
        keyboardType="number-pad"
        value={value}
        onChangeText={setValue}
        placeholder="e.g. 110"
        placeholderTextColor={colors.textMuted}
      />

      <Text style={styles.label}>Context</Text>
      <View style={styles.chipRow}>
        {contexts.map((item) => (
          <Pressable
            key={item.value}
            onPress={() => setContext(item.value)}
            style={[styles.chip, context === item.value && styles.chipActive]}
          >
            <Text style={[styles.chipText, context === item.value && styles.chipTextActive]}>
              {item.label}
            </Text>
          </Pressable>
        ))}
      </View>

      <Text style={styles.label}>Note (optional)</Text>
      <TextInput
        style={[styles.input, styles.noteInput]}
        value={note}
        onChangeText={setNote}
        placeholder="How are you feeling?"
        placeholderTextColor={colors.textMuted}
        multiline
      />

      <Pressable style={styles.saveButton} disabled={!value}>
        <Text style={styles.saveButtonText}>Save reading</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    padding: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
    marginTop: 16,
    marginBottom: 8,
  },
  input: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 16,
    color: colors.text,
  },
  noteInput: {
    minHeight: 80,
    textAlignVertical: 'top',
  },
  chipRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  chip: {
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
  },
  chipActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  chipText: {
    color: colors.text,
    fontSize: 14,
  },
  chipTextActive: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
  saveButton: {
    marginTop: 32,
    backgroundColor: colors.primary,
    borderRadius: 10,
    paddingVertical: 14,
    alignItems: 'center',
  },
  saveButtonText: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 16,
  },
});
