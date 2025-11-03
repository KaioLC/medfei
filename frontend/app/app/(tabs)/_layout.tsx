// frontend/app/(tabs)/_layout.tsx
import React from 'react';
import { Tabs } from 'expo-router';
// Você pode querer instalar o react-native-vector-icons para os ícones
// npx expo install @expo/vector-icons

// (Vamos usar ícones de texto simples por enquanto)

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: '#007AFF', // Cor da aba ativa
        headerShown: false, // Vamos esconder o header padrão
      }}>
      
      {/* --- Aba 1: Home --- */}
      <Tabs.Screen
        name="index" // Aponta para o arquivo app/(tabs)/index.tsx
        options={{
          title: 'Home', // Texto na barra de abas
          // tabBarIcon: ({ color }) => <Text style={{ color: color }}>🏠</Text>,
        }}
      />

      {/* --- Aba 2: Consultas --- */}
      <Tabs.Screen
        name="appointments" // Aponta para o arquivo app/(tabs)/consultas.tsx
        options={{
          title: 'Consultas', // Texto na barra de abas
          // tabBarIcon: ({ color }) => <Text style={{ color: color }}>🗓️</Text>,
        }}
      />
    </Tabs>
  );
}