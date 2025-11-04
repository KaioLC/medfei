import { StyleSheet, Text, View, Button, TextInput, Alert, TouchableOpacity, ImageBackground } from 'react-native';
import { useState } from 'react';
import { Link, router } from 'expo-router';
import api from '../../utils/api';
import { GlobalStyles } from '../../constants/theme';
import { useAuth } from '../../contexts/AuthContext';

const feiLogoBackground = require('../../assets/images/fei-logo.png'); 

export default function LoginScreen() {
  const [cpf, setCpf] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useAuth();

  const handleLogin = async () => {

    if (!cpf || !password) {
      Alert.alert("Erro", "Por favor, preencha CPF e senha.");
      return;
    }

    try {
      const response = await api.post('/api/login', { cpf, password });

      const { access_token, user, message } = response.data;

      // console.log("a api enviou: ", JSON.stringify(response.data, null, 2)); //tirar depois por segurança
   
      if (access_token && user) {
        console.log("Fazendo login com token:", access_token);
        await login(access_token, user);
        console.log("Login bem-sucedido, redirecionando...");
        // router.replace('/(tabs)/' as any);
      } else {
        Alert.alert("Erro", "Token de acesso não recebido.");
        console.log("Token de acesso nao recebido");
      }
    } catch (error: any) {
      if (error.response?.data?.message) {
        Alert.alert("Erro no Login", error.response.data.message);
      } else {
        Alert.alert("Erro", "Não foi possível fazer o login.");
      }
    }
  };

  return (
 
    <ImageBackground 
      source={feiLogoBackground} 
      style={GlobalStyles.authBackground}
    >
      <View style={GlobalStyles.authCard}>
        
        <Text style={GlobalStyles.title}>Login</Text>

        <TextInput
          style={GlobalStyles.input}
          placeholder="CPF"
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
        />

        <Button title="Entrar" onPress={handleLogin} />

        <View style={GlobalStyles.linkContainer}>
          <Text>Não tem uma conta? </Text>
          <Link href="/signup" asChild>
            <TouchableOpacity>
              <Text style={GlobalStyles.link}>Cadastre-se</Text>
            </TouchableOpacity>
          </Link>
        </View>

      </View>
    </ImageBackground>
  );
}
