import { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated, Easing } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { COLORS, SPACING } from '@/src/theme';
import { useI18n } from '@/src/context/I18nContext';
import { useAuth } from '@/src/context/AuthContext';
import { PremiumButton, Eyebrow } from '@/src/components/Premium';

export default function Discover() {
  const router = useRouter();
  const { t } = useI18n();
  const { userId } = useAuth();

  const glow = useRef(new Animated.Value(0)).current;
  const orbit = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(glow, { toValue: 1, duration: 3200, easing: Easing.inOut(Easing.quad), useNativeDriver: true }),
        Animated.timing(glow, { toValue: 0, duration: 3200, easing: Easing.inOut(Easing.quad), useNativeDriver: true }),
      ])
    ).start();
    Animated.loop(
      Animated.timing(orbit, { toValue: 1, duration: 24000, easing: Easing.linear, useNativeDriver: true })
    ).start();
  }, [glow, orbit]);

  const spin = orbit.interpolate({ inputRange: [0, 1], outputRange: ['0deg', '360deg'] });
  const glowOpacity = glow.interpolate({ inputRange: [0, 1], outputRange: [0.05, 0.14] });
  const glowScale = glow.interpolate({ inputRange: [0, 1], outputRange: [0.94, 1.04] });

  return (
    <SafeAreaView style={styles.container} testID="discover-screen" edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.brand}>NEXORA</Text>
        <Text style={styles.brandSub}>THE VAULT · CHAMBER I</Text>
      </View>

      <View style={styles.stage}>
        <Animated.View style={[styles.orbitRing, { transform: [{ rotate: spin }] }]}>
          <View style={styles.orbitDot} />
          <View style={[styles.orbitDot, styles.orbitDotFar]} />
        </Animated.View>

        <Animated.View style={[styles.glowRing, { opacity: glowOpacity, transform: [{ scale: glowScale }] }]} />
        <View style={styles.chamber}>
          <View style={styles.chamberInner} />
          <View style={styles.seal}>
            <Text style={styles.sealNx}>NX</Text>
          </View>
        </View>
      </View>

      <View style={styles.info}>
        <Eyebrow style={{ textAlign: 'center' }}>SEALED · UNKNOWN</Eyebrow>
        <Text style={styles.hint}>{t('tap_to_reveal')}</Text>
      </View>

      <View style={styles.bottom}>
        <PremiumButton
          testID="discover-reveal-button"
          variant="primary"
          label={t('reveal_relic')}
          onPress={() => router.push('/reveal')}
          disabled={!userId}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.bg, paddingHorizontal: SPACING.xxl },
  header: { alignItems: 'center', paddingTop: SPACING.lg },
  brand: { color: COLORS.ice, fontSize: 14, letterSpacing: 10 },
  brandSub: { color: COLORS.textMuted, fontSize: 9, letterSpacing: 5, marginTop: 8 },
  stage: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  orbitRing: {
    position: 'absolute', width: 320, height: 320, borderRadius: 999,
    borderWidth: 1, borderColor: COLORS.hairline,
    alignItems: 'center',
  },
  orbitDot: {
    position: 'absolute', top: -3, width: 5, height: 5, borderRadius: 999,
    backgroundColor: COLORS.gold,
  },
  orbitDotFar: { top: undefined, bottom: -3 },
  glowRing: {
    position: 'absolute', width: 300, height: 300, borderRadius: 999,
    backgroundColor: COLORS.gold,
  },
  chamber: {
    width: 240, height: 240, borderRadius: 999,
    borderWidth: 1, borderColor: COLORS.goldHairline,
    padding: 12,
    alignItems: 'center', justifyContent: 'center',
    backgroundColor: COLORS.bgElevated,
  },
  chamberInner: {
    ...StyleSheet.absoluteFillObject,
    margin: 12,
    borderRadius: 999,
    borderWidth: 1, borderColor: COLORS.hairline,
    backgroundColor: COLORS.bgSecondary,
  },
  seal: {
    width: 84, height: 84, borderRadius: 999,
    borderWidth: 1, borderColor: COLORS.gold,
    alignItems: 'center', justifyContent: 'center',
    backgroundColor: COLORS.bg,
  },
  sealNx: {
    color: COLORS.gold, fontFamily: 'serif', fontSize: 22, letterSpacing: 4,
  },
  info: { alignItems: 'center', marginBottom: SPACING.xl },
  hint: { color: COLORS.textDim, marginTop: SPACING.md, letterSpacing: 3, fontSize: 11, textTransform: 'uppercase' },
  bottom: { paddingBottom: SPACING.xl },
});
