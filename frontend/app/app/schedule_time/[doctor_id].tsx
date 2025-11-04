import { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Button, Alert, Platform, SafeAreaView, TouchableOpacity, ScrollView, ActivityIndicator } from 'react-native';
import { Stack, router, useLocalSearchParams } from 'expo-router';
import { GlobalStyles, Colors } from '../../constants/theme';
import api from '../../utils/api';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../../contexts/AuthContext';
import { Calendar, LocaleConfig } from 'react-native-calendars';


LocaleConfig.locales['pt-br'] = {
  monthNames: ['Janeiro','Fevereiro','Março','Abril','Maio','Junho','Julho','Agosto','Setembro','Outubro','Novembro','Dezembro'],
  monthNamesShort: ['Jan.','Fev.','Mar.','Abr.','Mai.','Jun.','Jul.','Ago.','Set.','Out.','Nov.','Dez.'],
  dayNames: ['Domingo','Segunda-feira','Terça-feira','Quarta-feira','Quinta-feira','Sexta-feira','Sábado'],
  dayNamesShort: ['Dom.','Seg.','Ter.','Qua.','Qui.','Sex.','Sáb.'],
  today: 'Hoje'
};
LocaleConfig.defaultLocale = 'pt-br';


const MOCK_TIMES = ['09:00', '10:00', '11:00', '14:00', '15:00', '16:00'];


export default function ScheduleTimeScreen() {
  const { doctor_id } = useLocalSearchParams<{ doctor_id: string }>();
  const { token } = useAuth();


  const [selectedDay, setSelectedDay] = useState<string>('');
  const [selectedTime, setSelectedTime] = useState<string>('');

  // estados pra controlar a UI
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const today = new Date();
  const minDateStr = today.toISOString().split('T')[0];
  
  const maxDate = new Date(today);
  maxDate.setMonth(maxDate.getMonth() + 3);
  const maxDateStr = maxDate.toISOString().split('T')[0];

  const onDayPress = (day: { dateString: string }) => {
    setSelectedDay(day.dateString);
    setSelectedTime(''); // reseta o horário ao trocar o dia
  };


  const handleSaveAppointment = async () => {

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

    setIsSubmitting(true); // exibe o loading no botao


    const [hour, minute] = selectedTime.split(':').map(Number);
    const [year, month, day] = selectedDay.split('-').map(Number);

    const finalDate = new Date(year, month - 1, day, hour, minute);

    try {
      const response = await api.post('/api/register_appointments', {
        doctor_id: Number(doctor_id),
        start_time: finalDate.toISOString(), // envia a data no formato UTC
      }, config
    );

      Alert.alert(
        "Sucesso", 
        response.data.message,
        [{ text: "OK", onPress: () => router.replace('/(tabs)/' as any) }]
      );

      setIsSuccess(true);

    } catch (error: any) {
      console.error("Erro ao salvar consulta:", error);
      const msg = error.response?.data?.message || "Não foi possível salvar a consulta.";
      Alert.alert("Erro", msg); // mostra o erro do backend
    } finally {
        setIsSubmitting(false); // esconde o loading no botao
    }
  };

  useEffect(() => {
    if (isSuccess) {
      
      const timer = setTimeout(() => {
        
        router.replace('/(tabs)/' as any);
        
      }, 2000);

      return () => clearTimeout(timer);
    }
  }, [isSuccess]); 

  
  if (isSuccess) {
    return (
      <SafeAreaView style={[GlobalStyles.safeArea, styles.successContainer]}>
        <Ionicons name="checkmark-circle" size={80} color={Colors.medfeiBlue} />
        <Text style={styles.successTitle}>Consulta Agendada!</Text>
        <Text style={styles.successSubtitle}>Redirecionando para a Home...</Text>
      </SafeAreaView>
    );
  }


  return (
    <SafeAreaView style={GlobalStyles.safeArea}>
      <Stack.Screen options={{ headerShown: false }} />
      
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="chevron-back" size={32} color={Colors.medfeiBlue} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Escolha o Horário</Text>
        <View style={{width: 40}} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={GlobalStyles.specialtyCardContainer}>
          
          <Text style={styles.label}>1. Selecione o dia:</Text>
          <Calendar
            style={styles.calendar}

            markedDates={{
              [selectedDay]: { selected: true, selectedColor: Colors.medfeiBlue, disableTouchEvent: true }
            }}
            onDayPress={onDayPress}
            
            minDate={minDateStr}
            maxDate={maxDateStr}
            
            theme={{
              calendarBackground: 'transparent',
              arrowColor: Colors.medfeiBlue,
              todayTextColor: Colors.primary,
              textSectionTitleColor: Colors.medfeiBlue,
            }}
          />

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

          <TouchableOpacity 
            style={[
              GlobalStyles.homeFullButton,

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
    flexGrow: 1, 
    paddingBottom: 40,
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
    backgroundColor: Colors.textSecondary,
  },

  successContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.screenBackground,
  },
  successTitle: {
    ...GlobalStyles.title,
    fontSize: 24,
    color: Colors.medfeiBlue,
    marginTop: 15,
  },
  successSubtitle: {
    fontSize: 16,
    color: Colors.textSecondary,
  }
});