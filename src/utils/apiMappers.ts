import { Event, User } from '../types';
import { SERVER_BASE_URL } from '../config/api';

// Helper pour construire l'URL complète de l'avatar
export const getAvatarUrl = (avatar: string | null | undefined): string | undefined => {
  if (!avatar) return undefined;
  // Si l'URL est déjà complète (commence par http), la retourner telle quelle
  if (avatar.startsWith('http')) return avatar;
  // Sinon, préfixer avec l'URL du serveur
  return `${SERVER_BASE_URL}${avatar}`;
};

// Mapper pour transformer les données utilisateur de l'API backend vers le format frontend
export const mapBackendUserToFrontend = (backendUser: any): User => {
  if (!backendUser) {
    throw new Error('Invalid user data: backendUser is null or undefined');
  }
  
  return {
    id: backendUser._id || backendUser.id,
    name: backendUser.name,
    email: backendUser.email,
    phone: backendUser.phone,
    avatar: getAvatarUrl(backendUser.avatar),
    role: backendUser.role,
    location: backendUser.location || undefined,
    birthdate: backendUser.birthdate || undefined,
  };
};

// Mapper pour transformer les données de l'API backend vers le format frontend
export const mapBackendEventToFrontend = (backendEvent: any): Event => {
  return {
    id: backendEvent._id || backendEvent.id,
    title: backendEvent.title,
    description: backendEvent.description,
    date: backendEvent.date,
    time: backendEvent.time,
    location: backendEvent.location,
    category: backendEvent.category,
    price: backendEvent.tickets?.[0]?.price || backendEvent.price || 0,
    vipPrice: backendEvent.tickets?.[1]?.price || backendEvent.vipPrice,
    image: backendEvent.image,
    organizer: backendEvent.organizer?.name || backendEvent.organizer || '',
    capacity: backendEvent.capacity,
    sold: backendEvent.sold,
    status: mapBackendStatus(backendEvent.status),
    featured: backendEvent.featured || false,
  };
};

// Mapper le statut du backend vers le frontend
const mapBackendStatus = (backendStatus: string): 'upcoming' | 'ongoing' | 'completed' | 'cancelled' => {
  switch (backendStatus) {
    case 'published':
    case 'active':
      return 'upcoming';
    case 'ongoing':
      return 'ongoing';
    case 'completed':
    case 'ended':
      return 'completed';
    case 'cancelled':
      return 'cancelled';
    default:
      return 'upcoming';
  }
};
