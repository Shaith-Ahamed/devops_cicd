
import axios from "axios";

const http = axios.create({
  baseURL: import.meta.env.VITE_API_BASE || 'http://localhost:8080',
});


http.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});





http.interceptors.response.use(
    (res) => res,  
    (err) => {  
      // Don't auto-redirect on 401 if it's a password change request
      if (err.response?.status === 401 && !err.config.url.includes('/password')) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        window.location.href = "/login";
      }
      return Promise.reject(err);
    }
  );
  
 

export default http;


