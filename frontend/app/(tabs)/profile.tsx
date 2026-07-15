import { useCallback, useState } from 'react';
import { View, Text, StyleSheet, Pressable, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useFocusEffect } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SPACING } from '@/src/theme';
import { useI18n } from '@/src/context/I18nContext';
import { useAuth } from '@/src/context/AuthContext';
import { api } from '@/src/context/api';
import { GoldRule, PremiumButton, Eyebrow } from '@/src/components/Premium';
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

  const since = collectorSince
    ? new Date(collectorSince).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: '2-digit' }).toUpperCase()
    : '—';

  return (
    <SafeAreaView style={styles.container} testID="profile-screen" edges={['top']}>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.brand}>NEXORA</Text>
          <Text style={styles.brandSub}>MEMBER · DOSSIER</Text>
        </View>
        <GoldRule width={20} style={styles.headerRule} />

        <View style={styles.identity}>
          <View style={styles.avatarRing}>
            <View style={styles.avatar}>
              <Ionicons name="person-outline" size={36} color={COLORS.gold} />
            </View>
          </View>
          <Text style={styles.name}>{name || '—'}</Text>
          <Text style={styles.location}>{[city, country].filter(Boolean).join(' · ').toUpperCase() || '—'}</Text>
        </View>

        <View style={styles.statsBox}>
          <Stat label={t('collector_since')} value={since} />
          <View style={styles.vline} />
          <Stat label={t('relic_count')} value={String(stats?.total_relics ?? 0).padStart(2, '0')} />
        </View>
        <View style={styles.statsBox}>
          <Stat label={t('influence')} value={String(stats?.influence ?? 0).padStart(2, '0')} />
          <View style={styles.vline} />
          <Stat label={t('invites_sent')} value={String(stats?.invites_sent ?? 0).padStart(2, '0')} />
        </View>

        <Eyebrow style={{ marginTop: SPACING.xxxl, marginBottom: SPACING.lg }}>{t('rarest_relic')}</Eyebrow>
        {rarest ? (
          <Pressable
            testID="profile-rarest-card"
            onPress={() => router.push({ pathname: '/relic/[key]', params: { key: rarest.relic_key } })}
            style={styles.rarestCard}
          >
            <View style={styles.rarestEdge} />
            <View style={{ paddingVertical: SPACING.xl, alignItems: 'center', flex: 1 }}>
              <RelicArt relicKey={rarest.relic_key as RelicKey} size={120} />
              <Text style={styles.rarestName}>{rarest.relic_name}</Text>
              <Text style={styles.rarestSerial}>N° {String(rarest.serial_number).padStart(6, '0')}</Text>
            </View>
          </Pressable>
        ) : (
          <View style={styles.rarestCard}>
            <Text style={{ color: COLORS.textMuted, letterSpacing: 3, padding: SPACING.xl, fontSize: 11 }}>
              {t('empty_collection').toUpperCase()}
            </Text>
          </View>
        )}

        <View style={styles.links}>
          <LinkRow
            testID="profile-invites-link"
            label={t('invites')}
            value={inviteCode || '—'}
            onPress={() => router.push('/invites')}
          />
          <LinkRow
            testID="profile-settings-link"
            label={t('settings')}
            onPress={() => router.push('/settings')}
          />
        </View>

        <PremiumButton
          testID="profile-logout"
          variant="hairline"
          label={t('logout')}
          onPress={async () => { await signOut(); router.replace('/welcome'); }}
          style={{ marginTop: SPACING.xxxl }}
        />
      </ScrollView>
    </SafeAreaView>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.stat}>
      <Text style={styles.statVal}>{value}</Text>
      <Text style={styles.statLabel}>{label.toUpperCase()}</Text>
    </View>
  );
}

function LinkRow({ label, value, onPress, testID }: any) {
  return (
    <Pressable testID={testID} onPress={onPress} style={styles.linkRow}>
      <Text style={styles.linkLabel}>{label}</Text>
      <View style={styles.linkRight}>
        {value ? <Text style={styles.linkValue}>{value}</Text> : null}
        <Ionicons name="chevron-forward" size={16} color={COLORS.gold} />
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.bg },
  scroll: { paddingHorizontal: SPACING.xxl, paddingBottom: SPACING.gallery },
  header: { alignItems: 'center', paddingTop: SPACING.lg },
  brand: { color: COLORS.ice, fontSize: 14, letterSpacing: 10 },
  brandSub: { color: COLORS.textMuted, fontSize: 9, letterSpacing: 5, marginTop: 8 },
  headerRule: { alignSelf: 'center', marginTop: SPACING.md, marginBottom: SPACING.xxl },
  identity: { alignItems: 'center' },
  avatarRing: {
    width: 112, height: 112, borderRadius: 999,
    borderWidth: 1, borderColor: COLORS.goldHairline, padding: 6,
  },
  avatar: {
    flex: 1, borderRadius: 999, borderWidth: 1, borderColor: COLORS.gold,
    alignItems: 'center', justifyContent: 'center', backgroundColor: COLORS.bgSecondary,
  },
  name: { color: COLORS.ice, fontSize: 26, fontFamily: 'serif', fontWeight: '300', marginTop: SPACING.lg, letterSpacing: 2 },
  location: { color: COLORS.gold, fontSize: 10, letterSpacing: 4, marginTop: SPACING.sm },
  statsBox: {
    flexDirection: 'row', marginTop: SPACING.lg, gap: 0,
    borderTopWidth: StyleSheet.hairlineWidth, borderBottomWidth: StyleSheet.hairlineWidth,
    borderColor: COLORS.hairlineStrong,
  },
  stat: { flex: 1, paddingVertical: SPACING.lg, alignItems: 'center' },
  vline: { width: StyleSheet.hairlineWidth, backgroundColor: COLORS.hairlineStrong },
  statVal: { color: COLORS.ice, fontSize: 22, fontFamily: 'serif', fontWeight: '300' },
  statLabel: { color: COLORS.textMuted, fontSize: 9, letterSpacing: 3, marginTop: 4 },
  rarestCard: {
    flexDirection: 'row',
    backgroundColor: COLORS.bgSecondary,
    borderTopWidth: StyleSheet.hairlineWidth, borderBottomWidth: StyleSheet.hairlineWidth,
    borderColor: COLORS.hairlineStrong,
  },
  rarestEdge: { width: 3, backgroundColor: COLORS.gold },
  rarestName: { color: COLORS.ice, fontSize: 20, fontFamily: 'serif', marginTop: SPACING.md, letterSpacing: 3, fontWeight: '300' },
  rarestSerial: { color: COLORS.gold, fontSize: 10, letterSpacing: 4, marginTop: 6 },
  links: { marginTop: SPACING.xxl },
  linkRow: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingVertical: SPACING.lg,
    borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: COLORS.hairline,
  },
  linkLabel: { color: COLORS.ice, fontSize: 14, letterSpacing: 3, textTransform: 'uppercase' },
  linkRight: { flexDirection: 'row', alignItems: 'center', gap: SPACING.md },
  linkValue: { color: COLORS.gold, fontSize: 11, letterSpacing: 3 },
});
