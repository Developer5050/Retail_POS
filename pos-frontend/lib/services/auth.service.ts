import { apiService } from './api.service';
import { AuthResponse, SignInCredentials, User } from '../types/auth';

export const authService = {
  async signIn(credentials: SignInCredentials): Promise<AuthResponse> {
    return apiService.post<AuthResponse>('/auth/signin', credentials);
  },

  async signUp(userData: any): Promise<AuthResponse> {
    return apiService.post<AuthResponse>('/auth/signup', userData);
  },

  async signOut(): Promise<void> {
    // Implement sign out logic (e.g., clearing tokens)
    localStorage.removeItem('token');
  },

  async getCurrentUser(): Promise<User | null> {
    try {
      return await apiService.get<User>('/auth/me');
    } catch (error) {
      return null;
    }
  },
};
