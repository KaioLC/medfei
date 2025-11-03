// frontend/app/(tabs)/consultas.tsx
import { View, Text, StyleSheet } from 'react-native';
import { GlobalStyles } from '../../constants/theme';

export default function ConsultasScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Minhas Consultas</Text>
      <Text>Aqui vamos listar as consultas do usuário logado.</Text>
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
  },
});