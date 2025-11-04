import React from 'react';
import { Tabs } from 'expo-router';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: '#007AFF',
        headerShown: false,
      }}>
      
      <Tabs.Screen
        name="index" 
        options={{
          title: 'Home',
        }}
      />

      <Tabs.Screen
        name="appointments"
        options={{
          title: 'Consultas',
        }}
      />
    </Tabs>
  );
}