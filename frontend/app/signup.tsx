import { useState } from 'react';
import {
  View, Text, StyleSheet, Pressable, TextInput, ScrollView,
  KeyboardAvoidingView, Platform,
} from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SPACING } from '@/src/theme';
import { useI18n } from '@/src/context/I18nContext';
import { useAuth } from '@/src/context/AuthContext';
import { PremiumButton, GoldRule, Eyebrow } from '@/src/components/Premium';

export default function Signup() {
  const router = useRouter();
  const { t } = useI18n();
  const { signIn } = useAuth();

  const [name, setName] = useState('');
  const [city, setCity] = useState('');
  const [country, setCountry] = useState('');
  const [accept, setAccept] = useState(false);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  const canSubmit = name.trim().length > 1 && city.trim() && country.trim() && accept && !busy;

  const submit = async () => {
    if (!canSubmit) return;
    setBusy(true);
    setErr(null);
    try {
      await signIn({ name: name.trim(), city: city.trim(), country: country.trim(), photo: null });
      router.replace('/(tabs)/home');
    } catch (e: any) {
      setErr(e?.message || 'error');
    } finally {
      setBusy(false);
    }
  };

  return (
    <SafeAreaView style={styles.container} testID="signup-screen">
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
          <Pressable onPress={() => router.back()} style={styles.back} testID="signup-back-button" hitSlop={12}>
            <Ionicons name="chevron-back" size={22} color={COLORS.ice} />
          </Pressable>

          <Text style={styles.brand}>NEXORA</Text>
          <GoldRule width={16} style={{ alignSelf: 'center', marginTop: SPACING.md }} />
          <Eyebrow style={{ alignSelf: 'center', marginTop: SPACING.xxl }}>NEW · MEMBER</Eyebrow>
          <Text style={styles.title}>{t('signup_title')}</Text>

          <Pressable style={styles.photoWrap} testID="signup-photo-button">
            <View style={styles.photoRing}>
              <View style={styles.photoCircle}>
                <Ionicons name="person-outline" size={30} color={COLORS.textDim} />
              </View>
            </View>
            <Text style={styles.photoLabel}>{t('add_photo')}</Text>
          </Pressable>

          <Field label={t('name')} value={name} onChange={setName} testID="signup-name-input" autoCapitalize="words" />
          <Field label={t('city')} value={city} onChange={setCity} testID="signup-city-input" />
          <Field label={t('country')} value={country} onChange={setCountry} testID="signup-country-input" />

          <Pressable
            testID="signup-terms-toggle"
            onPress={() => setAccept(!accept)}
            style={styles.termsRow}
          >
            <View style={[styles.checkbox, accept && styles.checkboxOn]}>
              {accept ? <Ionicons name="checkmark" size={12} color={COLORS.bg} /> : null}
            </View>
            <Text style={styles.termsText}>{t('accept_terms')}</Text>
          </Pressable>

          {err ? <Text style={styles.err}>{err}</Text> : null}

          <PremiumButton
            testID="signup-submit-button"
            variant="primary"
            label={t('signup')}
            onPress={submit}
            busy={busy}
            disabled={!canSubmit}
            style={{ marginTop: SPACING.lg }}
          />
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

function Field({ label, value, onChange, testID, autoCapitalize }: any) {
  return (
    <View style={styles.field}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        testID={testID}
        value={value}
        onChangeText={onChange}
        style={styles.input}
        placeholderTextColor={COLORS.textMuted}
        autoCapitalize={autoCapitalize}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.bg },
  scroll: { paddingHorizontal: SPACING.xxl, paddingBottom: SPACING.xxxl, paddingTop: SPACING.xl },
  back: { position: 'absolute', top: 8, left: SPACING.lg, zIndex: 2, padding: 4 },
  brand: { color: COLORS.ice, fontSize: 14, letterSpacing: 10, textAlign: 'center', marginTop: SPACING.xl },
  title: { color: COLORS.ice, fontSize: 28, fontFamily: 'serif', textAlign: 'center', marginTop: SPACING.md, fontWeight: '300', marginBottom: SPACING.xxl },
  photoWrap: { alignItems: 'center', marginBottom: SPACING.xxl },
  photoRing: {
    width: 108, height: 108, borderRadius: 54,
    borderWidth: 1, borderColor: COLORS.goldHairline,
    padding: 5,
    alignItems: 'center', justifyContent: 'center',
  },
  photoCircle: {
    flex: 1, alignSelf: 'stretch',
    borderRadius: 999, borderWidth: 1, borderColor: COLORS.gold,
    alignItems: 'center', justifyContent: 'center',
    backgroundColor: COLORS.bgSecondary,
  },
  photoLabel: { color: COLORS.textMuted, marginTop: SPACING.md, letterSpacing: 3, fontSize: 10 },
  field: { marginBottom: SPACING.xl },
  label: { color: COLORS.textMuted, fontSize: 10, letterSpacing: 3, marginBottom: 8, textTransform: 'uppercase' },
  input: {
    color: COLORS.ice, fontSize: 16, fontFamily: 'serif',
    borderBottomWidth: 1, borderBottomColor: COLORS.hairlineStrong,
    paddingVertical: 8,
  },
  termsRow: { flexDirection: 'row', alignItems: 'center', marginVertical: SPACING.lg },
  checkbox: {
    width: 18, height: 18, borderWidth: 1, borderColor: COLORS.hairlineStrong,
    marginRight: SPACING.md, alignItems: 'center', justifyContent: 'center',
  },
  checkboxOn: { backgroundColor: COLORS.gold, borderColor: COLORS.gold },
  termsText: { color: COLORS.textDim, fontSize: 13 },
  err: { color: '#E57373', fontSize: 12, marginBottom: SPACING.md },
});
