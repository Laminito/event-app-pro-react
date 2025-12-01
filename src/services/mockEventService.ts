import { Event, EventCategory } from '../types';
import { mockEvents } from '../data/mockData';

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

// Simule un délai réseau pour plus de réalisme
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const mockEventService = {
  // Liste des événements avec filtres
  async getEvents(filters: EventFilters = {}): Promise<EventListResponse> {
    await delay(300); // Simule un délai réseau

    let filteredEvents = [...mockEvents];

    // Filtrer par catégorie
    if (filters.category) {
      filteredEvents = filteredEvents.filter(e => e.category === filters.category);
    }

    // Filtrer par recherche
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      filteredEvents = filteredEvents.filter(e =>
        e.title.toLowerCase().includes(searchLower) ||
        e.description.toLowerCase().includes(searchLower)
      );
    }

    // Filtrer par localisation
    if (filters.location) {
      filteredEvents = filteredEvents.filter(e =>
        e.location.toLowerCase().includes(filters.location!.toLowerCase())
      );
    }

    // Filtrer par prix
    if (filters.minPrice !== undefined) {
      filteredEvents = filteredEvents.filter(e => e.price >= filters.minPrice!);
    }
    if (filters.maxPrice !== undefined) {
      filteredEvents = filteredEvents.filter(e => e.price <= filters.maxPrice!);
    }

    // Filtrer par featured
    if (filters.featured !== undefined) {
      filteredEvents = filteredEvents.filter(e => e.featured === filters.featured);
    }

    // Trier
    if (filters.sort) {
      switch (filters.sort) {
        case 'date':
          filteredEvents.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
          break;
        case 'price':
          filteredEvents.sort((a, b) => a.price - b.price);
          break;
        case 'popularity':
          filteredEvents.sort((a, b) => b.sold - a.sold);
          break;
      }
    }

    // Pagination
    const page = filters.page || 1;
    const limit = filters.limit || 10;
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedEvents = filteredEvents.slice(startIndex, endIndex);

    const total = filteredEvents.length;
    const pages = Math.ceil(total / limit);

    return {
      events: paginatedEvents,
      pagination: {
        page,
        limit,
        total,
        pages,
        hasNext: page < pages,
        hasPrev: page > 1,
      },
    };
  },

  // Détails d'un événement
  async getEventById(id: string): Promise<Event> {
    await delay(200);
    const event = mockEvents.find(e => e.id === id);
    if (!event) {
      throw new Error('Événement non trouvé');
    }
    return event;
  },

  // Événements à la une
  async getFeaturedEvents(): Promise<Event[]> {
    await delay(250);
    return mockEvents.filter(e => e.featured);
  },

  // Liste des catégories
  async getCategories(): Promise<EventCategory[]> {
    await delay(100);
    return [
      'Concert',
      'Conférence',
      'Sport',
      'Festival',
      'Théâtre',
      'Formation',
      'Networking',
    ];
  },

  // Suggestions de recherche
  async getSearchSuggestions(query: string): Promise<string[]> {
    await delay(150);
    const queryLower = query.toLowerCase();
    const suggestions = mockEvents
      .filter(e => e.title.toLowerCase().includes(queryLower))
      .map(e => e.title)
      .slice(0, 5);
    return suggestions;
  },
};
