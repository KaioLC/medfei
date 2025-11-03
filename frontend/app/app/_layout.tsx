// frontend/app/_layout.tsx
import React, { useEffect } from 'react';
import { Stack, router, useSegments } from 'expo-router';
import { View, ActivityIndicator } from 'react-native';

// 1. Importe o PROVEDOR e o HOOK que você criou
import { AuthProvider, useAuth } from '../contexts/AuthContext'; 

// Esta é a nova "casca" do app
export default function RootLayout() {
  return (
    // 2. Envolva todo o aplicativo no AuthProvider
    // Agora o "cérebro" do login está fora do roteador, corrigindo o loop.
    <AuthProvider>
      <RootLayoutNav />
    </AuthProvider>
  );
}

// Este é o "Porteiro" real agora
function RootLayoutNav() {
  const { token, isLoading } = useAuth(); // 3. Pega o estado de login do Contexto
  const segments = useSegments(); // Pega a rota atual

  useEffect(() => {
    // Se o app ainda está carregando o token, não faça nada
    if (isLoading) return; 

    const inAuthGroup = segments[0] === '(auth)';

    if (token && !inAuthGroup) {
      // Se TEM token, mas NÃO está no app (tabs), vá para as tabs
      router.replace('/(tabs)/' as any);
    } else if (!token && !inAuthGroup) {
      // Se NÃO tem token, e NÃO está no auth, vá para o login
      router.replace('/(auth)/signin');
    }
    // Se TEM token e ESTÁ no (tabs) -> não faz nada
    // Se NÃO tem token e ESTÁ no (auth) -> não faz nada (quebra o loop)

  }, [token, isLoading, segments]); // 4. Rode a verificação sempre que o login ou a rota mudar

  // 5. Mostra o "Loading..."
  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  // 6. O "Porteiro" (igual ao de antes)
  // A linha vermelha aqui é um BUG DE CACHE DO VSCODE.
  // Seu código está certo.
  return (
    <Stack>
      <Stack.Screen name="(auth)" options={{ headerShown: false }} />
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen 
        name="schedule_appointments" // Use o nome do seu arquivo
        options={{ presentation: 'modal', title: 'Agendar' }} 
      />
    </Stack>
  );
}