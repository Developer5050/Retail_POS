import { apiService } from './api.service';
import { Product, Category } from '../types/product';

export const productService = {
  async getProducts(): Promise<Product[]> {
    return apiService.get<Product[]>('/products');
  },

  async getProductById(id: string): Promise<Product> {
    return apiService.get<Product>(`/products/${id}`);
  },

  async createProduct(product: Omit<Product, 'id'>): Promise<Product> {
    return apiService.post<Product>('/products', product);
  },

  async updateProduct(id: string, product: Partial<Product>): Promise<Product> {
    return apiService.put<Product>(`/products/${id}`, product);
  },

  async deleteProduct(id: string): Promise<void> {
    return apiService.delete(`/products/${id}`);
  },

  async getCategories(): Promise<Category[]> {
    return apiService.get<Category[]>('/categories');
  },
};
