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

  // --- Estilos de Layout Base (Onde deu o erro) ---

  /**
   * Estilo de "tela cheia" segura. Garante que o conteúdo não
   * fique embaixo de notches (iOS) ou barras de status (Android).
   */
  safeArea: {
    flex: 1,
    backgroundColor: Colors.screenBackground, // Usa o fundo cinza-azulado por padrão
  },

  /**
   * Estilo de container padrão com padding.
   * CUIDADO: Este estilo NÃO centraliza. É só para espaçamento.
   */
  container: {
    padding: 20,
  },

  // --- Estilos de Autenticação (Login / Cadastro) ---

  /**
   * Fundo com imagem (Logo da FEI) para telas de autenticação.
   * Usado com o componente <ImageBackground>.
   */
  authBackground: {
    flex: 1,
    resizeMode: 'cover', 
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.background, // Cor de fallback
  },
  
  /**
   * O "Cartão" semi-transparente para formulários de login/cadastro.
   * Usado com o componente <View> dentro do authBackground.
   */
  authCard: {
    width: '90%', 
    maxWidth: 400,
    backgroundColor: 'rgba(255, 255, 255, 0.85)', // Branco com 85% de opacidade
    padding: 25,
    borderRadius: 20, // Cantos arredondados
    alignItems: 'center',
    
    // Sombra (iOS)
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    
    // Sombra (Android)
    elevation: 5,
  },

  // --- Estilos Gerais de Formulário ---

  /**
   * Título principal (usado no Login, Cadastro e Home).
   */
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: Colors.medfeiBlue, // Usa a cor do tema
  },

  /**
   * Input de texto padrão para todos os formulários.
   */
  input: {
    height: 44,
    width: '100%', // Ocupa a largura total do cartão onde está
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
    width: '100%', 
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

  specialtyCardContainer: {
    flex: 1,
    margin: 15,
    padding: 20,
    borderRadius: 20,
    backgroundColor: Colors.medfeiLightBlue,
  },

  searchBarContainer: {
    flexDirection: 'row',
    backgroundColor: Colors.surface,
    borderRadius: 10,
    paddingHorizontal: 15,
    alignItems: 'center',
    marginBottom: 20,
  },
  
  searchInput: {
    flex: 1,
    height: 44,
    fontSize: 16,
    marginLeft: 10,
  },
  
  specialtyButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.6)',
    padding: 20,
    borderRadius: 10,
    marginBottom: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  
  specialtyButtonText: {
    color: Colors.medfeiBlue,
    fontSize: 18,
    fontWeight: '600',
  },
});