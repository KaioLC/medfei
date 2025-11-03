import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import api from '../utils/api'; // Nossa API

// define o que o contexto vai guardar
type AuthContextData = {
  token: string | null;
  isLoading: boolean;
  login: (token: string) => Promise<void>;
  logout: () => Promise<void>;
};

// cria o contexto
const AuthContext = createContext<AuthContextData>({} as AuthContextData);

// cria o provedor
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadTokenFromStorage() {
      try {
        const storedToken = await AsyncStorage.getItem('userToken');
        if (storedToken) {
          setToken(storedToken);

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

  const login = async (newToken: string) => {
    try {
      setToken(newToken);
      // salva o token na memoria
      await AsyncStorage.setItem('userToken', newToken);
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
      // remove o token do axios
      delete api.defaults.headers.common['Authorization'];
    } catch (e) {
      console.error("Falha ao remover token", e);
    }
  };

  return (
    <AuthContext.Provider value={{ token, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// Cria um "Hook" para usarmos o contexto facilmente
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth deve ser usado dentro de um AuthProvider");
  }
  return context;
}