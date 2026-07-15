import { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated } from 'react-native';
import { useRouter } from 'expo-router';
import { COLORS, SPACING } from '@/src/theme';
import { useAuth } from '@/src/context/AuthContext';

export default function SplashIndex() {
  const router = useRouter();
  const auth = useAuth();
  const brand = useRef(new Animated.Value(0)).current;
  const ruleW = useRef(new Animated.Value(0)).current;
  const tag = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.sequence([
      Animated.timing(brand, { toValue: 1, duration: 1400, useNativeDriver: false }),
      Animated.timing(ruleW, { toValue: 1, duration: 900, useNativeDriver: false }),
      Animated.timing(tag, { toValue: 1, duration: 700, useNativeDriver: true }),
    ]).start();
  }, [brand, ruleW, tag]);

  useEffect(() => {
    if (!auth.loaded) return;
    const t = setTimeout(() => {
      if (auth.userId) router.replace('/(tabs)/home');
      else router.replace('/welcome');
    }, 3200);
    return () => clearTimeout(t);
  }, [auth.loaded, auth.userId, router]);

  const spacing = brand.interpolate({ inputRange: [0, 1], outputRange: [1, 14] });
  const opacity = brand.interpolate({ inputRange: [0, 1], outputRange: [0, 1] });
  const width = ruleW.interpolate({ inputRange: [0, 1], outputRange: [0, 48] });

  return (
    <View style={styles.container} testID="splash-screen">
      <View style={styles.center}>
        <Animated.Text style={[styles.logo, { letterSpacing: spacing, opacity }]}>
          NEXORA
        </Animated.Text>
        <Animated.View style={[styles.rule, { width }]} />
        <Animated.Text style={[styles.tag, { opacity: tag }]}>
          THE VAULT
        </Animated.Text>
      </View>
      <View style={styles.bottomMark}>
        <Animated.Text style={[styles.mark, { opacity: tag }]}>EST · MMXXVI</Animated.Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.bg, alignItems: 'center', justifyContent: 'center' },
  center: { alignItems: 'center' },
  logo: { color: COLORS.ice, fontSize: 34, fontWeight: '300', fontFamily: 'serif' },
  rule: { height: 1, backgroundColor: COLORS.gold, marginVertical: SPACING.xl },
  tag: { color: COLORS.gold, letterSpacing: 8, fontSize: 9, fontWeight: '500' },
  bottomMark: { position: 'absolute', bottom: SPACING.xxxl, alignItems: 'center' },
  mark: { color: COLORS.textMuted, letterSpacing: 4, fontSize: 9 },
});
