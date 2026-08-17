import { useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors, fonts } from '../constants/theme';
import { GlucoseReading, MealContext } from '../types';
import { formatQuickTimestamp, glucoseStatusColor } from '../utils/glucose';

const whenOptions: { label: string; value: MealContext }[] = [
  { label: 'Fasting', value: 'fasting' },
  { label: 'Before meal', value: 'before_meal' },
  { label: 'After meal', value: 'after_meal' },
  { label: 'Other', value: 'other' },
];

const presetNotes = ['Stressed', 'Skipped meal', 'Exercised'];

export default function HomeScreen() {
  const [readings, setReadings] = useState<GlucoseReading[]>([]);
  const [value, setValue] = useState(100);
  const [editingValue, setEditingValue] = useState(false);
  const [valueDraft, setValueDraft] = useState('');
  const [when, setWhen] = useState<MealContext>('fasting');
  const [selectedNotes, setSelectedNotes] = useState<string[]>([]);
  const [addingNote, setAddingNote] = useState(false);
  const [customNote, setCustomNote] = useState('');
  const [timestamp, setTimestamp] = useState(() => new Date());
  const [justSaved, setJustSaved] = useState(false);

  const toggleNote = (note: string) => {
    setSelectedNotes((prev) =>
      prev.includes(note) ? prev.filter((n) => n !== note) : [...prev, note]
    );
  };

  const startEditingValue = () => {
    setValueDraft(String(value));
    setEditingValue(true);
  };

  const commitValueEdit = () => {
    const parsed = parseInt(valueDraft, 10);
    if (!Number.isNaN(parsed)) {
      setValue(Math.max(0, parsed));
    }
    setEditingValue(false);
  };

  const commitCustomNote = () => {
    setCustomNote((prev) => prev.trim());
    setAddingNote(false);
  };

  const handleSave = () => {
    const notes = [...selectedNotes, ...(customNote ? [customNote] : [])];
    const reading: GlucoseReading = {
      id: `${Date.now()}`,
      value,
      context: when,
      note: notes.length > 0 ? notes.join(', ') : undefined,
      takenAt: timestamp.toISOString(),
    };
    setReadings((prev) => [reading, ...prev]);

    setJustSaved(true);
    setTimeout(() => setJustSaved(false), 1500);

    setSelectedNotes([]);
    setCustomNote('');
    setTimestamp(new Date());
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
          <View style={styles.timestampRow}>
            <Text style={styles.timestampText}>
              {formatQuickTimestamp(timestamp)} <Text style={styles.timestampEdit}>· edit</Text>
            </Text>
          </View>

          <View style={styles.valueSection}>
            <View style={styles.valueRow}>
              <Pressable
                style={styles.stepperButton}
                onPress={() => setValue((v) => Math.max(0, v - 1))}
                hitSlop={8}
              >
                <Text style={styles.stepperGlyph}>−</Text>
              </Pressable>

              {editingValue ? (
                <TextInput
                  style={[styles.valueText, styles.valueInput]}
                  value={valueDraft}
                  onChangeText={setValueDraft}
                  onSubmitEditing={commitValueEdit}
                  onBlur={commitValueEdit}
                  keyboardType="number-pad"
                  returnKeyType="done"
                  selectTextOnFocus
                  maxLength={4}
                  underlineColorAndroid="transparent"
                  autoFocus
                />
              ) : (
                <Pressable onPress={startEditingValue} hitSlop={8}>
                  <Text style={[styles.valueText, { color: glucoseStatusColor(value) }]}>
                    {value}
                  </Text>
                </Pressable>
              )}

              <Pressable
                style={styles.stepperButton}
                onPress={() => setValue((v) => v + 1)}
                hitSlop={8}
              >
                <Text style={styles.stepperGlyph}>+</Text>
              </Pressable>
            </View>
            <Text style={styles.valueUnit}>mg/dL</Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionLabel}>When</Text>
            <View style={styles.chipRow}>
              {whenOptions.map((option) => {
                const selected = when === option.value;
                return (
                  <Pressable
                    key={option.value}
                    onPress={() => setWhen(option.value)}
                    style={[styles.chip, selected ? styles.chipSelected : styles.chipOutlined]}
                  >
                    <Text style={[styles.chipText, selected && styles.chipTextSelected]}>
                      {option.label}
                    </Text>
                  </Pressable>
                );
              })}
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionLabel}>Note (optional)</Text>
            <View style={styles.chipRow}>
              {presetNotes.map((note) => {
                const selected = selectedNotes.includes(note);
                return (
                  <Pressable
                    key={note}
                    onPress={() => toggleNote(note)}
                    style={[styles.chip, selected ? styles.noteChipSelected : styles.chipOutlined]}
                  >
                    <Text style={styles.chipText}>{note}</Text>
                  </Pressable>
                );
              })}

              {customNote && !addingNote ? (
                <View style={[styles.chip, styles.customNoteChip]}>
                  <Pressable onPress={() => setAddingNote(true)}>
                    <Text style={styles.customNoteChipText} numberOfLines={1}>
                      {customNote}
                    </Text>
                  </Pressable>
                  <Pressable onPress={() => setCustomNote('')} hitSlop={8}>
                    <Text style={styles.customNoteChipClearText}>×</Text>
                  </Pressable>
                </View>
              ) : (
                <Pressable
                  onPress={() => setAddingNote((prev) => !prev)}
                  style={[styles.chip, styles.chipOutlined]}
                >
                  <Text style={styles.chipAddText}>+ Add</Text>
                </Pressable>
              )}
            </View>

            {addingNote && (
              <TextInput
                style={styles.customNoteInput}
                placeholder="Type a note for this reading"
                placeholderTextColor={colors.soft}
                value={customNote}
                onChangeText={setCustomNote}
                onSubmitEditing={commitCustomNote}
                onBlur={commitCustomNote}
                returnKeyType="done"
                autoFocus
              />
            )}
          </View>

          <Pressable style={styles.saveButton} onPress={handleSave} disabled={justSaved}>
            <Text style={styles.saveButtonText}>{justSaved ? 'Saved' : 'Save reading'}</Text>
          </Pressable>

          <Text style={styles.footerText}>No ads. No premium lock.</Text>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.paper,
  },
  flex: {
    flex: 1,
  },
  content: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingTop: 12,
    paddingBottom: 32,
  },
  timestampRow: {
    alignItems: 'center',
    marginBottom: 8,
  },
  timestampText: {
    fontFamily: fonts.regular,
    fontSize: 14,
    color: colors.soft,
  },
  timestampEdit: {
    fontFamily: fonts.medium,
    color: colors.sage,
  },
  valueSection: {
    alignItems: 'center',
    paddingVertical: 28,
  },
  valueRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 28,
  },
  stepperButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    borderWidth: 1.5,
    borderColor: colors.hairline,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.paper,
  },
  stepperGlyph: {
    fontFamily: fonts.medium,
    fontSize: 24,
    color: colors.ink,
    lineHeight: 28,
  },
  valueText: {
    fontFamily: fonts.display,
    fontSize: 72,
    minWidth: 160,
    textAlign: 'center',
  },
  valueInput: {
    padding: 0,
    color: colors.ink,
  },
  valueUnit: {
    fontFamily: fonts.medium,
    fontSize: 13,
    letterSpacing: 1,
    textTransform: 'uppercase',
    color: colors.soft,
    marginTop: 6,
  },
  section: {
    marginBottom: 26,
  },
  sectionLabel: {
    fontFamily: fonts.semiBold,
    fontSize: 13,
    letterSpacing: 0.5,
    textTransform: 'uppercase',
    color: colors.soft,
    marginBottom: 12,
  },
  chipRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  chip: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 999,
    borderWidth: 1.5,
  },
  chipOutlined: {
    borderColor: colors.hairline,
    backgroundColor: colors.paper,
  },
  chipSelected: {
    borderColor: colors.sage,
    backgroundColor: colors.sage,
  },
  noteChipSelected: {
    borderColor: colors.sageTint,
    backgroundColor: colors.sageTint,
  },
  chipText: {
    fontFamily: fonts.medium,
    fontSize: 15,
    color: colors.ink,
  },
  chipTextSelected: {
    color: '#FFFFFF',
  },
  chipAddText: {
    fontFamily: fonts.medium,
    fontSize: 15,
    color: colors.sage,
  },
  customNoteChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    borderStyle: 'dashed',
    borderColor: colors.sage,
    backgroundColor: colors.paper,
  },
  customNoteChipText: {
    fontFamily: fonts.medium,
    fontSize: 15,
    color: colors.ink,
    maxWidth: 140,
  },
  customNoteChipClearText: {
    fontFamily: fonts.medium,
    fontSize: 16,
    color: colors.soft,
  },
  customNoteInput: {
    marginTop: 12,
    borderWidth: 1.5,
    borderColor: colors.hairline,
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontFamily: fonts.regular,
    fontSize: 15,
    color: colors.ink,
    backgroundColor: colors.paper,
  },
  saveButton: {
    backgroundColor: colors.deepSage,
    borderRadius: 16,
    paddingVertical: 18,
    alignItems: 'center',
    marginTop: 8,
  },
  saveButtonText: {
    fontFamily: fonts.bold,
    fontSize: 17,
    color: '#FFFFFF',
  },
  footerText: {
    fontFamily: fonts.regular,
    fontSize: 12,
    color: colors.soft,
    textAlign: 'center',
    marginTop: 14,
  },
});
