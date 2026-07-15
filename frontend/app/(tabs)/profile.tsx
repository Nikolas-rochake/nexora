import { useCallback, useState } from 'react';
import { View, Text, StyleSheet, Pressable, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useFocusEffect } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SPACING } from '@/src/theme';
import { useI18n } from '@/src/context/I18nContext';
import { useAuth } from '@/src/context/AuthContext';
import { api } from '@/src/context/api';
import RelicArt from '@/src/relics/RelicArt';
import { RelicKey } from '@/src/relics/data';

export default function Profile() {
  const router = useRouter();
  const { t } = useI18n();
  const { name, city, country, userId, inviteCode, collectorSince, signOut } = useAuth();
  const [stats, setStats] = useState<any>(null);
  const [rarest, setRarest] = useState<any>(null);

  const load = useCallback(async () => {
    if (!userId) return;
    const [s, r] = await Promise.all([api.stats(userId), api.rarest(userId)]);
    setStats(s); setRarest(r);
  }, [userId]);

  useFocusEffect(useCallback(() => { load(); }, [load]));

  const since = collectorSince ? new Date(collectorSince).toLocaleDateString() : '—';

  return (
    <SafeAreaView style={styles.container} testID="profile-screen" edges={['top']}>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.brand}>NEXORA</Text>
          <View style={styles.rule} />
        </View>

        <View style={styles.identity}>
          <View style={styles.avatar}>
            <Ionicons name="person-outline" size={40} color={COLORS.gold} />
          </View>
          <Text style={styles.name}>{name || '—'}</Text>
          <Text style={styles.location}>{[city, country].filter(Boolean).join(' · ')}</Text>
        </View>

        <View style={styles.statsRow}>
          <Stat label={t('collector_since')} value={since} />
          <Stat label={t('influence')} value={String(stats?.influence ?? 0)} />
        </View>
        <View style={styles.statsRow}>
          <Stat label={t('invites_sent')} value={String(stats?.invites_sent ?? 0)} />
          <Stat label={t('relic_count')} value={String(stats?.total_relics ?? 0)} />
        </View>

        <Text style={styles.sectionLabel}>{t('rarest_relic')}</Text>
        {rarest ? (
          <Pressable
            testID="profile-rarest-card"
            onPress={() => router.push({ pathname: '/relic/[key]', params: { key: rarest.relic_key } })}
            style={styles.rarestCard}
          >
            <RelicArt relicKey={rarest.relic_key as RelicKey} size={140} />
            <Text style={styles.rarestName}>{rarest.relic_name}</Text>
            <Text style={styles.rarestSerial}>#{String(rarest.serial_number).padStart(6, '0')}</Text>
          </Pressable>
        ) : (
          <View style={styles.rarestCard}>
            <Text style={{ color: COLORS.textMuted }}>{t('empty_collection')}</Text>
          </View>
        )}

        <Pressable
          testID="profile-invites-link"
          style={styles.linkRow}
          onPress={() => router.push('/invites')}
        >
          <Text style={styles.linkLabel}>{t('invites')}</Text>
          <Text style={styles.linkValue}>{inviteCode || '—'}</Text>
          <Ionicons name="chevron-forward" size={18} color={COLORS.gold} />
        </Pressable>

        <Pressable
          testID="profile-settings-link"
          style={styles.linkRow}
          onPress={() => router.push('/settings')}
        >
          <Text style={styles.linkLabel}>{t('settings')}</Text>
          <Ionicons name="chevron-forward" size={18} color={COLORS.gold} />
        </Pressable>

        <Pressable
          testID="profile-logout"
          style={styles.logout}
          onPress={async () => { await signOut(); router.replace('/welcome'); }}
        >
          <Text style={styles.logoutText}>{t('logout')}</Text>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.stat}>
      <Text style={styles.statVal}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.bg },
  scroll: { paddingHorizontal: SPACING.xl, paddingBottom: SPACING.xxxl },
  header: { alignItems: 'center', paddingTop: SPACING.md },
  brand: { color: COLORS.text, fontSize: 14, letterSpacing: 8 },
  rule: { width: 14, height: 1, backgroundColor: COLORS.gold, marginVertical: SPACING.md },
  identity: { alignItems: 'center', marginTop: SPACING.lg },
  avatar: {
    width: 100, height: 100, borderRadius: 50,
    borderWidth: 1, borderColor: COLORS.gold,
    alignItems: 'center', justifyContent: 'center', backgroundColor: COLORS.bgSecondary,
  },
  name: { color: COLORS.text, fontSize: 24, fontFamily: 'serif', marginTop: SPACING.lg, letterSpacing: 1 },
  location: { color: COLORS.textMuted, fontSize: 12, letterSpacing: 2, marginTop: 4 },
  statsRow: { flexDirection: 'row', gap: SPACING.md, marginTop: SPACING.md },
  stat: {
    flex: 1, borderWidth: 1, borderColor: COLORS.border, borderRadius: 12,
    padding: SPACING.md, backgroundColor: COLORS.bgSecondary,
  },
  statVal: { color: COLORS.text, fontSize: 20, fontFamily: 'serif' },
  statLabel: { color: COLORS.textMuted, fontSize: 10, letterSpacing: 2, marginTop: 4 },
  sectionLabel: { color: COLORS.textMuted, fontSize: 10, letterSpacing: 3, marginTop: SPACING.xl, marginBottom: SPACING.md },
  rarestCard: {
    borderWidth: 1, borderColor: COLORS.border, borderRadius: 12,
    backgroundColor: COLORS.bgSecondary,
    padding: SPACING.lg, alignItems: 'center',
  },
  rarestName: { color: COLORS.text, fontSize: 18, fontFamily: 'serif', marginTop: SPACING.md, letterSpacing: 1 },
  rarestSerial: { color: COLORS.gold, fontSize: 11, letterSpacing: 3, marginTop: 4 },
  linkRow: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingVertical: SPACING.lg, borderBottomWidth: 1, borderBottomColor: COLORS.divider,
    marginTop: SPACING.md,
  },
  linkLabel: { color: COLORS.text, fontSize: 14, letterSpacing: 2, flex: 1 },
  linkValue: { color: COLORS.gold, fontSize: 12, letterSpacing: 3, marginRight: SPACING.md },
  logout: {
    marginTop: SPACING.xxl, borderWidth: 1, borderColor: COLORS.border,
    borderRadius: 999, paddingVertical: 14, alignItems: 'center',
  },
  logoutText: { color: COLORS.textMuted, letterSpacing: 3, fontSize: 12 },
});
