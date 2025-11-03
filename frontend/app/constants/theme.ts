
import { StyleSheet } from 'react-native';


export const Colors = {
  primary: '#007AFF',
  background: '#f5f5f5',
  surface: '#fff', 
  text: '#000',
  textSecondary: '#666',
  border: '#ddd',
  error: '#FF3B30',
};

export const GlobalStyles = StyleSheet.create({

  safeArea: {
    flex: 1,
    backgroundColor: Colors.background,
  },

  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
  },

  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: Colors.text,
  },

  input: {
    height: 44,
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
});