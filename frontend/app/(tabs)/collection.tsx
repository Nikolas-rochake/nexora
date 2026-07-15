import { useCallback, useState } from 'react';
import { View, Text, StyleSheet, Pressable, FlatList, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect, useRouter } from 'expo-router';
import { COLORS, SPACING } from '@/src/theme';
import { useI18n } from '@/src/context/I18nContext';
import { useAuth } from '@/src/context/AuthContext';
import { api, ApiCollectionItem } from '@/src/context/api';
import { GoldRule } from '@/src/components/Premium';
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
    } finally { setLoading(false); }
  }, [userId]);

  useFocusEffect(useCallback(() => { load(); }, [load]));

  const data = [...items].sort(
    (a, b) => (RELIC_ORDER[a.relic_key] ?? 999) - (RELIC_ORDER[b.relic_key] ?? 999)
  );

  return (
    <SafeAreaView style={styles.container} testID="collection-screen" edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.brand}>NEXORA</Text>
        <Text style={styles.brandSub}>MY COLLECTION</Text>
      </View>
      <GoldRule width={20} style={styles.headerRule} />

      {loading ? (
        <View style={styles.loading}><ActivityIndicator color={COLORS.gold} /></View>
      ) : (
        <FlatList
          data={data}
          keyExtractor={(i) => i.relic_key}
          contentContainerStyle={styles.list}
          ItemSeparatorComponent={() => <View style={styles.sep} />}
          renderItem={({ item }) => (
            <Pressable
              testID={`collection-item-${item.relic_key}`}
              onPress={() => router.push({ pathname: '/relic/[key]', params: { key: item.relic_key } })}
              style={({ pressed }) => [styles.plate, pressed && { opacity: 0.85 }]}
            >
              {/* left gold hairline "engraving" */}
              <View style={styles.plateEdge} />

              <View style={styles.plateArt}>
                <RelicArt relicKey={item.relic_key as RelicKey} size={72} discovered />
              </View>

              <View style={styles.plateBody}>
                <Text style={styles.plateName}>{item.relic_name}</Text>
                <View style={styles.plateMetaRow}>
                  <View style={styles.metaTick} />
                  <Text style={styles.plateSerial}>N° {String(item.first_serial).padStart(6, '0')}</Text>
                </View>
                {item.count > 1 ? (
                  <Text style={styles.plateMultiple}>×{item.count} SPECIMENS</Text>
                ) : null}
              </View>

              <Text style={styles.plateArrow}>→</Text>
            </Pressable>
          )}
          ListEmptyComponent={() => (
            <View style={styles.emptyWrap} testID="collection-empty">
              <View style={styles.emptyPedestal} />
              <Text style={styles.emptyTitle}>{t('empty_collection')}</Text>
            </View>
          )}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.bg },
  header: { alignItems: 'center', paddingTop: SPACING.lg },
  brand: { color: COLORS.ice, fontSize: 14, letterSpacing: 10 },
  brandSub: { color: COLORS.textMuted, fontSize: 9, letterSpacing: 5, marginTop: 8 },
  headerRule: { alignSelf: 'center', marginTop: SPACING.md, marginBottom: SPACING.xxl },
  loading: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  list: { paddingHorizontal: SPACING.xxl, paddingBottom: SPACING.gallery },
  sep: { height: SPACING.md },
  plate: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: COLORS.bgSecondary,
    paddingVertical: SPACING.lg, paddingRight: SPACING.lg,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderColor: COLORS.hairlineStrong,
  },
  plateEdge: {
    width: 3, alignSelf: 'stretch',
    backgroundColor: COLORS.gold,
    marginRight: SPACING.md,
  },
  plateArt: {
    width: 80, height: 80, alignItems: 'center', justifyContent: 'center',
  },
  plateBody: { flex: 1, marginLeft: SPACING.md },
  plateName: { color: COLORS.ice, fontSize: 20, fontFamily: 'serif', letterSpacing: 2, fontWeight: '300' },
  plateMetaRow: { flexDirection: 'row', alignItems: 'center', marginTop: 6, gap: 8 },
  metaTick: { width: 10, height: 1, backgroundColor: COLORS.gold },
  plateSerial: { color: COLORS.gold, fontSize: 10, letterSpacing: 3 },
  plateMultiple: { color: COLORS.textMuted, fontSize: 9, letterSpacing: 3, marginTop: 4 },
  plateArrow: { color: COLORS.gold, fontSize: 18, marginLeft: SPACING.md },
  emptyWrap: { flex: 1, alignItems: 'center', paddingTop: SPACING.gallery },
  emptyPedestal: { width: 80, height: 1, backgroundColor: COLORS.goldHairline, marginBottom: SPACING.xl },
  emptyTitle: { color: COLORS.textDim, letterSpacing: 3, fontSize: 12, textTransform: 'uppercase' },
});
