import { View, Text, StyleSheet, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { COLORS, SPACING } from '@/src/theme';
import { useI18n } from '@/src/context/I18nContext';
import { useAuth } from '@/src/context/AuthContext';
import RelicArt from '@/src/relics/RelicArt';

export default function Discover() {
  const router = useRouter();
  const { t } = useI18n();
  const { userId } = useAuth();

  return (
    <SafeAreaView style={styles.container} testID="discover-screen" edges={['top']}>
      <View style={styles.top}>
        <Text style={styles.brand}>NEXORA</Text>
        <View style={styles.rule} />
        <Text style={styles.title}>{t('discover_relic')}</Text>
      </View>

      <View style={styles.middle}>
        <View style={styles.artFrame}>
          <RelicArt relicKey="apex" size={220} discovered={false} />
        </View>
        <Text style={styles.hint}>{t('tap_to_reveal')}</Text>
      </View>

      <View style={styles.bottom}>
        <Pressable
          testID="discover-reveal-button"
          disabled={!userId}
          onPress={() => router.push('/reveal')}
          style={({ pressed }) => [styles.cta, pressed && { opacity: 0.85 }, !userId && { opacity: 0.4 }]}
        >
          <Text style={styles.ctaText}>{t('reveal_relic')}</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.bg, paddingHorizontal: SPACING.xl },
  top: { alignItems: 'center', paddingTop: SPACING.md },
  brand: { color: COLORS.text, fontSize: 14, letterSpacing: 8 },
  rule: { width: 14, height: 1, backgroundColor: COLORS.gold, marginVertical: SPACING.md },
  title: { color: COLORS.text, fontSize: 24, fontFamily: 'serif', marginTop: SPACING.md, letterSpacing: 1 },
  middle: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  artFrame: {
    width: 280, height: 280, borderRadius: 999,
    borderWidth: 1, borderColor: COLORS.border,
    alignItems: 'center', justifyContent: 'center',
    backgroundColor: COLORS.bgSecondary,
  },
  hint: { color: COLORS.textMuted, marginTop: SPACING.xl, letterSpacing: 3, fontSize: 10 },
  bottom: { paddingBottom: SPACING.xl, alignItems: 'center' },
  cta: {
    backgroundColor: COLORS.gold, paddingVertical: 18, paddingHorizontal: 48,
    borderRadius: 999, minWidth: 260, alignItems: 'center',
  },
  ctaText: { color: COLORS.bg, letterSpacing: 6, fontSize: 13, fontWeight: '700', textAlign: 'center', paddingLeft: 6 },
});
