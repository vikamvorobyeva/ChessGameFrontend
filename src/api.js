// 📁 frontend/src/api.js
import axios from 'axios';

// Создаём экземпляр axios с базовым URL бекенда
const api = axios.create({
  baseURL: 'http://127.0.0.1:8000', // заменишь на свой прод адрес, если нужно
});

// ⛓️ Интерцептор: каждый запрос — добавляем токен из localStorage
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`; // вот здесь JWT вставляется
  }
  return config;
});

export default api;
