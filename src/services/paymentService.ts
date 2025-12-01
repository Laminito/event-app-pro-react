import api from '../config/api';

interface InitiatePaymentData {
  orderId: string;
  method: 'wave' | 'orange_money' | 'free_money';
  phone: string;
}

interface PaymentResponse {
  paymentId: string;
  paymentUrl: string;
  status: string;
}

interface PaymentStatusResponse {
  status: 'pending' | 'completed' | 'failed' | 'cancelled';
  transactionId?: string;
}

export const paymentService = {
  // Initialiser un paiement
  async initiatePayment(data: InitiatePaymentData): Promise<PaymentResponse> {
    const response = await api.post('/payments/initiate', data);
    return response.data;
  },

  // Vérifier le statut d'un paiement
  async getPaymentStatus(paymentId: string): Promise<PaymentStatusResponse> {
    const response = await api.get(`/payments/${paymentId}/status`);
    return response.data;
  },

  // Historique des paiements
  async getPaymentHistory(): Promise<any[]> {
    const response = await api.get('/payments/history');
    return response.data.payments;
  },
};
