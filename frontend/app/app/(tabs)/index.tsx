import { StyleSheet, Text, View, Button } from 'react-native';
import { useState, useEffect } from 'react';
import axios from 'axios';

const API_URL = 'http://192.168.0.109:5000';

// instância do axios
const api = axios.create({
  baseURL: API_URL,
});

export default function HomeScreen() {
  // para guardar a mensagem da API
  const [message, setMessage] = useState('Carregando...');

  // para buscar os dados
  const fetchHello = () => {
    setMessage('Buscando dados...');

    api.get('/api/hello') //chamada a função hello da API
      .then(response => {
        // salva a mensagem no "estado"
        setMessage(response.data.message);
      })
      .catch(error => {
        // mostra o erro
        console.error("Erro de rede:", error);
        setMessage('Falha ao conectar na API!');
      });
  };
  useEffect(() => {
    fetchHello();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Mensagem do Backend:</Text>
      <Text style={styles.messageText}>{message}</Text>
      
      <Button title="Atualizar Mensagem" onPress={fetchHello} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  messageText: {
    fontSize: 24,
    color: '#333',
    textAlign: 'center',
    marginBottom: 20,
  },
});