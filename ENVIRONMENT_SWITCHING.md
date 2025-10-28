# Environment Switching Implementation

This document describes the comprehensive environment switching implementation for the VPVET frontend and backend applications.

## Overview

The environment switching system provides automatic detection and configuration of API endpoints based on whether the application is running in development (localhost) or production (Runaway/Railway). The implementation is production-safe and includes multiple layers of protection to ensure the working production system is never affected.

## Architecture

### Backend (Flask)

#### New Components

1. **Environment Detection Service** (`utils/environment.py`)
   - Automatic environment detection based on multiple indicators
   - Configuration management for different environments
   - Safety validation for production deployments

2. **Enhanced CORS Configuration** (`app.py`)
   - Dynamic CORS configuration based on environment
   - Support for multiple development origins
   - Production-specific origin restrictions

3. **Connection Validator** (`utils/connection_validator.py`)
   - Backend connectivity testing
   - Health check monitoring
   - Connection metrics collection

#### Enhanced Endpoints

1. **Health Check** (`/api/health`)
   - Environment information in response
   - Database connectivity status
   - API configuration details
   - Timestamp and version information

### Frontend (Next.js)

#### New Components

1. **Environment Detector** (`lib/environment/environmentDetector.ts`)
   - Automatic environment detection (localhost vs production)
   - API base URL configuration
   - Connection testing capabilities
   - Environment switch validation

2. **Feature Flag System** (`lib/config/featureFlags.ts`)
   - Production-safe feature toggling
   - Environment-specific feature availability
   - User override capabilities
   - Emergency disable functionality

3. **Connection Validator** (`lib/utils/connectionValidator.ts`)
   - Frontend connection validation
   - Environment switch safety checks
   - Connection metrics and monitoring
   - Health status reporting

4. **Enhanced API Client** (`lib/api.ts`)
   - Environment-aware API configuration
   - Automatic authentication token management
   - Enhanced error handling and logging
   - Mock response support for development

#### Enhanced Components

1. **AuthContext** (`contexts/AuthContext.tsx`)
   - Environment-aware authentication logging
   - Enhanced error reporting
   - Debug mode support

## Features

### Safety Features

1. **Production Protection**
   - Feature flags disabled by default
   - Environment validation before any changes
   - Emergency rollback capabilities
   - Multiple safety layers

2. **Connection Validation**
   - Pre-request connection health checks
   - Environment switch safety validation
   - Graceful fallback when backend unavailable
   - Comprehensive error handling

3. **Debug Mode**
   - Enhanced logging in development
   - Environment information in headers
   - Connection metrics collection
   - Step-by-step troubleshooting

### Development Features

1. **Automatic Localhost Detection**
   - No manual configuration required
   - Automatic API URL detection
   - Mock response support
   - Hot reload compatible

2. **Connection Monitoring**
   - Real-time connection status
   - Response time tracking
   - Success rate metrics
   - Historical data

3. **Feature Flag Controls**
   - Runtime feature toggling
   - Environment-specific settings
   - User preferences storage
   - Emergency controls

## Configuration

### Backend Environment Variables

```bash
# Development
FLASK_ENV=development
DATABASE_URL=postgresql://localhost/vpvet_dev
JWT_SECRET_KEY=development-jwt-secret
FRONTEND_URL=http://localhost:3000

# Production (Railway)
FLASK_ENV=production
DATABASE_URL=railway-postgresql-connection-string
JWT_SECRET_KEY=production-jwt-secret-change-this
FRONTEND_URL=https://your-runaway-domain.com
RAILWAY_PUBLIC_DOMAIN=your-railway-app.railway.app
```

### Frontend Environment Variables

```bash
# Development (optional)
NEXT_PUBLIC_API_URL=http://localhost:5000/api
NEXT_PUBLIC_ENABLE_AUTO_ENVIRONMENT_SWITCHING=true
NEXT_PUBLIC_ENABLE_DEBUG_MODE=true

# Production (not required - will be auto-detected)
NEXT_PUBLIC_RAILWAY_DOMAIN=your-railway-app.railway.app
NEXT_PUBLIC_FRONTEND_URL=https://your-runaway-domain.com
```

## Usage

### Development

1. **Automatic Detection**
   - The frontend automatically detects when running on localhost
   - API calls are automatically routed to `http://localhost:5000/api`
   - Mock responses are available when backend is not running

2. **Debug Mode**
   ```typescript
   import { enableFeature } from '@/lib/config/featureFlags';

   // Enable debug mode for detailed logging
   enableFeature('DEBUG_MODE');

   // Enable enhanced error reporting
   enableFeature('ENHANCED_ERROR_REPORTING');
   ```

3. **Connection Testing**
   ```typescript
   import { testConnection, validateConnection } from '@/lib/api';

   // Test backend connectivity
   const connection = await testConnection();
   console.log('Backend connected:', connection.isConnected);

   // Validate connection with detailed checks
   const validation = await validateConnection();
   console.log('Connection valid:', validation.isValid);
   console.log('Issues:', validation.issues);
   ```

### Production

1. **Zero Configuration**
   - Production deployment works without any configuration changes
   - Existing Runaway deployment continues to work unchanged
   - Feature flags are disabled by default for safety

2. **Feature Activation**
   ```typescript
   import { enableFeature } from '@/lib/config/featureFlags';

   // Enable auto environment switching (if needed)
   enableFeature('AUTO_ENVIRONMENT_SWITCHING');

   // Enable connection validation
   enableFeature('CONNECTION_VALIDATION');
   ```

3. **Emergency Controls**
   ```typescript
   import { featureFlags } from '@/lib/config/featureFlags';

   // Emergency disable all features
   featureFlags.emergencyDisableAll();

   // Reset all overrides
   featureFlags.resetAllOverrides();
   ```

## Testing

### Manual Testing

Run the test script to verify functionality:

```bash
npx tsx scripts/testEnvironmentSwitching.ts
```

### Unit Tests

Run the test suite:

```bash
npm test -- tests/environmentSwitching.test.ts
```

### Integration Testing

1. **Development Testing**
   - Start frontend on localhost:3000
   - Start backend on localhost:5000
   - Verify automatic connection
   - Test mock responses when backend is stopped

2. **Production Testing**
   - Deploy to Runaway
   - Verify existing functionality is unchanged
   - Test feature flag controls
   - Validate connection monitoring

## Troubleshooting

### Common Issues

1. **CORS Errors**
   - Check backend CORS configuration
   - Verify allowed origins match frontend URL
   - Check environment detection logs

2. **Connection Failures**
   - Verify backend is running on correct port
   - Check network connectivity
   - Validate API URL configuration

3. **Authentication Issues**
   - Clear localStorage tokens
   - Verify JWT secret key configuration
   - Check authentication flow logs

### Debug Mode

Enable debug mode for detailed troubleshooting:

```typescript
import { enableFeature } from '@/lib/config/featureFlags';
enableFeature('DEBUG_MODE');
```

This will provide:
- Detailed console logging
- Environment information in headers
- Connection metrics
- Step-by-step request/response logging

## Rollback Procedures

### Emergency Rollback

1. **Disable All Features**
   ```typescript
   import { featureFlags } from '@/lib/config/featureFlags';
   featureFlags.emergencyDisableAll();
   ```

2. **Reset Environment Detection**
   ```typescript
   import { apiUtils } from '@/lib/api';
   apiUtils.resetEnvironment();
   ```

3. **Clear Cache**
   ```typescript
   import { connectionValidator } from '@/lib/utils/connectionValidator';
   connectionValidator.clearCache();
   ```

### Production Rollback

1. Set environment variable: `NEXT_PUBLIC_ENABLE_AUTO_ENVIRONMENT_SWITCHING=false`
2. Redeploy frontend
3. System will fall back to original behavior

## Security Considerations

1. **Production Safety**
   - All new features are disabled by default in production
   - Environment validation prevents accidental switches
   - Emergency controls available for immediate rollback

2. **CORS Security**
   - Production CORS allows only specific origins
   - Development CORS allows localhost variations
   - Dynamic validation of origin requests

3. **Feature Flag Security**
   - User overrides stored in localStorage only
   - No sensitive information in feature flags
   - Environment-specific feature restrictions

## Monitoring and Maintenance

### Health Checks

- Backend `/api/health` endpoint provides status
- Frontend connection validation provides metrics
- Feature flag status can be monitored
- Environment detection logs provide debugging info

### Performance

- Connection validation is cached to reduce overhead
- Health checks run on intervals, not on every request
- Mock responses prevent unnecessary network calls
- Feature flag checks are optimized for performance

## Future Enhancements

1. **Advanced Environment Detection**
   - Support for more deployment environments
   - Automatic detection of deployment platforms
   - Enhanced environment fingerprinting

2. **Advanced Monitoring**
   - Real-time connection metrics dashboard
   - Performance alerting
   - Historical trend analysis

3. **Enhanced Debugging**
   - Visual debugging interface
   - Request/response inspection tools
   - Environment switch simulation

## Support

For issues or questions about the environment switching implementation:

1. Check debug mode logs
2. Run the test script
3. Verify environment variables
4. Check feature flag settings
5. Review this documentation

The implementation is designed to be robust and self-healing, with multiple fallback mechanisms to ensure reliable operation in all environments.