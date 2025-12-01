import api from '../config/api';
import { User } from '../types';
import { mapBackendUserToFrontend } from '../utils/apiMappers';

interface UpdateProfileData {
  name?: string;
  phone?: string;
  location?: string;
  birthdate?: string;
}

interface ChangePasswordData {
  currentPassword: string;
  newPassword: string;
}

export const userService = {
  // Récupérer le profil
  async getProfile(): Promise<User> {
    const response = await api.get('/users/profile');
    return mapBackendUserToFrontend(response.data.user);
  },

  // Mettre \u00e0 jour le profil
  async updateProfile(data: UpdateProfileData): Promise<User> {
    const response = await api.put('/users/profile', data);
    
    // L'API peut retourner { user: {...} } ou directement { data: {...} }
    const userData = response.data.user || response.data.data || response.data;
    const user = mapBackendUserToFrontend(userData);
    
    // Mettre à jour dans le localStorage
    localStorage.setItem('auth_user', JSON.stringify(user));
    
    return user;
  },

  // Uploader une photo de profil
  async uploadAvatar(file: File): Promise<User> {
    const formData = new FormData();
    formData.append('avatar', file);

    const response = await api.post('/users/avatar', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    console.log('Upload avatar response:', response.data);

    // L'API retourne juste { message, avatar } et non l'utilisateur complet
    // Donc on récupère le profil complet après l'upload
    const profileResponse = await api.get('/users/profile');
    const userData = profileResponse.data.user || profileResponse.data.data || profileResponse.data;
    console.log('Profile after avatar upload:', userData);
    
    const user = mapBackendUserToFrontend(userData);
    console.log('Mapped user with avatar:', user);
    
    // Mettre à jour dans le localStorage
    localStorage.setItem('auth_user', JSON.stringify(user));
    
    return user;
  },

  // Changer le mot de passe
  async changePassword(data: ChangePasswordData): Promise<void> {
    await api.put('/users/password', data);
  },

  // Événements favoris
  async getFavorites(): Promise<string[]> {
    const response = await api.get('/users/favorites');
    return response.data.favorites;
  },

  // Ajouter aux favoris
  async addToFavorites(eventId: string): Promise<void> {
    await api.post(`/users/favorites/${eventId}`);
  },

  // Retirer des favoris
  async removeFromFavorites(eventId: string): Promise<void> {
    await api.delete(`/users/favorites/${eventId}`);
  },
};
