import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { setCookie, deleteCookie } from '@/lib/cookies';

export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
}

interface AuthState {
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

const initialState: AuthState = {
  user: null,
  accessToken: null,
  refreshToken: null,
  isAuthenticated: false,
  isLoading: true,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials: (
      state,
      action: PayloadAction<{ user: User; accessToken: string; refreshToken: string }>
    ) => {
      state.user = action.payload.user;
      state.accessToken = action.payload.accessToken;
      state.refreshToken = action.payload.refreshToken;
      state.isAuthenticated = true;
      state.isLoading = false;

      // Store tokens in localStorage
      localStorage.setItem('_aT', action.payload.accessToken);
      localStorage.setItem('_rT', action.payload.refreshToken);
      localStorage.setItem('user', JSON.stringify(action.payload.user));

      // Also store in cookies for middleware
      setCookie('_aT', action.payload.accessToken, 7);
      setCookie('_rT', action.payload.refreshToken, 7);
    },
    logout: (state) => {
      state.user = null;
      state.accessToken = null;
      state.refreshToken = null;
      state.isAuthenticated = false;
      state.isLoading = false;

      // Clear localStorage
      localStorage.removeItem('_aT');
      localStorage.removeItem('_rT');
      localStorage.removeItem('user');

      // Clear cookies
      deleteCookie('_aT');
      deleteCookie('_rT');
    },
    updateTokens: (
      state,
      action: PayloadAction<{ accessToken: string; refreshToken: string }>
    ) => {
      state.accessToken = action.payload.accessToken;
      state.refreshToken = action.payload.refreshToken;

      // Update tokens in localStorage
      localStorage.setItem('_aT', action.payload.accessToken);
      localStorage.setItem('_rT', action.payload.refreshToken);

      // Update cookies
      setCookie('_aT', action.payload.accessToken, 7);
      setCookie('_rT', action.payload.refreshToken, 7);
    },
    initializeAuth: (state) => {
      const accessToken = localStorage.getItem('_aT');
      const refreshToken = localStorage.getItem('_rT');
      const userStr = localStorage.getItem('user');

      if (accessToken && refreshToken && userStr) {
        try {
          const user = JSON.parse(userStr);
          state.user = user;
          state.accessToken = accessToken;
          state.refreshToken = refreshToken;
          state.isAuthenticated = true;

          // Ensure cookies are set
          setCookie('_aT', accessToken, 7);
          setCookie('_rT', refreshToken, 7);
        } catch {
          // Invalid user data, clear everything
          localStorage.removeItem('_aT');
          localStorage.removeItem('_rT');
          localStorage.removeItem('user');
          deleteCookie('_aT');
          deleteCookie('_rT');
        }
      }
      state.isLoading = false;
    },
  },
});

export const { setCredentials, logout, updateTokens, initializeAuth } = authSlice.actions;
export default authSlice.reducer;
