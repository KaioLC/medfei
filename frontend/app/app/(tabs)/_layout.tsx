// frontend/app/(tabs)/_layout.tsx
import React from 'react';
import { Tabs } from 'expo-router';
import { Colors } from '../../constants/theme'; // Importa suas cores
import { Ionicons } from '@expo/vector-icons'; // Importa os ícones

// 1. Função auxiliar para o ícone
//    Ela recebe 'focused' (se a aba está ativa) e 'color' (a cor padrão)
function TabBarIcon(props: {
  name: React.ComponentProps<typeof Ionicons>['name'];
  color: string;
}) {
  return <Ionicons size={28} style={{ marginBottom: -3 }} {...props} />;
}

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors.medfeiBlue, // Usa a cor do seu tema
        headerShown: false, // Continua falso (cada tela cuida do seu header)
      }}>
      
      {/* --- Aba 1: Home --- */}
      <Tabs.Screen
        name="index" // app/(tabs)/index.tsx
        options={{
          title: 'Home',
          // 2. ADICIONA O ÍCONE
          tabBarIcon: ({ color }) => <TabBarIcon name="home" color={color} />,
        }}
      />

      {/* --- Aba 2: Consultas --- */}
      <Tabs.Screen
        name="appointments" // app/(tabs)/appointments.tsx
        options={{
          title: 'Consultas',
          // 3. ADICIONA O ÍCONE
          tabBarIcon: ({ color }) => <TabBarIcon name="calendar" color={color} />,
        }}
      />
    </Tabs>
  );
}