import { useCallback, useEffect, useState } from 'react';
import { View, Text, StyleSheet, Pressable, ActivityIndicator, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useFocusEffect } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SPACING } from '@/src/theme';
import { useI18n } from '@/src/context/I18nContext';
import { useAuth } from '@/src/context/AuthContext';
import { api } from '@/src/context/api';
import { PremiumButton, Eyebrow } from '@/src/components/Premium';
import RelicArt from '@/src/relics/RelicArt';
import { RelicKey } from '@/src/relics/data';

export default function Home() {
  const router = useRouter();
  const { t } = useI18n();
  const { name, userId } = useAuth();
  const [rarest, setRarest] = useState<any>(null);
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    if (!userId) return;
    setLoading(true);
    try {
      const [r, s] = await Promise.all([api.rarest(userId), api.stats(userId)]);
      setRarest(r);
      setStats(s);
    } finally { setLoading(false); }
  }, [userId]);

  useFocusEffect(useCallback(() => { load(); }, [load]));
  useEffect(() => { load(); }, [load]);

  const relicCount = stats?.total_relics ?? 0;

  return (
    <SafeAreaView style={styles.container} testID="home-screen" edges={['top']}>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <View>
            <Text style={styles.brand}>NEXORA</Text>
            <Text style={styles.brandSub}>THE VAULT</Text>
          </View>
          <Pressable onPress={() => router.push('/settings')} testID="home-settings-button" hitSlop={12}>
            <Ionicons name="ellipsis-horizontal" size={20} color={COLORS.textDim} />
          </Pressable>
        </View>

        <View style={styles.identity}>
          <Eyebrow>MEMBER</Eyebrow>
          <Text style={styles.greet}>{name || '—'}</Text>
        </View>

        <View style={styles.divider} />

        <Eyebrow style={{ marginTop: SPACING.xl }}>{t('rarest_relic')}</Eyebrow>

        <View style={styles.hero} testID="home-hero">
          {loading ? (
            <ActivityIndicator color={COLORS.gold} />
          ) : rarest ? (
            <Pressable
              testID="home-hero-relic"
              style={styles.heroPress}
              onPress={() => router.push({ pathname: '/relic/[key]', params: { key: rarest.relic_key } })}
            >
              <View style={styles.pedestal}>
                <View style={styles.pedestalRule} />
                <View style={styles.pedestalGlow} />
                <RelicArt relicKey={rarest.relic_key as RelicKey} size={230} />
              </View>
              <Text style={styles.heroName}>{rarest.relic_name}</Text>
              <View style={styles.heroSerialRow}>
                <View style={styles.serialTick} />
                <Text style={styles.heroSerial}>N° {String(rarest.serial_number).padStart(6, '0')}</Text>
                <View style={styles.serialTick} />
              </View>
            </Pressable>
          ) : (
            <View style={styles.empty}>
              <View style={styles.pedestalRule} />
              <Text style={styles.emptyText}>{t('no_relic_yet')}</Text>
              <PremiumButton
                testID="home-empty-cta"
                variant="ghost"
                label={t('discover_relic')}
                onPress={() => router.push('/(tabs)/discover')}
                fullWidth={false}
                style={{ marginTop: SPACING.xl }}
              />
            </View>
          )}
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerCount}>{String(relicCount).padStart(2, '0')}</Text>
          <Text style={styles.footerLabel}>RELICS · ARCHIVED</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.bg },
  scroll: { paddingHorizontal: SPACING.xxl, paddingBottom: SPACING.gallery },
  header: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingTop: SPACING.lg,
  },
  brand: { color: COLORS.ice, fontSize: 14, letterSpacing: 8 },
  brandSub: { color: COLORS.textMuted, fontSize: 8, letterSpacing: 6, marginTop: 4 },
  identity: { marginTop: SPACING.xxxl },
  greet: {
    color: COLORS.ice, fontSize: 30, fontFamily: 'serif',
    fontWeight: '300', marginTop: SPACING.md, letterSpacing: 0.5,
  },
  divider: { height: 1, backgroundColor: COLORS.hairline, marginTop: SPACING.xl },
  hero: {
    marginTop: SPACING.lg, minHeight: 420, alignItems: 'center', justifyContent: 'center',
  },
  heroPress: { alignItems: 'center', paddingVertical: SPACING.xl },
  pedestal: { alignItems: 'center', justifyContent: 'center' },
  pedestalGlow: {
    position: 'absolute', width: 260, height: 260, borderRadius: 999,
    backgroundColor: COLORS.gold, opacity: 0.05,
  },
  pedestalRule: {
    position: 'absolute', bottom: 6, width: 200, height: 1,
    backgroundColor: COLORS.goldHairline,
  },
  heroName: {
    color: COLORS.ice, fontSize: 28, fontFamily: 'serif', fontWeight: '300',
    marginTop: SPACING.xxl, letterSpacing: 3,
  },
  heroSerialRow: { flexDirection: 'row', alignItems: 'center', marginTop: SPACING.md, gap: SPACING.md },
  serialTick: { width: 14, height: 1, backgroundColor: COLORS.gold },
  heroSerial: { color: COLORS.gold, fontSize: 11, letterSpacing: 4 },
  empty: { alignItems: 'center', paddingVertical: SPACING.gallery },
  emptyText: { color: COLORS.textDim, fontSize: 13, letterSpacing: 3, marginTop: SPACING.xl, textTransform: 'uppercase' },
  footer: { alignItems: 'center', marginTop: SPACING.xxxl },
  footerCount: { color: COLORS.ice, fontSize: 48, fontFamily: 'serif', fontWeight: '300', letterSpacing: 2 },
  footerLabel: { color: COLORS.textMuted, fontSize: 9, letterSpacing: 5, marginTop: SPACING.sm },
});
