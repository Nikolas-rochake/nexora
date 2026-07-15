import { View, Text, StyleSheet, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SPACING } from '@/src/theme';
import { useI18n } from '@/src/context/I18nContext';

export default function Login() {
  const router = useRouter();
  const { t } = useI18n();

  const openSignup = () => router.push('/signup');

  return (
    <SafeAreaView style={styles.container} testID="login-screen">
      <Pressable onPress={() => router.back()} style={styles.back} testID="login-back-button" hitSlop={12}>
        <Ionicons name="chevron-back" size={22} color={COLORS.text} />
      </Pressable>

      <View style={styles.header}>
        <Text style={styles.brand}>NEXORA</Text>
        <View style={styles.rule} />
        <Text style={styles.title}>{t('enter')}</Text>
      </View>

      <View style={styles.buttons}>
        <Pressable testID="login-apple-button" onPress={openSignup} style={styles.btn}>
          <Ionicons name="logo-apple" size={18} color={COLORS.text} />
          <Text style={styles.btnText}>{t('sign_in_apple')}</Text>
        </Pressable>
        <Pressable testID="login-google-button" onPress={openSignup} style={styles.btn}>
          <Ionicons name="logo-google" size={16} color={COLORS.text} />
          <Text style={styles.btnText}>{t('sign_in_google')}</Text>
        </Pressable>
        <Pressable testID="login-email-button" onPress={openSignup} style={[styles.btn, styles.btnPrimary]}>
          <Ionicons name="mail-outline" size={16} color={COLORS.bg} />
          <Text style={[styles.btnText, { color: COLORS.bg }]}>{t('sign_in_email')}</Text>
        </Pressable>
      </View>

      <View style={styles.footer}>
        <Text style={styles.footerText}>NEXORA — MEMBER'S ARCHIVE</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.bg, paddingHorizontal: SPACING.xl },
  back: { position: 'absolute', top: 56, left: SPACING.lg, zIndex: 2 },
  header: { paddingTop: SPACING.xxxl, alignItems: 'center' },
  brand: { color: COLORS.text, fontSize: 16, letterSpacing: 8 },
  rule: { width: 18, height: 1, backgroundColor: COLORS.gold, marginVertical: SPACING.md },
  title: { color: COLORS.text, fontSize: 28, fontFamily: 'serif', marginTop: SPACING.lg },
  buttons: { flex: 1, justifyContent: 'center', gap: SPACING.md },
  btn: {
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 999,
    paddingVertical: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
  },
  btnPrimary: { backgroundColor: COLORS.gold, borderColor: COLORS.gold },
  btnText: { color: COLORS.text, letterSpacing: 2, fontSize: 13, fontWeight: '500' },
  footer: { paddingBottom: SPACING.xxl, alignItems: 'center' },
  footerText: { color: COLORS.textMuted, letterSpacing: 4, fontSize: 10 },
});
