// frontend/app/schedule_time/[doctor_id].tsx

import { useState } from 'react';
import { 
  View, Text, StyleSheet, Button, TextInput, Alert, 
  Platform, SafeAreaView, TouchableOpacity
} from 'react-native';
import { Stack, router, useLocalSearchParams } from 'expo-router';
import { GlobalStyles, Colors } from '../../constants/theme';
import api from '../../utils/api';
import { Ionicons } from '@expo/vector-icons';

// 1. Importe o Seletor de Data/Hora
import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';
import { useAuth } from '../../contexts/AuthContext'; // Para o token

export default function ScheduleTimeScreen() {
  // 2. Pega o ID do médico da URL (ex: "5")
  const { doctor_id } = useLocalSearchParams<{ doctor_id: string }>();
  const { token } = useAuth(); // Pega o token de login

  // Estados para o formulário
  const [date, setDate] = useState(new Date()); // Começa com a data/hora atual
  
  // Controla a UI
  // No iOS é melhor sempre mostrar, no Android usamos um botão
  const [showDatePicker, setShowDatePicker] = useState(Platform.OS === 'ios');

  // 3. Função para lidar com a mudança de data
  const onDateChange = (event: DateTimePickerEvent, selectedDate?: Date) => {
    const currentDate = selectedDate || date;
    // No Android, o seletor fecha sozinho. No iOS, ele fica aberto.
    setShowDatePicker(Platform.OS === 'ios');
    setDate(currentDate);
  };

  // 4. Função para SALVAR a consulta (chama a API)
  const handleSaveAppointment = async () => {
    // Verificação de segurança
    if (!token) {
      Alert.alert("Erro", "Você não está logado.", [{ text: "OK", onPress: () => router.replace('/(auth)/signin') }]);
      return;
    }
    
    try {
      // 5. Envia os dados para a rota que criamos no backend
      //    (O 'api' (axios) já está configurado com o token pelo AuthContext)
      const response = await api.post('/api/register_appointments', {
        doctor_id: Number(doctor_id), // Converte o ID da URL (string) para número
        start_time: date.toISOString(), // Envia a data no formato padrão
      });

      // 6. Sucesso!
      Alert.alert(
        "Sucesso", 
        response.data.message, // "Consulta agendada com sucesso!"
        [
          // 7. Manda o usuário de volta para a Home (pulando 3 telas)
          { text: "OK", onPress: () => router.replace('/(tabs)/' as any) }
        ]
      );

    } catch (error: any) {
      console.error("Erro ao salvar consulta:", error);
      // Mostra o erro do backend (ex: "Horário já agendado para este médico.")
      const msg = error.response?.data?.message || "Não foi possível salvar a consulta.";
      Alert.alert("Erro", msg); 
    }
  };

  return (
    <SafeAreaView style={GlobalStyles.safeArea}>
      <Stack.Screen options={{ headerShown: false }} />
      
      {/* --- Header Customizado --- */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="chevron-back" size={32} color={Colors.medfeiBlue} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Escolha o Horário</Text>
        <View style={{width: 40}} />
      </View>

      <View style={GlobalStyles.specialtyCardContainer}>
        
        {/* --- Seletor de Data/Hora --- */}
        <Text style={styles.label}>Escolha a Data e Hora:</Text>
        
        {/* Botão para abrir o seletor no Android */}
        {Platform.OS === 'android' && (
          <Button title="Escolher Data/Hora" onPress={() => setShowDatePicker(true)} />
        )}
        
        {/* O Seletor (Visível no iOS, ou quando 'showDatePicker' é true no Android) */}
        {showDatePicker && (
          <DateTimePicker
            testID="dateTimePicker"
            value={date}
            mode="datetime" // Permite escolher data E hora
            is24Hour={true}
            display="default" // "spinner" ou "calendar" também são opções
            onChange={onDateChange}
            minimumDate={new Date()} // Não deixa agendar no passado
          />
        )}
        
        {/* Mostra a data selecionada */}
        <Text style={styles.dateText}>Selecionado: {date.toLocaleString()}</Text>

        {/* --- Botão Salvar --- */}
        <TouchableOpacity 
          style={GlobalStyles.homeFullButton} // Reutiliza o estilo de botão azul
          onPress={handleSaveAppointment}
        >
          <Text style={GlobalStyles.homeGridButtonText}>Confirmar Agendamento</Text>
        </TouchableOpacity>

      </View>
    </SafeAreaView>
  );
}

// --- (Estilos locais) ---
const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
    paddingVertical: 5,
    backgroundColor: Colors.screenBackground,
  },
  backButton: {
    padding: 5,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: Colors.medfeiBlue,
  },
  label: {
    ...GlobalStyles.homeSectionTitle, // Reutiliza o estilo de título
    textAlign: 'left',
    paddingLeft: 10,
  },
  dateText: {
    fontSize: 16,
    textAlign: 'center',
    marginVertical: 15,
    color: Colors.textSecondary,
    fontWeight: '500',
  },
});