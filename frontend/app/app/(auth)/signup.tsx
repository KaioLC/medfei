import { StyleSheet, Text, View, Button, TextInput, Alert, TouchableOpacity, ImageBackground, SafeAreaView, ActivityIndicator } from 'react-native';
import { useState, useEffect } from 'react';
import { Link, router } from 'expo-router';
import api from '../../utils/api';
import { GlobalStyles, Colors } from '../../constants/theme'; // estilos globais
import { Ionicons } from '@expo/vector-icons';

const feiLogoBackground = require('../../assets/images/fei-logo.png'); 

export default function CadastroScreen() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [cpf, setCpf] = useState('');
  const [password, setPassword] = useState('');

  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isSuccess) {
      
      const timer = setTimeout(() => {
        
        router.replace('/(auth)/signin');
        
      }, 2000);

      return () => clearTimeout(timer);
    }
  }, [isSuccess]);

  const handleRegister = () => {
    
    setError(null);
    setIsLoading(true);

    if (!username || !email || !password || !cpf) {
      setError("Por favor, preencha todos os campos.");
      setIsLoading(false);
      return;
    }

    api.post('/api/register', { 
      username, 
      email, 
      password, 
      cpf 
    })
      .then(response => {
        setIsSuccess(true);
      })
      .catch(error => {
        if (error.response?.data?.message) {
          setError(error.response.data.message);
        } else {
          setError("Não foi possível registrar.");
        }
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  if (isSuccess) {
    return (
      <SafeAreaView style={[GlobalStyles.safeArea, styles.successContainer]}>
        <Ionicons name="checkmark-circle" size={80} color={Colors.medfeiBlue} />
        <Text style={styles.successTitle}>Cadastro Concluído!</Text>
        <Text style={styles.successSubtitle}>Redirecionando para o login...</Text>
      </SafeAreaView>
    );
  }

  return (

    <ImageBackground 
      source={feiLogoBackground} 
      style={GlobalStyles.authBackground}
    >

      <View style={GlobalStyles.authCard}>
        
        <Text style={GlobalStyles.title}>Criar Conta</Text>

        <TextInput
          style={GlobalStyles.input}
          placeholder="Nome de usuário"
          value={username}
          onChangeText={setUsername}
          autoCapitalize="none"
          editable={!isLoading}
        />
        <TextInput
          style={GlobalStyles.input}
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
          editable={!isLoading}
        />
        <TextInput
          style={GlobalStyles.input}
          placeholder="CPF (apenas números)"
          value={cpf}
          onChangeText={setCpf}
          keyboardType="numeric"
          editable={!isLoading}
        />
        <TextInput
          style={GlobalStyles.input}
          placeholder="Senha"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          editable={!isLoading}
        />

        {error && (
          <Text style={styles.errorText}>{error}</Text>
        )}

        <TouchableOpacity 
          style={[
            GlobalStyles.homeFullButton,
            isLoading && styles.buttonDisabled
          ]}
          onPress={handleRegister}
          disabled={isLoading}
        >
          {isLoading ? (
            <ActivityIndicator color={Colors.surface} />
          ) : (
            <Text style={GlobalStyles.homeGridButtonText}>Criar Conta</Text>
          )}
        </TouchableOpacity>

        <View style={GlobalStyles.linkContainer}>
          <Text>Já tem uma conta? </Text>
          <Link href="/signin" asChild>
            <TouchableOpacity>
              <Text style={GlobalStyles.link}>Faça Login</Text>
            </TouchableOpacity>
          </Link>
        </View>

      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({

  errorText: {
    color: Colors.error,
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 10,
    fontWeight: '500',
  },

  buttonDisabled: {
    backgroundColor: Colors.textSecondary,
  },

  successContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.screenBackground,
  },
  successTitle: {
    ...GlobalStyles.title,
    fontSize: 24,
    color: Colors.medfeiBlue,
    marginTop: 15,
  },
  successSubtitle: {
    fontSize: 16,
    color: Colors.textSecondary,
  }
});