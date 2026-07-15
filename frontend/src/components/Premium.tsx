import React, { ReactNode } from 'react';
import { Pressable, Text, StyleSheet, ActivityIndicator, View, ViewStyle } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SPACING } from '../theme';

type IoniconName = React.ComponentProps<typeof Ionicons>['name'];

type Props = {
  label: string;
  onPress?: () => void;
  variant?: 'primary' | 'ghost' | 'hairline';
  icon?: IoniconName;
  disabled?: boolean;
  busy?: boolean;
  testID?: string;
  fullWidth?: boolean;
  style?: ViewStyle;
};

/**
 * Premium button — thin gold hairline outline with slow-press feedback.
 * variants:
 *   - primary: gold-fill on ice-white ink (used for definitive CTAs)
 *   - ghost: 1px gold border, transparent, gold text (used for secondary actions)
 *   - hairline: barely-there border, text-only (used for tertiary links inside cards)
 */
export function PremiumButton({
  label,
  onPress,
  variant = 'primary',
  icon,
  disabled,
  busy,
  testID,
  fullWidth = true,
  style,
}: Props) {
  const isPrimary = variant === 'primary';
  const isGhost = variant === 'ghost';
  const isHairline = variant === 'hairline';

  return (
    <Pressable
      testID={testID}
      disabled={disabled || busy}
      onPress={onPress}
      style={({ pressed }) => [
        styles.base,
        fullWidth && { alignSelf: 'stretch' },
        isPrimary && styles.primary,
        isGhost && styles.ghost,
        isHairline && styles.hairline,
        pressed && (isPrimary ? styles.primaryPressed : styles.pressedDim),
        disabled && { opacity: 0.35 },
        style,
      ]}
    >
      <View style={styles.inner}>
        {busy ? (
          <ActivityIndicator color={isPrimary ? COLORS.bg : COLORS.gold} />
        ) : (
          <>
            {icon ? (
              <Ionicons
                name={icon}
                size={14}
                color={isPrimary ? COLORS.bg : COLORS.gold}
                style={{ marginRight: 10 }}
              />
            ) : null}
            <Text style={[
              styles.label,
              isPrimary ? styles.labelPrimary : styles.labelGold,
              isHairline && styles.labelHairline,
            ]}>
              {label}
            </Text>
          </>
        )}
      </View>
    </Pressable>
  );
}

/** A thin luxury divider — hairline gold rule with optional center gap for a "seal" glyph. */
export function GoldRule({ width = 24, style }: { width?: number; style?: ViewStyle }) {
  return <View style={[{ width, height: 1, backgroundColor: COLORS.gold }, style]} />;
}

/** Editorial eyebrow label used everywhere for section headings. */
export function Eyebrow({ children, style }: { children: ReactNode; style?: any }) {
  return <Text style={[styles.eyebrow, style]}>{children}</Text>;
}

const styles = StyleSheet.create({
  base: {
    borderRadius: 999,
    paddingVertical: 16,
    paddingHorizontal: 28,
    alignItems: 'center',
    justifyContent: 'center',
  },
  inner: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center' },
  primary: { backgroundColor: COLORS.gold },
  primaryPressed: { backgroundColor: COLORS.goldDeep },
  ghost: { borderWidth: 1, borderColor: COLORS.gold, backgroundColor: 'transparent' },
  hairline: { borderWidth: 1, borderColor: COLORS.hairlineStrong, backgroundColor: 'transparent' },
  pressedDim: { opacity: 0.65 },
  label: {
    fontSize: 12,
    letterSpacing: 6,
    fontWeight: '600',
    textAlign: 'center',
    paddingLeft: 6, // compensate letter-spacing tail
  },
  labelPrimary: { color: COLORS.bg },
  labelGold: { color: COLORS.gold },
  labelHairline: { color: COLORS.iceDim, letterSpacing: 3 },
  eyebrow: {
    color: COLORS.textMuted,
    fontSize: 10,
    letterSpacing: 4,
    textTransform: 'uppercase',
    fontWeight: '500',
  },
});
