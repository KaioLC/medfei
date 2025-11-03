// frontend/app/_layout.tsx
import React, { useState, useEffect } from 'react';
import { Stack, router } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { View, ActivityIndicator } from 'react-native';
import { AuthProvider, useAuth } from '../contexts/AuthContext'; // Importe os dois

export default function RootLayout() {
  return (
    <AuthProvider>
      <RootLayoutNav />
    </AuthProvider>
  );
}

function RootLayoutNav() {
  const { token, isLoading } = useAuth();

  useEffect(() => {
    if (isLoading) {
      return; 
    }

    if (token) {
      router.replace('/(tabs)/' as any);
    } else {
      router.replace('/(auth)/signin');
    }
  }, [isLoading, token]);
  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <Stack>
      <Stack.Screen name="(auth)" options={{ headerShown: false }} />
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen 
        name="schedule_appointments"
        options={{ presentation: 'modal', title: 'Agendar' }} 
      />
    </Stack>
  );
}