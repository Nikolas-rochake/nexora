import { useCallback, useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SPACING } from '@/src/theme';
import { useI18n } from '@/src/context/I18nContext';
import { useAuth } from '@/src/context/AuthContext';
import { api, ApiRelic } from '@/src/context/api';
import RelicArt from '@/src/relics/RelicArt';
import { RelicKey } from '@/src/relics/data';

function formatNumber(n: number) {
  return new Intl.NumberFormat('en-US').format(n);
}

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
  const first = firstDiscovery
    ? {
        serial: firstDiscovery.first_serial,
        date: new Date(firstDiscovery.latest_discovered_at),
      }
    : null;

  return (
    <SafeAreaView style={styles.container} testID="relic-detail-screen" edges={['top']}>
      <Pressable onPress={() => router.back()} style={styles.back} testID="relic-back-button" hitSlop={12}>
        <Ionicons name="chevron-back" size={22} color={COLORS.text} />
      </Pressable>

      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <View style={styles.hero}>
          <RelicArt relicKey={data.key as RelicKey} size={240} discovered={owned} />
        </View>

        <Text style={styles.name}>{data.name}</Text>
        <View style={styles.centerRule} />
        {first && (
          <Text style={styles.serial}>#{String(first.serial).padStart(6, '0')}</Text>
        )}

        <Text style={styles.sectionLabel}>{t('description')}</Text>
        <Text style={styles.body}>
          {lang === 'pt' ? data.description_pt : data.description_en}
        </Text>

        <Text style={styles.sectionLabel}>{t('history')}</Text>
        <Text style={styles.body}>
          {lang === 'pt' ? data.history_pt : data.history_en}
        </Text>

        <View style={styles.cert}>
          <Text style={styles.certTitle}>{t('certificate')}</Text>
          <View style={styles.certRule} />
          <Row label={t('max_qty')} value={formatNumber(data.max_supply)} />
          <Row label={t('discovered_qty')} value={formatNumber(data.discovered)} />
          <Row label={t('remaining_qty')} value={formatNumber((data.remaining ?? data.max_supply - data.discovered))} />
          <Row label={t('first_collector')} value={data.first_collector_name || '—'} />
          {owned && name ? <Row label={t('current_collector')} value={name} /> : null}
          {first ? (
            <>
              <Row label={t('discovery_date')} value={first.date.toLocaleDateString()} />
              <Row label={t('discovery_time')} value={first.date.toLocaleTimeString()} />
            </>
          ) : null}
          <Text style={styles.certBody}>{t('certificate_body')}</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.row}>
      <Text style={styles.rowLabel}>{label}</Text>
      <Text style={styles.rowValue}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.bg },
  back: { position: 'absolute', top: 56, left: SPACING.lg, zIndex: 2, padding: 6 },
  scroll: { paddingHorizontal: SPACING.xl, paddingBottom: SPACING.xxxl, paddingTop: SPACING.xxxl },
  hero: { alignItems: 'center', paddingVertical: SPACING.xl, backgroundColor: COLORS.bgSecondary, borderRadius: 20 },
  name: { color: COLORS.text, fontSize: 34, fontFamily: 'serif', textAlign: 'center', marginTop: SPACING.xl, letterSpacing: 2 },
  centerRule: { width: 20, height: 1, backgroundColor: COLORS.gold, alignSelf: 'center', marginVertical: SPACING.md },
  serial: { color: COLORS.gold, textAlign: 'center', letterSpacing: 4, fontSize: 12 },
  sectionLabel: { color: COLORS.textMuted, fontSize: 10, letterSpacing: 3, marginTop: SPACING.xl, marginBottom: SPACING.sm },
  body: { color: COLORS.textDim, fontSize: 14, lineHeight: 22 },
  cert: {
    marginTop: SPACING.xxl, padding: SPACING.xl, borderWidth: 1, borderColor: COLORS.gold,
    borderRadius: 12, backgroundColor: COLORS.bgSecondary,
  },
  certTitle: { color: COLORS.gold, letterSpacing: 4, fontSize: 12, textAlign: 'center' },
  certRule: { width: 20, height: 1, backgroundColor: COLORS.gold, alignSelf: 'center', marginTop: SPACING.md, marginBottom: SPACING.lg },
  row: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: SPACING.sm, borderBottomWidth: 1, borderBottomColor: COLORS.divider },
  rowLabel: { color: COLORS.textMuted, fontSize: 11, letterSpacing: 2 },
  rowValue: { color: COLORS.text, fontSize: 12, letterSpacing: 1 },
  certBody: { color: COLORS.textMuted, fontSize: 11, lineHeight: 18, marginTop: SPACING.lg, textAlign: 'center', fontStyle: 'italic' },
});
