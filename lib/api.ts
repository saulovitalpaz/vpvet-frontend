import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Mock interceptor for development when backend is not available
if (typeof window !== 'undefined' && API_URL.includes('localhost:5000')) {
  api.interceptors.request.use(
    (config) => {
      console.log('Mock API Request:', config.method?.toUpperCase(), config.url);
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

  api.interceptors.response.use(
    (config) => {
      console.log('Mock API Response:', config.config.url);
      return config;
    },
    (error) => {
      console.log('API Error intercepted, using mock response');

      // Mock successful login
      if (error.config?.url?.includes('/auth/login')) {
        return Promise.resolve({
          data: {
            token: 'mock-jwt-token-12345',
            user: {
              id: "1",
              name: "Dr. Saulo Vital Paz",
              email: error.config?.data?.email || "saulo@vpvet.com",
              role: "doctor",
              is_dr_saulo: true,
              clinic: {
                id: "1",
                name: "Clínica Veterinária VPVET"
              }
            }
          }
        });
      }

      // Mock user profile check
      if (error.config?.url?.includes('/auth/me')) {
        return Promise.resolve({
          data: {
            user: {
              id: "1",
              name: "Dr. Saulo Vital Paz",
              email: "saulo@vpvet.com",
              role: "doctor",
              is_dr_saulo: true,
              clinic: {
                id: "1",
                name: "Clínica Veterinária VPVET"
              }
            }
          }
        });
      }

      // Mock public results
      if (error.config?.url?.includes('/public/results')) {
        return Promise.resolve({
          data: {
            exam: {
              id: "exam-123",
              animal_name: "Rex",
              exam_type: "Ultrassonografia Abdominal",
              exam_date: new Date().toISOString(),
              findings: "Fígado e rins com aparência normal. Vesícula biliar sem alterações significativas. Baço com tamanho e ecotextura preservados.",
              impression: "Sem evidências de alterações patológicas significativas nos órgãos abdominais na data do exame. Recomenda-se acompanhamento regular.",
              veterinarian: "Dr. Saulo Vital Paz",
              pdf_url: "#"
            }
          }
        });
      }

      return Promise.reject(error);
    }
  );
}

// Request interceptor - add token to all requests
api.interceptors.request.use(
  (config) => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor - handle errors globally
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      if (typeof window !== 'undefined') {
        localStorage.removeItem('token');
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);
