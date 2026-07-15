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

type IoniconName = React.ComponentProps<typeof Ionicons>['name'];

type TileProps = {
  testID: string;
  label: string;
  icon: IoniconName;
  metric?: string;
  accent?: boolean;
  onPress: () => void;
};

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

  const relicCount = stats?.total_relics ?? 0;
  const invitesCount = stats?.invites_sent ?? 0;

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
            testID="home-tile-discover"
            label={t('discover_relic')}
            icon="add-outline"
            accent
            onPress={() => router.push('/(tabs)/discover')}
          />
          <Tile
            testID="home-tile-collection"
            label={t('my_collection')}
            icon="grid-outline"
            metric={String(relicCount).padStart(2, '0')}
            onPress={() => router.push('/(tabs)/collection')}
          />
          <Tile
            testID="home-tile-registry"
            label={t('world_registry')}
            icon="library-outline"
            onPress={() => router.push('/(tabs)/registry')}
          />
          <Tile
            testID="home-tile-invites"
            label={t('invites')}
            icon="mail-outline"
            metric={String(invitesCount).padStart(2, '0')}
            onPress={() => router.push('/invites')}
          />
        </View>

        <View style={{ height: SPACING.xxxl }} />
      </ScrollView>
    </SafeAreaView>
  );
}

function Tile({ testID, label, icon, metric, accent, onPress }: TileProps) {
  const fg = accent ? COLORS.bg : COLORS.text;
  const dim = accent ? COLORS.bg : COLORS.textMuted;
  return (
    <Pressable
      testID={testID}
      onPress={onPress}
      style={({ pressed }) => [
        styles.tile,
        accent && styles.tileAccent,
        pressed && { opacity: 0.85 },
      ]}
    >
      <View style={styles.tileTop}>
        <View style={[styles.iconBox, accent && styles.iconBoxAccent]}>
          <Ionicons name={icon} size={16} color={accent ? COLORS.bg : COLORS.gold} />
        </View>
        <Ionicons name="arrow-forward" size={14} color={accent ? COLORS.bg : COLORS.gold} />
      </View>
      <View style={styles.tileBottom}>
        {metric !== undefined ? (
          <Text style={[styles.tileMetric, { color: fg }]}>{metric}</Text>
        ) : (
          <View style={{ height: 22 }} />
        )}
        <Text style={[styles.tileLabel, { color: dim }]} numberOfLines={1}>
          {label}
        </Text>
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
    marginTop: SPACING.xl,
    rowGap: SPACING.md,
  },
  tile: {
    width: '48.5%', height: 132,
    borderWidth: 1, borderColor: COLORS.border, borderRadius: 12,
    padding: SPACING.lg, justifyContent: 'space-between',
    backgroundColor: COLORS.bgSecondary,
  },
  tileAccent: { backgroundColor: COLORS.gold, borderColor: COLORS.gold },
  tileTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  iconBox: {
    width: 30, height: 30, borderRadius: 999,
    borderWidth: 1, borderColor: COLORS.border,
    alignItems: 'center', justifyContent: 'center',
    backgroundColor: COLORS.bg,
  },
  iconBoxAccent: { backgroundColor: 'rgba(9,9,9,0.08)', borderColor: 'rgba(9,9,9,0.25)' },
  tileBottom: {},
  tileMetric: { fontSize: 22, fontFamily: 'serif', letterSpacing: 1 },
  tileLabel: { fontSize: 11, letterSpacing: 2, marginTop: 4 },
});
