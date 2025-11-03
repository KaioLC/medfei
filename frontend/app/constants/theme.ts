// frontend/constants/theme.ts
import { StyleSheet } from 'react-native';

/**
 * Paleta de cores centralizada do aplicativo.
 */
export const Colors = {
  // Cores Básicas
  primary: '#007AFF', // Azul padrão
  background: '#f5f5f5', // Fundo de autenticação (antes da imagem)
  surface: '#fff', // Fundo de inputs e cards
  text: '#000',
  textSecondary: '#666',
  border: '#ddd',
  error: '#FF3B30',

  // Cores do Tema MedFEI
  medfeiBlue: '#003366',      // Azul escuro principal da FEI (para botões e títulos)
  medfeiLightBlue: '#D6EAF8', // Azul bem claro para o fundo dos cards de consulta
  screenBackground: '#F0F4F8', // Fundo geral das telas internas (Home)
  cardBackground: '#FFFFFF', // Fundo do card principal da home
};

/**
 * Estilos globais reutilizáveis em todo o aplicativo.
 */
export const GlobalStyles = StyleSheet.create({

  authBackground: {
    flex: 1,
    resizeMode: 'cover', 
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.background,
  },
  
  authCard: {
    width: '90%', 
    maxWidth: 400,
    backgroundColor: 'rgba(255, 255, 255, 0.85)',
    padding: 25,
    borderRadius: 20,
    alignItems: 'center',
    
  
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    
    elevation: 5,
  },

  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: Colors.medfeiBlue,
  },

  input: {
    height: 44,
    width: '100%',
    backgroundColor: Colors.surface,
    borderColor: Colors.border,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 15,
    marginBottom: 12,
    fontSize: 16,
  },

  linkContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 20,
  },

  link: {
    color: Colors.primary,
    fontWeight: '600',
  },

  homeScreenContainer: {
    flex: 1,
    backgroundColor: Colors.screenBackground,
  },

  homeCard: {
    margin: 15,
    padding: 20,
    borderRadius: 20,
    backgroundColor: Colors.cardBackground,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },

  homeGridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },

  homeGridButton: {
    backgroundColor: Colors.medfeiBlue,
    width: '48.5%',
    paddingVertical: 25,
    paddingHorizontal: 10,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  homeGridButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },

  homeFullButton: {
    backgroundColor: Colors.medfeiBlue,
    width: '100%', // Ocupa a largura inteira
    paddingVertical: 15,
    borderRadius: 15,
    alignItems: 'center',
    marginTop: 10,
  },
  
  homeSectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.medfeiBlue,
    marginTop: 20,
    marginBottom: 10,
    textAlign: 'center',
  },

  appointmentCard: {
    backgroundColor: Colors.medfeiLightBlue,
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
  },
  appointmentCardText: {
    color: Colors.medfeiBlue,
    fontSize: 16,
    fontWeight: '500',
  },

  historyButton: {
    backgroundColor: '#FFFFFF',
    borderColor: Colors.medfeiBlue,
    borderWidth: 1.5,
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 5,
  },
  historyButtonText: {
    color: Colors.medfeiBlue,
    fontSize: 16,
    fontWeight: '600',
  },

});