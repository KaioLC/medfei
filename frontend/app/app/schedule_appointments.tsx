import { View, Text, StyleSheet, SafeAreaView,TextInput, TouchableOpacity, ScrollView, Alert, ActivityIndicator } from 'react-native';
import { Stack, router } from 'expo-router';
import { GlobalStyles, Colors } from '../constants/theme';
import { Ionicons } from '@expo/vector-icons';
import { useState, useEffect } from 'react';
import api from '../utils/api';

export default function ScheduleAppointmentsScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  

  const [specialties, setSpecialties] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);


  useEffect(() => {
    api.get('/api/specialties')
      .then(response => {
        setSpecialties(response.data.specialties);
      })
      .catch(error => {
        console.error("Erro ao buscar especialidades:", error);
        Alert.alert("Erro", "Não foi possível carregar as especialidades.");
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);


  const filteredSpecialties = specialties.filter(spec => 
    spec.toLowerCase().includes(searchQuery.toLowerCase())
  );


  const handleSpecialtyPress = (specialty: string) => {
    router.push(`/doctors/${specialty}` as any);
  };

  return (
    <SafeAreaView style={GlobalStyles.safeArea}>

      <Stack.Screen options={{ headerShown: false }} />
      
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="chevron-back" size={32} color={Colors.medfeiBlue} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Consultas</Text>
        <View style={{width: 40}} />
      </View>

      <View style={GlobalStyles.specialtyCardContainer}>
        
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

        {isLoading ? (
                <ActivityIndicator size="large" color={Colors.medfeiBlue} style={{marginTop: 20}} />
        ) : (
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
});