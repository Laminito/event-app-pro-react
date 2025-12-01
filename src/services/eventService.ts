import api from '../config/api';
import { Event, EventCategory } from '../types';
import { mapBackendEventToFrontend } from '../utils/apiMappers';

interface EventFilters {
  page?: number;
  limit?: number;
  category?: EventCategory;
  search?: string;
  location?: string;
  startDate?: string;
  endDate?: string;
  minPrice?: number;
  maxPrice?: number;
  featured?: boolean;
  sort?: 'date' | 'price' | 'popularity';
}

interface EventListResponse {
  events: Event[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

export const eventService = {
    // Upload d'une image d'événement
    async uploadEventImage(file: File): Promise<string> {
      const formData = new FormData();
      formData.append('image', file);
      const response = await api.post('/events/upload-image', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      // Retourne le nom ou l'URL de l'image selon la réponse du backend
      return response.data.filename || response.data.url || response.data.image;
    },

    // Création d'un nouvel événement
    async createEvent(data: any): Promise<Event> {
      const response = await api.post('/events', data);
      const rawEvent = response.data.data || response.data;
      return mapBackendEventToFrontend(rawEvent);
    },
  // Liste des événements avec filtres
  async getEvents(filters: EventFilters = {}): Promise<EventListResponse> {
    const response = await api.get('/events', { params: filters });
    // Le backend retourne { data, pagination } au lieu de { events, pagination }
    const rawEvents = response.data.data || response.data.events || [];
    const events = rawEvents.map(mapBackendEventToFrontend);
    
    return {
      events,
      pagination: response.data.pagination,
    };
  },

  // Détails d'un événement
  async getEventById(id: string): Promise<Event> {
    const response = await api.get(`/events/${id}`);
    const rawEvent = response.data.data || response.data;
    return mapBackendEventToFrontend(rawEvent);
  },

  // Événements à la une
  async getFeaturedEvents(): Promise<Event[]> {
    const response = await api.get('/events/featured');
    const rawEvents = response.data.events || response.data.data || response.data;
    return Array.isArray(rawEvents) ? rawEvents.map(mapBackendEventToFrontend) : [];
  },

  // Liste des catégories
  async getCategories(): Promise<EventCategory[]> {
    const response = await api.get('/events/categories');
    return response.data.categories;
  },

  // Suggestions de recherche
  async getSearchSuggestions(query: string): Promise<string[]> {
    const response = await api.get('/events/search/suggestions', {
      params: { q: query },
    });
    return response.data.suggestions;
  },
};
