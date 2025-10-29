import axios from 'axios'
import auth from './auth'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:4000'
})

// attach token if present
api.interceptors.request.use(cfg => {
  const token = auth.getToken();
  if (token) cfg.headers = { ...cfg.headers, Authorization: `Bearer ${token}` };
  return cfg;
})

export default api
