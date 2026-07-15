import { useCallback, useEffect, useState } from 'react';
import { View, Text, StyleSheet, Pressable, ScrollView, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useFocusEffect } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SPACING } from '@/src/theme';
import { useI18n } from '@/src/context/I18nContext';
import { useAuth } from '@/src/context/AuthContext';
import { api } from '@/src/context/api';
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
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useFocusEffect(useCallback(() => { load(); }, [load]));
  useEffect(() => { load(); }, [load]);

  return (
    <SafeAreaView style={styles.container} testID="home-screen" edges={['top']}>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <View>
            <Text style={styles.brand}>NEXORA</Text>
            <View style={styles.rule} />
          </View>
          <Pressable onPress={() => router.push('/settings')} testID="home-settings-button" hitSlop={12}>
            <Ionicons name="ellipsis-horizontal" size={22} color={COLORS.text} />
          </Pressable>
        </View>

        <Text style={styles.greet}>{name ? name.split(' ')[0] : ''}</Text>
        <Text style={styles.sectionLabel}>{t('rarest_relic')}</Text>

        <View style={styles.hero}>
          {loading ? (
            <ActivityIndicator color={COLORS.gold} />
          ) : rarest ? (
            <Pressable
              testID="home-hero-relic"
              style={{ alignItems: 'center' }}
              onPress={() => router.push({ pathname: '/relic/[key]', params: { key: rarest.relic_key } })}
            >
              <RelicArt relicKey={rarest.relic_key as RelicKey} size={200} />
              <Text style={styles.heroName}>{rarest.relic_name}</Text>
              <Text style={styles.heroSerial}>#{String(rarest.serial_number).padStart(6, '0')}</Text>
            </Pressable>
          ) : (
            <Pressable
              testID="home-empty-cta"
              onPress={() => router.push('/(tabs)/discover')}
              style={styles.empty}
            >
              <Text style={styles.emptyText}>{t('no_relic_yet')}</Text>
              <Text style={styles.emptyArrow}>→</Text>
            </Pressable>
          )}
        </View>

        <View style={styles.grid}>
          <Tile
            testID="home-tile-collection"
            label={t('my_collection')}
            count={stats?.total_relics ?? 0}
            onPress={() => router.push('/(tabs)/collection')}
          />
          <Tile
            testID="home-tile-discover"
            label={t('discover_relic')}
            accent
            onPress={() => router.push('/(tabs)/discover')}
          />
          <Tile
            testID="home-tile-invites"
            label={t('invites')}
            count={stats?.invites_sent ?? 0}
            onPress={() => router.push('/invites')}
          />
          <Tile
            testID="home-tile-registry"
            label={t('world_registry')}
            onPress={() => router.push('/(tabs)/registry')}
          />
        </View>

        <View style={{ height: SPACING.xxxl }} />
      </ScrollView>
    </SafeAreaView>
  );
}

function Tile({ label, count, accent, onPress, testID }: any) {
  return (
    <Pressable
      testID={testID}
      onPress={onPress}
      style={[styles.tile, accent && styles.tileAccent]}
    >
      {count !== undefined && (
        <Text style={[styles.tileCount, accent && { color: COLORS.bg }]}>
          {String(count).padStart(2, '0')}
        </Text>
      )}
      <Text style={[styles.tileLabel, accent && { color: COLORS.bg }]}>{label}</Text>
      <View style={styles.tileArrow}>
        <Ionicons name="arrow-forward" size={14} color={accent ? COLORS.bg : COLORS.gold} />
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.bg },
  scroll: { paddingHorizontal: SPACING.xl },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingTop: SPACING.md },
  brand: { color: COLORS.text, fontSize: 14, letterSpacing: 8 },
  rule: { width: 14, height: 1, backgroundColor: COLORS.gold, marginTop: 6 },
  greet: { color: COLORS.text, fontSize: 32, fontFamily: 'serif', marginTop: SPACING.xl },
  sectionLabel: { color: COLORS.textMuted, fontSize: 10, letterSpacing: 3, marginTop: SPACING.md },
  hero: {
    marginTop: SPACING.xl,
    borderWidth: 1, borderColor: COLORS.border, borderRadius: 20,
    backgroundColor: COLORS.bgSecondary,
    minHeight: 300, alignItems: 'center', justifyContent: 'center', padding: SPACING.xl,
  },
  heroName: { color: COLORS.text, fontSize: 22, fontFamily: 'serif', marginTop: SPACING.md, letterSpacing: 1 },
  heroSerial: { color: COLORS.gold, fontSize: 12, letterSpacing: 4, marginTop: 6 },
  empty: { alignItems: 'center', flexDirection: 'row', gap: 12 },
  emptyText: { color: COLORS.textDim, fontSize: 14, letterSpacing: 2 },
  emptyArrow: { color: COLORS.gold, fontSize: 20 },
  grid: {
    flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between',
    marginTop: SPACING.xl, gap: SPACING.md,
  },
  tile: {
    width: '48%', minHeight: 118,
    borderWidth: 1, borderColor: COLORS.border, borderRadius: 12,
    padding: SPACING.lg, justifyContent: 'space-between',
    backgroundColor: COLORS.bgSecondary,
  },
  tileAccent: { backgroundColor: COLORS.gold, borderColor: COLORS.gold },
  tileCount: { color: COLORS.text, fontSize: 28, fontFamily: 'serif' },
  tileLabel: { color: COLORS.textDim, fontSize: 11, letterSpacing: 2, marginTop: SPACING.md },
  tileArrow: { position: 'absolute', top: SPACING.lg, right: SPACING.lg },
});
