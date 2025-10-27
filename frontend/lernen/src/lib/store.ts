import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../features/auth/store/authSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

// Type helper for auth state
export type AuthState = {
  isAuthenticated: boolean;
  user: {
    id: string;
    role: 'Student' | 'Instructor' | 'Admin';
    name: string;
    email: string;
  } | null;
  status: 'idle' | 'loading' | 'failed';
};
