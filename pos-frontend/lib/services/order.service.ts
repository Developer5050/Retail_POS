import { apiService } from './api.service';
import { Order } from '../types/order';

export const orderService = {
  async getOrders(): Promise<Order[]> {
    return apiService.get<Order[]>('/orders');
  },

  async getOrderById(id: string): Promise<Order> {
    return apiService.get<Order>(`/orders/${id}`);
  },

  async createOrder(order: Omit<Order, 'id' | 'invoiceNo'>): Promise<Order> {
    return apiService.post<Order>('/orders', order);
  },

  async updateOrderStatus(id: string, status: Order['status']): Promise<Order> {
    return apiService.put<Order>(`/orders/${id}/status`, { status });
  },
};
