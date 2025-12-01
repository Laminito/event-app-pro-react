import axios from 'axios';

// Configuration de base de l'API
export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1';
export const SERVER_BASE_URL = import.meta.env.VITE_SERVER_URL || 'http://localhost:5000';

// Instance Axios configurée
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
  timeout: 30000, // 30 secondes
});

// Intercepteur de requête - Ajouter le token JWT
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('auth_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Intercepteur de réponse - Gérer les erreurs globalement
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response) {
      // Erreurs avec réponse du serveur
      const { status, data } = error.response;

      switch (status) {
        case 401:
          // Token expiré ou invalide
          localStorage.removeItem('auth_token');
          localStorage.removeItem('auth_user');
          if (globalThis.location.pathname !== '/login') {
            globalThis.location.href = '/login?expired=true';
          }
          break;
        case 403:
          // Accès refusé
          console.error('Accès refusé:', data.error?.message);
          break;
        case 404:
          console.error('Ressource non trouvée:', data.error?.message);
          break;
        case 422:
          // Erreur de validation
          console.error('Erreur de validation:', data.error?.details);
          break;
        case 429:
          // Trop de requêtes
          console.error('Trop de requêtes, veuillez patienter');
          break;
        case 500:
          console.error('Erreur serveur:', data.error?.message);
          break;
        default:
          console.error('Erreur API:', data.error?.message);
      }
    } else if (error.request) {
      // Pas de réponse du serveur
      console.error('Pas de réponse du serveur');
    } else {
      // Erreur lors de la configuration de la requête
      console.error('Erreur:', error.message);
    }

    return Promise.reject(error);
  }
);

export default api;
