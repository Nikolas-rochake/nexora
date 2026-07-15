import { useState } from 'react';
import { View, Text, StyleSheet, Pressable, Share } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import * as Clipboard from 'expo-clipboard';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SPACING } from '@/src/theme';
import { useI18n } from '@/src/context/I18nContext';
import { useAuth } from '@/src/context/AuthContext';

export default function Invites() {
  const router = useRouter();
  const { t } = useI18n();
  const { inviteCode } = useAuth();
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    if (!inviteCode) return;
    await Clipboard.setStringAsync(inviteCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 1600);
  };

  const share = async () => {
    if (!inviteCode) return;
    try {
      await Share.share({ message: `NEXORA · ${inviteCode}` });
    } catch {}
  };

  return (
    <SafeAreaView style={styles.container} testID="invites-screen" edges={['top']}>
      <Pressable onPress={() => router.back()} style={styles.back} testID="invites-back-button" hitSlop={12}>
        <Ionicons name="chevron-back" size={22} color={COLORS.text} />
      </Pressable>

      <View style={styles.header}>
        <Text style={styles.brand}>NEXORA</Text>
        <View style={styles.rule} />
        <Text style={styles.title}>{t('invites')}</Text>
      </View>

      <View style={styles.codeBox}>
        <Text style={styles.codeLabel}>{t('invite_code')}</Text>
        <Text style={styles.code} selectable testID="invites-code">
          {inviteCode || '—'}
        </Text>
      </View>

      <View style={styles.actions}>
        <Pressable testID="invites-copy-button" onPress={copy} style={styles.actionBtn}>
          <Ionicons name={copied ? 'checkmark' : 'copy-outline'} size={16} color={COLORS.gold} />
          <Text style={styles.actionText}>{copied ? t('copied') : t('copy')}</Text>
        </Pressable>
        <Pressable testID="invites-share-button" onPress={share} style={[styles.actionBtn, styles.actionBtnPrimary]}>
          <Ionicons name="share-outline" size={16} color={COLORS.bg} />
          <Text style={[styles.actionText, { color: COLORS.bg }]}>{t('share')}</Text>
        </Pressable>
      </View>

      <View style={styles.metric}>
        <Text style={styles.metricLabel}>{t('influence_acquired')}</Text>
        <Text style={styles.metricVal}>00</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.bg, paddingHorizontal: SPACING.xl },
  back: { position: 'absolute', top: 56, left: SPACING.lg, zIndex: 2, padding: 6 },
  header: { alignItems: 'center', paddingTop: SPACING.xl },
  brand: { color: COLORS.text, fontSize: 14, letterSpacing: 8 },
  rule: { width: 14, height: 1, backgroundColor: COLORS.gold, marginVertical: SPACING.md },
  title: { color: COLORS.text, fontSize: 24, fontFamily: 'serif', letterSpacing: 1 },
  codeBox: {
    marginTop: SPACING.xxl, padding: SPACING.xl,
    borderWidth: 1, borderColor: COLORS.gold, borderRadius: 12, alignItems: 'center',
    backgroundColor: COLORS.bgSecondary,
  },
  codeLabel: { color: COLORS.textMuted, fontSize: 10, letterSpacing: 3 },
  code: { color: COLORS.text, fontSize: 30, letterSpacing: 6, fontFamily: 'serif', marginTop: SPACING.md },
  actions: { flexDirection: 'row', gap: SPACING.md, marginTop: SPACING.xl },
  actionBtn: {
    flex: 1, flexDirection: 'row', gap: 8, alignItems: 'center', justifyContent: 'center',
    borderWidth: 1, borderColor: COLORS.gold, borderRadius: 999, paddingVertical: 14,
  },
  actionBtnPrimary: { backgroundColor: COLORS.gold },
  actionText: { color: COLORS.gold, letterSpacing: 3, fontSize: 12 },
  metric: {
    marginTop: SPACING.xxxl, alignItems: 'center',
  },
  metricLabel: { color: COLORS.textMuted, fontSize: 10, letterSpacing: 3 },
  metricVal: { color: COLORS.text, fontSize: 48, fontFamily: 'serif', marginTop: SPACING.md },
});
