import { View, Text, StyleSheet, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS, SPACING } from '@/src/theme';
import { useI18n } from '@/src/context/I18nContext';
import RelicArt from '@/src/relics/RelicArt';

export default function Welcome() {
  const router = useRouter();
  const { t } = useI18n();

  return (
    <SafeAreaView style={styles.container} testID="welcome-screen">
      <View style={styles.top}>
        <Text style={styles.brand}>NEXORA</Text>
        <View style={styles.rule} />
      </View>

      <View style={styles.artWrap}>
        <RelicArt relicKey="genesis" size={220} />
      </View>

      <View style={styles.bottom}>
        <Text style={styles.title}>{t('welcome_title')}</Text>
        <Text style={styles.subtitle}>{t('welcome_subtitle')}</Text>
        <Pressable
          testID="welcome-enter-button"
          onPress={() => router.push('/login')}
          style={({ pressed }) => [styles.cta, pressed && { opacity: 0.8 }]}
        >
          <Text style={styles.ctaText}>{t('enter')}</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.bg, paddingHorizontal: SPACING.xl },
  top: { alignItems: 'center', paddingTop: SPACING.xl },
  brand: { color: COLORS.text, fontSize: 18, letterSpacing: 8, fontWeight: '400' },
  rule: { width: 20, height: 1, backgroundColor: COLORS.gold, marginTop: SPACING.md },
  artWrap: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  bottom: { paddingBottom: SPACING.xxl, alignItems: 'center' },
  title: {
    color: COLORS.text,
    fontFamily: 'serif',
    fontSize: 32,
    textAlign: 'center',
    marginBottom: SPACING.md,
  },
  subtitle: {
    color: COLORS.textMuted,
    fontSize: 14,
    letterSpacing: 2,
    marginBottom: SPACING.xxl,
  },
  cta: {
    borderWidth: 1,
    borderColor: COLORS.gold,
    paddingVertical: 16,
    paddingHorizontal: 64,
    borderRadius: 999,
  },
  ctaText: { color: COLORS.gold, letterSpacing: 4, fontSize: 12, fontWeight: '600' },
});
