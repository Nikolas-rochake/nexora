import { useCallback, useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SPACING } from '@/src/theme';
import { useI18n } from '@/src/context/I18nContext';
import { useAuth } from '@/src/context/AuthContext';
import { api, ApiRelic } from '@/src/context/api';
import { GoldRule, Eyebrow } from '@/src/components/Premium';
import RelicArt from '@/src/relics/RelicArt';
import { RelicKey } from '@/src/relics/data';

const nf = new Intl.NumberFormat('en-US');

export default function RelicDetail() {
  const { key } = useLocalSearchParams<{ key: string }>();
  const router = useRouter();
  const { t, lang } = useI18n();
  const { userId, name } = useAuth();
  const [data, setData] = useState<ApiRelic | null>(null);
  const [firstDiscovery, setFirstDiscovery] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    if (!key) return;
    setLoading(true);
    try {
      const d = await api.relicDetail(String(key));
      setData(d);
      if (userId) {
        const cols = await api.collection(userId);
        const first = cols.find((c) => c.relic_key === key);
        setFirstDiscovery(first || null);
      }
    } finally { setLoading(false); }
  }, [key, userId]);

  useEffect(() => { load(); }, [load]);

  if (loading || !data) {
    return (
      <View style={[styles.container, { alignItems: 'center', justifyContent: 'center' }]}>
        <ActivityIndicator color={COLORS.gold} />
      </View>
    );
  }

  const owned = !!firstDiscovery;
  const first = firstDiscovery ? {
    serial: firstDiscovery.first_serial,
    date: new Date(firstDiscovery.latest_discovered_at),
  } : null;

  return (
    <SafeAreaView style={styles.container} testID="relic-detail-screen" edges={['top']}>
      <Pressable onPress={() => router.back()} style={styles.back} testID="relic-back-button" hitSlop={12}>
        <Ionicons name="chevron-back" size={22} color={COLORS.ice} />
      </Pressable>

      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        {/* Certificate frame */}
        <View style={styles.certificate}>
          <View style={styles.certOuter}>
            <View style={styles.certInner}>
              {/* corner accents */}
              <View style={[styles.corner, styles.cornerTL]} />
              <View style={[styles.corner, styles.cornerTR]} />
              <View style={[styles.corner, styles.cornerBL]} />
              <View style={[styles.corner, styles.cornerBR]} />

              <View style={styles.certHeader}>
                <Text style={styles.certBrand}>NEXORA</Text>
                <Text style={styles.certBrandSub}>CERTIFICATE OF AUTHENTICITY</Text>
              </View>

              <GoldRule width={40} style={{ alignSelf: 'center', marginTop: SPACING.lg }} />

              <View style={styles.plateWrap}>
                <RelicArt relicKey={data.key as RelicKey} size={200} discovered={owned} />
              </View>

              <Text style={styles.name}>{data.name}</Text>
              {first ? (
                <Text style={styles.serial}>N° {String(first.serial).padStart(6, '0')}</Text>
              ) : (
                <Text style={[styles.serial, { color: COLORS.textMuted }]}>UNDISCOVERED</Text>
              )}

              <GoldRule width={20} style={{ alignSelf: 'center', marginVertical: SPACING.xl }} />

              <View style={styles.certGrid}>
                <Row label={t('max_qty')} value={nf.format(data.max_supply)} />
                <Row label={t('discovered_qty')} value={nf.format(data.discovered)} />
                <Row label={t('remaining_qty')} value={nf.format(data.remaining ?? data.max_supply - data.discovered)} />
                <Row label={t('first_collector')} value={data.first_collector_name || '—'} />
                {owned && name ? <Row label={t('current_collector')} value={name} /> : null}
                {first ? (
                  <>
                    <Row label={t('discovery_date')} value={first.date.toLocaleDateString()} />
                    <Row label={t('discovery_time')} value={first.date.toLocaleTimeString()} />
                  </>
                ) : null}
              </View>

              <Text style={styles.legal}>{t('certificate_body')}</Text>

              <View style={styles.sealRow}>
                <View style={styles.seal}>
                  <Text style={styles.sealText}>NX</Text>
                </View>
                <View>
                  <Text style={styles.signName}>Nexora Archive</Text>
                  <Text style={styles.signLine}>Curator · Master of Vault</Text>
                </View>
              </View>
            </View>
          </View>
        </View>

        {/* Below-certificate editorial */}
        <View style={styles.article}>
          <Eyebrow>{t('description')}</Eyebrow>
          <Text style={styles.body}>{lang === 'pt' ? data.description_pt : data.description_en}</Text>

          <Eyebrow style={{ marginTop: SPACING.xxl }}>{t('history')}</Eyebrow>
          <Text style={styles.body}>{lang === 'pt' ? data.history_pt : data.history_en}</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.row}>
      <Text style={styles.rowLabel}>{label}</Text>
      <View style={styles.rowDot} />
      <Text style={styles.rowValue} numberOfLines={1}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.bg },
  back: { position: 'absolute', top: 56, left: SPACING.lg, zIndex: 3, padding: 6 },
  scroll: { paddingHorizontal: SPACING.xl, paddingBottom: SPACING.gallery, paddingTop: SPACING.gallery },
  certificate: { backgroundColor: COLORS.bgSecondary, padding: 8, borderWidth: StyleSheet.hairlineWidth, borderColor: COLORS.hairlineStrong },
  certOuter: { borderWidth: 1, borderColor: COLORS.goldHairline, padding: 8 },
  certInner: {
    borderWidth: StyleSheet.hairlineWidth, borderColor: COLORS.gold,
    paddingHorizontal: SPACING.xl, paddingVertical: SPACING.xxl,
    backgroundColor: COLORS.bg,
  },
  corner: {
    position: 'absolute', width: 12, height: 12,
    borderColor: COLORS.gold,
  },
  cornerTL: { top: 8, left: 8, borderTopWidth: 1, borderLeftWidth: 1 },
  cornerTR: { top: 8, right: 8, borderTopWidth: 1, borderRightWidth: 1 },
  cornerBL: { bottom: 8, left: 8, borderBottomWidth: 1, borderLeftWidth: 1 },
  cornerBR: { bottom: 8, right: 8, borderBottomWidth: 1, borderRightWidth: 1 },
  certHeader: { alignItems: 'center' },
  certBrand: { color: COLORS.ice, fontSize: 16, letterSpacing: 10, marginTop: SPACING.md },
  certBrandSub: { color: COLORS.gold, fontSize: 9, letterSpacing: 4, marginTop: 6, fontWeight: '500' },
  plateWrap: { alignItems: 'center', marginTop: SPACING.xl, marginBottom: SPACING.xl },
  name: { color: COLORS.ice, fontSize: 30, fontFamily: 'serif', fontWeight: '300', textAlign: 'center', letterSpacing: 3 },
  serial: { color: COLORS.gold, textAlign: 'center', letterSpacing: 5, fontSize: 11, marginTop: SPACING.sm },
  certGrid: { marginTop: SPACING.md },
  row: {
    flexDirection: 'row', alignItems: 'center', paddingVertical: SPACING.sm, gap: SPACING.sm,
  },
  rowLabel: { color: COLORS.textMuted, fontSize: 10, letterSpacing: 2, textTransform: 'uppercase' },
  rowDot: { flex: 1, height: 1, borderBottomWidth: StyleSheet.hairlineWidth, borderStyle: 'dotted', borderColor: COLORS.hairlineStrong },
  rowValue: { color: COLORS.ice, fontSize: 11, letterSpacing: 1, maxWidth: '55%', textAlign: 'right' },
  legal: {
    color: COLORS.textMuted, fontSize: 10, lineHeight: 16,
    marginTop: SPACING.xl, textAlign: 'center', fontStyle: 'italic', letterSpacing: 0.6,
  },
  sealRow: {
    flexDirection: 'row', alignItems: 'center', gap: SPACING.md,
    marginTop: SPACING.xl, paddingTop: SPACING.lg,
    borderTopWidth: StyleSheet.hairlineWidth, borderTopColor: COLORS.hairline,
  },
  seal: {
    width: 42, height: 42, borderRadius: 999, borderWidth: 1, borderColor: COLORS.gold,
    alignItems: 'center', justifyContent: 'center',
  },
  sealText: { color: COLORS.gold, fontFamily: 'serif', fontSize: 13, letterSpacing: 2 },
  signName: { color: COLORS.ice, fontSize: 12, fontFamily: 'serif' },
  signLine: { color: COLORS.textMuted, fontSize: 9, letterSpacing: 2, marginTop: 2 },
  article: { paddingHorizontal: SPACING.sm, marginTop: SPACING.xxl },
  body: { color: COLORS.textDim, fontSize: 14, lineHeight: 24, marginTop: SPACING.md, letterSpacing: 0.4 },
});
