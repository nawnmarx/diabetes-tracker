import { Edge, SafeAreaView } from 'react-native-safe-area-context';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { colors, fonts } from '../constants/theme';

interface Props {
  title: string;
  onBack?: () => void;
  edges?: Edge[];
}

export default function ComingSoonScreen({ title, onBack, edges = ['top', 'bottom'] }: Props) {
  return (
    <SafeAreaView style={styles.safeArea} edges={edges}>
      {onBack && (
        <Pressable onPress={onBack} style={styles.backRow} hitSlop={8}>
          <Text style={styles.backText}>‹ Back</Text>
        </Pressable>
      )}
      <View style={styles.center}>
        <Text style={styles.heading}>{title}</Text>
        <Text style={styles.subtext}>Coming soon</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.paper,
  },
  backRow: {
    paddingHorizontal: 24,
    paddingTop: 12,
  },
  backText: {
    fontFamily: fonts.medium,
    fontSize: 15,
    color: colors.sage,
  },
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  heading: {
    fontFamily: fonts.display,
    fontSize: 24,
    color: colors.ink,
    marginBottom: 6,
  },
  subtext: {
    fontFamily: fonts.regular,
    fontSize: 14,
    color: colors.soft,
  },
});
