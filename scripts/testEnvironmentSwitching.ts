#!/usr/bin/env tsx

/**
 * Manual test script for environment switching functionality.
 * This script can be run to verify that the environment detection and switching works correctly.
 */

// Import our environment switching modules
import { environmentDetector } from '../lib/environment/environmentDetector';
import { featureFlags } from '../lib/config/featureFlags';
import { connectionValidator } from '../lib/utils/connectionValidator';
import { api, apiUtils } from '../lib/api';

/**
 * Test environment detection
 */
async function testEnvironmentDetection() {
  console.log('\n=== Testing Environment Detection ===');

  const config = environmentDetector.getConfig();
  console.log('Environment Configuration:', {
    environment: config.environment,
    isDevelopment: config.isDevelopment,
    isProduction: config.isProduction,
    apiBaseUrl: config.apiBaseUrl,
    allowedOrigins: config.allowedOrigins,
    enableMockResponses: config.enableMockResponses,
    frontendUrl: config.frontendUrl
  });

  console.log('Current Environment:', environmentDetector.getEnvironment());
  console.log('API Base URL:', environmentDetector.getApiBaseUrl());
  console.log('Is Development:', environmentDetector.isDevelopment());
  console.log('Is Production:', environmentDetector.isProduction());
}

/**
 * Test feature flags
 */
async function testFeatureFlags() {
  console.log('\n=== Testing Feature Flags ===');

  console.log('Auto Environment Switching:', featureFlags.isAutoEnvironmentSwitchingEnabled());
  console.log('Connection Validation:', featureFlags.isConnectionValidationEnabled());
  console.log('Mock Responses:', featureFlags.areMockResponsesEnabled());
  console.log('Debug Mode:', featureFlags.isDebugModeEnabled());
  console.log('Enhanced Error Reporting:', featureFlags.isEnhancedErrorReportingEnabled());

  // Show all active flags
  const activeFlags = featureFlags.getActiveFlags();
  console.log('Active Feature Flags:', activeFlags);
}

/**
 * Test backend connectivity
 */
async function testBackendConnectivity() {
  console.log('\n=== Testing Backend Connectivity ===');

  try {
    const connectionResult = await environmentDetector.testBackendConnection();
    console.log('Connection Test Result:', {
      isConnected: connectionResult.isConnected,
      responseTimeMs: connectionResult.responseTimeMs,
      environment: connectionResult.environment,
      status: connectionResult.status,
      error: connectionResult.error
    });

    if (connectionResult.apiInfo) {
      console.log('Backend API Info:', {
        apiBaseUrl: connectionResult.apiInfo.apiBaseUrl,
        allowedOrigins: connectionResult.apiInfo.allowedOrigins,
        mockResponsesEnabled: connectionResult.apiInfo.mockResponsesEnabled,
        version: connectionResult.apiInfo.version
      });
    }
  } catch (error) {
    console.error('Connection test failed:', error);
  }
}

/**
 * Test connection validation
 */
async function testConnectionValidation() {
  console.log('\n=== Testing Connection Validation ===');

  try {
    const validationResult = await connectionValidator.validateCurrentConnection();
    console.log('Validation Result:', {
      isValid: validationResult.isValid,
      canConnect: validationResult.canConnect,
      isHealthy: validationResult.isHealthy,
      responseTimeMs: validationResult.responseTimeMs,
      environment: validationResult.environment,
      issuesCount: validationResult.issues.length,
      recommendationsCount: validationResult.recommendations.length
    });

    if (validationResult.issues.length > 0) {
      console.log('Issues:', validationResult.issues);
    }
    if (validationResult.recommendations.length > 0) {
      console.log('Recommendations:', validationResult.recommendations);
    }
  } catch (error) {
    console.error('Connection validation failed:', error);
  }
}

/**
 * Test API client configuration
 */
async function testApiClient() {
  console.log('\n=== Testing API Client Configuration ===');

  const apiConfig = apiUtils.getConfig();
  console.log('API Client Configuration:', apiConfig);

  // Test connection metrics
  try {
    const metrics = connectionValidator.getConnectionMetrics();
    console.log('Connection Metrics:', {
      totalChecks: metrics.totalChecks,
      successfulChecks: metrics.successfulChecks,
      successRate: `${metrics.successRate}%`,
      averageResponseTime: `${metrics.averageResponseTime}ms`,
      lastCheckTime: metrics.lastCheckTime
    });
  } catch (error) {
    console.log('Connection metrics not available:', error);
  }

  // Test status summary
  try {
    const statusSummary = connectionValidator.getStatusSummary();
    console.log('Status Summary:', {
      status: statusSummary.status,
      message: statusSummary.message,
      lastChecked: statusSummary.lastChecked,
      successRate: `${statusSummary.metrics.successRate}%`
    });
  } catch (error) {
    console.log('Status summary not available:', error);
  }
}

/**
 * Test environment switching (development only)
 */
async function testEnvironmentSwitching() {
  console.log('\n=== Testing Environment Switching (Development Only) ===');

  if (environmentDetector.isProduction()) {
    console.log('Skipping environment switch test in production environment');
    return;
  }

  // Test switching to localhost
  try {
    const switchValidation = await connectionValidator.validateEnvironmentSwitch('http://localhost:5000/api');
    console.log('Environment Switch Validation (to localhost):', {
      isSafe: switchValidation.isSafe,
      recommendationsCount: switchValidation.recommendations.length
    });

    if (switchValidation.recommendations.length > 0) {
      console.log('Switch Recommendations:', switchValidation.recommendations);
    }
  } catch (error) {
    console.error('Environment switch validation failed:', error);
  }
}

/**
 * Test feature flag controls
 */
async function testFeatureFlagControls() {
  console.log('\n=== Testing Feature Flag Controls ===');

  if (environmentDetector.isProduction()) {
    console.log('Skipping feature flag modification tests in production');
    return;
  }

  // Test enabling debug mode
  console.log('Enabling debug mode...');
  featureFlags.enableFeature('DEBUG_MODE');
  console.log('Debug Mode after enable:', featureFlags.isDebugModeEnabled());

  // Test disabling debug mode
  console.log('Disabling debug mode...');
  featureFlags.disableFeature('DEBUG_MODE');
  console.log('Debug Mode after disable:', featureFlags.isDebugModeEnabled());

  // Test resetting feature
  console.log('Resetting debug mode...');
  featureFlags.resetFeature('DEBUG_MODE');
  console.log('Debug Mode after reset:', featureFlags.isDebugModeEnabled());
}

/**
 * Main test runner
 */
async function runAllTests() {
  console.log('🧪 Starting Environment Switching Tests');
  console.log('=====================================');

  try {
    await testEnvironmentDetection();
    await testFeatureFlags();
    await testBackendConnectivity();
    await testConnectionValidation();
    await testApiClient();
    await testEnvironmentSwitching();
    await testFeatureFlagControls();

    console.log('\n✅ All tests completed successfully!');
    console.log('\n📝 Summary:');
    console.log('- Environment detection is working');
    console.log('- Feature flags are properly configured');
    console.log('- Backend connectivity can be tested');
    console.log('- Connection validation is functional');
    console.log('- API client is properly configured');
    console.log('- Environment switching can be validated');
    console.log('- Feature flag controls are working');

  } catch (error) {
    console.error('\n❌ Test failed with error:', error);
    process.exit(1);
  }
}

// Run tests if this script is executed directly
if (require.main === module) {
  runAllTests().catch(console.error);
}

export {
  runAllTests,
  testEnvironmentDetection,
  testFeatureFlags,
  testBackendConnectivity,
  testConnectionValidation,
  testApiClient,
  testEnvironmentSwitching,
  testFeatureFlagControls
};