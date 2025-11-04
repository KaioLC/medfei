import { View, Text, StyleSheet, ScrollView, TouchableOpacity, SafeAreaView, Alert, Button } from 'react-native';
import { GlobalStyles, Colors } from '../../constants/theme';
import { router } from 'expo-router';
import { useAuth } from '../../contexts/AuthContext';

export default function HomeScreen() {

  const { logout, username } = useAuth();

  return (
  
    <SafeAreaView style={GlobalStyles.safeArea}>
      <ScrollView>
  
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Bem-vindo, {username || 'usuario'}!</Text>
        </View>

        <View style={GlobalStyles.homeCard}>
          

          <View style={GlobalStyles.homeGridContainer}>
            

            <TouchableOpacity 
              style={GlobalStyles.homeGridButton}

              onPress={() => router.push('/schedule_appointments')} 
            >
              <Text style={GlobalStyles.homeGridButtonText}>Consultas</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={GlobalStyles.homeGridButton} 
              onPress={() => Alert.alert("Em breve", "Função não implementada.")}
            >
              <Text style={GlobalStyles.homeGridButtonText}>Tratamentos</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={GlobalStyles.homeGridButton} 
              onPress={() => Alert.alert("Em breve", "Função não implementada.")}
            >
              <Text style={GlobalStyles.homeGridButtonText}>Exames</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={GlobalStyles.homeGridButton} 
              onPress={() => Alert.alert("Em breve", "Função não implementada.")}
            >
              <Text style={GlobalStyles.homeGridButtonText}>Relatórios</Text>
            </TouchableOpacity>
          </View>
          <Text style={GlobalStyles.homeSectionTitle}>Consultas em breve</Text>
          <View>

            <View style={GlobalStyles.appointmentCard}>
              <Text style={GlobalStyles.appointmentCardText}>15 OUT - Especialidade</Text>
              <Text style={GlobalStyles.appointmentCardText}>18:15 Dr. Exemplo</Text>
            </View>
          
            <TouchableOpacity 
              style={GlobalStyles.historyButton}
              onPress={() => router.push('/(tabs)/appointments')} 
            >
              <Text style={GlobalStyles.historyButtonText}>Visualizar histórico</Text>
            </TouchableOpacity>
          </View>

          <Text style={GlobalStyles.homeSectionTitle}>Outros Recursos</Text>
          <TouchableOpacity 
            style={GlobalStyles.homeFullButton}
            onPress={() => Alert.alert("Em breve", "Função não implementada.")}
          >
            <Text style={GlobalStyles.homeGridButtonText}>Atualizar Cadastro</Text>
          </TouchableOpacity>

          <View style={{marginTop: 20}}>
            <Button title="Sair (Logout)" onPress={logout} color={Colors.error} />
          </View>

        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  header: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.medfeiBlue,
  }
});