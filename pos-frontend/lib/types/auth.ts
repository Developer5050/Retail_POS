export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'manager' | 'cashier';
}

export interface AuthResponse {
  user: User;
  token: string;
}

export interface SignInCredentials {
  email: string;
  password: string;
}
