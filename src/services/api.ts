import axios from 'axios';

const api = axios.create({
  baseURL: (import.meta.env.API_URL || "http://localhost:5000")
});

export default api;
