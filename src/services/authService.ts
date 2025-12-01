import api from '../config/api';
import { User } from '../types';
import { mapBackendUserToFrontend } from '../utils/apiMappers';

interface LoginCredentials {
  email: string;
  password: string;
}

interface RegisterData {
  name: string;
  email: string;
  password: string;
  phone: string;
}

interface AuthResponse {
  user: User;
  token: string;
}

export const authService = {
  // Inscription
  async register(data: RegisterData): Promise<AuthResponse> {
    const response = await api.post('/auth/register', data);
    const user = mapBackendUserToFrontend(response.data.user);
    const token = response.data.token;
    
    localStorage.setItem('auth_token', token);
    localStorage.setItem('auth_user', JSON.stringify(user));
    
    return { user, token };
  },

  // Connexion
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    const response = await api.post('/auth/login', credentials);
    const token = response.data.token;
    
    // Stocker le token d'abord pour les requêtes suivantes
    localStorage.setItem('auth_token', token);
    
    // R\u00e9cup\u00e9rer le profil complet avec birthdate et location
    try {
      const profileResponse = await api.get('/users/profile');
      const userData = profileResponse.data.user || profileResponse.data.data || profileResponse.data;
      const user = mapBackendUserToFrontend(userData);
      
      localStorage.setItem('auth_user', JSON.stringify(user));
      
      return { user, token };
    } catch (error) {
      // Si la récupération du profil échoue, utiliser les données de base
      console.warn('Could not fetch full profile, using basic user data');
      const user = mapBackendUserToFrontend(response.data.user);
      localStorage.setItem('auth_user', JSON.stringify(user));
      
      return { user, token };
    }
  },

  // Déconnexion
  async logout(): Promise<void> {
    try {
      await api.post('/auth/logout');
    } finally {
      localStorage.removeItem('auth_token');
      localStorage.removeItem('auth_user');
    }
  },

  // Rafraîchir le token
  async refreshToken(): Promise<string> {
    const response = await api.post('/auth/refresh-token');
    const { token } = response.data;
    
    localStorage.setItem('auth_token', token);
    
    return token;
  },

  // Mot de passe oublié
  async forgotPassword(email: string): Promise<void> {
    await api.post('/auth/forgot-password', { email });
  },

  // Réinitialiser le mot de passe
  async resetPassword(token: string, password: string): Promise<void> {
    await api.post(`/auth/reset-password/${token}`, { password });
  },

  // Récupérer l'utilisateur depuis le localStorage
  getCurrentUser(): User | null {
    const userStr = localStorage.getItem('auth_user');
    return userStr ? JSON.parse(userStr) : null;
  },

  // Récupérer le token
  getToken(): string | null {
    return localStorage.getItem('auth_token');
  },

  // Vérifier si l'utilisateur est connecté
  isAuthenticated(): boolean {
    return !!this.getToken();
  },
};
