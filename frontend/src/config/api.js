// API Base URL Configuration
// ใน production จะใช้ environment variable จาก Vercel
// ใน development จะใช้ localhost
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export default API_BASE_URL;




