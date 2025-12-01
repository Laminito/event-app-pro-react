import api from '../config/api';
import { Event, Ticket, Order } from '../types';

interface CreateEventData {
  title: string;
  description: string;
  category: string;
  date: string;
  time: string;
  location: string;
  image?: string;
  capacity: number;
  tickets: Array<{
    type: string;
    price: number;
    quantity: number;
    description?: string;
  }>;
  tags?: string[];
}

interface DashboardStats {
  totalRevenue: number;
  totalEvents: number;
  totalTickets: number;
  activeEvents: number;
  revenueGrowth: number;
  ticketsSold: {
    thisMonth: number;
    lastMonth: number;
  };
}

interface SalesData {
  labels: string[];
  data: number[];
}

export const organizerService = {
  // Dashboard - Statistiques
  async getDashboardStats(): Promise<DashboardStats> {
    const response = await api.get('/organizer/dashboard/stats');
    return response.data;
  },

  // Créer un événement
  async createEvent(data: CreateEventData): Promise<Event> {
    const response = await api.post('/organizer/events', data);
    return response.data.event;
  },

  // Mes événements
  async getMyEvents(): Promise<Event[]> {
    const response = await api.get('/organizer/events');
    return response.data.events;
  },

  // Détails d'un événement (vue organisateur)
  async getEventById(id: string): Promise<Event> {
    const response = await api.get(`/organizer/events/${id}`);
    return response.data.event;
  },

  // Mettre à jour un événement
  async updateEvent(id: string, data: Partial<CreateEventData>): Promise<Event> {
    const response = await api.put(`/organizer/events/${id}`, data);
    return response.data.event;
  },

  // Supprimer un événement
  async deleteEvent(id: string): Promise<void> {
    await api.delete(`/organizer/events/${id}`);
  },

  // Publier un événement
  async publishEvent(id: string): Promise<void> {
    await api.post(`/organizer/events/${id}/publish`);
  },

  // Dépublier un événement
  async unpublishEvent(id: string): Promise<void> {
    await api.post(`/organizer/events/${id}/unpublish`);
  },

  // Upload d'image
  async uploadEventImage(file: File): Promise<string> {
    const formData = new FormData();
    formData.append('image', file);

    const response = await api.post('/organizer/events/upload-image', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    return response.data.imageUrl;
  },

  // Billets vendus
  async getTickets(filters: { eventId?: string; status?: string } = {}): Promise<Ticket[]> {
    const response = await api.get('/organizer/tickets', { params: filters });
    return response.data.tickets;
  },

  // Billets pour un événement
  async getEventTickets(eventId: string): Promise<Ticket[]> {
    const response = await api.get(`/organizer/events/${eventId}/tickets`);
    return response.data.tickets;
  },

  // Scanner un QR code
  async scanTicket(qrCode: string): Promise<{ valid: boolean; ticket: Ticket }> {
    const response = await api.post('/organizer/tickets/scan', { qrCode });
    return response.data;
  },

  // Annuler un billet
  async cancelTicket(ticketId: string): Promise<void> {
    await api.put(`/organizer/tickets/${ticketId}/cancel`);
  },

  // Données de ventes pour graphiques
  async getSalesData(period: 'day' | 'week' | 'month' | 'year'): Promise<SalesData> {
    const response = await api.get('/organizer/analytics/sales', {
      params: { period },
    });
    return response.data;
  },

  // Analytiques d'un événement
  async getEventAnalytics(eventId: string): Promise<any> {
    const response = await api.get(`/organizer/analytics/events/${eventId}`);
    return response.data;
  },

  // Analyse des revenus
  async getRevenueAnalytics(period: 'week' | 'month' | 'quarter' | 'year'): Promise<any> {
    const response = await api.get('/organizer/analytics/revenue', {
      params: { period },
    });
    return response.data;
  },

  // Commandes pour un événement
  async getEventOrders(eventId: string): Promise<Order[]> {
    const response = await api.get(`/organizer/events/${eventId}/orders`);
    return response.data.orders;
  },

  // Participants d'un événement
  async getEventAttendees(eventId: string): Promise<any[]> {
    const response = await api.get(`/organizer/events/${eventId}/attendees`);
    return response.data.attendees;
  },
};
