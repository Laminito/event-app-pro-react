// Event Types
export interface Event {
  id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  location: string;
  category: EventCategory;
  price: number;
  vipPrice?: number;
  image: string;
  organizer: string;
  capacity: number;
  sold: number;
  status: 'upcoming' | 'ongoing' | 'completed' | 'cancelled';
  featured?: boolean;
}

export type EventCategory = 
  | 'Concert'
  | 'Conférence'
  | 'Sport'
  | 'Festival'
  | 'Théâtre'
  | 'Formation'
  | 'Networking'
  | 'Autre';

// Ticket Types
export interface Ticket {
  id: string;
  eventId: string;
  eventTitle: string;
  eventDate: string;
  eventLocation: string;
  type: 'Standard' | 'VIP';
  quantity: number;
  price: number;
  qrCode: string;
  purchaseDate: string;
  status: 'valid' | 'used' | 'cancelled';
}

export interface CartItem {
  eventId: string;
  eventTitle: string;
  eventDate: string;
  eventLocation: string;
  eventImage: string;
  standardQuantity: number;
  vipQuantity: number;
  standardPrice: number;
  vipPrice: number;
}

// User Types
export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  avatar?: string;
  role: 'user' | 'organizer' | 'admin';
}

// Payment Types
export type PaymentMethod = 'card' | 'wave' | 'orange-money' | 'free-money';

export interface PaymentInfo {
  method: PaymentMethod;
  cardNumber?: string;
  phoneNumber?: string;
}

// Order Types
export interface Order {
  id: string;
  userId: string;
  eventId: string;
  eventTitle: string;
  eventDate: string;
  tickets: {
    type: 'Standard' | 'VIP';
    quantity: number;
    price: number;
  }[];
  total: number;
  paymentMethod: PaymentMethod;
  status: 'pending' | 'completed' | 'failed' | 'refunded';
  purchaseDate: string;
}

// Blog Types
export interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  image: string;
  author: string;
  authorAvatar: string;
  publishDate: string;
  category: string;
  readTime: number;
}

// Analytics Types
export interface Analytics {
  revenue: {
    total: number;
    thisMonth: number;
    lastMonth: number;
  };
  tickets: {
    sold: number;
    thisMonth: number;
    lastMonth: number;
  };
  events: {
    total: number;
    upcoming: number;
    completed: number;
  };
  revenueData: {
    month: string;
    revenue: number;
  }[];
  visitorsData: {
    day: string;
    visitors: number;
  }[];
}
