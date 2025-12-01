import api from '../config/api';
import { Order } from '../types';

interface OrderFilters {
  page?: number;
  limit?: number;
  status?: 'pending' | 'completed' | 'cancelled' | 'refunded';
}

interface OrderListResponse {
  orders: Order[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

export const orderService = {
  // Liste des commandes
  async getOrders(filters: OrderFilters = {}): Promise<OrderListResponse> {
    const response = await api.get('/orders', { params: filters });
    return response.data;
  },

  // Détails d'une commande
  async getOrderById(orderId: string): Promise<Order> {
    const response = await api.get(`/orders/${orderId}`);
    return response.data.order;
  },

  // Annuler une commande
  async cancelOrder(orderId: string): Promise<void> {
    await api.post(`/orders/${orderId}/cancel`);
  },

  // Télécharger la facture
  async downloadInvoice(orderId: string): Promise<Blob> {
    const response = await api.get(`/orders/${orderId}/invoice`, {
      responseType: 'blob',
    });
    return response.data;
  },
};
