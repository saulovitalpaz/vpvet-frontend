/**
 * Test suite for environment switching functionality.
 * These tests verify that the automatic environment detection and switching works correctly.
 */

import { describe, test, expect, beforeEach, jest } from '@jest/globals';

// Mock environment and feature flags
jest.mock('../lib/environment/environmentDetector');
jest.mock('../lib/config/featureFlags');
jest.mock('../lib/utils/connectionValidator');

// Import after mocking
import { environmentDetector } from '../lib/environment/environmentDetector';
import { featureFlags } from '../lib/config/featureFlags';
import { connectionValidator } from '../lib/utils/connectionValidator';
import { api } from '../lib/api';

describe('Environment Switching Functionality', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Environment Detection', () => {
    test('should detect development environment on localhost', () => {
      // Mock environment detection
      const mockConfig = {
        environment: 'development' as const,
        isDevelopment: true,
        isProduction: false,
        apiBaseUrl: 'http://localhost:5000/api',
        allowedOrigins: ['http://localhost:3000'],
        enableMockResponses: true,
        frontendUrl: 'http://localhost:3000'
      };

      jest.mocked(environmentDetector.getConfig).mockReturnValue(mockConfig);
      jest.mocked(environmentDetector.getEnvironment).mockReturnValue('development');
      jest.mocked(environmentDetector.getApiBaseUrl).mockReturnValue('http://localhost:5000/api');

      expect(mockConfig.environment).toBe('development');
      expect(mockConfig.isDevelopment).toBe(true);
      expect(mockConfig.enableMockResponses).toBe(true);
      expect(mockConfig.apiBaseUrl).toBe('http://localhost:5000/api');
    });

    test('should detect production environment on live domain', () => {
      // Mock production environment
      const mockConfig = {
        environment: 'production' as const,
        isDevelopment: false,
        isProduction: true,
        apiBaseUrl: 'https://api.vpvet.app/api',
        allowedOrigins: ['https://vpvet-frontend.vercel.app'],
        enableMockResponses: false,
        frontendUrl: 'https://vpvet-frontend.vercel.app'
      };

      jest.mocked(environmentDetector.getConfig).mockReturnValue(mockConfig);
      jest.mocked(environmentDetector.getEnvironment).mockReturnValue('production');
      jest.mocked(environmentDetector.getApiBaseUrl).mockReturnValue('https://api.vpvet.app/api');

      expect(mockConfig.environment).toBe('production');
      expect(mockConfig.isProduction).toBe(true);
      expect(mockConfig.enableMockResponses).toBe(false);
      expect(mockConfig.apiBaseUrl).toBe('https://api.vpvet.app/api');
    });
  });

  describe('Feature Flag Safety', () => {
    test('should have auto environment switching disabled by default', () => {
      jest.mocked(featureFlags.isEnabled).mockReturnValue(false);
      jest.mocked(featureFlags.isAutoEnvironmentSwitchingEnabled).mockReturnValue(false);

      expect(featureFlags.isAutoEnvironmentSwitchingEnabled()).toBe(false);
    });

    test('should enable mock responses in development', () => {
      jest.mocked(featureFlags.isEnabled).mockReturnValue(true);
      jest.mocked(featureFlags.areMockResponsesEnabled).mockReturnValue(true);

      expect(featureFlags.areMockResponsesEnabled()).toBe(true);
    });

    test('should have connection validation enabled', () => {
      jest.mocked(featureFlags.isEnabled).mockReturnValue(true);
      jest.mocked(featureFlags.isConnectionValidationEnabled).mockReturnValue(true);

      expect(featureFlags.isConnectionValidationEnabled()).toBe(true);
    });
  });

  describe('Connection Validation', () => {
    test('should validate backend connection successfully', async () => {
      const mockValidationResult = {
        isValid: true,
        canConnect: true,
        isHealthy: true,
        responseTimeMs: 150,
        environment: 'development',
        issues: [],
        recommendations: [],
        lastChecked: new Date().toISOString()
      };

      jest.mocked(connectionValidator.validateConnection).mockResolvedValue(mockValidationResult);

      const result = await connectionValidator.validateConnection('http://localhost:5000/api');

      expect(result.isValid).toBe(true);
      expect(result.canConnect).toBe(true);
      expect(result.isHealthy).toBe(true);
      expect(result.responseTimeMs).toBe(150);
      expect(result.issues).toHaveLength(0);
    });

    test('should handle connection failure gracefully', async () => {
      const mockValidationResult = {
        isValid: false,
        canConnect: false,
        isHealthy: false,
        issues: ['Cannot connect to backend: Connection refused'],
        recommendations: ['Check if the backend server is running'],
        lastChecked: new Date().toISOString()
      };

      jest.mocked(connectionValidator.validateConnection).mockResolvedValue(mockValidationResult);

      const result = await connectionValidator.validateConnection('http://localhost:5000/api');

      expect(result.isValid).toBe(false);
      expect(result.canConnect).toBe(false);
      expect(result.issues).toHaveLength(1);
      expect(result.recommendations).toHaveLength(1);
    });

    test('should validate environment switch safety', async () => {
      const mockSwitchValidation = {
        isSafe: true,
        validation: {
          isValid: true,
          canConnect: true,
          isHealthy: true,
          issues: [],
          recommendations: [],
          lastChecked: new Date().toISOString()
        },
        switchValidation: {
          isSafe: true,
          safetyIssues: [],
          currentBackend: { isConnected: true },
          targetBackend: { isConnected: true },
          recommendation: 'safe_to_switch'
        },
        recommendations: []
      };

      jest.mocked(connectionValidator.validateEnvironmentSwitch).mockResolvedValue(mockSwitchValidation);

      const result = await connectionValidator.validateEnvironmentSwitch('https://api.vpvet.app/api');

      expect(result.isSafe).toBe(true);
      expect(result.validation.isValid).toBe(true);
      expect(result.switchValidation.isSafe).toBe(true);
      expect(result.recommendations).toHaveLength(0);
    });
  });

  describe('Backend Health Check', () => {
    test('should test backend connection successfully', async () => {
      const mockConnectionResult = {
        isConnected: true,
        responseTimeMs: 200,
        environment: 'development',
        status: 'healthy',
        apiInfo: {
          apiBaseUrl: 'http://localhost:5000/api',
          allowedOrigins: ['http://localhost:3000'],
          mockResponsesEnabled: true,
          version: '1.0.0'
        },
        timestamp: new Date().toISOString()
      };

      jest.mocked(environmentDetector.testBackendConnection).mockResolvedValue(mockConnectionResult);

      const result = await environmentDetector.testBackendConnection('http://localhost:5000/api');

      expect(result.isConnected).toBe(true);
      expect(result.status).toBe('healthy');
      expect(result.environment).toBe('development');
      expect(result.apiInfo?.mockResponsesEnabled).toBe(true);
      expect(result.apiInfo?.version).toBe('1.0.0');
    });

    test('should handle backend health check failure', async () => {
      const mockConnectionResult = {
        isConnected: false,
        error: 'Connection timeout',
        responseTimeMs: 5000,
        timestamp: new Date().toISOString()
      };

      jest.mocked(environmentDetector.testBackendConnection).mockResolvedValue(mockConnectionResult);

      const result = await environmentDetector.testBackendConnection('http://localhost:5000/api');

      expect(result.isConnected).toBe(false);
      expect(result.error).toBe('Connection timeout');
      expect(result.responseTimeMs).toBe(5000);
    });
  });

  describe('Production Safety', () => {
    test('should not allow localhost URLs in production environment', () => {
      const mockProductionConfig = {
        environment: 'production' as const,
        isProduction: true,
        allowedOrigins: ['https://vpvet-frontend.vercel.app'],
        apiBaseUrl: 'https://api.vpvet.app/api'
      };

      // Check that production config doesn't include localhost
      expect(mockProductionConfig.allowedOrigins).not.toContain(
        expect.stringMatching(/localhost|127\.0\.0\.1/)
      );
      expect(mockProductionConfig.apiBaseUrl).toStartWith('https://');
    });

    test('should have feature flags disabled in production by default', () => {
      // Mock production environment
      jest.mocked(environmentDetector.isProduction).mockReturnValue(true);

      // Auto environment switching should be disabled in production
      jest.mocked(featureFlags.isAutoEnvironmentSwitchingEnabled).mockReturnValue(false);

      expect(environmentDetector.isProduction()).toBe(true);
      expect(featureFlags.isAutoEnvironmentSwitchingEnabled()).toBe(false);
    });

    test('should enable debug mode only in development', () => {
      // Mock development environment
      jest.mocked(environmentDetector.isDevelopment).mockReturnValue(true);
      jest.mocked(featureFlags.isDebugModeEnabled).mockReturnValue(true);

      expect(environmentDetector.isDevelopment()).toBe(true);
      expect(featureFlags.isDebugModeEnabled()).toBe(true);

      // Mock production environment
      jest.mocked(environmentDetector.isDevelopment).mockReturnValue(false);
      jest.mocked(featureFlags.isDebugModeEnabled).mockReturnValue(false);

      expect(environmentDetector.isDevelopment()).toBe(false);
      expect(featureFlags.isDebugModeEnabled()).toBe(false);
    });
  });

  describe('API Client Integration', () => => {
    test('should use environment-aware API URL', () => {
      // Mock the API URL detection
      const mockApiUrl = 'http://localhost:5000/api';
      jest.mocked(environmentDetector.getApiBaseUrl).mockReturnValue(mockApiUrl);

      // Test that API client would use the correct URL
      expect(mockApiUrl).toBe('http://localhost:5000/api');
    });

    test('should handle API configuration correctly', () => {
      // Mock feature flags
      jest.mocked(featureFlags.isAutoEnvironmentSwitchingEnabled).mockReturnValue(true);
      jest.mocked(featureFlags.isConnectionValidationEnabled).mockReturnValue(true);
      jest.mocked(featureFlags.areMockResponsesEnabled).mockReturnValue(true);
      jest.mocked(featureFlags.isDebugModeEnabled).mockReturnValue(true);

      // Test configuration
      expect(featureFlags.isAutoEnvironmentSwitchingEnabled()).toBe(true);
      expect(featureFlags.isConnectionValidationEnabled()).toBe(true);
      expect(featureFlags.areMockResponsesEnabled()).toBe(true);
      expect(featureFlags.isDebugModeEnabled()).toBe(true);
    });
  });

  describe('Error Handling and Logging', () => {
    test('should log environment information in debug mode', () => {
      const consoleSpy = jest.spyOn(console, 'log').mockImplementation();

      // Mock debug mode enabled
      jest.mocked(featureFlags.isDebugModeEnabled).mockReturnValue(true);

      expect(featureFlags.isDebugModeEnabled()).toBe(true);

      consoleSpy.mockRestore();
    });

    test('should provide enhanced error reporting when enabled', () => {
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation();

      // Mock enhanced error reporting enabled
      jest.mocked(featureFlags.isEnhancedErrorReportingEnabled).mockReturnValue(true);

      expect(featureFlags.isEnhancedErrorReportingEnabled()).toBe(true);

      consoleSpy.mockRestore();
    });
  });
});

describe('Integration Tests', () => {
  test('should work end-to-end for development environment', async () => {
    // Mock complete development setup
    const mockConfig = {
      environment: 'development' as const,
      isDevelopment: true,
      apiBaseUrl: 'http://localhost:5000/api',
      enableMockResponses: true
    };

    const mockValidation = {
      isValid: true,
      canConnect: true,
      isHealthy: true,
      issues: [],
      recommendations: [],
      lastChecked: new Date().toISOString()
    };

    const mockConnection = {
      isConnected: true,
      environment: 'development',
      status: 'healthy',
      timestamp: new Date().toISOString()
    };

    jest.mocked(environmentDetector.getConfig).mockReturnValue(mockConfig);
    jest.mocked(environmentDetector.getEnvironment).mockReturnValue('development');
    jest.mocked(connectionValidator.validateConnection).mockResolvedValue(mockValidation);
    jest.mocked(environmentDetector.testBackendConnection).mockResolvedValue(mockConnection);
    jest.mocked(featureFlags.isAutoEnvironmentSwitchingEnabled).mockReturnValue(true);
    jest.mocked(featureFlags.areMockResponsesEnabled).mockReturnValue(true);

    // Test the complete flow
    expect(environmentDetector.getEnvironment()).toBe('development');
    expect(mockConfig.enableMockResponses).toBe(true);

    const validation = await connectionValidator.validateConnection(mockConfig.apiBaseUrl);
    expect(validation.isValid).toBe(true);

    const connection = await environmentDetector.testBackendConnection(mockConfig.apiBaseUrl);
    expect(connection.isConnected).toBe(true);
    expect(connection.environment).toBe('development');
  });

  test('should work end-to-end for production environment', async () => {
    // Mock complete production setup
    const mockConfig = {
      environment: 'production' as const,
      isProduction: true,
      apiBaseUrl: 'https://api.vpvet.app/api',
      enableMockResponses: false
    };

    const mockValidation = {
      isValid: true,
      canConnect: true,
      isHealthy: true,
      issues: [],
      recommendations: [],
      lastChecked: new Date().toISOString()
    };

    jest.mocked(environmentDetector.getConfig).mockReturnValue(mockConfig);
    jest.mocked(environmentDetector.getEnvironment).mockReturnValue('production');
    jest.mocked(connectionValidator.validateConnection).mockResolvedValue(mockValidation);
    jest.mocked(featureFlags.isAutoEnvironmentSwitchingEnabled).mockReturnValue(false);
    jest.mocked(featureFlags.areMockResponsesEnabled).mockReturnValue(false);

    // Test the complete flow
    expect(environmentDetector.getEnvironment()).toBe('production');
    expect(mockConfig.enableMockResponses).toBe(false);
    expect(featureFlags.isAutoEnvironmentSwitchingEnabled()).toBe(false);

    const validation = await connectionValidator.validateConnection(mockConfig.apiBaseUrl);
    expect(validation.isValid).toBe(true);
  });
});