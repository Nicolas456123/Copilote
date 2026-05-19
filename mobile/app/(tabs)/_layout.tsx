import { Tabs } from 'expo-router';
import { Text } from 'react-native';

function Icon({ emoji }: { emoji: string }) {
  return <Text style={{ fontSize: 22 }}>{emoji}</Text>;
}

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#3D405B',
        tabBarInactiveTintColor: '#9CA3AF',
        tabBarStyle: { paddingTop: 6 },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{ title: 'Accueil', tabBarIcon: () => <Icon emoji="🏠" /> }}
      />
      <Tabs.Screen
        name="rappels"
        options={{ title: 'Rappels', tabBarIcon: () => <Icon emoji="🔔" /> }}
      />
      <Tabs.Screen
        name="reve-lucide"
        options={{ title: 'Rêve lucide', tabBarIcon: () => <Icon emoji="🌙" /> }}
      />
    </Tabs>
  );
}
