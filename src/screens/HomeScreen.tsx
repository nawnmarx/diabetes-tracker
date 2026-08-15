import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import ReadingListItem from '../components/ReadingListItem';
import { colors } from '../constants/theme';
import { RootStackParamList } from '../navigation/AppNavigator';
import { GlucoseReading } from '../types';

const sampleReadings: GlucoseReading[] = [
  { id: '1', value: 118, context: 'after_meal', takenAt: new Date().toISOString() },
  { id: '2', value: 92, context: 'fasting', takenAt: new Date(Date.now() - 86400000).toISOString() },
  { id: '3', value: 145, context: 'before_meal', takenAt: new Date(Date.now() - 172800000).toISOString(), note: 'Felt tired' },
];

type Props = NativeStackScreenProps<RootStackParamList, 'Home'>;

export default function HomeScreen({ navigation }: Props) {
  return (
    <View style={styles.container}>
      <FlatList
        data={sampleReadings}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <ReadingListItem reading={item} />}
        contentContainerStyle={styles.list}
        ListHeaderComponent={<Text style={styles.title}>Glucose Readings</Text>}
      />
      <Pressable style={styles.fab} onPress={() => navigation.navigate('AddReading')}>
        <Text style={styles.fabText}>+ Add reading</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  list: {
    padding: 16,
    paddingBottom: 96,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 16,
  },
  fab: {
    position: 'absolute',
    right: 16,
    bottom: 24,
    backgroundColor: colors.primary,
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 999,
  },
  fabText: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 15,
  },
});
