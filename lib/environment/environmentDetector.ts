/**
 * Environment detection and management for VPVET frontend.
 * Provides automatic environment detection with production safety features.
 */

export type Environment = 'development' | 'production';

export interface EnvironmentConfig {
  environment: Environment;
  isDevelopment: boolean;
  isProduction: boolean;
  apiBaseUrl: string;
  allowedOrigins: string[];
  enableMockResponses: boolean;
  railwayDomain?: string;
  frontendUrl: string;
}

export interface ConnectionTestResult {
  isConnected: boolean;
  responseTimeMs?: number;
  environment?: string;
  status?: string;
  error?: string;
  apiInfo?: {
    apiBaseUrl: string;
    allowedOrigins: string[];
    mockResponsesEnabled: boolean;
    version: string;
  };
  timestamp: string;
}

export class EnvironmentDetector {
  private static instance: EnvironmentDetector;
  private config: EnvironmentConfig | null = null;
  private connectionCache: Map<string, ConnectionTestResult> = new Map();
  private readonly CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

  private constructor() {
    this.detectEnvironment();
  }

  /**
   * Get singleton instance of EnvironmentDetector
   */
  static getInstance(): EnvironmentDetector {
    if (!EnvironmentDetector.instance) {
      EnvironmentDetector.instance = new EnvironmentDetector();
    }
    return EnvironmentDetector.instance;
  }

  /**
   * Detect the current environment automatically
   */
  private detectEnvironment(): void {
    const isDevelopment = this.isDevelopmentEnvironment();
    const isProduction = !isDevelopment;

    this.config = {
      environment: isDevelopment ? 'development' : 'production',
      isDevelopment,
      isProduction,
      apiBaseUrl: this.getApiBaseUrlForEnvironment(isDevelopment),
      allowedOrigins: this.getAllowedOrigins(isDevelopment),
      enableMockResponses: isDevelopment,
      railwayDomain: process.env.NEXT_PUBLIC_RAILWAY_DOMAIN || undefined,
      frontendUrl: this.getFrontendUrl(isDevelopment)
    };

    console.log(`[EnvironmentDetector] Environment detected: ${this.config.environment}`);
    console.log(`[EnvironmentDetector] API URL: ${this.config.apiBaseUrl}`);
    console.log(`[EnvironmentDetector] Mock responses: ${this.config.enableMockResponses}`);
  }

  /**
   * Determine if running in development environment
   */
  private isDevelopmentEnvironment(): boolean {
    // Check multiple indicators for development environment

    // 1. Check hostname
    if (typeof window !== 'undefined') {
      const hostname = window.location.hostname;
      if (hostname === 'localhost' || hostname === '127.0.0.1') {
        return true;
      }
    }

    // 2. Check environment variables
    if (process.env.NODE_ENV === 'development') {
      return true;
    }

    // 3. Check Next.js development mode
    if (process.env.NEXT_PUBLIC_VERCEL_ENV === 'development') {
      return true;
    }

    // 4. Check if configured API URL is localhost
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;
    if (apiUrl && (apiUrl.includes('localhost') || apiUrl.includes('127.0.0.1'))) {
      return true;
    }

    return false;
  }

  /**
   * Get API base URL based on environment
   */
  private getApiBaseUrlForEnvironment(isDevelopment: boolean): string {
    // Environment variable takes precedence
    const envApiUrl = process.env.NEXT_PUBLIC_API_URL;
    if (envApiUrl) {
      return envApiUrl;
    }

    // Environment-specific URLs
    if (isDevelopment) {
      return 'http://localhost:5000/api';
    }

    // Production - use Railway domain or fallback
    const railwayDomain = process.env.NEXT_PUBLIC_RAILWAY_DOMAIN;
    if (railwayDomain) {
      return `https://${railwayDomain}/api`;
    }

    // Fallback production URL
    return 'https://api.vpvet.app/api';
  }

  /**
   * Get allowed origins based on environment
   */
  private getAllowedOrigins(isDevelopment: boolean): string[] {
    if (isDevelopment) {
      return [
        'http://localhost:3000',
        'http://localhost:3001',
        'http://127.0.0.1:3000',
        'http://127.0.0.1:3001'
      ];
    }

    // Production - specific frontend URLs
    const frontendUrl = this.getFrontendUrl(false);
    return [frontendUrl];
  }

  /**
   * Get frontend URL based on environment
   */
  private getFrontendUrl(isDevelopment: boolean): string {
    if (isDevelopment) {
      return 'http://localhost:3000';
    }

    // Production - use environment variable or detect from window
    if (typeof window !== 'undefined') {
      return `${window.location.protocol}//${window.location.host}`;
    }

    // Fallback
    return process.env.NEXT_PUBLIC_FRONTEND_URL || 'https://vpvet-frontend.vercel.app';
  }

  /**
   * Get current environment configuration
   */
  getConfig(): EnvironmentConfig {
    if (!this.config) {
      this.detectEnvironment();
    }
    return this.config!;
  }

  /**
   * Get current environment
   */
  getEnvironment(): Environment {
    return this.getConfig().environment;
  }

  /**
   * Get API base URL for current environment
   */
  getApiBaseUrl(): string {
    return this.getConfig().apiBaseUrl;
  }

  /**
   * Check if current environment is development
   */
  isDevelopment(): boolean {
    return this.getConfig().isDevelopment;
  }

  /**
   * Check if current environment is production
   */
  isProduction(): boolean {
    return this.getConfig().isProduction;
  }

  /**
   * Test backend connectivity
   */
  async testBackendConnection(baseUrl?: string): Promise<ConnectionTestResult> {
    const url = baseUrl || this.getApiBaseUrl();
    const healthUrl = `${url.replace(/\/$/, '')}/health`;

    // Check cache first
    const cacheKey = url;
    const cached = this.connectionCache.get(cacheKey);
    if (cached && (Date.now() - new Date(cached.timestamp).getTime()) < this.CACHE_DURATION) {
      console.log(`[EnvironmentDetector] Using cached connection result for ${url}`);
      return cached;
    }

    console.log(`[EnvironmentDetector] Testing backend connection to: ${healthUrl}`);

    const startTime = Date.now();

    try {
      const response = await fetch(healthUrl, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'User-Agent': 'VPVET-EnvironmentDetector/1.0'
        },
        signal: AbortSignal.timeout(5000) // 5 second timeout
      });

      const responseTime = Date.now() - startTime;

      if (response.ok) {
        const data = await response.json();
        const result: ConnectionTestResult = {
          isConnected: true,
          responseTimeMs: responseTime,
          environment: data.environment,
          status: data.status,
          apiInfo: {
            apiBaseUrl: data.api_base_url,
            allowedOrigins: data.allowed_origins,
            mockResponsesEnabled: data.mock_responses_enabled,
            version: data.version
          },
          timestamp: new Date().toISOString()
        };

        // Cache the result
        this.connectionCache.set(cacheKey, result);

        console.log(`[EnvironmentDetector] Connection successful: ${responseTime}ms`);
        return result;
      } else {
        const result: ConnectionTestResult = {
          isConnected: false,
          error: `HTTP ${response.status}`,
          responseTimeMs: responseTime,
          timestamp: new Date().toISOString()
        };

        this.connectionCache.set(cacheKey, result);
        return result;
      }

    } catch (error) {
      const responseTime = Date.now() - startTime;
      let errorMessage = 'Unknown error';

      if (error instanceof Error) {
        if (error.name === 'AbortError') {
          errorMessage = 'Connection timeout';
        } else if (error.message.includes('fetch')) {
          errorMessage = 'Connection refused';
        } else {
          errorMessage = error.message;
        }
      }

      const result: ConnectionTestResult = {
        isConnected: false,
        error: errorMessage,
        responseTimeMs: responseTime,
        timestamp: new Date().toISOString()
      };

      this.connectionCache.set(cacheKey, result);
      return result;
    }
  }

  /**
   * Validate environment switch safety
   */
  async validateEnvironmentSwitch(targetUrl: string): Promise<{
    isSafe: boolean;
    safetyIssues: string[];
    currentBackend: ConnectionTestResult;
    targetBackend: ConnectionTestResult;
    recommendation: string;
  }> {
    console.log(`[EnvironmentDetector] Validating environment switch to: ${targetUrl}`);

    const currentUrl = this.getApiBaseUrl();
    const [currentResult, targetResult] = await Promise.all([
      this.testBackendConnection(currentUrl),
      this.testBackendConnection(targetUrl)
    ]);

    const safetyIssues: string[] = [];

    // Check if target is responding
    if (!targetResult.isConnected) {
      safetyIssues.push('Target backend is not responding');
    }

    // Check for localhost in production-like URLs
    if (targetUrl.includes('localhost') && targetResult.environment === 'production') {
      safetyIssues.push('Localhost URL detected with production environment');
    }

    // Check for HTTP vs HTTPS mismatch
    if (targetUrl.startsWith('https://') && currentResult.environment === 'development') {
      console.warn('[EnvironmentDetector] Switching from development to HTTPS URL');
    }

    const isSafe = safetyIssues.length === 0;
    const recommendation = isSafe ? 'safe_to_switch' : 'do_not_switch';

    return {
      isSafe,
      safetyIssues,
      currentBackend: currentResult,
      targetBackend: targetResult,
      recommendation
    };
  }

  /**
   * Clear connection cache
   */
  clearCache(): void {
    this.connectionCache.clear();
    console.log('[EnvironmentDetector] Connection cache cleared');
  }

  /**
   * Force re-detection of environment
   */
  redetectEnvironment(): void {
    this.clearCache();
    this.config = null;
    this.detectEnvironment();
  }
}

// Export singleton instance
export const environmentDetector = EnvironmentDetector.getInstance();

// Export utility functions for convenience
export const getEnvironment = () => environmentDetector.getEnvironment();
export const getApiUrl = () => environmentDetector.getApiBaseUrl();
export const isDevelopment = () => environmentDetector.isDevelopment();
export const isProduction = () => environmentDetector.isProduction();
export const testConnection = (url?: string) => environmentDetector.testBackendConnection(url);