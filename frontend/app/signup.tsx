import { useState } from 'react';
import {
  View, Text, StyleSheet, Pressable, TextInput, ScrollView,
  KeyboardAvoidingView, Platform, ActivityIndicator,
} from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SPACING } from '@/src/theme';
import { useI18n } from '@/src/context/I18nContext';
import { useAuth } from '@/src/context/AuthContext';

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
            <Ionicons name="chevron-back" size={22} color={COLORS.text} />
          </Pressable>

          <Text style={styles.brand}>NEXORA</Text>
          <View style={styles.rule} />
          <Text style={styles.title}>{t('signup_title')}</Text>

          <Pressable style={styles.photoWrap} testID="signup-photo-button">
            <View style={styles.photoCircle}>
              <Ionicons name="person-outline" size={36} color={COLORS.textMuted} />
            </View>
            <Text style={styles.photoLabel}>{t('add_photo')}</Text>
          </Pressable>

          <View style={styles.field}>
            <Text style={styles.label}>{t('name')}</Text>
            <TextInput
              testID="signup-name-input"
              value={name}
              onChangeText={setName}
              style={styles.input}
              placeholderTextColor={COLORS.textMuted}
              autoCapitalize="words"
            />
          </View>

          <View style={styles.field}>
            <Text style={styles.label}>{t('city')}</Text>
            <TextInput
              testID="signup-city-input"
              value={city}
              onChangeText={setCity}
              style={styles.input}
              placeholderTextColor={COLORS.textMuted}
            />
          </View>

          <View style={styles.field}>
            <Text style={styles.label}>{t('country')}</Text>
            <TextInput
              testID="signup-country-input"
              value={country}
              onChangeText={setCountry}
              style={styles.input}
              placeholderTextColor={COLORS.textMuted}
            />
          </View>

          <Pressable
            testID="signup-terms-toggle"
            onPress={() => setAccept(!accept)}
            style={styles.termsRow}
          >
            <View style={[styles.checkbox, accept && styles.checkboxOn]}>
              {accept ? <Ionicons name="checkmark" size={14} color={COLORS.bg} /> : null}
            </View>
            <Text style={styles.termsText}>{t('accept_terms')}</Text>
          </Pressable>

          {err ? <Text style={styles.err}>{err}</Text> : null}

          <Pressable
            testID="signup-submit-button"
            disabled={!canSubmit}
            onPress={submit}
            style={[styles.cta, !canSubmit && { opacity: 0.35 }]}
          >
            {busy ? <ActivityIndicator color={COLORS.bg} /> : <Text style={styles.ctaText}>{t('signup')}</Text>}
          </Pressable>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.bg },
  scroll: { paddingHorizontal: SPACING.xl, paddingBottom: SPACING.xxxl, paddingTop: SPACING.xl },
  back: { position: 'absolute', top: 8, left: SPACING.lg, zIndex: 2, padding: 4 },
  brand: { color: COLORS.text, fontSize: 14, letterSpacing: 8, textAlign: 'center', marginTop: SPACING.xl },
  rule: { width: 16, height: 1, backgroundColor: COLORS.gold, alignSelf: 'center', marginVertical: SPACING.md },
  title: { color: COLORS.text, fontSize: 26, fontFamily: 'serif', textAlign: 'center', marginBottom: SPACING.xxl },
  photoWrap: { alignItems: 'center', marginBottom: SPACING.xl },
  photoCircle: {
    width: 96, height: 96, borderRadius: 48,
    borderWidth: 1, borderColor: COLORS.gold,
    alignItems: 'center', justifyContent: 'center',
    backgroundColor: COLORS.bgSecondary,
  },
  photoLabel: { color: COLORS.textMuted, marginTop: SPACING.md, letterSpacing: 2, fontSize: 11 },
  field: { marginBottom: SPACING.xl },
  label: { color: COLORS.textMuted, fontSize: 10, letterSpacing: 3, marginBottom: 8 },
  input: {
    color: COLORS.text,
    fontSize: 16,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
    paddingVertical: 8,
  },
  termsRow: { flexDirection: 'row', alignItems: 'center', marginVertical: SPACING.lg },
  checkbox: {
    width: 20, height: 20, borderWidth: 1, borderColor: COLORS.borderStrong,
    marginRight: SPACING.md, alignItems: 'center', justifyContent: 'center',
  },
  checkboxOn: { backgroundColor: COLORS.gold, borderColor: COLORS.gold },
  termsText: { color: COLORS.textDim, fontSize: 13 },
  err: { color: '#E57373', fontSize: 12, marginBottom: SPACING.md },
  cta: {
    backgroundColor: COLORS.gold, borderRadius: 999, paddingVertical: 16,
    alignItems: 'center', marginTop: SPACING.lg,
  },
  ctaText: { color: COLORS.bg, letterSpacing: 4, fontSize: 12, fontWeight: '700' },
});
