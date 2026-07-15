import { View, Text, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS, SPACING } from '@/src/theme';
import { useI18n } from '@/src/context/I18nContext';
import { PremiumButton, GoldRule, Eyebrow } from '@/src/components/Premium';

export default function Welcome() {
  const router = useRouter();
  const { t } = useI18n();

  return (
    <SafeAreaView style={styles.container} testID="welcome-screen">
      <View style={styles.center}>
        <Text style={styles.brand}>NEXORA</Text>
        <GoldRule width={28} style={{ marginTop: SPACING.xl }} />
        <Eyebrow style={styles.eyebrow}>MEMBER · ACCESS</Eyebrow>
        <Text style={styles.title}>{t('welcome_title')}</Text>
        <Text style={styles.subtitle}>{t('welcome_subtitle')}</Text>
      </View>

      <View style={styles.bottom}>
        <PremiumButton
          testID="welcome-enter-button"
          variant="primary"
          label={t('enter')}
          onPress={() => router.push('/login')}
        />
        <Text style={styles.mark}>EST · MMXXVI</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.bg, paddingHorizontal: SPACING.xxl },
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  brand: {
    color: COLORS.ice,
    fontSize: 20,
    letterSpacing: 12,
    fontWeight: '400',
    paddingLeft: 12, // compensate letter-spacing tail so it feels perfectly centered
  },
  eyebrow: { marginTop: SPACING.xl, marginBottom: SPACING.xl },
  title: {
    color: COLORS.ice,
    fontFamily: 'serif',
    fontSize: 34,
    textAlign: 'center',
    fontWeight: '300',
    lineHeight: 42,
    marginTop: SPACING.md,
  },
  subtitle: {
    color: COLORS.textDim,
    fontSize: 12,
    letterSpacing: 3,
    marginTop: SPACING.lg,
    textTransform: 'uppercase',
    textAlign: 'center',
  },
  bottom: { paddingBottom: SPACING.xxxl, alignItems: 'center', gap: SPACING.xxl },
  mark: { color: COLORS.textMuted, letterSpacing: 4, fontSize: 9 },
});
