'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/api';
import { environmentDetector } from '@/lib/environment/environmentDetector';
import {
  isDebugModeEnabled,
  isEnhancedErrorReportingEnabled,
  isAutoEnvironmentSwitchingEnabled
} from '@/lib/config/featureFlags';

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  is_dr_saulo: boolean;
  clinic?: {
    id: string;
    name: string;
  };
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // Log environment information on AuthProvider initialization
    if (isDebugModeEnabled()) {
      const envInfo = environmentDetector.getConfig();
      console.log('[AuthProvider] Initializing with environment:', {
        environment: envInfo.environment,
        apiBaseUrl: envInfo.apiBaseUrl,
        autoSwitchingEnabled: isAutoEnvironmentSwitchingEnabled(),
        debugModeEnabled: isDebugModeEnabled(),
        enhancedErrorReporting: isEnhancedErrorReportingEnabled()
      });
    }

    // Check for existing token on mount
    const token = localStorage.getItem('token');
    if (token) {
      fetchUser();
    } else {
      setIsLoading(false);
    }
  }, []);

  const fetchUser = async () => {
    try {
      if (isDebugModeEnabled()) {
        console.log('[AuthProvider] Fetching user profile');
      }

      const response = await api.get('/auth/me');

      if (isDebugModeEnabled()) {
        console.log('[AuthProvider] User profile fetched successfully:', {
          userId: response.data.user?.id,
          userName: response.data.user?.name,
          userRole: response.data.user?.role,
          environment: environmentDetector.getEnvironment()
        });
      }

      setUser(response.data.user);
    } catch (error) {
      if (isEnhancedErrorReportingEnabled()) {
        console.error('[AuthProvider] Failed to fetch user profile:', {
          error: error instanceof Error ? error.message : 'Unknown error',
          environment: environmentDetector.getEnvironment(),
          apiBaseUrl: environmentDetector.getConfig().apiBaseUrl,
          hasToken: !!localStorage.getItem('token')
        });
      }

      // Token invalid, remove it
      localStorage.removeItem('token');
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    try {
      if (isDebugModeEnabled()) {
        console.log('[AuthProvider] Attempting login:', {
          email,
          environment: environmentDetector.getEnvironment(),
          apiBaseUrl: environmentDetector.getConfig().apiBaseUrl
        });
      }

      const response = await api.post('/auth/login', { email, password });
      localStorage.setItem('token', response.data.token);
      setUser(response.data.user);

      if (isDebugModeEnabled()) {
        console.log('[AuthProvider] Login successful:', {
          userId: response.data.user?.id,
          userName: response.data.user?.name,
          userRole: response.data.user?.role,
          redirectTarget: '/dashboard'
        });
      }

      router.push('/dashboard');
    } catch (error) {
      if (isEnhancedErrorReportingEnabled()) {
        console.error('[AuthProvider] Login failed:', {
          email,
          error: error instanceof Error ? error.message : 'Unknown error',
          environment: environmentDetector.getEnvironment(),
          apiBaseUrl: environmentDetector.getConfig().apiBaseUrl
        });
      }

      // Re-throw the error to be handled by the login form
      throw error;
    }
  };

  const logout = () => {
    if (isDebugModeEnabled()) {
      console.log('[AuthProvider] Logging out user:', {
        userId: user?.id,
        userName: user?.name,
        environment: environmentDetector.getEnvironment()
      });
    }

    localStorage.removeItem('token');
    setUser(null);
    router.push('/');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
