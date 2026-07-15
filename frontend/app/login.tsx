import { View, Text, StyleSheet, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SPACING } from '@/src/theme';
import { useI18n } from '@/src/context/I18nContext';
import { PremiumButton, GoldRule, Eyebrow } from '@/src/components/Premium';

export default function Login() {
  const router = useRouter();
  const { t } = useI18n();
  const openSignup = () => router.push('/signup');

  return (
    <SafeAreaView style={styles.container} testID="login-screen">
      <Pressable onPress={() => router.back()} style={styles.back} testID="login-back-button" hitSlop={12}>
        <Ionicons name="chevron-back" size={22} color={COLORS.ice} />
      </Pressable>

      <View style={styles.header}>
        <Text style={styles.brand}>NEXORA</Text>
        <GoldRule width={16} style={{ marginTop: SPACING.md }} />
        <Eyebrow style={{ marginTop: SPACING.xxl }}>MEMBER · ACCESS</Eyebrow>
        <Text style={styles.title}>{t('enter')}</Text>
      </View>

      <View style={styles.buttons}>
        <PremiumButton
          testID="login-apple-button"
          variant="ghost"
          icon="logo-apple"
          label={t('sign_in_apple')}
          onPress={openSignup}
        />
        <PremiumButton
          testID="login-google-button"
          variant="ghost"
          icon="logo-google"
          label={t('sign_in_google')}
          onPress={openSignup}
        />
        <PremiumButton
          testID="login-email-button"
          variant="primary"
          icon="mail-outline"
          label={t('sign_in_email')}
          onPress={openSignup}
        />
      </View>

      <View style={styles.footer}>
        <Text style={styles.footerText}>NEXORA {'\u00B7'} MEMBER{'\u2019'}S ARCHIVE</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.bg, paddingHorizontal: SPACING.xxl },
  back: { position: 'absolute', top: 56, left: SPACING.lg, zIndex: 2, padding: 6 },
  header: { paddingTop: SPACING.xxxl, alignItems: 'center' },
  brand: { color: COLORS.ice, fontSize: 14, letterSpacing: 10 },
  title: { color: COLORS.ice, fontSize: 32, fontFamily: 'serif', marginTop: SPACING.md, fontWeight: '300' },
  buttons: { flex: 1, justifyContent: 'center', gap: SPACING.md },
  footer: { paddingBottom: SPACING.xxl, alignItems: 'center' },
  footerText: { color: COLORS.textMuted, letterSpacing: 4, fontSize: 9 },
});
