import { useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet, Pressable, Animated, Easing, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SPACING } from '@/src/theme';
import { useI18n } from '@/src/context/I18nContext';
import { useAuth } from '@/src/context/AuthContext';
import { api, ApiDiscoverResponse, ApiRelic } from '@/src/context/api';
import { PremiumButton } from '@/src/components/Premium';
import RelicArt from '@/src/relics/RelicArt';
import { RelicKey } from '@/src/relics/data';

export default function Reveal() {
  const router = useRouter();
  const { t, lang } = useI18n();
  const { userId } = useAuth();

  const [result, setResult] = useState<ApiDiscoverResponse | null>(null);
  const [detail, setDetail] = useState<ApiRelic | null>(null);
  const [error, setError] = useState<string | null>(null);

  const doors = useRef(new Animated.Value(0)).current;    // vault door split
  const glow = useRef(new Animated.Value(0)).current;
  const artScale = useRef(new Animated.Value(0.6)).current;
  const artOp = useRef(new Animated.Value(0)).current;
  const artRot = useRef(new Animated.Value(0)).current;
  const nameOp = useRef(new Animated.Value(0)).current;
  const serialOp = useRef(new Animated.Value(0)).current;
  const descOp = useRef(new Animated.Value(0)).current;
  const actionsOp = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    let cancelled = false;
    const run = async () => {
      if (!userId) return;
      try {
        const r = await api.discover(userId);
        if (cancelled) return;
        setResult(r);
        try {
          const d = await api.relicDetail(r.discovery.relic_key);
          if (!cancelled) setDetail(d);
        } catch {}

        // Slow cinematic vault sequence
        Animated.sequence([
          // 1. doors open (slow)
          Animated.timing(doors, { toValue: 1, duration: 1600, easing: Easing.inOut(Easing.cubic), useNativeDriver: true }),
          // 2. glow ignites + relic rises & rotates (parallel)
          Animated.parallel([
            Animated.timing(glow, { toValue: 1, duration: 1800, easing: Easing.out(Easing.quad), useNativeDriver: true }),
            Animated.timing(artOp, { toValue: 1, duration: 1400, easing: Easing.out(Easing.quad), useNativeDriver: true }),
            Animated.timing(artScale, { toValue: 1, duration: 2400, easing: Easing.out(Easing.cubic), useNativeDriver: true }),
            Animated.timing(artRot, { toValue: 1, duration: 5200, easing: Easing.inOut(Easing.cubic), useNativeDriver: true }),
          ]),
          // 3. metadata cascades
          Animated.timing(nameOp, { toValue: 1, duration: 700, useNativeDriver: true }),
          Animated.timing(serialOp, { toValue: 1, duration: 700, useNativeDriver: true }),
          Animated.timing(descOp, { toValue: 1, duration: 700, useNativeDriver: true }),
          Animated.timing(actionsOp, { toValue: 1, duration: 500, useNativeDriver: true }),
        ]).start();
      } catch (e: any) {
        if (!cancelled) setError(e?.message || 'error');
      }
    };
    run();
    return () => { cancelled = true; };
  }, [userId, doors, glow, artScale, artOp, artRot, nameOp, serialOp, descOp, actionsOp]);

  const leftDoor = doors.interpolate({ inputRange: [0, 1], outputRange: [0, -220] });
  const rightDoor = doors.interpolate({ inputRange: [0, 1], outputRange: [0, 220] });
  const glowScale = glow.interpolate({ inputRange: [0, 1], outputRange: [0.8, 1.4] });
  const glowOpacity = glow.interpolate({ inputRange: [0, 1], outputRange: [0, 0.5] });
  const spin = artRot.interpolate({ inputRange: [0, 1], outputRange: ['0deg', '340deg'] });

  return (
    <SafeAreaView style={styles.container} testID="reveal-screen" edges={['top']}>
      <Pressable style={styles.close} onPress={() => router.back()} testID="reveal-close-button" hitSlop={12}>
        <Ionicons name="close" size={22} color={COLORS.ice} />
      </Pressable>

      <View style={styles.stage}>
        {/* Backdrop glow */}
        <Animated.View
          style={[
            styles.glow,
            { opacity: glowOpacity, transform: [{ scale: glowScale }] },
          ]}
        />

        {/* Relic art */}
        {error ? (
          <Text style={{ color: '#E57373' }}>{error}</Text>
        ) : !result ? (
          <ActivityIndicator color={COLORS.gold} />
        ) : (
          <Animated.View
            style={{
              opacity: artOp,
              transform: [{ scale: artScale }, { rotate: spin }],
            }}
          >
            <RelicArt relicKey={result.discovery.relic_key as RelicKey} size={260} />
          </Animated.View>
        )}

        {/* Vault doors sliding open */}
        <Animated.View style={[styles.door, styles.doorLeft, { transform: [{ translateX: leftDoor }] }]}>
          <View style={styles.doorSeam} />
        </Animated.View>
        <Animated.View style={[styles.door, styles.doorRight, { transform: [{ translateX: rightDoor }] }]}>
          <View style={styles.doorSeam} />
        </Animated.View>
      </View>

      {result && (
        <View style={styles.meta}>
          <Animated.Text style={[styles.name, { opacity: nameOp }]}>
            {result.discovery.relic_name}
          </Animated.Text>
          <Animated.View style={[styles.serialRow, { opacity: serialOp }]}>
            <View style={styles.tick} />
            <Text style={styles.serial}>
              N° {String(result.discovery.serial_number).padStart(6, '0')} · {result.relic.discovered}/{result.relic.max_supply}
            </Text>
            <View style={styles.tick} />
          </Animated.View>
          {detail && (
            <Animated.Text style={[styles.desc, { opacity: descOp }]} numberOfLines={3}>
              {lang === 'pt' ? detail.description_pt : detail.description_en}
            </Animated.Text>
          )}
          {result.is_first_collector && (
            <Animated.View style={[styles.firstBadgeWrap, { opacity: descOp }]}>
              <Text style={styles.firstBadge}>FIRST · COLLECTOR</Text>
            </Animated.View>
          )}
        </View>
      )}

      <Animated.View style={[styles.actions, { opacity: actionsOp }]}>
        {result && (
          <>
            <PremiumButton
              testID="reveal-details-button"
              variant="primary"
              label={t('view_details')}
              onPress={() => router.replace({ pathname: '/relic/[key]', params: { key: result.discovery.relic_key } })}
            />
            <PremiumButton
              testID="reveal-again-button"
              variant="ghost"
              label={t('reveal_again')}
              onPress={() => router.replace('/(tabs)/discover')}
            />
          </>
        )}
      </Animated.View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#050505', paddingHorizontal: SPACING.xxl },
  close: { position: 'absolute', top: 56, right: SPACING.lg, zIndex: 3, padding: 6 },
  stage: {
    flex: 1, alignItems: 'center', justifyContent: 'center',
    overflow: 'hidden',
  },
  glow: {
    position: 'absolute', width: 360, height: 360, borderRadius: 999,
    backgroundColor: COLORS.gold,
  },
  door: {
    position: 'absolute', top: 0, bottom: 0, width: '55%',
    backgroundColor: '#0A0A0A',
    borderColor: COLORS.goldHairline,
  },
  doorLeft: { left: 0, borderRightWidth: StyleSheet.hairlineWidth, alignItems: 'flex-end' },
  doorRight: { right: 0, borderLeftWidth: StyleSheet.hairlineWidth, alignItems: 'flex-start' },
  doorSeam: {
    width: 1, height: '100%', backgroundColor: COLORS.gold, opacity: 0.15,
  },
  meta: { alignItems: 'center', paddingHorizontal: SPACING.md, minHeight: 120 },
  name: {
    color: COLORS.ice, fontSize: 34, fontFamily: 'serif', fontWeight: '300',
    letterSpacing: 3, textAlign: 'center',
  },
  serialRow: { flexDirection: 'row', alignItems: 'center', marginTop: SPACING.md, gap: SPACING.md },
  tick: { width: 12, height: 1, backgroundColor: COLORS.gold },
  serial: { color: COLORS.gold, fontSize: 11, letterSpacing: 4 },
  desc: { color: COLORS.textDim, fontSize: 13, textAlign: 'center', marginTop: SPACING.lg, lineHeight: 22, letterSpacing: 0.4 },
  firstBadgeWrap: {
    marginTop: SPACING.lg,
    borderWidth: 1, borderColor: COLORS.gold,
    paddingHorizontal: 14, paddingVertical: 6, borderRadius: 999,
  },
  firstBadge: { color: COLORS.gold, letterSpacing: 5, fontSize: 9, fontWeight: '600' },
  actions: { paddingBottom: SPACING.xxl, paddingTop: SPACING.xl, gap: SPACING.md },
});
