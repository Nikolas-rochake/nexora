import { useCallback, useState } from 'react';
import { View, Text, StyleSheet, Pressable, FlatList, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect, useRouter } from 'expo-router';
import { COLORS, SPACING } from '@/src/theme';
import { useI18n } from '@/src/context/I18nContext';
import { useAuth } from '@/src/context/AuthContext';
import { api, ApiCollectionItem } from '@/src/context/api';
import { RELICS, RelicKey } from '@/src/relics/data';
import RelicArt from '@/src/relics/RelicArt';

export default function Collection() {
  const { t } = useI18n();
  const { userId } = useAuth();
  const router = useRouter();
  const [items, setItems] = useState<ApiCollectionItem[]>([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    if (!userId) return;
    setLoading(true);
    try {
      const data = await api.collection(userId);
      setItems(data);
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useFocusEffect(useCallback(() => { load(); }, [load]));

  const owned: Record<string, ApiCollectionItem | undefined> = items.reduce(
    (acc, i) => ({ ...acc, [i.relic_key]: i }),
    {}
  );

  const data = RELICS.map((r) => ({
    ...r,
    ownedCount: owned[r.key]?.count ?? 0,
    firstSerial: owned[r.key]?.first_serial,
  }));

  return (
    <SafeAreaView style={styles.container} testID="collection-screen" edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.brand}>NEXORA</Text>
        <View style={styles.rule} />
        <Text style={styles.title}>{t('my_collection')}</Text>
      </View>

      {loading ? (
        <View style={styles.loading}><ActivityIndicator color={COLORS.gold} /></View>
      ) : (
        <FlatList
          data={data}
          keyExtractor={(i) => i.key}
          numColumns={2}
          columnWrapperStyle={{ gap: SPACING.md, paddingHorizontal: SPACING.xl }}
          contentContainerStyle={{ gap: SPACING.md, paddingBottom: SPACING.xxxl, paddingTop: SPACING.md }}
          renderItem={({ item }) => {
            const owned = item.ownedCount > 0;
            return (
              <Pressable
                testID={`collection-item-${item.key}`}
                onPress={() => router.push({ pathname: '/relic/[key]', params: { key: item.key } })}
                style={[styles.card, !owned && styles.cardLocked]}
              >
                <View style={styles.artBox}>
                  <RelicArt relicKey={item.key as RelicKey} size={110} discovered={owned} />
                </View>
                <Text style={[styles.cardName, !owned && { color: COLORS.textMuted }]}>{item.name}</Text>
                <Text style={styles.cardSerial}>
                  {owned ? `#${String(item.firstSerial).padStart(6, '0')}` : '— — —'}
                </Text>
              </Pressable>
            );
          }}
          ListEmptyComponent={() => (
            <Text style={{ color: COLORS.textMuted, textAlign: 'center', marginTop: SPACING.xxxl }}>
              {t('empty_collection')}
            </Text>
          )}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.bg },
  header: { alignItems: 'center', paddingTop: SPACING.md, paddingBottom: SPACING.lg },
  brand: { color: COLORS.text, fontSize: 14, letterSpacing: 8 },
  rule: { width: 14, height: 1, backgroundColor: COLORS.gold, marginVertical: SPACING.md },
  title: { color: COLORS.text, fontSize: 22, fontFamily: 'serif', letterSpacing: 1 },
  loading: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  card: {
    flex: 1, borderWidth: 1, borderColor: COLORS.border, borderRadius: 12,
    padding: SPACING.md, alignItems: 'center', backgroundColor: COLORS.bgSecondary,
    minHeight: 180,
  },
  cardLocked: { backgroundColor: COLORS.grayDark, borderColor: COLORS.divider, opacity: 0.9 },
  artBox: { alignItems: 'center', justifyContent: 'center', paddingVertical: 4 },
  cardName: { color: COLORS.text, fontSize: 14, marginTop: SPACING.sm, fontFamily: 'serif', letterSpacing: 1 },
  cardSerial: { color: COLORS.gold, fontSize: 10, letterSpacing: 3, marginTop: 4 },
});
