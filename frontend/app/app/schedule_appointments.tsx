// frontend/app/schedule_appointments.tsx

import { View, Text, StyleSheet, Button } from 'react-native';
import { Stack, router } from 'expo-router'; // Importa o router para fechar
import { GlobalStyles, Colors } from '../constants/theme'; // Importa estilos

export default function ScheduleAppointmentScreen() {

  // Esta é a aparência que o Expo Router espera para
  // configurar o cabeçalho de um modal.
  const isPresentedAsModal = router.canGoBack();

  return (
    <View style={styles.container}>
      {/* Configura o cabeçalho */}
      <Stack.Screen 
        options={{ 
          title: 'Agendar',
          // Mostra um botão "X" ou "Fechar" se for um modal
          headerLeft: isPresentedAsModal ? () => (
            <Button 
              title="Fechar" 
              onPress={() => router.back()} 
              color={Colors.primary}
            />
          ) : undefined,
        }} 
      />
      
      <Text style={styles.title}>Tela de Agendamento</Text>
      <Text style={styles.subtitle}>Em breve...</Text>

      {/* Botão de fechar para garantir (especialmente no Android) */}
      {!isPresentedAsModal && (
         <View style={{marginTop: 20}}>
            <Button title="Voltar" onPress={() => router.back()} />
         </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    ...GlobalStyles.container,
    flex: 1,
    justifyContent: 'center', // Centraliza o conteúdo
    alignItems: 'center',
  },
  title: {
    ...GlobalStyles.title,
  },
  subtitle: {
    fontSize: 16,
    color: Colors.textSecondary,
  }
});