import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { View, Platform } from 'react-native';
import { COLORS } from '@/src/theme';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: COLORS.gold,
        tabBarInactiveTintColor: COLORS.textMuted,
        tabBarStyle: {
          backgroundColor: COLORS.bg,
          borderTopColor: COLORS.border,
          borderTopWidth: 1,
          height: Platform.OS === 'ios' ? 84 : 68,
          paddingBottom: Platform.OS === 'ios' ? 24 : 10,
          paddingTop: 8,
        },
        tabBarLabelStyle: { fontSize: 10, letterSpacing: 2, fontWeight: '500' },
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          title: 'HOME',
          tabBarIcon: ({ color }) => <Ionicons name="diamond-outline" size={20} color={color} />,
        }}
      />
      <Tabs.Screen
        name="collection"
        options={{
          title: 'COLEÇÃO',
          tabBarIcon: ({ color }) => <Ionicons name="grid-outline" size={20} color={color} />,
        }}
      />
      <Tabs.Screen
        name="discover"
        options={{
          title: 'DESCOBRIR',
          tabBarIcon: ({ color }) => (
            <View
              style={{
                width: 42, height: 42, borderRadius: 21,
                borderWidth: 1, borderColor: color, alignItems: 'center', justifyContent: 'center',
                marginTop: -12, backgroundColor: COLORS.bg,
              }}
            >
              <Ionicons name="add" size={22} color={color} />
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="registry"
        options={{
          title: 'REGISTRO',
          tabBarIcon: ({ color }) => <Ionicons name="library-outline" size={20} color={color} />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'PERFIL',
          tabBarIcon: ({ color }) => <Ionicons name="person-outline" size={20} color={color} />,
        }}
      />
    </Tabs>
  );
}
