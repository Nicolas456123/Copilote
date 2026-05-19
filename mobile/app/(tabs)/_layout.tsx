import { Tabs } from 'expo-router';
import { Text, useColorScheme } from 'react-native';

function Icon({ emoji }: { emoji: string }) {
  return <Text style={{ fontSize: 20 }}>{emoji}</Text>;
}

export default function TabsLayout() {
  const scheme = useColorScheme();
  const isDark = scheme === 'dark';
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: isDark ? '#ECECF5' : '#3D405B',
        tabBarInactiveTintColor: isDark ? '#6B6D86' : '#9CA3AF',
        tabBarStyle: {
          paddingTop: 6,
          backgroundColor: isDark ? '#1A1B29' : '#FFFFFF',
          borderTopColor: isDark ? '#2A2C42' : '#E5E7EB',
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{ title: 'Accueil', tabBarIcon: () => <Icon emoji="🏠" /> }}
      />
      <Tabs.Screen
        name="habitudes"
        options={{ title: 'Habitudes', tabBarIcon: () => <Icon emoji="✅" /> }}
      />
      <Tabs.Screen
        name="oreille"
        options={{ title: 'Oreille', tabBarIcon: () => <Icon emoji="🎹" /> }}
      />
      <Tabs.Screen
        name="reve-lucide"
        options={{ title: 'Rêve', tabBarIcon: () => <Icon emoji="🌙" /> }}
      />
      <Tabs.Screen
        name="rappels"
        options={{ title: 'Rappels', tabBarIcon: () => <Icon emoji="🔔" /> }}
      />
    </Tabs>
  );
}
