import { useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet, Pressable, Animated, Easing, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SPACING } from '@/src/theme';
import { useI18n } from '@/src/context/I18nContext';
import { useAuth } from '@/src/context/AuthContext';
import { api, ApiDiscoverResponse, ApiRelic } from '@/src/context/api';
import RelicArt from '@/src/relics/RelicArt';
import { RelicKey } from '@/src/relics/data';

export default function Reveal() {
  const router = useRouter();
  const { t, lang } = useI18n();
  const { userId } = useAuth();

  const [result, setResult] = useState<ApiDiscoverResponse | null>(null);
  const [detail, setDetail] = useState<ApiRelic | null>(null);
  const [error, setError] = useState<string | null>(null);

  const artScale = useRef(new Animated.Value(0.4)).current;
  const artOpacity = useRef(new Animated.Value(0)).current;
  const rotate = useRef(new Animated.Value(0)).current;
  const glow = useRef(new Animated.Value(0)).current;
  const nameOp = useRef(new Animated.Value(0)).current;
  const serialOp = useRef(new Animated.Value(0)).current;
  const descOp = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    let cancelled = false;
    const run = async () => {
      if (!userId) return;
      try {
        const r = await api.discover(userId);
        if (cancelled) return;
        setResult(r);
        // fetch detail (for description/history)
        try {
          const d = await api.relicDetail(r.discovery.relic_key);
          if (!cancelled) setDetail(d);
        } catch {}

        Animated.sequence([
          Animated.parallel([
            Animated.timing(artOpacity, { toValue: 1, duration: 900, useNativeDriver: true }),
            Animated.timing(artScale, { toValue: 1, duration: 1400, easing: Easing.out(Easing.cubic), useNativeDriver: true }),
            Animated.timing(rotate, { toValue: 1, duration: 2400, easing: Easing.out(Easing.cubic), useNativeDriver: true }),
            Animated.timing(glow, { toValue: 1, duration: 1600, useNativeDriver: true }),
          ]),
          Animated.timing(nameOp, { toValue: 1, duration: 500, useNativeDriver: true }),
          Animated.timing(serialOp, { toValue: 1, duration: 500, useNativeDriver: true }),
          Animated.timing(descOp, { toValue: 1, duration: 500, useNativeDriver: true }),
        ]).start();
      } catch (e: any) {
        if (!cancelled) setError(e?.message || 'error');
      }
    };
    run();
    return () => { cancelled = true; };
  }, [userId, artOpacity, artScale, rotate, glow, nameOp, serialOp, descOp]);

  const spin = rotate.interpolate({ inputRange: [0, 1], outputRange: ['0deg', '360deg'] });

  return (
    <SafeAreaView style={styles.container} testID="reveal-screen" edges={['top']}>
      <Pressable style={styles.close} onPress={() => router.back()} testID="reveal-close-button" hitSlop={12}>
        <Ionicons name="close" size={22} color={COLORS.text} />
      </Pressable>

      <View style={styles.stage}>
        <Animated.View
          style={[styles.glow, { opacity: glow.interpolate({ inputRange: [0, 1], outputRange: [0, 0.5] }) }]}
        />
        {error ? (
          <Text style={{ color: '#E57373' }}>{error}</Text>
        ) : !result ? (
          <ActivityIndicator color={COLORS.gold} />
        ) : (
          <Animated.View style={{ opacity: artOpacity, transform: [{ scale: artScale }, { rotate: spin }] }}>
            <RelicArt relicKey={result.discovery.relic_key as RelicKey} size={240} />
          </Animated.View>
        )}
      </View>

      {result && (
        <View style={styles.meta}>
          <Animated.Text style={[styles.name, { opacity: nameOp }]}>
            {result.discovery.relic_name}
          </Animated.Text>
          <Animated.Text style={[styles.serial, { opacity: serialOp }]}>
            #{String(result.discovery.serial_number).padStart(6, '0')} · {result.relic.discovered}/{result.relic.max_supply}
          </Animated.Text>
          {detail && (
            <Animated.Text style={[styles.desc, { opacity: descOp }]} numberOfLines={3}>
              {lang === 'pt' ? detail.description_pt : detail.description_en}
            </Animated.Text>
          )}
          {result.is_first_collector && (
            <Animated.Text style={[styles.firstBadge, { opacity: descOp }]}>
              FIRST COLLECTOR
            </Animated.Text>
          )}
        </View>
      )}

      <View style={styles.actions}>
        {result && (
          <>
            <Pressable
              testID="reveal-details-button"
              onPress={() => router.replace({ pathname: '/relic/[key]', params: { key: result.discovery.relic_key } })}
              style={styles.primary}
            >
              <Text style={styles.primaryText}>{t('view_details')}</Text>
            </Pressable>
            <Pressable
              testID="reveal-again-button"
              onPress={() => router.replace('/(tabs)/discover')}
              style={styles.secondary}
            >
              <Text style={styles.secondaryText}>{t('reveal_again')}</Text>
            </Pressable>
          </>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#050505', paddingHorizontal: SPACING.xl },
  close: { position: 'absolute', top: 56, right: SPACING.lg, zIndex: 2, padding: 6 },
  stage: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  glow: {
    position: 'absolute', width: 320, height: 320, borderRadius: 160,
    backgroundColor: COLORS.gold,
  },
  meta: { alignItems: 'center', paddingHorizontal: SPACING.md },
  name: { color: COLORS.text, fontSize: 32, fontFamily: 'serif', letterSpacing: 2 },
  serial: { color: COLORS.gold, fontSize: 12, letterSpacing: 4, marginTop: 8 },
  desc: { color: COLORS.textDim, fontSize: 13, textAlign: 'center', marginTop: SPACING.md, lineHeight: 20 },
  firstBadge: {
    color: COLORS.gold, letterSpacing: 4, fontSize: 10, marginTop: SPACING.md,
    borderWidth: 1, borderColor: COLORS.gold, paddingHorizontal: 10, paddingVertical: 4, borderRadius: 999,
  },
  actions: { paddingBottom: SPACING.xxl, paddingTop: SPACING.xl, gap: SPACING.md },
  primary: { backgroundColor: COLORS.gold, borderRadius: 999, paddingVertical: 16, alignItems: 'center' },
  primaryText: { color: COLORS.bg, letterSpacing: 3, fontWeight: '700', fontSize: 12 },
  secondary: { borderWidth: 1, borderColor: COLORS.border, borderRadius: 999, paddingVertical: 14, alignItems: 'center' },
  secondaryText: { color: COLORS.text, letterSpacing: 3, fontSize: 12 },
});
