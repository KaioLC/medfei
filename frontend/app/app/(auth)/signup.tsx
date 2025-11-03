
import { 
  StyleSheet, Text, View, Button, TextInput, 
  Alert, SafeAreaView, TouchableOpacity 
} from 'react-native';
import { useState } from 'react';
import { Link, router } from 'expo-router';
import api from '../../utils/api';

import { GlobalStyles, Colors } from '../../constants/theme'; 

export default function CadastroScreen() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [cpf, setCpf] = useState('');
  const [password, setPassword] = useState('');

  const handleRegister = () => {
    if (!username || !email || !password || !cpf) {
      Alert.alert("Erro", "Por favor, preencha todos os campos.");
      return;
    }

    api.post('/api/register', { 
        username, 
        email, 
        password,
        cpf 
    })
      .then(response => {
        Alert.alert(
          "Sucesso", 
          response.data.message,
          [{ text: "OK", onPress: () => router.replace('/signin') }] 
        );
      })
      .catch(error => {
        console.error("Erro ao registrar:", error);
        if (error.response?.data?.message) {
          Alert.alert("Erro no Cadastro", error.response.data.message);
        } else {
          Alert.alert("Erro", "Não foi possível registrar.");
        }
      });
  };

  return (

    <SafeAreaView style={GlobalStyles.safeArea}>
      <View style={[GlobalStyles.container, styles.pageContainer]}>
        
        <Text style={GlobalStyles.title}>Criar Conta</Text>

        <TextInput
          style={GlobalStyles.input}
          placeholder="Nome de usuário"
          value={username}
          onChangeText={setUsername}
          autoCapitalize="none"
        />
        <TextInput
          style={GlobalStyles.input}
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />
        <TextInput
          style={GlobalStyles.input}
          placeholder="CPF (apenas números)"
          value={cpf}
          onChangeText={setCpf}
          keyboardType="numeric"
        />
        <TextInput
          style={GlobalStyles.input}
          placeholder="Senha"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          autoCapitalize="none"
        />

        <Button title="Criar Conta" onPress={handleRegister} />

        <View style={GlobalStyles.linkContainer}>
          <Text>Já tem uma conta? </Text>
          <Link href="/signin" asChild>
            <TouchableOpacity>
              <Text style={GlobalStyles.link}>Faça Login</Text>
            </TouchableOpacity>
          </Link>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  pageContainer: {
    justifyContent: 'center',
  },
});