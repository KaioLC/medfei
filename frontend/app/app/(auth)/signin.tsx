import { StyleSheet, Text, View, Button, TextInput, Alert, SafeAreaView, TouchableOpacity } from 'react-native';
import { useState } from 'react';
import { Link, router } from 'expo-router';
import api from '../../utils/api'; // api centralizada
import { GlobalStyles } from '../../constants/theme';
import AsyncStorage from '@react-native-async-storage/async-storage'; // responsavel por salvar o token

export default function LoginScreen() {

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    if (!username || !password) {
      Alert.alert("Erro", "Por favor, preencha o nome de usuário e a senha.");
      return;
    }

    try {

      const response = await api.post('/api/login', { username, password }); // fazendo login

      const { access_token, message } = response.data; // coleta o token

      if (access_token) {

        await AsyncStorage.setItem('userToken', access_token); // salvando o token na memoria do dispositivo
        
        Alert.alert("Sucesso", message);
        
        router.replace('/(tabs)/');

      } else {
        
        Alert.alert("Erro", "Token de acesso não recebido.");

      }

    } catch (error: any) {

        console.error("Erro ao logar:", error);
      if (error.response?.data?.message) {
        Alert.alert("Erro no Login", error.response.data.message);
      } else {
        Alert.alert("Erro", "Não foi possível fazer o login.");

      }
    }
  };

  return (
    <SafeAreaView style={GlobalStyles.safeArea}>
      <View style={[GlobalStyles.container, styles.pageContainer]}>
        
        <Text style={GlobalStyles.title}>Fazer Login</Text>

        <TextInput
          style={GlobalStyles.input}
          placeholder="Nome de usuário"
          value={username}
          onChangeText={setUsername}
          autoCapitalize="none"
        />
        <TextInput
          style={GlobalStyles.input}
          placeholder="Senha"
          value={password}
          onChangeText={setPassword}
          secureTextEntry // Esconde a senha
          autoCapitalize="none"
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
    </SafeAreaView>
  );
}

// O StyleSheet local é mínimo, pois usamos o GlobalStyles
const styles = StyleSheet.create({
  pageContainer: {
    justifyContent: 'center',
  },
});