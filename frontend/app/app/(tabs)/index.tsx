import { 
  StyleSheet, Text, View, Button, TextInput, 
  Alert, ScrollView, SafeAreaView, TouchableOpacity 
} from 'react-native';
import { useState, useEffect } from 'react';
import axios from 'axios';
import Constants from 'expo-constants'; // tira o hardcode do IP

// --- (O CÓDIGO DA API CONTINUA IGUAL) ---
function getApiHostname() {
  // 1. Tenta o 'hostUri' (Ideal para web e alguns emuladores)
  const hostUri = Constants.expoConfig?.hostUri;
  if (hostUri) {
    return hostUri.split(':')[0]; // Ex: "192.168.0.109:8081" -> "192.168.0.109"
  }

  // 2. Tenta o 'linkingUri' (Plano B - Ótimo para Expo Go no celular)
  const linkingUri = Constants.linkingUri;
  if (linkingUri) {
    return linkingUri.replace('exp://', '').split(':')[0];
  }
  
  console.warn("Não foi possível detectar o IP do host, usando 'localhost'.");
  return 'localhost';
}

const hostname = getApiHostname();
const API_URL = `http://${hostname}:5000`; // porta do backend flask;

console.log(`Conectando ao backend em: ${API_URL}`);

const api = axios.create({
  baseURL: API_URL,
});
// --- (FIM DO CÓDIGO DA API) ---


// Molde do usuario (ADICIONADO EMAIL)
type User = { 
  id: number;
  username: string;
  email: string; // Adicionado
  cpf: string;
}

export default function HomeScreen() {

  // --- (ESTADOS ATUALIZADOS) ---
  const [users, setUsers] = useState<User[]>([]);
  
  // Estado para os formulários
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState(''); // Adicionado
  const [password, setPassword] = useState(''); // Adicionado
  const [cpf, setCPF] = useState(''); 

  // Estado para alternar a tela
  const [isLoginView, setIsLoginView] = useState(true); // Começa na tela de Login

  // --- (FUNÇÃO DE BUSCAR USUÁRIOS) ---
  const fetchUsers = () => {
    api.get('/api/users')
      .then(response => {
        setUsers(response.data.users);
      })
      .catch(error => {
        console.error("Erro ao buscar usuários:", error);
        Alert.alert("Erro", "Não foi possível buscar os usuários.");
      });
  };

  useEffect(() => {
    fetchUsers(); // Busca os usuários ao carregar
  }, []);

  // Limpa os campos do formulário
  const clearForm = () => {
    setUsername('');
    setEmail('');
    setPassword('');
    setCPF('');
  };

  // --- (NOVA FUNÇÃO: CADASTRO) ---
  const handleRegister = () => {
    if (!username || !email || !password || !cpf) {
      Alert.alert("Erro", "Por favor, preencha todos os campos para cadastro.");
      return;
    }

    // Chama a rota de registro que criamos no backend
    api.post('/api/register', { username, email, password, cpf })
      .then(response => {
        Alert.alert("Sucesso", response.data.message); // "Usuário registrado..."
        clearForm();
        fetchUsers(); // Atualiza a lista de usuários
        setIsLoginView(true); // Volta para a tela de login
      })
      .catch(error => {
        console.error("Erro ao registrar:", error);
        if (error.response?.data?.message) {
          Alert.alert("Erro no Cadastro", error.response.data.message); // Ex: "Usuário já existe"
        } else {
          Alert.alert("Erro", "Não foi possível registrar.");
        }
      });
  };

  // --- (NOVA FUNÇÃO: LOGIN) ---
  const handleLogin = () => {
    if (!username || !password || !cpf) {
      Alert.alert("Erro", "Por favor, preencha nome de usuário e senha.");
      return;
    }

    // Chama a rota de login que criamos no backend
    api.post('/api/login', { username, password, cpf })
      .then(response => {
        Alert.alert("Sucesso", response.data.message); // "Login bem-sucedido!"
        clearForm();
      })
      .catch(error => {
        console.error("Erro ao logar:", error);
        if (error.response?.data?.message) {
          Alert.alert("Erro no Login", error.response.data.message); // Ex: "Nome de usuário ou senha inválidos."
        } else {
          Alert.alert("Erro", "Não foi possível fazer o login.");
        }
      });
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container}>

        {/* --- ALTERNADOR DE TELA --- */}
        <View style={styles.toggleContainer}>
          <TouchableOpacity 
            style={[styles.toggleButton, isLoginView && styles.toggleButtonActive]} 
            onPress={() => {
              setIsLoginView(true);
              clearForm();
            }}
          >
            <Text style={[styles.toggleText, isLoginView && styles.toggleTextActive]}>Login</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.toggleButton, !isLoginView && styles.toggleButtonActive]} 
            onPress={() => {
              setIsLoginView(false);
              clearForm();
            }}
          >
            <Text style={[styles.toggleText, !isLoginView && styles.toggleTextActive]}>Cadastro</Text>
          </TouchableOpacity>
        </View>

        {/* --- SEÇÃO DE TÍTULO DINÂMICO --- */}
        <Text style={styles.title}>{isLoginView ? "Fazer Login" : "Criar Nova Conta"}</Text>

        {/* --- FORMULÁRIO DE LOGIN (CONDICIONAL) --- */}
        {isLoginView && (
          <View>
            <TextInput
              style={styles.input}
              placeholder="Nome de usuário"
              value={username}
              onChangeText={setUsername}
              autoCapitalize="none"
            />
            <TextInput
              style={styles.input}
              placeholder="Senha"
              value={password}
              onChangeText={setPassword}
              secureTextEntry // Esconde a senha
              autoCapitalize="none"
            />
            <TextInput
              style={styles.input}
              placeholder="CPF"
              value={cpf}
              onChangeText={setCPF}
              autoCapitalize="none"
            />
            <Button title="Entrar" onPress={handleLogin} />
          </View>
        )}

        {/* --- FORMULÁRIO DE CADASTRO (CONDICIONAL) --- */}
        {!isLoginView && (
          <View>
            <TextInput
              style={styles.input}
              placeholder="Nome de usuário"
              value={username}
              onChangeText={setUsername}
              autoCapitalize="none"
            />
            <TextInput
              style={styles.input}
              placeholder="Email"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
            />
            <TextInput
              style={styles.input}
              placeholder="Senha"
              value={password}
              onChangeText={setPassword}
              secureTextEntry // Esconde a senha
              autoCapitalize="none"
            />
            <TextInput
              style={styles.input}
              placeholder="CPF"
              value={cpf}
              onChangeText={setCPF}
              autoCapitalize="none"
            />
            <Button title="Criar Conta" onPress={handleRegister} />
          </View>
        )}
        
        {/* --- LISTA DE USUÁRIOS (PARA DEBUG) --- */}
        <Text style={styles.listTitle}>Usuários no Banco (para Teste)</Text>
        
        {users.length === 0 ? (
          <Text>Nenhum usuário cadastrado.</Text>
        ) : (
          users.map(user => (
            <View key={user.id} style={styles.userItem}>
              <Text style={styles.userText}>ID: {user.id}</Text>
              {/* ATUALIZADO PARA MOSTRAR EMAIL */}
              <Text style={styles.userText}>{user.username} ({user.email})</Text>
            </View>
          ))
        )}

      </ScrollView>
    </SafeAreaView>
  );
}

// --- (ESTILOS ATUALIZADOS) ---
const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  container: {
    padding: 20,
  },
  // Estilos para o alternador
  toggleContainer: {
    flexDirection: 'row',
    marginBottom: 20,
    backgroundColor: '#e0e0e0',
    borderRadius: 8,
    overflow: 'hidden',
  },
  toggleButton: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
  },
  toggleButtonActive: {
    backgroundColor: '#007AFF', // Cor azul do botão
  },
  toggleText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
  },
  toggleTextActive: {
    color: '#fff',
  },
  // Fim dos estilos do alternador
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 15,
    textAlign: 'center',
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