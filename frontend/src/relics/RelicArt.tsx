import React from 'react';
import { View, StyleSheet, ImageStyle, StyleProp } from 'react-native';
import { Image } from 'expo-image';
import { RelicKey } from './data';

const BASE = (process.env.EXPO_PUBLIC_BACKEND_URL || '').replace(/\/$/, '');

type Props = {
  relicKey: RelicKey;
  size?: number;
  discovered?: boolean;
  style?: StyleProp<ImageStyle>;
};

/**
 * Photo-real Relic imagery (Gemini Nano Banana output).
 * Undiscovered state renders the image desaturated + very dim so it still
 * hints at the shape while feeling "sealed".
 */
export default function RelicArt({ relicKey, size = 220, discovered = true, style }: Props) {
  const uri = `${BASE}/api/relic-images/${relicKey}.png?v=2`;
  return (
    <View style={[{ width: size, height: size }, styles.wrap]}>
      <Image
        source={{ uri }}
        style={[
          { width: size, height: size },
          !discovered && styles.locked,
          style,
        ]}
        contentFit="contain"
        transition={400}
        cachePolicy="memory-disk"
        recyclingKey={relicKey + (discovered ? '-on' : '-off')}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { alignItems: 'center', justifyContent: 'center' },
  locked: { opacity: 0.16 },
});
