import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { View, Platform, StyleSheet } from 'react-native';
import { COLORS } from '@/src/theme';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,
        tabBarActiveTintColor: COLORS.gold,
        tabBarInactiveTintColor: COLORS.textMuted,
        tabBarStyle: {
          backgroundColor: COLORS.bg,
          borderTopColor: COLORS.hairline,
          borderTopWidth: StyleSheet.hairlineWidth,
          height: Platform.OS === 'ios' ? 84 : 66,
          paddingBottom: Platform.OS === 'ios' ? 26 : 10,
          paddingTop: 12,
          elevation: 0,
        },
        tabBarItemStyle: { paddingTop: 4 },
      }}
    >
      <Tabs.Screen
        name="home"
        options={{ tabBarIcon: ({ color }) => <TabDot active={color === COLORS.gold} icon="home-outline" /> }}
      />
      <Tabs.Screen
        name="collection"
        options={{ tabBarIcon: ({ color }) => <TabDot active={color === COLORS.gold} icon="albums-outline" /> }}
      />
      <Tabs.Screen
        name="discover"
        options={{
          tabBarIcon: ({ color }) => (
            <View style={[styles.centerPill, color === COLORS.gold && styles.centerPillActive]}>
              <Ionicons name="add" size={20} color={color === COLORS.gold ? COLORS.bg : COLORS.gold} />
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="registry"
        options={{ tabBarIcon: ({ color }) => <TabDot active={color === COLORS.gold} icon="reader-outline" /> }}
      />
      <Tabs.Screen
        name="profile"
        options={{ tabBarIcon: ({ color }) => <TabDot active={color === COLORS.gold} icon="person-outline" /> }}
      />
    </Tabs>
  );
}

function TabDot({ icon, active }: { icon: React.ComponentProps<typeof Ionicons>['name']; active: boolean }) {
  return (
    <View style={styles.tabItem}>
      <Ionicons name={icon} size={18} color={active ? COLORS.gold : COLORS.textMuted} />
      <View style={[styles.dot, active && styles.dotActive]} />
    </View>
  );
}

const styles = StyleSheet.create({
  tabItem: { alignItems: 'center', justifyContent: 'center' },
  dot: {
    width: 3, height: 3, borderRadius: 999,
    backgroundColor: 'transparent',
    marginTop: 6,
  },
  dotActive: { backgroundColor: COLORS.gold },
  centerPill: {
    width: 46, height: 46, borderRadius: 999,
    borderWidth: 1, borderColor: COLORS.goldHairline,
    alignItems: 'center', justifyContent: 'center',
    backgroundColor: COLORS.bgSecondary,
    marginTop: -14,
  },
  centerPillActive: { backgroundColor: COLORS.gold, borderColor: COLORS.gold },
});
