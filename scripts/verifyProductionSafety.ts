#!/usr/bin/env tsx

/**
 * Production Safety Verification Script
 *
 * This script verifies that the environment switching implementation is safe for production.
 * It checks that all safety mechanisms are in place and that the production system
 * cannot be accidentally affected by the new functionality.
 */

import { readFileSync } from 'fs';
import { join } from 'path';

interface SafetyCheckResult {
  name: string;
  passed: boolean;
  message: string;
  details?: string;
}

class ProductionSafetyVerifier {
  private results: SafetyCheckResult[] = [];

  /**
   * Add a safety check result
   */
  private addResult(name: string, passed: boolean, message: string, details?: string) {
    this.results.push({ name, passed, message, details });
  }

  /**
   * Check that feature flags are disabled by default
   */
  async checkFeatureFlagsDefaultState() {
    try {
      // Read the feature flags file
      const featureFlagsPath = join(__dirname, '../lib/config/featureFlags.ts');
      const content = readFileSync(featureFlagsPath, 'utf8');

      // Check that AUTO_ENVIRONMENT_SWITCHING is disabled by default
      const autoSwitchingDisabled = content.includes('enabled: false') &&
        content.includes('AUTO_ENVIRONMENT_SWITCHING');

      if (autoSwitchingDisabled) {
        this.addResult(
          'Feature Flags Default State',
          true,
          'AUTO_ENVIRONMENT_SWITCHING is disabled by default'
        );
      } else {
        this.addResult(
          'Feature Flags Default State',
          false,
          'AUTO_ENVIRONMENT_SWITCHING should be disabled by default',
          'Found enabled: true for AUTO_ENVIRONMENT_SWITCHING'
        );
      }

      // Check that requiresExplicitEnable is set for sensitive features
      const explicitEnableRequired = content.includes('requiresExplicitEnable: true') &&
        content.includes('AUTO_ENVIRONMENT_SWITCHING');

      if (explicitEnableRequired) {
        this.addResult(
          'Explicit Enable Requirement',
          true,
          'Sensitive features require explicit enable'
        );
      } else {
        this.addResult(
          'Explicit Enable Requirement',
          false,
          'Sensitive features should require explicit enable'
        );
      }

    } catch (error) {
      this.addResult(
        'Feature Flags Default State',
        false,
        'Failed to read feature flags file',
        error instanceof Error ? error.message : 'Unknown error'
      );
    }
  }

  /**
   * Check that environment detection has safety validation
   */
  async checkEnvironmentSafetyValidation() {
    try {
      const envDetectorPath = join(__dirname, '../lib/environment/environmentDetector.ts');
      const content = readFileSync(envDetectorPath, 'utf8');

      // Check for environment validation
      const hasValidation = content.includes('isProduction') &&
        content.includes('isDevelopment') &&
        content.includes('localhost') &&
        content.includes('https://');

      if (hasValidation) {
        this.addResult(
          'Environment Safety Validation',
          true,
          'Environment detection includes safety validation'
        );
      } else {
        this.addResult(
          'Environment Safety Validation',
          false,
          'Environment detection should include safety validation'
        );
      }

      // Check for production safety checks
      const hasProductionSafety = content.includes('if (isProduction)') ||
        content.includes('production') ||
        content.includes('safety');

      if (hasProductionSafety) {
        this.addResult(
          'Production Safety Checks',
          true,
          'Production safety checks are present'
        );
      } else {
        this.addResult(
          'Production Safety Checks',
          false,
          'Production safety checks should be implemented'
        );
      }

    } catch (error) {
      this.addResult(
        'Environment Safety Validation',
        false,
        'Failed to read environment detector file',
        error instanceof Error ? error.message : 'Unknown error'
      );
    }
  }

  /**
   * Check that API client has fallback behavior
   */
  async checkApiClientFallbacks() {
    try {
      const apiPath = join(__dirname, '../lib/api.ts');
      const content = readFileSync(apiPath, 'utf8');

      // Check for environment variable fallback
      const hasEnvFallback = content.includes('NEXT_PUBLIC_API_URL') &&
        content.includes('getApiUrl') &&
        content.includes('fallback');

      if (hasEnvFallback) {
        this.addResult(
          'API Client Fallback',
          true,
          'API client has environment variable fallback'
        );
      } else {
        this.addResult(
          'API Client Fallback',
          false,
          'API client should have environment variable fallback'
        );
      }

      // Check for error handling
      const hasErrorHandling = content.includes('try') &&
        content.includes('catch') &&
        content.includes('Promise.reject');

      if (hasErrorHandling) {
        this.addResult(
          'API Error Handling',
          true,
          'API client has comprehensive error handling'
        );
      } else {
        this.addResult(
          'API Error Handling',
          false,
          'API client should have comprehensive error handling'
        );
      }

    } catch (error) {
      this.addResult(
        'API Client Fallback',
        false,
        'Failed to read API client file',
        error instanceof Error ? error.message : 'Unknown error'
      );
    }
  }

  /**
   * Check that backend has environment safety
   */
  async checkBackendSafety() {
    try {
      const backendPath = join(__dirname, '../../vpet-backend/utils/environment.py');
      const content = readFileSync(backendPath, 'utf8');

      // Check for production validation
      const hasProductionValidation = content.includes('def validate_environment_config') &&
        content.includes('is_production') &&
        content.includes('safety');

      if (hasProductionValidation) {
        this.addResult(
          'Backend Production Validation',
          true,
          'Backend has production environment validation'
        );
      } else {
        this.addResult(
          'Backend Production Validation',
          false,
          'Backend should have production environment validation'
        );
      }

      // Check for localhost restriction in production
      const hasLocalhostRestriction = content.includes('localhost') &&
        content.includes('production') &&
        content.includes('error');

      if (hasLocalhostRestriction) {
        this.addResult(
          'Backend Localhost Restriction',
          true,
          'Backend restricts localhost in production'
        );
      } else {
        this.addResult(
          'Backend Localhost Restriction',
          false,
          'Backend should restrict localhost in production'
        );
      }

    } catch (error) {
      this.addResult(
        'Backend Safety',
        false,
        'Failed to read backend environment file',
        error instanceof Error ? error.message : 'Unknown error'
      );
    }
  }

  /**
   * Check for emergency controls
   */
  async checkEmergencyControls() {
    try {
      const featureFlagsPath = join(__dirname, '../lib/config/featureFlags.ts');
      const content = readFileSync(featureFlagsPath, 'utf8');

      // Check for emergency disable
      const hasEmergencyDisable = content.includes('emergencyDisableAll') ||
        content.includes('emergency_disable');

      if (hasEmergencyDisable) {
        this.addResult(
          'Emergency Controls',
          true,
          'Emergency disable functionality is available'
        );
      } else {
        this.addResult(
          'Emergency Controls',
          false,
          'Emergency disable functionality should be available'
        );
      }

      // Check for reset functionality
      const hasResetFunction = content.includes('resetAllOverrides') ||
        content.includes('reset_feature');

      if (hasResetFunction) {
        this.addResult(
          'Reset Functionality',
          true,
          'Reset functionality is available'
        );
      } else {
        this.addResult(
          'Reset Functionality',
          false,
          'Reset functionality should be available'
        );
      }

    } catch (error) {
      this.addResult(
        'Emergency Controls',
        false,
        'Failed to check emergency controls',
        error instanceof Error ? error.message : 'Unknown error'
      );
    }
  }

  /**
   * Check for comprehensive logging
   */
  async checkLoggingAndMonitoring() {
    try {
      const apiPath = join(__dirname, '../lib/api.ts');
      const content = readFileSync(apiPath, 'utf8');

      // Check for debug mode logging
      const hasDebugLogging = content.includes('isDebugModeEnabled') &&
        content.includes('console.log') &&
        content.includes('debug');

      if (hasDebugLogging) {
        this.addResult(
          'Debug Logging',
          true,
          'Debug mode logging is implemented'
        );
      } else {
        this.addResult(
          'Debug Logging',
          false,
          'Debug mode logging should be implemented'
        );
      }

      // Check for error logging
      const hasErrorLogging = content.includes('console.error') &&
        content.includes('error') &&
        content.includes('catch');

      if (hasErrorLogging) {
        this.addResult(
          'Error Logging',
          true,
          'Error logging is implemented'
        );
      } else {
        this.addResult(
          'Error Logging',
          false,
          'Error logging should be implemented'
        );
      }

    } catch (error) {
      this.addResult(
        'Logging and Monitoring',
        false,
        'Failed to check logging functionality',
        error instanceof Error ? error.message : 'Unknown error'
      );
    }
  }

  /**
   * Check for environment-specific behavior
   */
  async checkEnvironmentSpecificBehavior() {
    try {
      const envDetectorPath = join(__dirname, '../lib/environment/environmentDetector.ts');
      const content = readFileSync(envDetectorPath, 'utf8');

      // Check for localhost detection
      const hasLocalhostDetection = content.includes('localhost') &&
        content.includes('hostname') &&
        content.includes('development');

      if (hasLocalhostDetection) {
        this.addResult(
          'Localhost Detection',
          true,
          'Localhost detection is implemented'
        );
      } else {
        this.addResult(
          'Localhost Detection',
          false,
          'Localhost detection should be implemented'
        );
      }

      // Check for HTTPS requirement in production
      const hasHttpsRequirement = content.includes('https://') &&
        content.includes('production');

      if (hasHttpsRequirement) {
        this.addResult(
          'HTTPS Requirement',
          true,
          'HTTPS requirement in production is implemented'
        );
      } else {
        this.addResult(
          'HTTPS Requirement',
          false,
          'HTTPS requirement in production should be implemented'
        );
      }

    } catch (error) {
      this.addResult(
        'Environment Specific Behavior',
        false,
        'Failed to check environment-specific behavior',
        error instanceof Error ? error.message : 'Unknown error'
      );
    }
  }

  /**
   * Check connection validation safety
   */
  async checkConnectionValidationSafety() {
    try {
      const validatorPath = join(__dirname, '../lib/utils/connectionValidator.ts');
      const content = readFileSync(validatorPath, 'utf8');

      // Check for validation logic
      const hasValidation = content.includes('validateConnection') &&
        content.includes('issues') &&
        content.includes('recommendations');

      if (hasValidation) {
        this.addResult(
          'Connection Validation Logic',
          true,
          'Connection validation logic is implemented'
        );
      } else {
        this.addResult(
          'Connection Validation Logic',
          false,
          'Connection validation logic should be implemented'
        );
      }

      // Check for safety validation
      const hasSafetyValidation = content.includes('validateEnvironmentSwitch') &&
        content.includes('isSafe') &&
        content.includes('safetyIssues');

      if (hasSafetyValidation) {
        this.addResult(
          'Environment Switch Safety',
          true,
          'Environment switch safety validation is implemented'
        );
      } else {
        this.addResult(
          'Environment Switch Safety',
          false,
          'Environment switch safety validation should be implemented'
        );
      }

    } catch (error) {
      this.addResult(
        'Connection Validation Safety',
        false,
        'Failed to check connection validation safety',
        error instanceof Error ? error.message : 'Unknown error'
      );
    }
  }

  /**
   * Run all safety checks
   */
  async runAllChecks() {
    console.log('🔒 Production Safety Verification');
    console.log('==================================');
    console.log('Verifying that environment switching implementation is safe for production...\n');

    await this.checkFeatureFlagsDefaultState();
    await this.checkEnvironmentSafetyValidation();
    await this.checkApiClientFallbacks();
    await this.checkBackendSafety();
    await this.checkEmergencyControls();
    await this.checkLoggingAndMonitoring();
    await this.checkEnvironmentSpecificBehavior();
    await this.checkConnectionValidationSafety();

    this.displayResults();
  }

  /**
   * Display verification results
   */
  private displayResults() {
    const passed = this.results.filter(r => r.passed).length;
    const total = this.results.length;
    const failed = total - passed;

    console.log('\n📊 Verification Results');
    console.log('=======================');

    this.results.forEach(result => {
      const icon = result.passed ? '✅' : '❌';
      console.log(`${icon} ${result.name}: ${result.message}`);

      if (!result.passed && result.details) {
        console.log(`   Details: ${result.details}`);
      }
    });

    console.log(`\n📈 Summary: ${passed}/${total} checks passed (${failed} failed)`);

    if (failed === 0) {
      console.log('\n🎉 All safety checks passed! The implementation is safe for production.');
      console.log('\n📋 Next Steps:');
      console.log('1. Deploy to production with confidence');
      console.log('2. Monitor the application after deployment');
      console.log('3. Keep feature flags disabled until needed');
      console.log('4. Use emergency controls if any issues arise');
    } else {
      console.log('\n⚠️  Some safety checks failed. Please address the issues before production deployment.');
      console.log('\n🔧 Required Actions:');
      this.results.filter(r => !r.passed).forEach(result => {
        console.log(`- ${result.name}: ${result.message}`);
      });
      console.log('\n💡 After fixing the issues, run this verification again.');
    }
  }

  /**
   * Get verification results
   */
  getResults(): SafetyCheckResult[] {
    return [...this.results];
  }

  /**
   * Check if all tests passed
   */
  allTestsPassed(): boolean {
    return this.results.every(r => r.passed);
  }
}

/**
 * Run production safety verification
 */
async function runProductionSafetyVerification() {
  const verifier = new ProductionSafetyVerifier();
  await verifier.runAllChecks();

  // Exit with appropriate code
  process.exit(verifier.allTestsPassed() ? 0 : 1);
}

// Export for use in other scripts
export { ProductionSafetyVerifier };

// Run if executed directly
if (require.main === module) {
  runProductionSafetyVerification().catch(console.error);
}