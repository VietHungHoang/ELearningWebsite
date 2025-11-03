import { createContext, useContext } from 'react';
import type { LoginRequest } from '../types/api';

export interface User {
  id: string;
  role?: 'Student' | 'Tutor' | 'Admin';
  name: string;
  email: string;
}

export interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  status: 'idle' | 'loading' | 'failed';
}

interface AuthContextType {
  state: AuthState;
  login: (request: LoginRequest) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export { AuthContext };

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};