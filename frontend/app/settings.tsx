import { View, Text, StyleSheet, Pressable, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SPACING } from '@/src/theme';
import { useI18n } from '@/src/context/I18nContext';

export default function Settings() {
  const router = useRouter();
  const { t, lang, setLang } = useI18n();

  return (
    <SafeAreaView style={styles.container} testID="settings-screen" edges={['top']}>
      <Pressable onPress={() => router.back()} style={styles.back} testID="settings-back-button" hitSlop={12}>
        <Ionicons name="chevron-back" size={22} color={COLORS.text} />
      </Pressable>

      <ScrollView contentContainerStyle={styles.scroll}>
        <View style={styles.header}>
          <Text style={styles.brand}>NEXORA</Text>
          <View style={styles.rule} />
          <Text style={styles.title}>{t('settings')}</Text>
        </View>

        <Text style={styles.sectionLabel}>{t('language')}</Text>
        <View style={styles.langRow}>
          <Pressable
            testID="settings-lang-pt"
            onPress={() => setLang('pt')}
            style={[styles.langChip, lang === 'pt' && styles.langChipActive]}
          >
            <Text style={[styles.langText, lang === 'pt' && styles.langTextActive]}>PT</Text>
          </Pressable>
          <Pressable
            testID="settings-lang-en"
            onPress={() => setLang('en')}
            style={[styles.langChip, lang === 'en' && styles.langChipActive]}
          >
            <Text style={[styles.langText, lang === 'en' && styles.langTextActive]}>EN</Text>
          </Pressable>
        </View>

        {[
          { key: 'account', label: t('account'), testID: 'settings-account' },
          { key: 'privacy', label: t('privacy'), testID: 'settings-privacy' },
          { key: 'security', label: t('security'), testID: 'settings-security' },
          { key: 'terms', label: t('terms'), testID: 'settings-terms' },
        ].map((row) => (
          <Pressable key={row.key} testID={row.testID} style={styles.linkRow}>
            <Text style={styles.linkLabel}>{row.label}</Text>
            <Ionicons name="chevron-forward" size={18} color={COLORS.gold} />
          </Pressable>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.bg },
  back: { position: 'absolute', top: 56, left: SPACING.lg, zIndex: 2, padding: 6 },
  scroll: { paddingHorizontal: SPACING.xl, paddingBottom: SPACING.xxxl, paddingTop: SPACING.xl },
  header: { alignItems: 'center' },
  brand: { color: COLORS.text, fontSize: 14, letterSpacing: 8 },
  rule: { width: 14, height: 1, backgroundColor: COLORS.gold, marginVertical: SPACING.md },
  title: { color: COLORS.text, fontSize: 24, fontFamily: 'serif', letterSpacing: 1 },
  sectionLabel: { color: COLORS.textMuted, fontSize: 10, letterSpacing: 3, marginTop: SPACING.xxl, marginBottom: SPACING.md },
  langRow: { flexDirection: 'row', gap: SPACING.md },
  langChip: {
    flex: 1, borderWidth: 1, borderColor: COLORS.border, borderRadius: 999,
    paddingVertical: 12, alignItems: 'center',
  },
  langChipActive: { borderColor: COLORS.gold, backgroundColor: COLORS.gold },
  langText: { color: COLORS.textDim, letterSpacing: 4, fontSize: 12 },
  langTextActive: { color: COLORS.bg, fontWeight: '700' },
  linkRow: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingVertical: SPACING.lg, borderBottomWidth: 1, borderBottomColor: COLORS.divider,
  },
  linkLabel: { color: COLORS.text, fontSize: 14, letterSpacing: 2 },
});
