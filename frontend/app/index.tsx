import { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import { useRouter } from 'expo-router';
import { COLORS, SPACING } from '@/src/theme';
import { useAuth } from '@/src/context/AuthContext';

export default function SplashIndex() {
  const router = useRouter();
  const auth = useAuth();
  const fade = useRef(new Animated.Value(0)).current;
  const letter = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.sequence([
      Animated.timing(fade, { toValue: 1, duration: 900, useNativeDriver: true }),
      Animated.timing(letter, { toValue: 1, duration: 700, useNativeDriver: true }),
    ]).start();
  }, [fade, letter]);

  useEffect(() => {
    if (!auth.loaded) return;
    const t = setTimeout(() => {
      if (auth.userId) router.replace('/(tabs)/home');
      else router.replace('/welcome');
    }, 1900);
    return () => clearTimeout(t);
  }, [auth.loaded, auth.userId, router]);

  const spacing = letter.interpolate({ inputRange: [0, 1], outputRange: [2, 10] });

  return (
    <View style={styles.container} testID="splash-screen">
      <Animated.View style={{ opacity: fade, alignItems: 'center' }}>
        <Animated.Text style={[styles.logo, { letterSpacing: spacing as unknown as number }]}>
          NEXORA
        </Animated.Text>
        <View style={styles.rule} />
        <Text style={styles.tagline}>THE VAULT</Text>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.bg, alignItems: 'center', justifyContent: 'center' },
  logo: {
    color: COLORS.text,
    fontSize: 44,
    fontWeight: '300',
    fontFamily: 'serif',
  },
  rule: {
    width: 28,
    height: 1,
    backgroundColor: COLORS.gold,
    marginVertical: SPACING.lg,
  },
  tagline: {
    color: COLORS.gold,
    letterSpacing: 6,
    fontSize: 10,
    fontWeight: '500',
  },
});
