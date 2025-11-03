// frontend/app/schedule_appointments.tsx

import { 
  View, Text, StyleSheet, SafeAreaView,
  TextInput, TouchableOpacity, ScrollView, Alert
} from 'react-native';
import { Stack, router } from 'expo-router';
import { GlobalStyles, Colors } from '../constants/theme';
import { Ionicons } from '@expo/vector-icons'; // Importa os ícones
import { useState } from 'react';

// Dados Falsos (Mock Data) para as especialidades
const ESPECIALIDADES = [
  'Clínico geral',
  'Dermatologista',
  'Hematologia',
  'Oftalmologia',
  'Psiquiatria',
  'Cardiologia',
];

export default function ScheduleAppointmentsScreen() {
  const [searchQuery, setSearchQuery] = useState('');

  // Filtra as especialidades baseado na busca
  const filteredSpecialties = ESPECIALIDADES.filter(spec => 
    spec.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSpecialtyPress = (specialty: string) => {
    // PRÓXIMO PASSO: Navegar para a tela de médicos,
    // passando a especialidade como parâmetro.
    Alert.alert(
      "Especialidade Selecionada", 
      `Em breve, você verá os médicos para: ${specialty}`
    );
    // Ex: router.push(`/doctors?specialty=${specialty}`);
  };

  return (
    <SafeAreaView style={GlobalStyles.safeArea}>
      <Stack.Screen options={{ headerShown: false }} />
      
      {/* --- Header Customizado --- */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="chevron-back" size={32} color={Colors.medfeiBlue} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Consultas</Text>
        <View style={{width: 40}} /> {/* Espaçador para centralizar o título */}
      </View>

      {/* --- Card Principal Azul Claro --- */}
      <View style={GlobalStyles.specialtyCardContainer}>
        
        {/* Barra de Busca */}
        <View style={GlobalStyles.searchBarContainer}>
          <Ionicons name="search" size={20} color={Colors.textSecondary} />
          <TextInput
            style={GlobalStyles.searchInput}
            placeholder="Buscar Especialidade..."
            placeholderTextColor={Colors.textSecondary}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>

        {/* Lista de Especialidades */}
        <ScrollView showsVerticalScrollIndicator={false}>
          {filteredSpecialties.map((specialty, index) => (
            <TouchableOpacity 
              key={index} 
              style={GlobalStyles.specialtyButton}
              onPress={() => handleSpecialtyPress(specialty)}
            >
              <Text style={GlobalStyles.specialtyButtonText}>{specialty}</Text>
              <Ionicons name="chevron-forward" size={24} color={Colors.medfeiBlue} />
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

// Estilos locais apenas para o Header desta tela
const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
    paddingVertical: 5,
    backgroundColor: Colors.screenBackground, // Fundo igual ao da tela
  },
  backButton: {
    padding: 5,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: Colors.medfeiBlue,
  },
});