// frontend/app/(auth)/_layout.tsx

import { Stack } from 'expo-router';

// Este é o "Layout de Autenticação"
// Ele define como as telas DENTRO do grupo (auth) são organizadas.
export default function AuthLayout() {
  return (
    // Nós queremos que o login e o cadastro sejam uma "pilha" (Stack)
    // para que você possa navegar de um para o outro.
    <Stack>
      <Stack.Screen
        name="signin" // Aponta para o seu arquivo app/(auth)/signin.tsx
        options={{
          headerShown: false, // Esconde o cabeçalho (ex: "signin")
        }}
      />
      <Stack.Screen
        name="signup" // Aponta para o seu arquivo app/(auth)/signup.tsx
        options={{
          headerShown: false, // Esconde o cabeçalho
        }}
      />
    </Stack>
  );
}