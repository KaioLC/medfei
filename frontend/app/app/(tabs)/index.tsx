// frontend/app/(tabs)/index.tsx

import { View, Text, StyleSheet, Button } from 'react-native';
import { GlobalStyles, Colors } from '../../constants/theme';
import { router } from 'expo-router';
import { useAuth } from '../../contexts/AuthContext';

export default function HomeScreen() {

  const { logout } = useAuth();

  const handleLogout = () => {
    logout();
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Home (Logado!)</Text>
      <Text style={styles.subtitle}>Você está na área privada do app.</Text>
      
      <View style={styles.buttonContainer}>
        <Button 
          title="Agendar Consulta" 
          onPress={() => router.push('/schedule_appointments')} 
        />
      </View>

      <View style={styles.logoutButtonContainer}>
        <Button 
          title="Sair (Logout)"
          onPress={handleLogout}
          color={Colors.error}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    ...GlobalStyles.container,
    flex: 1,
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    ...GlobalStyles.title,
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
  },
  buttonContainer: {
    marginTop: 30,
    width: '80%',
  },

  logoutButtonContainer: {
    marginTop: 20,
    width: '80%',
  }
});