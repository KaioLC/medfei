import { useState, useEffect } from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, ActivityIndicator, Alert, Button, TouchableOpacity } from 'react-native';
import { Stack, router } from 'expo-router';
import { GlobalStyles, Colors } from '../../constants/theme';
import { useAuth } from '../../contexts/AuthContext';
import api from '../../utils/api';
import { Ionicons } from '@expo/vector-icons';

type Appointment = {
  id: number;
  appointment_date: string;
  created_at: string;
  doctor_id: number;
  user_id: number;
  doctor_name: string;
  doctor_specialty: string;
};

export default function AppointmentsScreen() {
  const { token } = useAuth();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchAppointments = async () => {
    if (!token) {
      Alert.alert("Erro", "Você não está logado.", [{ text: "OK", onPress: () => router.replace('/(auth)/signin') }]);
      return;
    }

    setIsLoading(true);
    try {
   
      const config = {
        headers: { Authorization: `Bearer ${token}` }
      };
      

      const response = await api.get('/api/appointments', config);
      
      setAppointments(response.data.appointments);

    } catch (error: any) {
      console.error("Erro ao buscar consultas:", error);
      const msg = error.response?.data?.message || "Não foi possível buscar suas consultas.";
      Alert.alert("Erro", msg);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, []);


  const formatDateTime = (isoString: string) => {
    const date = new Date(isoString);

    if (isNaN(date.getTime())) {
    return "Data Inválida";
  }


    return date.toLocaleString('pt-BR', {
      year: 'numeric',
      day: '2-digit',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <SafeAreaView style={GlobalStyles.safeArea}>

      <Stack.Screen options={{ 
        title: 'Minhas Consultas',
        headerShown: true,
        headerRight: () => (

            <TouchableOpacity onPress={fetchAppointments} style={{marginRight: 15}}>
            <Ionicons name="refresh" size={24} color={Colors.medfeiBlue} />
          </TouchableOpacity>

        )
      }} />

      {isLoading ? (

          <View style={styles.centerContainer}>

          <ActivityIndicator size="large" color={Colors.medfeiBlue} />
          <Text style={styles.loadingText}>Buscando suas consultas...</Text>

        </View>
      ) : appointments.length === 0 ? (

          <View style={styles.centerContainer}>

          <Text style={styles.emptyText}>Você ainda não agendou nenhuma consulta.</Text>
          <Button title="Agendar Agora" onPress={() => router.push('/schedule_appointments')} />

        </View>
      ) : (
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          {appointments.map(appt => (
            <View key={appt.id} style={GlobalStyles.appointmentCard}>
              <Text style={styles.specialtyText}>{appt.doctor_specialty}</Text>
              <Text style={styles.doctorText}>{appt.doctor_name}</Text>
              <Text style={styles.dateText}>
                {formatDateTime(appt.appointment_date)}
              </Text>
            </View>
          ))}
        </ScrollView>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  scrollContainer: {
    padding: 15,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: Colors.textSecondary,
  },
  emptyText: {
    fontSize: 18,
    color: Colors.textSecondary,
    textAlign: 'center',
    marginBottom: 20,
  },

  specialtyText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.medfeiBlue,
  },
  doctorText: {
    fontSize: 16,
    color: Colors.medfeiBlue,
    marginVertical: 4,
  },
  dateText: {
    fontSize: 16,
    color: Colors.textSecondary,
    fontWeight: '500',
  }
});