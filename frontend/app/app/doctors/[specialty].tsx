import { useState, useEffect } from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { Stack, router, useLocalSearchParams } from 'expo-router';
import { GlobalStyles, Colors } from '../../constants/theme';
import api from '../../utils/api';
import { Ionicons } from '@expo/vector-icons';

type Doctor = {
  id: number;
  name: string;
  crm: string;
  specialty: string;
};

export default function DoctorsBySpecialtyScreen() {
  // 1. Pega o parâmetro 'specialty' da URL (ex: "Dermatologista")
  const { specialty } = useLocalSearchParams<{ specialty: string }>();

  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // 2. Busca os médicos filtrados da sua API (GET /api/doctors?specialty=...)
  useEffect(() => {
    if (specialty) { // Garante que a especialidade não seja indefinida
      setIsLoading(true);
      api.get(`/api/doctors`, { 
          params: { specialty: specialty } // Envia a especialidade como um query param
      })
        .then(response => {

          console.log(
            `[FRONTEND] Recebido da API para ${specialty}:`, 
            JSON.stringify(response.data.doctors, null, 2)
          );

          setDoctors(response.data.doctors);
        })
        .catch(error => {
          console.error(`Erro ao buscar médicos para ${specialty}:`, error);
          Alert.alert("Erro", "Não foi possível carregar os médicos.");
        })
        .finally(() => {
          setIsLoading(false);
        });
    }
  }, [specialty]); // Rode esta busca toda vez que o parâmetro 'specialty' mudar

  // 3. Lógica para quando o médico for selecionado
  const handleDoctorPress = (doctor: Doctor) => {
    // Navega para a tela final (a que você chamou de [doctor_id])
    // passando o ID do médico na URL
    router.push(`/schedule_time/${doctor.id}` as any);
  };

  return (
    <SafeAreaView style={GlobalStyles.safeArea}>
      <Stack.Screen options={{ headerShown: false }} />
      
      {/* --- Header Customizado (com botão "Voltar") --- */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="chevron-back" size={32} color={Colors.medfeiBlue} />
        </TouchableOpacity>
        {/* Mostra o nome da especialidade no título */}
        <Text style={styles.headerTitle}>{specialty || 'Médicos'}</Text>
        <View style={{width: 40}} /> {/* Espaçador */}
      </View>

      {/* --- Card Principal Azul Claro --- */}
      <View style={GlobalStyles.specialtyCardContainer}>
        {isLoading ? (
          <ActivityIndicator size="large" color={Colors.medfeiBlue} style={{marginTop: 20}} />
        ) : (
          <ScrollView showsVerticalScrollIndicator={false}>
            {doctors.length === 0 ? (
              <Text style={styles.noResultsText}>Nenhum médico encontrado para esta especialidade.</Text>
            ) : (

              doctors.map((doctor) => (
                <TouchableOpacity 
                  key={doctor.id} 
                  style={GlobalStyles.specialtyButton}
                  onPress={() => handleDoctorPress(doctor)}
                >
                  <View>
                    <Text style={GlobalStyles.specialtyButtonText}>{doctor.name}</Text>
                    <Text style={{color: Colors.medfeiBlue}}>CRM: {doctor.crm}</Text>
                  </View>
                  <Ionicons name="chevron-forward" size={24} color={Colors.medfeiBlue} />
                </TouchableOpacity>
              ))
            )}
          </ScrollView>
        )}
      </View>
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
  noResultsText: {
    textAlign: 'center',
    marginTop: 20,
    fontSize: 16,
    color: Colors.textSecondary,
  }
});