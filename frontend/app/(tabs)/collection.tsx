import { useCallback, useState } from 'react';
import { View, Text, StyleSheet, Pressable, FlatList, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect, useRouter } from 'expo-router';
import { COLORS, SPACING } from '@/src/theme';
import { useI18n } from '@/src/context/I18nContext';
import { useAuth } from '@/src/context/AuthContext';
import { api, ApiCollectionItem } from '@/src/context/api';
import { RELIC_ORDER, RelicKey } from '@/src/relics/data';
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

  const data = [...items].sort(
    (a, b) => (RELIC_ORDER[a.relic_key] ?? 999) - (RELIC_ORDER[b.relic_key] ?? 999)
  );

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
          keyExtractor={(i) => i.relic_key}
          numColumns={2}
          columnWrapperStyle={data.length > 0 ? { gap: SPACING.md, paddingHorizontal: SPACING.xl } : undefined}
          contentContainerStyle={{ gap: SPACING.md, paddingBottom: SPACING.xxxl, paddingTop: SPACING.md }}
          renderItem={({ item }) => (
            <Pressable
              testID={`collection-item-${item.relic_key}`}
              onPress={() => router.push({ pathname: '/relic/[key]', params: { key: item.relic_key } })}
              style={styles.card}
            >
              <View style={styles.artBox}>
                <RelicArt relicKey={item.relic_key as RelicKey} size={110} discovered />
              </View>
              <Text style={styles.cardName}>{item.relic_name}</Text>
              <Text style={styles.cardSerial}>
                #{String(item.first_serial).padStart(6, '0')}
                {item.count > 1 ? `  ×${item.count}` : ''}
              </Text>
            </Pressable>
          )}
          ListEmptyComponent={() => (
            <View style={styles.emptyWrap} testID="collection-empty">
              <Text style={styles.emptyText}>{t('empty_collection')}</Text>
            </View>
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
  emptyWrap: { flex: 1, alignItems: 'center', paddingHorizontal: SPACING.xl, paddingTop: SPACING.xxxl },
  emptyText: { color: COLORS.textMuted, textAlign: 'center', letterSpacing: 2, fontSize: 12 },
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
