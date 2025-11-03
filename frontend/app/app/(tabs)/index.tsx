// frontend/app/(tabs)/index.tsx

import { View, Text, StyleSheet } from 'react-native';
import { GlobalStyles } from '../../constants/theme';

export default function HomeScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Home (Logado!)</Text>
      <Text style={styles.subtitle}>Você está na área privada do app.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    ...GlobalStyles.container, // Pega o padding e justi/align
    flex: 1,
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    ...GlobalStyles.title, // Pega o estilo de título
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
  },
});