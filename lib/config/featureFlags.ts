/**
 * Feature flag system for VPVET frontend.
 * Provides production-safe feature toggling with environment awareness.
 */

import { environmentDetector } from '../environment/environmentDetector';

export interface FeatureFlagConfig {
  name: string;
  description: string;
  enabled: boolean;
  environment?: 'development' | 'production' | 'both';
  requiresExplicitEnable?: boolean;
  rolloutPercentage?: number;
  lastModified?: string;
}

export interface FeatureFlagOverrides {
  [featureName: string]: boolean;
}

class FeatureFlagManager {
  private static instance: FeatureFlagManager;
  private flags: Map<string, FeatureFlagConfig> = new Map();
  private userOverrides: FeatureFlagOverrides = {};

  private constructor() {
    this.initializeDefaultFlags();
    this.loadUserOverrides();
  }

  /**
   * Get singleton instance
   */
  static getInstance(): FeatureFlagManager {
    if (!FeatureFlagManager.instance) {
      FeatureFlagManager.instance = new FeatureFlagManager();
    }
    return FeatureFlagManager.instance;
  }

  /**
   * Initialize default feature flags with safety-first approach
   */
  private initializeDefaultFlags(): void {
    const defaultFlags: FeatureFlagConfig[] = [
      {
        name: 'AUTO_ENVIRONMENT_SWITCHING',
        description: 'Enable automatic environment detection and API switching',
        enabled: false, // DISABLED by default for safety
        environment: 'development',
        requiresExplicitEnable: true,
        rolloutPercentage: 0 // No rollout in production initially
      },
      {
        name: 'ENHANCED_ERROR_REPORTING',
        description: 'Enable detailed error reporting and logging',
        enabled: true,
        environment: 'both',
        requiresExplicitEnable: false
      },
      {
        name: 'CONNECTION_VALIDATION',
        description: 'Enable backend connection validation before making requests',
        enabled: true,
        environment: 'both',
        requiresExplicitEnable: false
      },
      {
        name: 'MOCK_RESPONSES',
        description: 'Enable mock API responses when backend is unavailable',
        enabled: true,
        environment: 'development',
        requiresExplicitEnable: false
      },
      {
        name: 'PERFORMANCE_MONITORING',
        description: 'Enable performance monitoring and metrics collection',
        enabled: false,
        environment: 'development',
        requiresExplicitEnable: true
      },
      {
        name: 'DEBUG_MODE',
        description: 'Enable debug mode with additional logging',
        enabled: false,
        environment: 'development',
        requiresExplicitEnable: false
      },
      {
        name: 'CACHED_ENVIRONMENT_DETECTION',
        description: 'Enable caching of environment detection results',
        enabled: true,
        environment: 'both',
        requiresExplicitEnable: false
      },
      {
        name: 'GRACEFUL_FALLBACK',
        description: 'Enable graceful fallback when backend is unavailable',
        enabled: true,
        environment: 'both',
        requiresExplicitEnable: false
      }
    ];

    defaultFlags.forEach(flag => {
      this.flags.set(flag.name, flag);
    });

    console.log('[FeatureFlagManager] Initialized default flags');
    this.logCurrentFlags();
  }

  /**
   * Load user overrides from localStorage
   */
  private loadUserOverrides(): void {
    if (typeof window !== 'undefined') {
      try {
        const stored = localStorage.getItem('vpvet_feature_flags');
        if (stored) {
          this.userOverrides = JSON.parse(stored);
          console.log('[FeatureFlagManager] Loaded user overrides:', this.userOverrides);
        }
      } catch (error) {
        console.warn('[FeatureFlagManager] Failed to load user overrides:', error);
      }
    }
  }

  /**
   * Save user overrides to localStorage
   */
  private saveUserOverrides(): void {
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem('vpvet_feature_flags', JSON.stringify(this.userOverrides));
        console.log('[FeatureFlagManager] Saved user overrides:', this.userOverrides);
      } catch (error) {
        console.warn('[FeatureFlagManager] Failed to save user overrides:', error);
      }
    }
  }

  /**
   * Check if a feature flag is enabled
   */
  isEnabled(featureName: string): boolean {
    const flag = this.flags.get(featureName);
    if (!flag) {
      console.warn(`[FeatureFlagManager] Unknown feature flag: ${featureName}`);
      return false;
    }

    // Check user override first (highest priority)
    if (featureName in this.userOverrides) {
      const overrideValue = this.userOverrides[featureName];
      console.log(`[FeatureFlagManager] Using override for ${featureName}: ${overrideValue}`);
      return overrideValue;
    }

    // Check environment compatibility
    const currentEnvironment = environmentDetector.getEnvironment();
    if (flag.environment && flag.environment !== 'both' && flag.environment !== currentEnvironment) {
      console.log(`[FeatureFlagManager] Feature ${featureName} not available in ${currentEnvironment} environment`);
      return false;
    }

    // Check if explicit enable is required
    if (flag.requiresExplicitEnable && !this.isExplicitlyEnabled(featureName)) {
      console.log(`[FeatureFlagManager] Feature ${featureName} requires explicit enable`);
      return false;
    }

    // Check rollout percentage (for production rollouts)
    if (flag.rolloutPercentage !== undefined && flag.rolloutPercentage < 100) {
      const isInRollout = this.isUserInRollout(flag.rolloutPercentage);
      if (!isInRollout) {
        console.log(`[FeatureFlagManager] User not in rollout for ${featureName} (${flag.rolloutPercentage}%)`);
        return false;
      }
    }

    console.log(`[FeatureFlagManager] Feature ${featureName} is ${flag.enabled ? 'ENABLED' : 'DISABLED'}`);
    return flag.enabled;
  }

  /**
   * Check if a feature has been explicitly enabled by the user
   */
  private isExplicitlyEnabled(featureName: string): boolean {
    // Check environment variables
    const envVar = `NEXT_PUBLIC_ENABLE_${featureName.toUpperCase()}`;
    const envValue = process.env[envVar];
    if (envValue !== undefined) {
      return envValue === 'true' || envValue === '1';
    }

    // Check user overrides
    return featureName in this.userOverrides;
  }

  /**
   * Check if user is in rollout group (simplified implementation)
   */
  private isUserInRollout(rolloutPercentage: number): boolean {
    if (typeof window === 'undefined') {
      return false; // SSR: not in rollout by default
    }

    // Create a simple hash based on user ID or session ID
    let userId = '';
    try {
      userId = localStorage.getItem('vpvet_user_id') || '';
    } catch {
      // Ignore localStorage errors
    }

    if (!userId) {
      // Create a random user ID if none exists
      userId = Math.random().toString(36).substring(2, 15);
      try {
        localStorage.setItem('vpvet_user_id', userId);
      } catch {
        // Ignore localStorage errors
      }
    }

    // Simple hash function
    let hash = 0;
    for (let i = 0; i < userId.length; i++) {
      const char = userId.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32-bit integer
    }

    const rolloutThreshold = (rolloutPercentage / 100) * 100;
    const userScore = Math.abs(hash) % 100;

    return userScore < rolloutThreshold;
  }

  /**
   * Enable a feature flag (user override)
   */
  enableFeature(featureName: string): void {
    const flag = this.flags.get(featureName);
    if (!flag) {
      console.warn(`[FeatureFlagManager] Cannot enable unknown feature: ${featureName}`);
      return;
    }

    // Safety check for production
    if (environmentDetector.isProduction() && flag.requiresExplicitEnable) {
      console.warn(`[FeatureFlagManager] WARNING: Enabling production feature ${featureName} explicitly`);
    }

    this.userOverrides[featureName] = true;
    this.saveUserOverrides();
    console.log(`[FeatureFlagManager] Enabled feature: ${featureName}`);
  }

  /**
   * Disable a feature flag (user override)
   */
  disableFeature(featureName: string): void {
    const flag = this.flags.get(featureName);
    if (!flag) {
      console.warn(`[FeatureFlagManager] Cannot disable unknown feature: ${featureName}`);
      return;
    }

    this.userOverrides[featureName] = false;
    this.saveUserOverrides();
    console.log(`[FeatureFlagManager] Disabled feature: ${featureName}`);
  }

  /**
   * Reset a feature flag to default value
   */
  resetFeature(featureName: string): void {
    delete this.userOverrides[featureName];
    this.saveUserOverrides();
    console.log(`[FeatureFlagManager] Reset feature: ${featureName}`);
  }

  /**
   * Get all feature flags
   */
  getAllFlags(): Map<string, FeatureFlagConfig> {
    return new Map(this.flags);
  }

  /**
   * Get active feature flags (enabled for current environment)
   */
  getActiveFlags(): string[] {
    const activeFlags: string[] = [];
    this.flags.forEach((flag, name) => {
      if (this.isEnabled(name)) {
        activeFlags.push(name);
      }
    });
    return activeFlags;
  }

  /**
   * Log current flag states for debugging
   */
  private logCurrentFlags(): void {
    console.log('[FeatureFlagManager] Current feature flags:');
    this.flags.forEach((flag, name) => {
      const status = this.isEnabled(name) ? '✅ ENABLED' : '❌ DISABLED';
      const override = name in this.userOverrides ? ' (override)' : '';
      console.log(`  ${status} ${name}${override} - ${flag.description}`);
    });
  }

  /**
   * Get configuration for a specific feature
   */
  getFeatureConfig(featureName: string): FeatureFlagConfig | undefined {
    return this.flags.get(featureName);
  }

  /**
   * Check if auto environment switching is enabled
   */
  isAutoEnvironmentSwitchingEnabled(): boolean {
    return this.isEnabled('AUTO_ENVIRONMENT_SWITCHING');
  }

  /**
   * Check if enhanced error reporting is enabled
   */
  isEnhancedErrorReportingEnabled(): boolean {
    return this.isEnabled('ENHANCED_ERROR_REPORTING');
  }

  /**
   * Check if connection validation is enabled
   */
  isConnectionValidationEnabled(): boolean {
    return this.isEnabled('CONNECTION_VALIDATION');
  }

  /**
   * Check if mock responses are enabled
   */
  areMockResponsesEnabled(): boolean {
    return this.isEnabled('MOCK_RESPONSES');
  }

  /**
   * Check if debug mode is enabled
   */
  isDebugModeEnabled(): boolean {
    return this.isEnabled('DEBUG_MODE');
  }

  /**
   * Emergency disable all features (for production issues)
   */
  emergencyDisableAll(): void {
    console.warn('[FeatureFlagManager] EMERGENCY: Disabling all features');
    this.flags.forEach((flag, name) => {
      if (flag.name !== 'GRACEFUL_FALLBACK') { // Keep graceful fallback
        this.userOverrides[name] = false;
      }
    });
    this.saveUserOverrides();
  }

  /**
   * Reset all user overrides
   */
  resetAllOverrides(): void {
    console.log('[FeatureFlagManager] Resetting all user overrides');
    this.userOverrides = {};
    this.saveUserOverrides();
  }
}

// Export singleton instance
export const featureFlags = FeatureFlagManager.getInstance();

// Export convenience functions
export const isFeatureEnabled = (featureName: string) => featureFlags.isEnabled(featureName);
export const enableFeature = (featureName: string) => featureFlags.enableFeature(featureName);
export const disableFeature = (featureName: string) => featureFlags.disableFeature(featureName);
export const resetFeature = (featureName: string) => featureFlags.resetFeature(featureName);

// Export specific feature checks
export const isAutoEnvironmentSwitchingEnabled = () => featureFlags.isAutoEnvironmentSwitchingEnabled();
export const isEnhancedErrorReportingEnabled = () => featureFlags.isEnhancedErrorReportingEnabled();
export const isConnectionValidationEnabled = () => featureFlags.isConnectionValidationEnabled();
export const areMockResponsesEnabled = () => featureFlags.areMockResponsesEnabled();
export const isDebugModeEnabled = () => featureFlags.isDebugModeEnabled();