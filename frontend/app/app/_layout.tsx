import React, { useState, useEffect } from 'react';
import { Stack, router, useSegments } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { View, ActivityIndicator } from 'react-native';
import { AuthProvider, useAuth } from '../contexts/AuthContext';

export default function RootLayout() {
  return (
    <AuthProvider>
      <RootLayoutNav />
    </AuthProvider>
  );
}

function RootLayoutNav() {

  const { token, isLoading } = useAuth();
  const segments = useSegments();

  useEffect(() => {

    if (isLoading) {
      return; 
    }

    const inAuthgroup = segments[0] === '(auth)';

    if (token && inAuthgroup) {
      router.replace('/(tabs)/' as any);
    } 
    else if (!token && !inAuthgroup) {
      router.replace('/(auth)/signin');
    }
  }, [token, isLoading, segments]);

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
            options={{ 
              headerShown: false,
            }} 
      />
      <Stack.Screen 
        name="doctors/[specialty]"
        options={{ headerShown: false }} 
      />
      <Stack.Screen 
        name="schedule_time/[doctor_id]"
        options={{ 
          headerShown: false,
        }} 
      />
    </Stack>
  );
}