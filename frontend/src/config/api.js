// API Base URL Configuration
// Use VITE_API_URL when explicitly configured; otherwise call the backend
// on the same hostname using port 5000. This avoids browser-side localhost
// pointing at the visitor's own computer in production.
const API_BASE_URL = import.meta.env.VITE_API_URL || `http://${window.location.hostname}:5000`;

export default API_BASE_URL;
