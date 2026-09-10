import axios from 'axios';
import API_BASE_URL from '../config/api';

// สร้าง axios instance ที่มี base URL และ interceptor สำหรับ JWT token
const instance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor สำหรับเพิ่ม JWT token อัตโนมัติ
instance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default instance;




