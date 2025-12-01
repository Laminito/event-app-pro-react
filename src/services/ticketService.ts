import api from '../config/api';
import { Ticket, Order } from '../types';

interface ReserveTicketsData {
  eventId: string;
  tickets: Array<{
    type: string;
    quantity: number;
  }>;
}

interface PurchaseTicketsData {
  reservationId: string;
  paymentMethod: 'wave' | 'orange_money' | 'free_money';
  customerInfo: {
    name: string;
    email: string;
    phone: string;
  };
}

interface ReservationResponse {
  reservation: {
    id: string;
    expiresAt: string;
    total: number;
  };
}

interface PurchaseResponse {
  order: Order;
}

export const ticketService = {
  // Réserver des billets
  async reserveTickets(data: ReserveTicketsData): Promise<ReservationResponse> {
    const response = await api.post('/tickets/reserve', data);
    return response.data;
  },

  // Acheter des billets
  async purchaseTickets(data: PurchaseTicketsData): Promise<PurchaseResponse> {
    const response = await api.post('/tickets/purchase', data);
    return response.data;
  },

  // Mes billets
  async getMyTickets(status?: 'upcoming' | 'past' | 'cancelled'): Promise<Ticket[]> {
    const response = await api.get('/tickets/my-tickets', {
      params: { status },
    });
    return response.data.tickets;
  },

  // Détails d'un billet
  async getTicketById(ticketId: string): Promise<Ticket> {
    const response = await api.get(`/tickets/${ticketId}`);
    return response.data.ticket;
  },

  // QR code du billet
  async getTicketQRCode(ticketId: string): Promise<string> {
    const response = await api.get(`/tickets/${ticketId}/qr`);
    return response.data.qrCode;
  },

  // Transférer un billet
  async transferTicket(ticketId: string, recipientEmail: string): Promise<void> {
    await api.post(`/tickets/${ticketId}/transfer`, { recipientEmail });
  },

  // Annuler un billet
  async cancelTicket(ticketId: string): Promise<void> {
    await api.post(`/tickets/${ticketId}/cancel`);
  },

  // Valider un billet (organisateur)
  async validateTicket(ticketId: string): Promise<{ valid: boolean; message: string }> {
    const response = await api.post(`/tickets/${ticketId}/validate`);
    return response.data;
  },
};
