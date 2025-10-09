import axios from 'axios';
import type { AxiosRequestHeaders } from 'axios';

// const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://api.aghaai.com';
const API_BASE_URL = 'https://api.aghaai.com';


const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
});

// Request interceptor to add auth token
axiosInstance.interceptors.request.use(
  (config) => {
    const publicEndpoints = new Set([
      '/api/auth/login',
      '/api/auth/register-request',
      '/api/auth/register-verify',
      '/api/auth/resend-otp',
      '/api/auth/forgot-password-request',
      '/api/auth/forgot-password-verify',
    ]);

    const resolvedUrl = config.url
      ? new URL(config.url, config.baseURL ?? API_BASE_URL)
      : null;

    const isPublicEndpoint = resolvedUrl ? publicEndpoints.has(resolvedUrl.pathname) : false;

    config.headers = (config.headers ?? {}) as AxiosRequestHeaders;

    if (isPublicEndpoint) {
      if (config.headers.Authorization) {
        delete config.headers.Authorization;
      }
    } else if (typeof window !== 'undefined') {
      const token = window.localStorage.getItem('_aT');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }

    const hasFormDataSupport = typeof FormData !== 'undefined';
    const isFormDataPayload = hasFormDataSupport && config.data instanceof FormData;

    if (isFormDataPayload) {
      delete config.headers['Content-Type'];
    } else if (!config.headers['Content-Type']) {
      config.headers['Content-Type'] = 'application/json';
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle token refresh
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // If error is 401 and we haven't tried to refresh yet
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = localStorage.getItem('_rT');
        if (!refreshToken) {
          throw new Error('No refresh token available');
        }

        // Call refresh token endpoint
        const response = await axios.get(`${API_BASE_URL}/api/auth/token/refresh`, {
          headers: {
            Authorization: `Bearer ${refreshToken}`,
          },
        });

        const { _aT, _rT } = response.data.data.tokens;

        // Store new tokens
        localStorage.setItem('_aT', _aT);
        localStorage.setItem('_rT', _rT);

        // Retry original request with new token
        originalRequest.headers.Authorization = `Bearer ${_aT}`;
        return axiosInstance(originalRequest);
      } catch (refreshError) {
        // Refresh failed, logout user
        localStorage.removeItem('_aT');
        localStorage.removeItem('_rT');
        localStorage.removeItem('user');
        window.location.href = '/';
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
