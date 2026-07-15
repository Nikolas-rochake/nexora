import { View, Text, StyleSheet, Pressable, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SPACING } from '@/src/theme';
import { useI18n } from '@/src/context/I18nContext';
import { GoldRule, Eyebrow } from '@/src/components/Premium';

export default function Settings() {
  const router = useRouter();
  const { t, lang, setLang } = useI18n();

  return (
    <SafeAreaView style={styles.container} testID="settings-screen" edges={['top']}>
      <Pressable onPress={() => router.back()} style={styles.back} testID="settings-back-button" hitSlop={12}>
        <Ionicons name="chevron-back" size={22} color={COLORS.ice} />
      </Pressable>

      <ScrollView contentContainerStyle={styles.scroll}>
        <View style={styles.header}>
          <Text style={styles.brand}>NEXORA</Text>
          <Text style={styles.brandSub}>{t('settings').toUpperCase()}</Text>
          <GoldRule width={20} style={{ alignSelf: 'center', marginTop: SPACING.md }} />
        </View>

        <Eyebrow style={{ marginTop: SPACING.xxxl }}>{t('language')}</Eyebrow>
        <View style={styles.langRow}>
          <LangChip active={lang === 'pt'} label="PT" onPress={() => setLang('pt')} testID="settings-lang-pt" />
          <LangChip active={lang === 'en'} label="EN" onPress={() => setLang('en')} testID="settings-lang-en" />
        </View>

        <Eyebrow style={{ marginTop: SPACING.xxxl }}>ARCHIVE</Eyebrow>
        {[
          { key: 'account', label: t('account'), testID: 'settings-account' },
          { key: 'privacy', label: t('privacy'), testID: 'settings-privacy' },
          { key: 'security', label: t('security'), testID: 'settings-security' },
          { key: 'terms', label: t('terms'), testID: 'settings-terms' },
        ].map((row) => (
          <Pressable key={row.key} testID={row.testID} style={styles.linkRow}>
            <Text style={styles.linkLabel}>{row.label.toUpperCase()}</Text>
            <Ionicons name="chevron-forward" size={16} color={COLORS.gold} />
          </Pressable>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

function LangChip({ active, label, onPress, testID }: any) {
  return (
    <Pressable testID={testID} onPress={onPress} style={[styles.langChip, active && styles.langChipActive]}>
      <Text style={[styles.langText, active && styles.langTextActive]}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.bg },
  back: { position: 'absolute', top: 56, left: SPACING.lg, zIndex: 2, padding: 6 },
  scroll: { paddingHorizontal: SPACING.xxl, paddingBottom: SPACING.gallery, paddingTop: SPACING.xl },
  header: { alignItems: 'center' },
  brand: { color: COLORS.ice, fontSize: 14, letterSpacing: 10 },
  brandSub: { color: COLORS.textMuted, fontSize: 9, letterSpacing: 5, marginTop: 8 },
  langRow: { flexDirection: 'row', gap: SPACING.md, marginTop: SPACING.md },
  langChip: {
    flex: 1, borderWidth: 1, borderColor: COLORS.hairlineStrong,
    paddingVertical: 14, alignItems: 'center',
  },
  langChipActive: { borderColor: COLORS.gold, backgroundColor: COLORS.gold },
  langText: { color: COLORS.textDim, letterSpacing: 6, fontSize: 12, paddingLeft: 6 },
  langTextActive: { color: COLORS.bg, fontWeight: '700' },
  linkRow: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingVertical: SPACING.lg,
    borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: COLORS.hairline,
  },
  linkLabel: { color: COLORS.ice, fontSize: 13, letterSpacing: 3 },
});
