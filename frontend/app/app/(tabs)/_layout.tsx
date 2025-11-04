import React from 'react';
import { Tabs } from 'expo-router';
import { Colors } from '../../constants/theme';
import { Ionicons } from '@expo/vector-icons';


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
        tabBarActiveTintColor: Colors.medfeiBlue,
        headerShown: false,
      }}>

      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          
          tabBarIcon: ({ color }) => <TabBarIcon name="home" color={color} />,
        }}
      />

      <Tabs.Screen
        name="appointments" 
        options={{
          title: 'Consultas',

          tabBarIcon: ({ color }) => <TabBarIcon name="calendar" color={color} />,
        }}
      />
    </Tabs>
  );
}