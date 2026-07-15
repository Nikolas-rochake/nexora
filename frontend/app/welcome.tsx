import { View, Text, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS, SPACING } from '@/src/theme';
import { useI18n } from '@/src/context/I18nContext';
import { PremiumButton, GoldRule, Eyebrow } from '@/src/components/Premium';
import RelicArt from '@/src/relics/RelicArt';

export default function Welcome() {
  const router = useRouter();
  const { t } = useI18n();

  return (
    <SafeAreaView style={styles.container} testID="welcome-screen">
      <View style={styles.top}>
        <Text style={styles.brand}>NEXORA</Text>
        <GoldRule width={20} style={{ marginTop: SPACING.md }} />
      </View>

      <View style={styles.artStage}>
        <View style={styles.artPedestal} />
        <View style={styles.art}>
          <RelicArt relicKey="genesis" size={200} />
        </View>
        <View style={styles.artShadow} />
      </View>

      <View style={styles.bottom}>
        <Eyebrow style={styles.eyebrow}>MEMBER · ACCESS</Eyebrow>
        <Text style={styles.title}>{t('welcome_title')}</Text>
        <Text style={styles.subtitle}>{t('welcome_subtitle')}</Text>
        <PremiumButton
          testID="welcome-enter-button"
          variant="primary"
          label={t('enter')}
          onPress={() => router.push('/login')}
          style={{ marginTop: SPACING.xxl }}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.bg, paddingHorizontal: SPACING.xxl },
  top: { alignItems: 'center', paddingTop: SPACING.xl },
  brand: { color: COLORS.ice, fontSize: 14, letterSpacing: 10, fontWeight: '400' },
  artStage: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  artPedestal: {
    position: 'absolute', bottom: '20%',
    width: 260, height: 1, backgroundColor: COLORS.goldHairline,
  },
  art: { alignItems: 'center', justifyContent: 'center' },
  artShadow: {
    position: 'absolute', bottom: '18%',
    width: 140, height: 6, borderRadius: 6,
    backgroundColor: 'rgba(0,0,0,0.4)',
    shadowColor: COLORS.gold, shadowOpacity: 0.2, shadowRadius: 20,
  },
  bottom: { paddingBottom: SPACING.gallery, alignItems: 'center' },
  eyebrow: { marginBottom: SPACING.md },
  title: {
    color: COLORS.ice, fontFamily: 'serif', fontSize: 34,
    textAlign: 'center', fontWeight: '300', lineHeight: 42,
  },
  subtitle: {
    color: COLORS.textDim, fontSize: 12, letterSpacing: 3, marginTop: SPACING.md,
    textTransform: 'uppercase',
  },
});
