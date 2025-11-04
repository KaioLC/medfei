import { View, Text, StyleSheet, ScrollView, TouchableOpacity, SafeAreaView, Alert, Button, ActivityIndicator } from 'react-native';
import { GlobalStyles, Colors } from '../../constants/theme';
import { router, useFocusEffect, Stack } from 'expo-router';
import { useAuth } from '../../contexts/AuthContext';
import { useState, useCallback, useMemo } from 'react';
import api from '../../utils/api';
import { Ionicons } from '@expo/vector-icons';


type Appointment = {
  id: number;
  appointment_date: string;
  doctor_name: string;
  doctor_specialty: string;

};

export default function HomeScreen() {
  const { logout, username, token } = useAuth();

  const [allAppointments, setAllAppointments] = useState<Appointment[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const formatDateTime = (isoString: string) => {
    const date = new Date(isoString);
    if (isNaN(date.getTime())) return "Data Inválida";
    return date.toLocaleString('pt-BR', {
      day: '2-digit',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  // função para buscar os dados da API
  // 'useCallback' para que ela seja estável
  const fetchAppointments = useCallback(async () => {
    if (!token) return;

    setIsLoading(true);
    try {
      const config = { headers: { Authorization: `Bearer ${token}` } };
      const response = await api.get('/api/appointments', config);
      setAllAppointments(response.data.appointments);
    } catch (error) {
      console.error("Erro ao buscar consultas na Home:", error);
      
    } finally {
      setIsLoading(false);
    }
  }, [token]);

  useFocusEffect(
    useCallback(() => {
      fetchAppointments();
    }, [fetchAppointments])
  );

  const upcomingAppointment = useMemo(() => {
    const now = new Date();

    const futureAppointments = allAppointments.filter(appt => 
      new Date(appt.appointment_date) > now
    );
    
    if (futureAppointments.length === 0) {
      return null;
    }

    futureAppointments.sort((a, b) => 
      new Date(a.appointment_date).getTime() - new Date(b.appointment_date).getTime()
    );

    return futureAppointments[0];

  }, [allAppointments]);

  return (
    <SafeAreaView style={GlobalStyles.safeArea}>

      <Stack.Screen 
        options={{
          headerShown: true,
          headerStyle: { backgroundColor: Colors.screenBackground },
          headerShadowVisible: false,
          headerTitleAlign: 'center',
          
          headerTitle: () => (
            <Text style={styles.headerTitle}>
              Bem-vindo, {username || ''}!
            </Text>
          ),
          
          headerRight: () => (
            <TouchableOpacity onPress={logout} style={{ marginRight: 15 }}>
              <Ionicons name="log-out-outline" size={28} color={Colors.error} />
            </TouchableOpacity>
          ),
          headerLeft: () => null,
        }}
      />    
        <View style={GlobalStyles.homeCard}>
          
          <View style={GlobalStyles.homeGridContainer}>
            <TouchableOpacity 
              style={GlobalStyles.homeGridButton}
              onPress={() => router.push('/schedule_appointments')}
            >
              <Text style={GlobalStyles.homeGridButtonText}>Consultas</Text>
            </TouchableOpacity>
            <TouchableOpacity style={GlobalStyles.homeGridButton} onPress={() => Alert.alert("Em breve")}><Text style={GlobalStyles.homeGridButtonText}>Tratamentos</Text></TouchableOpacity>
            <TouchableOpacity style={GlobalStyles.homeGridButton} onPress={() => Alert.alert("Em breve")}><Text style={GlobalStyles.homeGridButtonText}>Exames</Text></TouchableOpacity>
            <TouchableOpacity style={GlobalStyles.homeGridButton} onPress={() => Alert.alert("Em breve")}><Text style={GlobalStyles.homeGridButtonText}>Relatórios</Text></TouchableOpacity>
          </View>

          <Text style={GlobalStyles.homeSectionTitle}>Consultas em breve</Text>
          
          {isLoading ? (
            <ActivityIndicator color={Colors.medfeiBlue} />
          ) : upcomingAppointment ? (
            <View style={GlobalStyles.appointmentCard}>
              <Text style={GlobalStyles.appointmentCardText}>
                {upcomingAppointment.doctor_specialty}
              </Text>
              <Text style={GlobalStyles.appointmentCardText}>
                {upcomingAppointment.doctor_name}
              </Text>
              <Text style={styles.upcomingDateText}>
                {formatDateTime(upcomingAppointment.appointment_date)}
              </Text>
            </View>
          ) : (
            <View style={GlobalStyles.appointmentCard}>
              <Text style={styles.noUpcomingText}>
                Nenhuma consulta futura agendada.
              </Text>
            </View>
          )}
          
          <TouchableOpacity 
            style={GlobalStyles.historyButton}
            onPress={() => router.push('/(tabs)/appointments')}
          >
            <Text style={GlobalStyles.historyButtonText}>Visualizar histórico</Text>
          </TouchableOpacity>

          <Text style={GlobalStyles.homeSectionTitle}>Outros Recursos</Text>
          <TouchableOpacity 
            style={GlobalStyles.homeFullButton}
            onPress={() => Alert.alert("Em breve", "Função não implementada.")}
          >
            <Text style={GlobalStyles.homeGridButtonText}>Atualizar Cadastro</Text>
          </TouchableOpacity>
          <View style={{marginTop: 20}}>
          </View>

        </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  header: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.medfeiBlue,
  },

  upcomingDateText: {
    ...GlobalStyles.appointmentCardText,
    fontWeight: 'bold',
    marginTop: 5,
  },
  noUpcomingText: {
    ...GlobalStyles.appointmentCardText,
    textAlign: 'center',
    fontStyle: 'italic',
    color: Colors.textSecondary,
  },
});