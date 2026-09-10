// API Base URL Configuration
// Use an explicitly configured API when provided. Production Docker deployments
// use the frontend reverse proxy, keeping browser requests same-origin and
// avoiding mixed-content/CORS failures on HTTPS sites.
const API_BASE_URL = import.meta.env.VITE_API_URL ?? (
  import.meta.env.PROD ? '' : `http://${window.location.hostname}:5000`
);

export default API_BASE_URL;
