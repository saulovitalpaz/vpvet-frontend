/**
 * Connection validation utilities for VPVET frontend.
 * Provides tools to validate backend connectivity and handle environment switching.
 */

import { environmentDetector, type ConnectionTestResult } from '../environment/environmentDetector';
import { isConnectionValidationEnabled, isDebugModeEnabled } from '../config/featureFlags';

export interface ValidationResult {
  isValid: boolean;
  canConnect: boolean;
  isHealthy: boolean;
  responseTimeMs?: number;
  environment?: string;
  issues: string[];
  recommendations: string[];
  lastChecked: string;
}

export interface ConnectionMetrics {
  totalChecks: number;
  successfulChecks: number;
  averageResponseTime: number;
  minResponseTime: number;
  maxResponseTime: number;
  successRate: number;
  lastCheckTime: string;
}

class ConnectionValidator {
  private static instance: ConnectionValidator;
  private connectionHistory: ConnectionTestResult[] = [];
  private maxHistorySize = 50;
  private validationCache: Map<string, ValidationResult> = new Map();
  private cacheExpiry = 2 * 60 * 1000; // 2 minutes

  private constructor() {
    this.setupPeriodicValidation();
  }

  /**
   * Get singleton instance
   */
  static getInstance(): ConnectionValidator {
    if (!ConnectionValidator.instance) {
      ConnectionValidator.instance = new ConnectionValidator();
    }
    return ConnectionValidator.instance;
  }

  /**
   * Setup periodic connection validation
   */
  private setupPeriodicValidation(): void {
    if (typeof window !== 'undefined') {
      // Validate every 5 minutes
      setInterval(() => {
        this.validateCurrentConnection().catch(error => {
          console.warn('[ConnectionValidator] Periodic validation failed:', error);
        });
      }, 5 * 60 * 1000);
    }
  }

  /**
   * Validate current backend connection
   */
  async validateCurrentConnection(): Promise<ValidationResult> {
    const currentUrl = environmentDetector.getConfig().apiBaseUrl;
    return this.validateConnection(currentUrl);
  }

  /**
   * Validate connection to a specific URL
   */
  async validateConnection(url: string, forceCheck = false): Promise<ValidationResult> {
    const cacheKey = url;
    const cached = this.validationCache.get(cacheKey);

    // Check cache first
    if (!forceCheck && cached && (Date.now() - new Date(cached.lastChecked).getTime()) < this.cacheExpiry) {
      if (isDebugModeEnabled()) {
        console.log(`[ConnectionValidator] Using cached validation for ${url}`);
      }
      return cached;
    }

    if (isDebugModeEnabled()) {
      console.log(`[ConnectionValidator] Validating connection to: ${url}`);
    }

    const issues: string[] = [];
    const recommendations: string[] = [];
    let isValid = true;
    let canConnect = false;
    let isHealthy = false;
    let responseTimeMs: number | undefined;
    let environment: string | undefined;

    try {
      // Test basic connectivity
      const connectionResult = await environmentDetector.testBackendConnection(url);
      this.addToHistory(connectionResult);

      if (!connectionResult.isConnected) {
        canConnect = false;
        isValid = false;
        issues.push(`Cannot connect to backend: ${connectionResult.error || 'Unknown error'}`);
        recommendations.push('Check if the backend server is running');
        recommendations.push('Verify the API URL is correct');
      } else {
        canConnect = true;
        responseTimeMs = connectionResult.responseTimeMs;
        environment = connectionResult.environment;

        // Check response time
        if (responseTimeMs && responseTimeMs > 5000) {
          issues.push('Slow response time (>5 seconds)');
          recommendations.push('Consider optimizing backend performance');
        }

        // Check health status
        if (connectionResult.status === 'healthy') {
          isHealthy = true;
        } else {
          isHealthy = false;
          issues.push('Backend reported unhealthy status');
          recommendations.push('Check backend logs for issues');
        }

        // Validate environment consistency
        const expectedEnv = url.includes('localhost') ? 'development' : 'production';
        if (connectionResult.environment && connectionResult.environment !== expectedEnv) {
          issues.push(`Environment mismatch: expected ${expectedEnv}, got ${connectionResult.environment}`);
          recommendations.push('Ensure API URL matches expected environment');
        }

        // Validate API info
        if (connectionResult.apiInfo) {
          const { allowedOrigins, mockResponsesEnabled, version } = connectionResult.apiInfo;

          // Check if mock responses are appropriately enabled/disabled
          const shouldHaveMocks = expectedEnv === 'development';
          if (mockResponsesEnabled !== shouldHaveMocks) {
            issues.push(`Mock responses ${mockResponsesEnabled ? 'enabled' : 'disabled'} but should be ${shouldHaveMocks ? 'enabled' : 'disabled'}`);
          }

          // Log version info
          if (isDebugModeEnabled()) {
            console.log(`[ConnectionValidator] Backend version: ${version}`);
            console.log(`[ConnectionValidator] Allowed origins:`, allowedOrigins);
          }
        }
      }

    } catch (error) {
      isValid = false;
      canConnect = false;
      issues.push(`Validation error: ${error instanceof Error ? error.message : 'Unknown error'}`);
      recommendations.push('Check network connectivity');
      recommendations.push('Verify CORS configuration');
    }

    const result: ValidationResult = {
      isValid,
      canConnect,
      isHealthy,
      responseTimeMs,
      environment,
      issues,
      recommendations,
      lastChecked: new Date().toISOString()
    };

    // Cache the result
    this.validationCache.set(cacheKey, result);

    // Log results
    if (isDebugModeEnabled() || issues.length > 0) {
      console.log(`[ConnectionValidator] Validation result for ${url}:`, {
        isValid,
        canConnect,
        isHealthy,
        responseTimeMs,
        issues: issues.length,
        recommendations: recommendations.length
      });

      if (issues.length > 0) {
        console.warn(`[ConnectionValidator] Issues found:`, issues);
        console.info(`[ConnectionValidator] Recommendations:`, recommendations);
      }
    }

    return result;
  }

  /**
   * Validate environment switch safety
   */
  async validateEnvironmentSwitch(targetUrl: string): Promise<{
    isSafe: boolean;
    validation: ValidationResult;
    switchValidation: any;
    recommendations: string[];
  }> {
    const currentUrl = environmentDetector.getConfig().apiBaseUrl;
    const recommendations: string[] = [];

    console.log(`[ConnectionValidator] Validating environment switch: ${currentUrl} → ${targetUrl}`);

    // Validate current connection
    const currentValidation = await this.validateConnection(currentUrl);

    // Validate target connection
    const targetValidation = await this.validateConnection(targetUrl, true);

    // Use environment detector's switch validation
    const switchValidation = await environmentDetector.validateEnvironmentSwitch(targetUrl);

    // Combine validation results
    const isSafe = (
      currentValidation.isValid &&
      targetValidation.isValid &&
      switchValidation.isSafe &&
      targetValidation.canConnect
    );

    // Add specific recommendations
    if (!targetValidation.canConnect) {
      recommendations.push('Target backend is not accessible - cannot switch');
    }

    if (switchValidation.safetyIssues.length > 0) {
      recommendations.push(...switchValidation.safetyIssues);
    }

    if (targetValidation.responseTimeMs && targetValidation.responseTimeMs > 5000) {
      recommendations.push('Target backend has slow response times - consider performance optimization');
    }

    // Environment-specific recommendations
    const currentEnv = environmentDetector.getEnvironment();
    const isTargetLocalhost = targetUrl.includes('localhost');

    if (currentEnv === 'production' && isTargetLocalhost) {
      recommendations.push('WARNING: Switching from production to localhost environment');
    }

    if (currentEnv === 'development' && !isTargetLocalhost) {
      recommendations.push('Switching from development to production-like environment');
    }

    return {
      isSafe,
      validation: targetValidation,
      switchValidation,
      recommendations
    };
  }

  /**
   * Get connection metrics
   */
  getConnectionMetrics(): ConnectionMetrics {
    const recentHistory = this.connectionHistory.slice(-20); // Last 20 checks
    const totalChecks = recentHistory.length;
    const successfulChecks = recentHistory.filter(check => check.isConnected).length;

    const responseTimes = recentHistory
      .filter(check => check.responseTimeMs !== undefined)
      .map(check => check.responseTimeMs!);

    const averageResponseTime = responseTimes.length > 0
      ? responseTimes.reduce((sum, time) => sum + time, 0) / responseTimes.length
      : 0;

    const minResponseTime = responseTimes.length > 0 ? Math.min(...responseTimes) : 0;
    const maxResponseTime = responseTimes.length > 0 ? Math.max(...responseTimes) : 0;
    const successRate = totalChecks > 0 ? (successfulChecks / totalChecks) * 100 : 0;

    return {
      totalChecks,
      successfulChecks,
      averageResponseTime: Math.round(averageResponseTime * 100) / 100,
      minResponseTime,
      maxResponseTime,
      successRate: Math.round(successRate * 100) / 100,
      lastCheckTime: recentHistory.length > 0 ? recentHistory[recentHistory.length - 1].timestamp : new Date().toISOString()
    };
  }

  /**
   * Add connection result to history
   */
  private addToHistory(result: ConnectionTestResult): void {
    this.connectionHistory.push(result);

    // Maintain history size
    if (this.connectionHistory.length > this.maxHistorySize) {
      this.connectionHistory.shift();
    }
  }

  /**
   * Clear validation cache
   */
  clearCache(): void {
    this.validationCache.clear();
    console.log('[ConnectionValidator] Validation cache cleared');
  }

  /**
   * Get connection history
   */
  getConnectionHistory(): ConnectionTestResult[] {
    return [...this.connectionHistory];
  }

  /**
   * Check if connection validation should be performed
   */
  shouldValidate(): boolean {
    return isConnectionValidationEnabled();
  }

  /**
   * Perform quick health check
   */
  async quickHealthCheck(): Promise<{
    isHealthy: boolean;
    responseTimeMs?: number;
    environment?: string;
  }> {
    if (!this.shouldValidate()) {
      return { isHealthy: true }; // Skip validation if disabled
    }

    try {
      const validation = await this.validateCurrentConnection();
      return {
        isHealthy: validation.isHealthy && validation.canConnect,
        responseTimeMs: validation.responseTimeMs,
        environment: validation.environment
      };
    } catch (error) {
      console.warn('[ConnectionValidator] Quick health check failed:', error);
      return { isHealthy: false };
    }
  }

  /**
   * Get connection status summary
   */
  getStatusSummary(): {
    status: 'healthy' | 'degraded' | 'unhealthy' | 'unknown';
    message: string;
    lastChecked: string;
    metrics: ConnectionMetrics;
  } {
    const metrics = this.getConnectionMetrics();
    const lastValidation = this.connectionHistory[this.connectionHistory.length - 1];

    if (!lastValidation) {
      return {
        status: 'unknown',
        message: 'No connection history available',
        lastChecked: new Date().toISOString(),
        metrics
      };
    }

    let status: 'healthy' | 'degraded' | 'unhealthy' | 'unknown' = 'unknown';
    let message = '';

    if (metrics.successRate >= 95 && metrics.averageResponseTime < 1000) {
      status = 'healthy';
      message = 'Connection is performing well';
    } else if (metrics.successRate >= 80 && metrics.averageResponseTime < 3000) {
      status = 'degraded';
      message = 'Connection has some performance issues';
    } else {
      status = 'unhealthy';
      message = 'Connection is experiencing significant issues';
    }

    return {
      status,
      message,
      lastChecked: lastValidation.timestamp,
      metrics
    };
  }
}

// Export singleton instance
export const connectionValidator = ConnectionValidator.getInstance();

// Export convenience functions
export const validateConnection = (url?: string) =>
  connectionValidator.validateConnection(url || environmentDetector.getConfig().apiBaseUrl);

export const validateEnvironmentSwitch = (targetUrl: string) =>
  connectionValidator.validateEnvironmentSwitch(targetUrl);

export const quickHealthCheck = () => connectionValidator.quickHealthCheck();

export const getConnectionMetrics = () => connectionValidator.getConnectionMetrics();

export const getStatusSummary = () => connectionValidator.getStatusSummary();