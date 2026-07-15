import { useState } from 'react';
import { View, Text, StyleSheet, Pressable, Share } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import * as Clipboard from 'expo-clipboard';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SPACING } from '@/src/theme';
import { useI18n } from '@/src/context/I18nContext';
import { useAuth } from '@/src/context/AuthContext';
import { PremiumButton, GoldRule, Eyebrow } from '@/src/components/Premium';

export default function Invites() {
  const router = useRouter();
  const { t } = useI18n();
  const { inviteCode } = useAuth();
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    if (!inviteCode) return;
    await Clipboard.setStringAsync(inviteCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  };

  const share = async () => {
    if (!inviteCode) return;
    try { await Share.share({ message: `NEXORA · ${inviteCode}` }); } catch {}
  };

  return (
    <SafeAreaView style={styles.container} testID="invites-screen" edges={['top']}>
      <Pressable onPress={() => router.back()} style={styles.back} testID="invites-back-button" hitSlop={12}>
        <Ionicons name="chevron-back" size={22} color={COLORS.ice} />
      </Pressable>

      <View style={styles.header}>
        <Text style={styles.brand}>NEXORA</Text>
        <Text style={styles.brandSub}>PRIVATE · INVITATION</Text>
        <GoldRule width={20} style={{ alignSelf: 'center', marginTop: SPACING.md }} />
      </View>

      <View style={styles.stage}>
        <Eyebrow style={{ textAlign: 'center' }}>{t('invite_code')}</Eyebrow>

        <View style={styles.codePlate}>
          <View style={[styles.corner, styles.cornerTL]} />
          <View style={[styles.corner, styles.cornerTR]} />
          <View style={[styles.corner, styles.cornerBL]} />
          <View style={[styles.corner, styles.cornerBR]} />
          <Text style={styles.code} selectable testID="invites-code">
            {inviteCode || '—'}
          </Text>
        </View>

        <Text style={styles.legal}>
          Non-transferable · Single-use per recipient
        </Text>
      </View>

      <View style={styles.actions}>
        <PremiumButton
          testID="invites-copy-button"
          variant="ghost"
          icon={copied ? 'checkmark' : 'copy-outline'}
          label={copied ? t('copied') : t('copy')}
          onPress={copy}
        />
        <PremiumButton
          testID="invites-share-button"
          variant="primary"
          icon="share-outline"
          label={t('share')}
          onPress={share}
        />
      </View>

      <View style={styles.metric}>
        <Text style={styles.metricVal}>00</Text>
        <Text style={styles.metricLabel}>{t('influence_acquired').toUpperCase()}</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.bg, paddingHorizontal: SPACING.xxl },
  back: { position: 'absolute', top: 56, left: SPACING.lg, zIndex: 2, padding: 6 },
  header: { alignItems: 'center', paddingTop: SPACING.xl },
  brand: { color: COLORS.ice, fontSize: 14, letterSpacing: 10 },
  brandSub: { color: COLORS.textMuted, fontSize: 9, letterSpacing: 5, marginTop: 8 },
  stage: { alignItems: 'center', marginTop: SPACING.xxxl },
  codePlate: {
    marginTop: SPACING.lg, padding: SPACING.xxl,
    borderTopWidth: StyleSheet.hairlineWidth, borderBottomWidth: StyleSheet.hairlineWidth, borderColor: COLORS.gold,
    minWidth: '100%',
  },
  corner: { position: 'absolute', width: 10, height: 10, borderColor: COLORS.gold },
  cornerTL: { top: 6, left: 6, borderTopWidth: 1, borderLeftWidth: 1 },
  cornerTR: { top: 6, right: 6, borderTopWidth: 1, borderRightWidth: 1 },
  cornerBL: { bottom: 6, left: 6, borderBottomWidth: 1, borderLeftWidth: 1 },
  cornerBR: { bottom: 6, right: 6, borderBottomWidth: 1, borderRightWidth: 1 },
  code: { color: COLORS.ice, fontSize: 26, letterSpacing: 8, fontFamily: 'serif', textAlign: 'center' },
  legal: { color: COLORS.textMuted, fontSize: 9, letterSpacing: 3, marginTop: SPACING.lg, textTransform: 'uppercase' },
  actions: { gap: SPACING.md, marginTop: SPACING.xxxl },
  metric: { alignItems: 'center', marginTop: SPACING.xxxl },
  metricVal: { color: COLORS.ice, fontSize: 44, fontFamily: 'serif', fontWeight: '300' },
  metricLabel: { color: COLORS.textMuted, fontSize: 9, letterSpacing: 4, marginTop: SPACING.sm },
});
