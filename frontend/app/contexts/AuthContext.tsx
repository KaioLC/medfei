import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import api from '../utils/api'; // nossa API
import { store } from 'expo-router/build/global-state/router-store';

// define o que o contexto vai guardar
type AuthContextData = {
  token: string | null;
  isLoading: boolean;
  username: string | null;
  login: (token: string, user: UserData) => Promise<void>;
  logout: () => Promise<void>;
};

// dados do usuario para salvar
type UserData = {
  username: string;
}

// cria o contexto
const AuthContext = createContext<AuthContextData>({} as AuthContextData);

// cria o provedor
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [token, setToken] = useState<string | null>(null);
  const [username, setUsername] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadTokenFromStorage() {
      try {
        const storedToken = await AsyncStorage.getItem('userToken'); // pegando o token da memoria
        const storedUsername = await AsyncStorage.getItem('username'); // pegando o username da memoria

        if (storedToken && storedUsername) {
          setToken(storedToken);
          setUsername(storedUsername);

          api.defaults.headers.common['Authorization'] = `Bearer ${storedToken}`;
        }
      } catch (e) {
        console.error("Falha ao carregar token", e);
      } finally {
        setIsLoading(false);
      }
    }
    loadTokenFromStorage();
  }, []);

  const login = async (newToken: string, user: UserData) => {

    try {
      setToken(newToken);
      // salva o token na memoria
      await AsyncStorage.setItem('userToken', newToken);

      // salva o username na memoria
      setUsername(user.username);
      await AsyncStorage.setItem('username', user.username); 

      // configura o axios para o resto da sessão
      api.defaults.headers.common['Authorization'] = `Bearer ${newToken}`;
    } catch (e) {
      console.error("Falha ao salvar token", e);
    }
  };

  const logout = async () => {

    try {

      setToken(null);
      // remove o token da memoria
      await AsyncStorage.removeItem('userToken');

      // remove o username da memoria
      setUsername(null);
      await AsyncStorage.removeItem('username');

      // remove o token do axios
      delete api.defaults.headers.common['Authorization'];
    } catch (e) {
      console.error("Falha ao remover token", e);
    }
  };

  return (
    <AuthContext.Provider value={{ token, isLoading, username, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth deve ser usado dentro de um AuthProvider");
  }
  return context;
}