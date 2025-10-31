import { StyleSheet, Text, View, Button, TextInput, Alert, ScrollView, SafeAreaView } from 'react-native';
import { useState, useEffect } from 'react';
import axios from 'axios';
import Constants from 'expo-constants'; // tira o hardcode do IP
import { get } from 'react-native/Libraries/TurboModule/TurboModuleRegistry';

// pegando o IP dinamicamente

function getApiHostname() {

  // pega o hostUri das variaveis de ambiente do expo
  const hostUri = Constants.expoConfig?.extra?.hostUri;
  // separa o hostname da porta
  if(hostUri) {
    return hostUri.split(':')[0];
  }
  // pega o linkingUri das variaveis de ambiente do expo
  const linkingUri = Constants.linkingUri;
  if(linkingUri) {
    // separa o hostname da porta
    return linkingUri.replace('exp://', '').split(':')[0];
  }

  console.warn("Não foi possível detectar o IP do host, usando localhost");
  return 'localhost';
}

const hostname = getApiHostname();
const API_URL =  `http://${hostname}:5000`; // porta do backend flask;

console.log(`Conectando ao backend em: ${API_URL}`); // debugando o URL do back

const api = axios.create({
  baseURL: API_URL,
});

// molde do usuario
type User = { 
  id: number;
  username: string;
}

export default function HomeScreen() {

  // estado para a lista de users do banco
  const [users, setUsers] = useState<User[]>([]); // definindo uma lista de usuarios pro estado
  
  // estados para os formulários
  const [username, setUsername] = useState('');

  // busca os users
  const fetchUsers = () => {
    api.get('/api/users') // chama a rota GET /api/users
      .then(response => {
        setUsers(response.data.users); // salva a lista de usuários no estado
      })
      .catch(error => {
        console.error("Erro ao buscar usuários:", error);
        Alert.alert("Erro", "Não foi possível buscar os usuários.");
      });
  };
  // busca os users ao carregar o componente
  useEffect(() => {
    fetchUsers(); // busca os usuários ao carregar
  }, []);

  // salva o novo usuário
  const handleSaveUser = () => {

    // nao deixa salvar se o nome estiver vazio
    if (!username) {
      Alert.alert("Erro", "Por favor, preencha o nome e o email.");
      return;
    }

    // envia os dados do estado para o backend
    api.post('/api/users', { username })
      .then(response => {

        // sem erros
        Alert.alert("Sucesso", response.data.message); // exibe a mensagem do flask
        setUsername(''); //limpa o campo
        fetchUsers(); // atualiza a lista de usuarios na tela
        }) 
      .catch(error => {
        console.error("Erro ao salvar usuário:", error);
        Alert.alert("Erro", "Não foi possível salvar o usuário.");
      });
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container}>

        <Text style={styles.title}>Adicionar Novo Usuário</Text>
        <TextInput
          style={styles.input}
          placeholder="Nome de usuário"
          value={username}
          onChangeText={setUsername}
          autoCapitalize="none"
        />
        <Button title="Salvar Usuário no Banco" onPress={handleSaveUser} />
        
        <Text style={styles.listTitle}>Usuários no Banco</Text>
        
        {users.length === 0 ? (
          <Text>Nenhum usuário cadastrado.</Text>
        ) : (
          users.map(user => (
            <View key={user.id} style={styles.userItem}>
              <Text style={styles.userText}>ID: {user.id}</Text>
              <Text style={styles.userText}>{user.username}</Text>
            </View>
          ))
        )}

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  container: {
    padding: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  input: {
    height: 44,
    backgroundColor: '#fff',
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 15,
    marginBottom: 10,
    fontSize: 16,
  },
  listTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 30,
    marginBottom: 10,
    borderTopColor: '#ccc',
    borderTopWidth: 1,
    paddingTop: 20,
  },
  userItem: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
    borderColor: '#eee',
    borderWidth: 1,
  },
  userText: {
    fontSize: 16,
  },
});