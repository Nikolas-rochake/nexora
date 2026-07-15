import { useCallback, useState } from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect } from 'expo-router';
import { COLORS, SPACING } from '@/src/theme';
import { useI18n } from '@/src/context/I18nContext';
import { api, ApiRegistry } from '@/src/context/api';
import RelicArt from '@/src/relics/RelicArt';
import { RelicKey } from '@/src/relics/data';

function formatCount(n: number) {
  return new Intl.NumberFormat('en-US').format(n);
}

export default function Registry() {
  const { t } = useI18n();
  const [items, setItems] = useState<ApiRegistry[]>([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const data = await api.registry();
      setItems(data);
    } finally {
      setLoading(false);
    }
  }, []);

  useFocusEffect(useCallback(() => { load(); }, [load]));

  return (
    <SafeAreaView style={styles.container} testID="registry-screen" edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.brand}>NEXORA</Text>
        <View style={styles.rule} />
        <Text style={styles.title}>{t('world_registry')}</Text>
      </View>

      {loading ? (
        <View style={styles.loading}><ActivityIndicator color={COLORS.gold} /></View>
      ) : (
        <FlatList
          data={items}
          keyExtractor={(i) => i.key}
          contentContainerStyle={{ paddingHorizontal: SPACING.xl, paddingBottom: SPACING.xxxl }}
          ItemSeparatorComponent={() => <View style={styles.sep} />}
          renderItem={({ item }) => (
            <View style={styles.row} testID={`registry-row-${item.key}`}>
              <View style={styles.artMini}>
                <RelicArt relicKey={item.key as RelicKey} size={44} discovered={item.discovered > 0} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.rowName}>{item.name}</Text>
                <Text style={styles.rowSub}>
                  {formatCount(item.remaining)} {item.remaining === 1 ? 'unit remaining' : 'remaining'}
                </Text>
              </View>
              <Text style={styles.count}>
                {formatCount(item.discovered)} / {formatCount(item.max_supply)}
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
  header: { alignItems: 'center', paddingTop: SPACING.md, paddingBottom: SPACING.lg },
  brand: { color: COLORS.text, fontSize: 14, letterSpacing: 8 },
  rule: { width: 14, height: 1, backgroundColor: COLORS.gold, marginVertical: SPACING.md },
  title: { color: COLORS.text, fontSize: 22, fontFamily: 'serif', letterSpacing: 1 },
  loading: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  sep: { height: 1, backgroundColor: COLORS.divider },
  row: { flexDirection: 'row', alignItems: 'center', paddingVertical: SPACING.lg, gap: SPACING.md },
  artMini: { width: 48, height: 48, alignItems: 'center', justifyContent: 'center' },
  rowName: { color: COLORS.text, fontSize: 16, fontFamily: 'serif', letterSpacing: 1 },
  rowSub: { color: COLORS.textMuted, fontSize: 10, letterSpacing: 2, marginTop: 2 },
  count: { color: COLORS.gold, fontSize: 13, letterSpacing: 2, fontVariant: ['tabular-nums'] },
});
