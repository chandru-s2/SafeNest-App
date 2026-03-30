import axios from 'axios';
import { store } from '../app/store';
import { logout } from '../app/store/slices/authSlice';

// Android emulator links to host machine localhost via 10.0.2.2
const API_URL = 'http://10.0.2.2:3000/v1/';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Inject JWT token into every request
api.interceptors.request.use(
  (config) => {
    const token = store.getState().auth.authToken;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Handle 401 Unauthorized globally
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Auto logout on token expiration
      store.dispatch(logout());
    }
    return Promise.reject(error);
  }
);

export default api;
