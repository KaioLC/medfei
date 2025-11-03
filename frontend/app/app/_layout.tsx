// frontend/app/_layout.tsx
import React, { useState, useEffect } from 'react';
import { Stack, router } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { View, ActivityIndicator } from 'react-native';

export default function RootLayout() {
  const [isLoading, setIsLoading] = useState(true);
  
  // Este useEffect é o "verificador de login"
  useEffect(() => {
    async function checkLoginStatus() {
      try {
        const token = await AsyncStorage.getItem('userToken');
        
        if (token) {
          // Se tem token, vá para as tabs
          router.replace('/(tabs)/');
        } else {
          // Se NÃO tem token, vá para o signin (seu nome de arquivo)
          router.replace('/(auth)/signin');
        }
      } catch (e) {
        console.error("Falha ao carregar o token", e);
        router.replace('/(auth)/signin'); // Manda para o signin em caso de erro
      } finally {
        setIsLoading(false);
      }
    }

    checkLoginStatus();
  }, []); // O array vazio [] faz isso rodar UMA VEZ no startup

  // Tela de "Carregando..." enquanto o AsyncStorage é verificado
  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  // --- O "PORTEIRO" ---
  // Esta é a parte que corrige o seu erro.
  // Ele define TODAS as suas rotas de "primeiro nível" (os grupos e modais).
  return (
    <Stack>
      {/* 1. Define o grupo (auth) */}
      <Stack.Screen 
        name="(auth)" // Aponta para a pasta /app/(auth)
        options={{ headerShown: false }} 
      />

      {/* 2. Define o grupo (tabs) <-- ESTA LINHA CORRIGE O ERRO */}
      <Stack.Screen 
        name="(tabs)" // Aponta para a pasta /app/(tabs)
        options={{ headerShown: false }} 
      />
      
      {/* 3. Define a tela modal (usando o SEU nome de arquivo) */}
      <Stack.Screen 
        name="schedule_appointments" // Aponta para /app/schedule_appointments.tsx
        options={{ 
          presentation: 'modal',
          title: 'Agendar Consulta'
        }} 
      />
    </Stack>
  );
}