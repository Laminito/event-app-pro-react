import { create } from 'zustand';
import { CartItem, Order } from '../types';

interface CartStore {
  items: CartItem[];
  addToCart: (item: CartItem) => void;
  removeFromCart: (eventId: string) => void;
  updateQuantity: (eventId: string, type: 'standard' | 'vip', quantity: number) => void;
  clearCart: () => void;
  getTotal: () => number;
}

export const useCartStore = create<CartStore>((set, get) => ({
  items: [],
  
  addToCart: (item) => {
    set((state) => {
      const existingItem = state.items.find((i) => i.eventId === item.eventId);
      if (existingItem) {
        return {
          items: state.items.map((i) =>
            i.eventId === item.eventId
              ? {
                  ...i,
                  standardQuantity: i.standardQuantity + item.standardQuantity,
                  vipQuantity: i.vipQuantity + item.vipQuantity,
                }
              : i
          ),
        };
      }
      return { items: [...state.items, item] };
    });
  },
  
  removeFromCart: (eventId) => {
    set((state) => ({
      items: state.items.filter((i) => i.eventId !== eventId),
    }));
  },
  
  updateQuantity: (eventId, type, quantity) => {
    set((state) => ({
      items: state.items.map((i) =>
        i.eventId === eventId
          ? {
              ...i,
              [type === 'standard' ? 'standardQuantity' : 'vipQuantity']: quantity,
            }
          : i
      ),
    }));
  },
  
  clearCart: () => set({ items: [] }),
  
  getTotal: () => {
    const { items } = get();
    return items.reduce(
      (total, item) =>
        total +
        item.standardQuantity * item.standardPrice +
        item.vipQuantity * item.vipPrice,
      0
    );
  },
}));

interface OrderStore {
  orders: Order[];
  addOrder: (order: Order) => void;
  getOrders: () => Order[];
}

export const useOrderStore = create<OrderStore>((set, get) => ({
  orders: [],
  
  addOrder: (order) => {
    set((state) => ({
      orders: [...state.orders, order],
    }));
  },
  
  getOrders: () => get().orders,
}));
