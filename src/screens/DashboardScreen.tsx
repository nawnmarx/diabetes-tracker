import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useEffect, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { mealContextLabel } from '../constants/mealOptions';
import { colors, fonts } from '../constants/theme';
import { useReadings } from '../context/ReadingsContext';
import { RootStackParamList } from '../navigation/AppNavigator';
import { formatQuickTimestamp, glucoseDotColor, isInRange, isSameDay } from '../utils/glucose';

const RECENT_LIMIT = 10;
const BANNER_DURATION_MS = 4000;

type Props = NativeStackScreenProps<RootStackParamList, 'Dashboard'>;

export default function DashboardScreen({ navigation, route }: Props) {
  const { readings } = useReadings();
  const [justLoggedId, setJustLoggedId] = useState(route.params?.justLoggedId);

  useEffect(() => {
    const id = route.params?.justLoggedId;
    if (!id) return;
    setJustLoggedId(id);
    const timer = setTimeout(() => setJustLoggedId(undefined), BANNER_DURATION_MS);
    return () => clearTimeout(timer);
  }, [route.params?.justLoggedId]);

  const hasReadings = readings.length > 0;
  const justLoggedReading = readings.find((r) => r.id === justLoggedId);

  const todayReadings = readings.filter((r) => isSameDay(new Date(r.takenAt), new Date()));
  const loggedCount = todayReadings.length;
  const inRangeCount = todayReadings.filter((r) => isInRange(r.value)).length;
  const inRangePct = loggedCount > 0 ? Math.round((inRangeCount / loggedCount) * 100) : null;
  const avgValue =
    loggedCount > 0
      ? Math.round(todayReadings.reduce((sum, r) => sum + r.value, 0) / loggedCount)
      : null;

  const today = new Date();
  const dateLabel = today.toLocaleDateString(undefined, {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  });

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
      <View style={styles.headerRow}>
        <View>
          <Text style={styles.headerTitle}>Today</Text>
          <Text style={styles.headerDate}>{dateLabel}</Text>
        </View>
        <View style={styles.avatar}>
          <Text style={styles.avatarGlyph}>+</Text>
        </View>
      </View>

      {hasReadings ? (
        <ScrollView contentContainerStyle={styles.content}>
          {justLoggedReading && (
            <View style={styles.banner}>
              <View style={styles.bannerDot} />
              <Text style={styles.bannerText}>
                {justLoggedReading.value} mg/dL logged just now
              </Text>
            </View>
          )}

          <View style={styles.statsRow}>
            <View style={styles.statCard}>
              <Text style={styles.statLabel}>In range</Text>
              <Text style={styles.statValue}>{inRangePct !== null ? `${inRangePct}%` : '–'}</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statLabel}>Avg</Text>
              <Text style={styles.statValue}>{avgValue !== null ? avgValue : '–'}</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statLabel}>Logged</Text>
              <Text style={styles.statValue}>{loggedCount}</Text>
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionLabel}>Recent</Text>
            {readings.slice(0, RECENT_LIMIT).map((reading) => (
              <View key={reading.id} style={styles.recentRow}>
                <View style={[styles.recentDot, { backgroundColor: glucoseDotColor(reading.value) }]} />
                <View style={styles.recentDetails}>
                  <Text style={styles.recentValue}>{reading.value} mg/dL</Text>
                  <Text style={styles.recentMeta}>
                    {mealContextLabel(reading.context)} · {formatQuickTimestamp(new Date(reading.takenAt))}
                  </Text>
                </View>
              </View>
            ))}
          </View>
        </ScrollView>
      ) : (
        <View style={styles.emptyState}>
          <View style={styles.emptyCircle} />
          <Text style={styles.emptyHeading}>Nothing logged yet</Text>
          <Text style={styles.emptySubtext}>
            Once readings are added, they'll show up here with trends and history.
          </Text>
        </View>
      )}

      <Pressable style={styles.fab} onPress={() => navigation.navigate('Home')} hitSlop={8}>
        <Text style={styles.fabGlyph}>+</Text>
      </Pressable>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.paper,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingHorizontal: 24,
    paddingTop: 12,
    paddingBottom: 16,
  },
  headerTitle: {
    fontFamily: fonts.display,
    fontSize: 32,
    color: colors.ink,
  },
  headerDate: {
    fontFamily: fonts.regular,
    fontSize: 13,
    color: colors.soft,
    marginTop: 2,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.sage,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarGlyph: {
    fontFamily: fonts.medium,
    fontSize: 18,
    color: '#FFFFFF',
  },
  content: {
    paddingHorizontal: 24,
    paddingBottom: 100,
  },
  banner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.sageTint,
    borderRadius: 14,
    paddingVertical: 12,
    paddingHorizontal: 16,
    gap: 10,
    marginBottom: 20,
  },
  bannerDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.sage,
  },
  bannerText: {
    fontFamily: fonts.medium,
    fontSize: 14,
    color: colors.ink,
  },
  statsRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 28,
  },
  statCard: {
    flex: 1,
    backgroundColor: colors.card,
    borderWidth: 1.5,
    borderColor: colors.hairline,
    borderRadius: 16,
    paddingVertical: 16,
    alignItems: 'center',
  },
  statLabel: {
    fontFamily: fonts.semiBold,
    fontSize: 11,
    letterSpacing: 0.5,
    textTransform: 'uppercase',
    color: colors.soft,
    marginBottom: 6,
    textAlign: 'center',
  },
  statValue: {
    fontFamily: fonts.bold,
    fontSize: 24,
    color: colors.ink,
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
  recentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.card,
    borderWidth: 1.5,
    borderColor: colors.hairline,
    borderRadius: 14,
    padding: 14,
    marginBottom: 10,
  },
  recentDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: 12,
  },
  recentDetails: {
    flex: 1,
  },
  recentValue: {
    fontFamily: fonts.bold,
    fontSize: 16,
    color: colors.ink,
  },
  recentMeta: {
    fontFamily: fonts.regular,
    fontSize: 13,
    color: colors.soft,
    marginTop: 2,
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 40,
  },
  emptyCircle: {
    width: 72,
    height: 72,
    borderRadius: 36,
    borderWidth: 2,
    borderColor: colors.hairline,
    marginBottom: 20,
  },
  emptyHeading: {
    fontFamily: fonts.display,
    fontSize: 22,
    color: colors.ink,
    marginBottom: 8,
    textAlign: 'center',
  },
  emptySubtext: {
    fontFamily: fonts.regular,
    fontSize: 14,
    color: colors.soft,
    textAlign: 'center',
    lineHeight: 20,
    maxWidth: 260,
  },
  fab: {
    position: 'absolute',
    right: 24,
    bottom: 24,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.deepSage,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: colors.ink,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  fabGlyph: {
    fontFamily: fonts.regular,
    fontSize: 28,
    color: '#FFFFFF',
    lineHeight: 30,
  },
});
