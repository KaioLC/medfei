// frontend/app/schedule_time/[doctor_id].tsx

import { useState } from 'react';
import { 
  View, Text, StyleSheet, Button, Alert, 
  SafeAreaView, TouchableOpacity, ScrollView 
} from 'react-native';
import { Stack, router, useLocalSearchParams } from 'expo-router';
import { GlobalStyles, Colors } from '../../constants/theme';
import api from '../../utils/api';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../../contexts/AuthContext';

// 1. Importe o Calendário
import { Calendar, LocaleConfig } from 'react-native-calendars';

// (Opcional: Traduz o calendário para Português)
LocaleConfig.locales['pt-br'] = {
  monthNames: ['Janeiro','Fevereiro','Março','Abril','Maio','Junho','Julho','Agosto','Setembro','Outubro','Novembro','Dezembro'],
  monthNamesShort: ['Jan.','Fev.','Mar.','Abr.','Mai.','Jun.','Jul.','Ago.','Set.','Out.','Nov.','Dez.'],
  dayNames: ['Domingo','Segunda-feira','Terça-feira','Quarta-feira','Quinta-feira','Sexta-feira','Sábado'],
  dayNamesShort: ['Dom.','Seg.','Ter.','Qua.','Qui.','Sex.','Sáb.'],
  today: 'Hoje'
};
LocaleConfig.defaultLocale = 'pt-br';

// --- (DADOS FALSOS PARA OS HORÁRIOS) ---
// (No futuro, você fará uma API para buscar
//  os horários disponíveis deste médico neste dia)
const MOCK_TIMES = ['09:00', '10:00', '11:00', '14:00', '15:00', '16:00'];
// ----------------------------------------

export default function ScheduleTimeScreen() {
  const { doctor_id } = useLocalSearchParams<{ doctor_id: string }>();
  const { token } = useAuth();

  // Estados para o fluxo de Dia -> Horário
  const [selectedDay, setSelectedDay] = useState<string>(''); // Salva '2025-11-20'
  const [selectedTime, setSelectedTime] = useState<string>(''); // Salva '09:00'

  // --- Lógica de Datas (para desabilitar dias) ---
  const today = new Date();
  const minDateStr = today.toISOString().split('T')[0];
  
  const maxDate = new Date(today);
  maxDate.setMonth(maxDate.getMonth() + 3); // 3 meses no futuro
  const maxDateStr = maxDate.toISOString().split('T')[0];
  // ----------------------------------------------

  // 2. Função chamada quando um dia é clicado no calendário
  const onDayPress = (day: { dateString: string }) => {
    setSelectedDay(day.dateString);
    setSelectedTime(''); // Reseta o horário ao trocar o dia
  };

  // 3. Função para salvar o agendamento
  const handleSaveAppointment = async () => {
    // Validação
    if (!selectedDay || !selectedTime) {
      Alert.alert("Erro", "Por favor, selecione um dia e um horário.");
      return;
    }
    if (!token) {
      Alert.alert("Erro", "Você não está logado.", [{ text: "OK", onPress: () => router.replace('/(auth)/signin') }]);
      return;
    }

    console.log("[FRONTEND] Enviando este token para a API:", token);
    
    const config = {
      headers: {
        Authorization: `Bearer ${token}` // usa o token do useAuth()
      }
    };

    const [hour, minute] = selectedTime.split(':').map(Number);
    const [year, month, day] = selectedDay.split('-').map(Number);

    const finalDate = new Date(year, month - 1, day, hour, minute);

    try {
      const response = await api.post('/api/register_appointments', {
        doctor_id: Number(doctor_id),
        start_time: finalDate.toISOString(), // Envia a data no formato UTC
      }, config
    );

      Alert.alert(
        "Sucesso", 
        response.data.message,
        [{ text: "OK", onPress: () => router.replace('/(tabs)/' as any) }]
      );

    } catch (error: any) {
      console.error("Erro ao salvar consulta:", error);
      const msg = error.response?.data?.message || "Não foi possível salvar a consulta.";
      Alert.alert("Erro", msg); // Mostra o erro do backend (ex: "Horário já agendado")
    }
  };

  return (
    <SafeAreaView style={GlobalStyles.safeArea}>
      <Stack.Screen options={{ headerShown: false }} />
      
      {/* Header Customizado */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="chevron-back" size={32} color={Colors.medfeiBlue} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Escolha o Horário</Text>
        <View style={{width: 40}} />
      </View>

      {/* Usamos ScrollView para o caso da tela ser pequena */}
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={GlobalStyles.specialtyCardContainer}>
          
          {/* --- 5. O CALENDÁRIO --- */}
          <Text style={styles.label}>1. Selecione o dia:</Text>
          <Calendar
            style={styles.calendar}
            // Marca o dia selecionado com a cor azul
            markedDates={{
              [selectedDay]: { selected: true, selectedColor: Colors.medfeiBlue, disableTouchEvent: true }
            }}
            onDayPress={onDayPress}
            
            // Desabilita dias passados e futuros (como você pediu)
            minDate={minDateStr}
            maxDate={maxDateStr}
            
            theme={{
              calendarBackground: 'transparent',
              arrowColor: Colors.medfeiBlue,
              todayTextColor: Colors.primary,
              textSectionTitleColor: Colors.medfeiBlue,
            }}
          />

          {/* --- 6. OS HORÁRIOS (SÓ APARECEM SE UM DIA ESTIVER SELECIONADO) --- */}
          {selectedDay && (
            <View>
              <Text style={styles.label}>2. Selecione o horário:</Text>
              <ScrollView 
                horizontal 
                showsHorizontalScrollIndicator={false}
                style={GlobalStyles.timeSlotContainer}
              >
                {MOCK_TIMES.map((time) => (
                  <TouchableOpacity
                    key={time}
                    style={[
                      GlobalStyles.timeSlotButton,
                      selectedTime === time && GlobalStyles.timeSlotButtonSelected
                    ]}
                    onPress={() => setSelectedTime(time)}
                  >
                    <Text style={[
                      GlobalStyles.timeSlotText,
                      selectedTime === time && GlobalStyles.timeSlotTextSelected
                    ]}>
                      {time}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
          )}

          {/* --- 7. Botão Salvar --- */}
          <TouchableOpacity 
            style={[
              GlobalStyles.homeFullButton,
              // Desabilita o botão se o dia ou hora não estiverem selecionados
              (!selectedDay || !selectedTime) && styles.buttonDisabled
            ]}
            onPress={handleSaveAppointment}
            disabled={!selectedDay || !selectedTime}
          >
            <Text style={GlobalStyles.homeGridButtonText}>Confirmar Agendamento</Text>
          </TouchableOpacity>

        </View>
      </ScrollView>
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
  scrollContainer: {
    flexGrow: 1, // Permite que o ScrollView cresça
  },
  label: {
    ...GlobalStyles.homeSectionTitle,
    textAlign: 'left',
    paddingLeft: 10,
    marginTop: 10,
    fontSize: 18,
  },
  calendar: {
    borderRadius: 10,
    marginBottom: 10,
  },
  buttonDisabled: {
    backgroundColor: Colors.textSecondary, // Cor de botão desabilitado
  }
});