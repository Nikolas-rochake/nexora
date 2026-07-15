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

  // Suspense/search dot pulse (before reveal)
  const searchPulse = useRef(new Animated.Value(0)).current;

  // Vertical gold slash
  const slashScaleY = useRef(new Animated.Value(0)).current;
  const slashOpacity = useRef(new Animated.Value(0)).current;
  const slashScaleX = useRef(new Animated.Value(0)).current;

  // Relic materialization (scale + opacity, NO rotation)
  const artScale = useRef(new Animated.Value(0.02)).current;
  const artOp = useRef(new Animated.Value(0)).current;
  const artBreath = useRef(new Animated.Value(0)).current;

  // Text cascade
  const nameOp = useRef(new Animated.Value(0)).current;
  const nameY = useRef(new Animated.Value(-14)).current;
  const serialOp = useRef(new Animated.Value(0)).current;
  const serialY = useRef(new Animated.Value(-8)).current;
  const descOp = useRef(new Animated.Value(0)).current;
  const actionsOp = useRef(new Animated.Value(0)).current;
  const actionsY = useRef(new Animated.Value(20)).current;

  useEffect(() => {
    // Loop the search pulse while waiting for API/animation
    Animated.loop(
      Animated.sequence([
        Animated.timing(searchPulse, { toValue: 1, duration: 800, easing: Easing.inOut(Easing.quad), useNativeDriver: true }),
        Animated.timing(searchPulse, { toValue: 0, duration: 800, easing: Easing.inOut(Easing.quad), useNativeDriver: true }),
      ])
    ).start();

    let cancelled = false;

    const run = async () => {
      if (!userId) return;
      try {
        const r = await api.discover(userId);
        if (cancelled) return;

        // Fetch detail in parallel with the drama
        api.relicDetail(r.discovery.relic_key)
          .then((d) => { if (!cancelled) setDetail(d); })
          .catch(() => {});

        // 1.2s dramatic pause (search dot pulses) BEFORE reveal begins
        setTimeout(() => {
          if (cancelled) return;
          setResult(r);

          // Slow, cinematic sequence — NO rotation
          Animated.sequence([
            // (1) Vertical gold slash appears — sudden, then hairline widens
            Animated.parallel([
              Animated.timing(slashOpacity, { toValue: 1, duration: 120, useNativeDriver: true }),
              Animated.timing(slashScaleY, { toValue: 1, duration: 380, easing: Easing.out(Easing.cubic), useNativeDriver: true }),
            ]),
            Animated.delay(240),

            // (2) Slash expands horizontally into subtle spotlight rails
            Animated.timing(slashScaleX, { toValue: 1, duration: 900, easing: Easing.inOut(Easing.cubic), useNativeDriver: true }),

            // (3) Relic materializes: scale up slowly with fade-in
            Animated.parallel([
              Animated.timing(artOp, { toValue: 1, duration: 1400, easing: Easing.out(Easing.quad), useNativeDriver: true }),
              Animated.timing(artScale, { toValue: 1, duration: 2200, easing: Easing.out(Easing.cubic), useNativeDriver: true }),
            ]),

            // (5) Dramatic hold — 1s pause for viewer to absorb
            Animated.delay(1000),

            // (6) Text cascade: name drops from above
            Animated.parallel([
              Animated.timing(nameOp, { toValue: 1, duration: 620, easing: Easing.out(Easing.cubic), useNativeDriver: true }),
              Animated.timing(nameY, { toValue: 0, duration: 620, easing: Easing.out(Easing.cubic), useNativeDriver: true }),
            ]),
            Animated.parallel([
              Animated.timing(serialOp, { toValue: 1, duration: 520, easing: Easing.out(Easing.cubic), useNativeDriver: true }),
              Animated.timing(serialY, { toValue: 0, duration: 520, easing: Easing.out(Easing.cubic), useNativeDriver: true }),
            ]),
            Animated.timing(descOp, { toValue: 1, duration: 520, useNativeDriver: true }),

            // (7) Action buttons rise from below
            Animated.parallel([
              Animated.timing(actionsOp, { toValue: 1, duration: 500, useNativeDriver: true }),
              Animated.timing(actionsY, { toValue: 0, duration: 500, easing: Easing.out(Easing.cubic), useNativeDriver: true }),
            ]),
          ]).start(() => {
            // Very subtle breathing on the Relic — barely perceptible
            Animated.loop(
              Animated.sequence([
                Animated.timing(artBreath, { toValue: 1, duration: 3400, easing: Easing.inOut(Easing.quad), useNativeDriver: true }),
                Animated.timing(artBreath, { toValue: 0, duration: 3400, easing: Easing.inOut(Easing.quad), useNativeDriver: true }),
              ])
            ).start();
          });
        }, 1200);
      } catch (e: any) {
        if (!cancelled) setError(e?.message || 'error');
      }
    };
    run();
    return () => { cancelled = true; };
  }, [userId]);

  const searchOpacity = searchPulse.interpolate({ inputRange: [0, 1], outputRange: [0.25, 1] });

  const slashHeight = slashScaleY.interpolate({ inputRange: [0, 1], outputRange: [0, 380] });
  const slashWidth = slashScaleX.interpolate({ inputRange: [0, 1], outputRange: [1, 300] });
  const slashInnerOpacity = slashScaleX.interpolate({ inputRange: [0, 0.5, 1], outputRange: [1, 0.3, 0] });

  const breathScale = artBreath.interpolate({ inputRange: [0, 1], outputRange: [1, 1.015] });

  return (
    <SafeAreaView style={styles.container} testID="reveal-screen" edges={['top']}>
      <Pressable style={styles.close} onPress={() => router.back()} testID="reveal-close-button" hitSlop={12}>
        <Ionicons name="close" size={22} color={COLORS.ice} />
      </Pressable>

      <View style={styles.stage}>
        {/* Search dot — visible only before result */}
        {!result && !error && (
          <View style={styles.searchWrap}>
            <Animated.View style={[styles.searchDot, { opacity: searchOpacity }]} />
            <Animated.Text style={[styles.searchText, { opacity: searchOpacity }]}>
              SEARCHING · THE · VAULT
            </Animated.Text>
          </View>
        )}

        {/* Vertical gold slash → museum spotlight rails (very subtle) */}
        <Animated.View
          style={[
            styles.slash,
            {
              opacity: slashOpacity,
              height: slashHeight as unknown as number,
              width: slashWidth as unknown as number,
            },
          ]}
          pointerEvents="none"
        >
          <Animated.View style={[styles.slashInner, { opacity: slashInnerOpacity }]} />
        </Animated.View>

        {/* Relic — pure PNG, no background, no rotation */}
        {error ? (
          <Text style={{ color: '#E57373' }}>{error}</Text>
        ) : result ? (
          <Animated.View
            style={{
              opacity: artOp,
              transform: [{ scale: Animated.multiply(artScale, breathScale) }],
            }}
          >
            <RelicArt relicKey={result.discovery.relic_key as RelicKey} size={280} />
          </Animated.View>
        ) : null}

        {/* Loading state (before slash) — hidden after result arrives */}
        {!result && !error && (
          <ActivityIndicator style={styles.spinner} color={COLORS.gold} />
        )}
      </View>

      {result && (
        <View style={styles.meta}>
          <Animated.Text style={[styles.name, { opacity: nameOp, transform: [{ translateY: nameY }] }]}>
            {result.discovery.relic_name}
          </Animated.Text>
          <Animated.View style={[styles.serialRow, { opacity: serialOp, transform: [{ translateY: serialY }] }]}>
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

      <Animated.View style={[styles.actions, { opacity: actionsOp, transform: [{ translateY: actionsY }] }]}>
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
  close: { position: 'absolute', top: 56, right: SPACING.lg, zIndex: 5, padding: 6 },
  stage: {
    flex: 1, alignItems: 'center', justifyContent: 'center',
    overflow: 'hidden',
  },
  // Search state
  searchWrap: { position: 'absolute', alignItems: 'center' },
  searchDot: { width: 4, height: 4, borderRadius: 999, backgroundColor: COLORS.gold, marginBottom: SPACING.md },
  searchText: { color: COLORS.gold, letterSpacing: 6, fontSize: 10, paddingLeft: 6 },
  spinner: { position: 'absolute', bottom: 40, opacity: 0 },
  // Vertical spotlight rails — barely visible framing marks
  slash: {
    position: 'absolute',
    alignItems: 'center', justifyContent: 'center',
    borderLeftWidth: StyleSheet.hairlineWidth,
    borderRightWidth: StyleSheet.hairlineWidth,
    borderColor: 'rgba(201,169,97,0.28)',
  },
  slashInner: {
    width: 1, height: '100%', backgroundColor: COLORS.gold,
  },
  meta: { alignItems: 'center', paddingHorizontal: SPACING.md, minHeight: 130 },
  name: {
    color: COLORS.ice, fontSize: 36, fontFamily: 'serif', fontWeight: '300',
    letterSpacing: 3, textAlign: 'center',
  },
  serialRow: { flexDirection: 'row', alignItems: 'center', marginTop: SPACING.md, gap: SPACING.md },
  tick: { width: 14, height: 1, backgroundColor: COLORS.gold },
  serial: { color: COLORS.gold, fontSize: 11, letterSpacing: 5 },
  desc: { color: COLORS.textDim, fontSize: 13, textAlign: 'center', marginTop: SPACING.lg, lineHeight: 22, letterSpacing: 0.4 },
  firstBadgeWrap: {
    marginTop: SPACING.lg,
    borderWidth: 1, borderColor: COLORS.gold,
    paddingHorizontal: 14, paddingVertical: 6, borderRadius: 999,
  },
  firstBadge: { color: COLORS.gold, letterSpacing: 5, fontSize: 9, fontWeight: '600', paddingLeft: 5 },
  actions: { paddingBottom: SPACING.xxl, paddingTop: SPACING.xl, gap: SPACING.md },
});
