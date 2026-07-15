import { useCallback, useState } from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect } from 'expo-router';
import { COLORS, SPACING } from '@/src/theme';
import { api, ApiRegistry } from '@/src/context/api';
import { GoldRule } from '@/src/components/Premium';

const nf = new Intl.NumberFormat('en-US');

export default function Registry() {
  const [items, setItems] = useState<ApiRegistry[]>([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const data = await api.registry();
      setItems(data);
    } finally { setLoading(false); }
  }, []);

  useFocusEffect(useCallback(() => { load(); }, [load]));

  return (
    <SafeAreaView style={styles.container} testID="registry-screen" edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.brand}>NEXORA</Text>
        <Text style={styles.brandSub}>WORLD · LEDGER</Text>
        <GoldRule width={20} style={{ marginTop: SPACING.md, alignSelf: 'center' }} />
      </View>

      {loading ? (
        <View style={styles.loading}><ActivityIndicator color={COLORS.gold} /></View>
      ) : (
        <FlatList
          data={items}
          keyExtractor={(i) => i.key}
          contentContainerStyle={styles.list}
          ItemSeparatorComponent={() => <View style={styles.sep} />}
          ListHeaderComponent={() => (
            <View style={styles.legend}>
              <Text style={styles.legendLeft}>NAME</Text>
              <Text style={styles.legendRight}>DISCOVERED · MAX</Text>
            </View>
          )}
          renderItem={({ item, index }) => (
            <View style={styles.row} testID={`registry-row-${item.key}`}>
              <Text style={styles.index}>{String(index + 1).padStart(2, '0')}</Text>
              <View style={{ flex: 1 }}>
                <Text style={styles.rowName}>{item.name}</Text>
              </View>
              <Text style={styles.count}>
                {nf.format(item.discovered)} <Text style={styles.countSlash}>·</Text> {nf.format(item.max_supply)}
              </Text>
            </View>
          )}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.bg },
  header: { alignItems: 'center', paddingTop: SPACING.lg, paddingBottom: SPACING.xxl },
  brand: { color: COLORS.ice, fontSize: 14, letterSpacing: 10 },
  brandSub: { color: COLORS.textMuted, fontSize: 9, letterSpacing: 5, marginTop: 8 },
  loading: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  list: { paddingHorizontal: SPACING.xxl, paddingBottom: SPACING.gallery },
  legend: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingBottom: SPACING.md, marginBottom: SPACING.md,
    borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: COLORS.hairlineStrong,
  },
  legendLeft: { color: COLORS.textMuted, fontSize: 9, letterSpacing: 4 },
  legendRight: { color: COLORS.textMuted, fontSize: 9, letterSpacing: 4 },
  sep: { height: 1, backgroundColor: COLORS.hairline },
  row: {
    flexDirection: 'row', alignItems: 'center',
    paddingVertical: SPACING.xl, gap: SPACING.lg,
  },
  index: { color: COLORS.gold, fontSize: 11, letterSpacing: 2, fontFamily: 'serif' },
  rowName: { color: COLORS.ice, fontSize: 20, fontFamily: 'serif', letterSpacing: 3, fontWeight: '300' },
  count: { color: COLORS.gold, fontSize: 12, letterSpacing: 2, fontVariant: ['tabular-nums'] },
  countSlash: { color: COLORS.textMuted },
});
