import axios from 'axios';
import Constants from 'expo-constants'; // tira o hardcode do IP

// pegando o IP dinamicamente

function getApiHostname() {

  // pega o hostUri das variaveis de ambiente do expo
  const hostUri = Constants.expoConfig?.extra?.hostUri;
  // separa o hostname da porta
  if(hostUri) {
    return hostUri.split(':')[0];
  }
  // pega o linkingUri das variaveis de ambiente do expo
  const linkingUri = Constants.linkingUri;
  if(linkingUri) {
    // separa o hostname da porta
    return linkingUri.replace('exp://', '').split(':')[0];
  }

  console.warn("Não foi possível detectar o IP do host, usando localhost");
  return 'localhost';
}

const hostname = getApiHostname();
const API_URL =  `http://${hostname}:5000`; // porta do backend flask;

console.log(`Conectando ao backend em: ${API_URL}`); // debugando o URL do back

const api = axios.create({
  baseURL: API_URL,
});

export default api;