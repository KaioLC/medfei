import axios from 'axios';
import Constants from 'expo-constants'; // tira o hardcode do IP
import { Platform } from 'react-native';

// pegando o IP dinamicamente

function getApiHostname() {

  // caso seja web 
  if (Platform.OS === 'web' && typeof window !== 'undefined') {
    return window.location.hostname;
  }

  // se for mobile (qr code)
  const linkingUri = Constants.linkingUri;
  if(linkingUri) {
    // separa o hostname da porta
    return linkingUri.replace('exp://', '').split(':')[0];
  }

  console.warn("Não foi possível detectar o IP do host, usando 10.0.2.2");
  return '10.0.2.2';
}

const hostname = getApiHostname();
const API_URL =  `http://${hostname}:5000`; // porta do backend flask;

console.log(`Conectando ao backend em: ${API_URL}`); // debugando o URL do back

const api = axios.create({
  baseURL: API_URL,
});

export default api;