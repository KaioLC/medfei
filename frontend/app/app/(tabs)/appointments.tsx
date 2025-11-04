import { useState, useEffect } from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, ActivityIndicator, Alert, Button, TouchableOpacity } from 'react-native';
import { Stack, router } from 'expo-router';
import { GlobalStyles, Colors } from '../../constants/theme';
import { useAuth } from '../../contexts/AuthContext'; // Para o token
import api from '../../utils/api';
import { Ionicons } from '@expo/vector-icons'; // Para o ícone de recarregar

// 1. Define o "molde" da consulta (agora com os dados do médico)
type Appointment = {
  id: number;
  appointment_date: string; // Vem como string ISO (ex: "2025-11-05T10:00:00")
  created_at: string;
  doctor_id: number;
  user_id: number;
  doctor_name: string; // <-- O NOVO DADO!
  doctor_specialty: string; // <-- O NOVO DADO!
};

export default function AppointmentsScreen() {
  const { token } = useAuth(); // Pega o token de login
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // 2. Função para buscar os dados da API
  const fetchAppointments = async () => {
    if (!token) {
      Alert.alert("Erro", "Você não está logado.", [{ text: "OK", onPress: () => router.replace('/(auth)/signin') }]);
      return;
    }

    setIsLoading(true); // Mostra o "loading"
    try {
      // 3. Cria o cabeçalho de autorização (o método 100% seguro)
      const config = {
        headers: { Authorization: `Bearer ${token}` }
      };
      
      // 4. Chama a rota privada que acabamos de turbinar
      const response = await api.get('/api/appointments', config);
      
      setAppointments(response.data.appointments); // Salva no estado

    } catch (error: any) {
      console.error("Erro ao buscar consultas:", error);
      const msg = error.response?.data?.message || "Não foi possível buscar suas consultas.";
      Alert.alert("Erro", msg);
    } finally {
      setIsLoading(false); // Esconde o "loading"
    }
  };

  // 5. Busca os dados quando a tela é aberta
  useEffect(() => {
    fetchAppointments();
  }, []); // O [] faz rodar uma vez

  // 6. Função para formatar a data (para ficar amigável)
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
      {/* O _layout.tsx das (tabs) já cuida do título "Consultas" */}
      <Stack.Screen options={{ 
        title: 'Minhas Consultas',
        headerShown: true, // Garante que o header da Tab seja visível
        headerRight: () => (
          // Adiciona um botão de "Recarregar"
          <TouchableOpacity onPress={fetchAppointments} style={{marginRight: 15}}>
            <Ionicons name="refresh" size={24} color={Colors.medfeiBlue} />
          </TouchableOpacity>
        )
      }} />

      {/* --- 7. Renderização da Tela --- */}
      {isLoading ? (
        // Se estiver carregando...
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color={Colors.medfeiBlue} />
          <Text style={styles.loadingText}>Buscando suas consultas...</Text>
        </View>
      ) : appointments.length === 0 ? (
        // Se não tiver consultas...
        <View style={styles.centerContainer}>
          <Text style={styles.emptyText}>Você ainda não agendou nenhuma consulta.</Text>
          <Button title="Agendar Agora" onPress={() => router.push('/schedule_appointments')} />
        </View>
      ) : (
        // Se tiver consultas...
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          {appointments.map(appt => (
            // Reutiliza o estilo de card da Home
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

// --- (Estilos locais para esta tela) ---
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
  // Estilos para o Card de Consulta
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