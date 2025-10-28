import axios from 'axios';
import { environmentDetector } from './environment/environmentDetector';
import {
  isAutoEnvironmentSwitchingEnabled,
  isConnectionValidationEnabled,
  areMockResponsesEnabled,
  isDebugModeEnabled,
  isEnhancedErrorReportingEnabled
} from './config/featureFlags';
import { connectionValidator } from './utils/connectionValidator';

// Get API URL from environment detector with fallback
const getApiUrl = (): string => {
  // Environment variable takes precedence
  if (process.env.NEXT_PUBLIC_API_URL) {
    return process.env.NEXT_PUBLIC_API_URL;
  }

  // Use environment detector if auto-switching is enabled
  if (isAutoEnvironmentSwitchingEnabled()) {
    return environmentDetector.getConfig().apiBaseUrl;
  }

  // Fallback to default localhost
  return 'http://localhost:5000/api';
};

const API_URL = getApiUrl();

export const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  },
  timeout: 10000 // 10 second timeout
});

// Enhanced logging for debugging
if (isDebugModeEnabled()) {
  console.log('[API] Initializing API client with URL:', API_URL);
  console.log('[API] Auto environment switching:', isAutoEnvironmentSwitchingEnabled());
  console.log('[API] Connection validation:', isConnectionValidationEnabled());
  console.log('[API] Mock responses:', areMockResponsesEnabled());
  console.log('[API] Enhanced error reporting:', isEnhancedErrorReportingEnabled());
}

// Enhanced mock interceptor with feature flag support
if (typeof window !== 'undefined' && areMockResponsesEnabled()) {
  api.interceptors.request.use(
    (config) => {
      // Mock API request for development
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

  api.interceptors.response.use(
    (config) => {
      // Mock API response for development
      return config;
    },
    (error) => {
      // API error intercepted, using mock response

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

      // Mock appointments availability
      if (error.config?.url?.includes('/appointments/availability')) {
        // Simple mock data with different slots for different days (using local timezone)
        const mockSlots = [
          // Monday (20/10/2025) - full day
          { datetime: '2025-10-20T08:00:00', available: true, duration: 30 },
          { datetime: '2025-10-20T08:30:00', available: true, duration: 30 },
          { datetime: '2025-10-20T09:00:00', available: true, duration: 30 },
          { datetime: '2025-10-20T09:30:00', available: true, duration: 30 },
          { datetime: '2025-10-20T10:00:00', available: true, duration: 30 },
          { datetime: '2025-10-20T10:30:00', available: true, duration: 30 },
          { datetime: '2025-10-20T11:00:00', available: true, duration: 30 },
          { datetime: '2025-10-20T11:30:00', available: true, duration: 30 },
          { datetime: '2025-10-20T12:00:00', available: true, duration: 30 },
          { datetime: '2025-10-20T12:30:00', available: true, duration: 30 },
          { datetime: '2025-10-20T13:00:00', available: true, duration: 30 },
          { datetime: '2025-10-20T13:30:00', available: true, duration: 30 },
          { datetime: '2025-10-20T14:00:00', available: true, duration: 30 },
          { datetime: '2025-10-20T14:30:00', available: true, duration: 30 },
          { datetime: '2025-10-20T15:00:00', available: true, duration: 30 },
          { datetime: '2025-10-20T15:30:00', available: true, duration: 30 },
          { datetime: '2025-10-20T16:00:00', available: true, duration: 30 },
          { datetime: '2025-10-20T16:30:00', available: true, duration: 30 },
          { datetime: '2025-10-20T17:00:00', available: true, duration: 30 },
          { datetime: '2025-10-20T17:30:00', available: true, duration: 30 },

          // Tuesday (21/10/2025) - limited hours
          { datetime: '2025-10-21T09:00:00', available: true, duration: 30 },
          { datetime: '2025-10-21T09:30:00', available: true, duration: 30 },
          { datetime: '2025-10-21T10:00:00', available: true, duration: 30 },

          // Wednesday (22/10/2025) - different slots
          { datetime: '2025-10-22T11:00:00', available: true, duration: 30 },
          { datetime: '2025-10-22T14:00:00', available: true, duration: 30 },
          { datetime: '2025-10-22T16:00:00', available: true, duration: 30 },

          // Thursday (23/10/2025) - morning only
          { datetime: '2025-10-23T08:00:00', available: true, duration: 30 },
          { datetime: '2025-10-23T09:00:00', available: true, duration: 30 },
          { datetime: '2025-10-23T10:00:00', available: true, duration: 30 },

          // Friday (24/10/2025) - regular hours
          { datetime: '2025-10-24T09:00:00', available: true, duration: 30 },
          { datetime: '2025-10-24T10:30:00', available: true, duration: 30 },
          { datetime: '2025-10-24T14:00:00', available: true, duration: 30 },
          { datetime: '2025-10-24T15:30:00', available: true, duration: 30 },

          // Saturday (25/10/2025) - full day
          { datetime: '2025-10-25T08:00:00', available: true, duration: 30 },
          { datetime: '2025-10-25T08:30:00', available: true, duration: 30 },
          { datetime: '2025-10-25T09:00:00', available: true, duration: 30 },
          { datetime: '2025-10-25T09:30:00', available: true, duration: 30 },
          { datetime: '2025-10-25T10:00:00', available: true, duration: 30 },
          { datetime: '2025-10-25T10:30:00', available: true, duration: 30 },
          { datetime: '2025-10-25T11:00:00', available: true, duration: 30 },
          { datetime: '2025-10-25T11:30:00', available: true, duration: 30 },
          { datetime: '2025-10-25T12:00:00', available: true, duration: 30 },
          { datetime: '2025-10-25T12:30:00', available: true, duration: 30 },
          { datetime: '2025-10-25T13:00:00', available: true, duration: 30 },
          { datetime: '2025-10-25T13:30:00', available: true, duration: 30 },
          { datetime: '2025-10-25T14:00:00', available: true, duration: 30 },
          { datetime: '2025-10-25T14:30:00', available: true, duration: 30 },
          { datetime: '2025-10-25T15:00:00', available: true, duration: 30 },
          { datetime: '2025-10-25T15:30:00', available: true, duration: 30 },
          { datetime: '2025-10-25T16:00:00', available: true, duration: 30 },
          { datetime: '2025-10-25T16:30:00', available: true, duration: 30 },
          { datetime: '2025-10-25T17:00:00', available: true, duration: 30 },
          { datetime: '2025-10-25T17:30:00', available: true, duration: 30 },

          // Sunday (26/10/2025) - full day
          { datetime: '2025-10-26T08:00:00', available: true, duration: 30 },
          { datetime: '2025-10-26T08:30:00', available: true, duration: 30 },
          { datetime: '2025-10-26T09:00:00', available: true, duration: 30 },
          { datetime: '2025-10-26T09:30:00', available: true, duration: 30 },
          { datetime: '2025-10-26T10:00:00', available: true, duration: 30 },
          { datetime: '2025-10-26T10:30:00', available: true, duration: 30 },
          { datetime: '2025-10-26T11:00:00', available: true, duration: 30 },
          { datetime: '2025-10-26T11:30:00', available: true, duration: 30 },
          { datetime: '2025-10-26T12:00:00', available: true, duration: 30 },
          { datetime: '2025-10-26T12:30:00', available: true, duration: 30 },
          { datetime: '2025-10-26T13:00:00', available: true, duration: 30 },
          { datetime: '2025-10-26T13:30:00', available: true, duration: 30 },
          { datetime: '2025-10-26T14:00:00', available: true, duration: 30 },
          { datetime: '2025-10-26T14:30:00', available: true, duration: 30 },
          { datetime: '2025-10-26T15:00:00', available: true, duration: 30 },
          { datetime: '2025-10-26T15:30:00', available: true, duration: 30 },
          { datetime: '2025-10-26T16:00:00', available: true, duration: 30 },
          { datetime: '2025-10-26T16:30:00', available: true, duration: 30 },
          { datetime: '2025-10-26T17:00:00', available: true, duration: 30 },
          { datetime: '2025-10-26T17:30:00', available: true, duration: 30 }
        ];

        return Promise.resolve({
          data: {
            slots: mockSlots
          }
        });
      }

      return Promise.reject(error);
    }
  );
}

// Enhanced request interceptor with environment detection and validation
api.interceptors.request.use(
  async (config) => {
    // Add authentication token
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }

      // Add environment header for debugging
      if (isDebugModeEnabled()) {
        config.headers['X-Environment'] = environmentDetector.getEnvironment();
        config.headers['X-Client-Version'] = '1.0.0';
      }
    }

    // Log request details in debug mode
    if (isDebugModeEnabled()) {
      console.log(`[API Request] ${config.method?.toUpperCase()} ${config.url}`, {
        baseURL: config.baseURL,
        hasAuth: !!config.headers.Authorization,
        environment: environmentDetector.getEnvironment()
      });
    }

    // Perform connection validation if enabled and this is not a health check
    if (isConnectionValidationEnabled() && !config.url?.includes('/health')) {
      try {
        const healthCheck = await connectionValidator.quickHealthCheck();
        if (!healthCheck.isHealthy) {
          console.warn('[API] Backend health check failed, but proceeding with request');
        }
      } catch (error) {
        console.warn('[API] Could not perform health check:', error);
      }
    }

    return config;
  },
  (error) => {
    if (isEnhancedErrorReportingEnabled()) {
      console.error('[API Request Error]', error);
    }
    return Promise.reject(error);
  }
);

// Enhanced response interceptor with environment-aware error handling
api.interceptors.response.use(
  (response) => {
    // Log successful responses in debug mode
    if (isDebugModeEnabled()) {
      console.log(`[API Response] ${response.config.method?.toUpperCase()} ${response.config.url}`, {
        status: response.status,
        responseTime: response.headers['x-response-time'],
        environment: response.headers['x-environment'],
        apiVersion: response.headers['x-api-version']
      });
    }

    return response;
  },
  async (error) => {
    // Enhanced error reporting
    if (isEnhancedErrorReportingEnabled()) {
      console.error('[API Response Error]', {
        url: error.config?.url,
        method: error.config?.method,
        status: error.response?.status,
        statusText: error.response?.statusText,
        message: error.message,
        environment: environmentDetector.getEnvironment(),
        baseURL: error.config?.baseURL
      });
    }

    // Handle authentication errors
    if (error.response?.status === 401) {
      if (isDebugModeEnabled()) {
        console.warn('[API] Authentication error - clearing token and redirecting');
      }

      if (typeof window !== 'undefined') {
        localStorage.removeItem('token');

        // Avoid redirect loops - redirect to homepage since login is now handled there
        if (window.location.pathname !== '/') {
          window.location.href = '/';
        }
      }
    }

    // Handle CORS errors
    if (error.message.includes('CORS')) {
      if (isDebugModeEnabled()) {
        console.error('[API] CORS error detected - check backend CORS configuration');
      }
    }

    // Handle network errors with environment switching attempt
    if (error.code === 'NETWORK_ERROR' || error.message.includes('Network Error')) {
      if (isAutoEnvironmentSwitchingEnabled() && environmentDetector.isDevelopment()) {
        console.warn('[API] Network error detected - attempting environment validation');

        // Try to validate current environment and potentially switch
        try {
          const validation = await connectionValidator.validateCurrentConnection();
          if (!validation.canConnect && areMockResponsesEnabled()) {
            console.info('[API] Backend unreachable, mock responses will handle requests');
          }
        } catch (validationError) {
          console.warn('[API] Environment validation failed:', validationError);
        }
      }
    }

    // Handle timeout errors
    if (error.code === 'ECONNABORTED' || error.message.includes('timeout')) {
      if (isDebugModeEnabled()) {
        console.warn('[API] Request timeout - check backend performance');
      }
    }

    // Server errors with potential fallback suggestions
    if (error.response?.status >= 500) {
      if (isDebugModeEnabled()) {
        console.error('[API] Server error - check backend logs');
      }

      // In development, suggest checking if backend is running
      if (environmentDetector.isDevelopment()) {
        console.info('[API] Development hint: Ensure backend server is running on localhost:5000');
      }
    }

    return Promise.reject(error);
  }
);

// Export utility functions for environment management
export const apiUtils = {
  /**
   * Get current API configuration
   */
  getConfig: () => ({
    baseURL: API_URL,
    environment: environmentDetector.getEnvironment(),
    isAutoSwitchingEnabled: isAutoEnvironmentSwitchingEnabled(),
    areMocksEnabled: areMockResponsesEnabled(),
    isDebugEnabled: isDebugModeEnabled()
  }),

  /**
   * Test API connectivity
   */
  testConnection: () => environmentDetector.testBackendConnection(API_URL),

  /**
   * Validate API connection
   */
  validateConnection: () => connectionValidator.validateConnection(API_URL),

  /**
   * Get connection metrics
   */
  getConnectionMetrics: () => connectionValidator.getConnectionMetrics(),

  /**
   * Enable/disable features
   */
  enableFeature: (feature: string) => {
    // Import dynamically to avoid circular dependencies
    import('./config/featureFlags').then(({ enableFeature }) => {
      enableFeature(feature);
    });
  },

  disableFeature: (feature: string) => {
    import('./config/featureFlags').then(({ disableFeature }) => {
      disableFeature(feature);
    });
  },

  /**
   * Reset environment detection
   */
  resetEnvironment: () => {
    environmentDetector.redetectEnvironment();
    connectionValidator.clearCache();
  },

  /**
   * Get environment information
   */
  getEnvironmentInfo: () => ({
    environment: environmentDetector.getEnvironment(),
    apiBaseUrl: environmentDetector.getConfig().apiBaseUrl,
    config: environmentDetector.getConfig()
  })
};

// Export commonly used utilities directly
export const {
  getConfig,
  testConnection,
  validateConnection,
  getConnectionMetrics,
  getEnvironmentInfo
} = apiUtils;
