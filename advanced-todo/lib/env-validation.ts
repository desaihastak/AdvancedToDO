/**
 * Environment Variable Validation
 * Validates critical environment variables at application startup
 */

interface EnvValidationResult {
  isValid: boolean
  errors: string[]
  warnings: string[]
}

export function validateEnvironmentVariables(): EnvValidationResult {
  const errors: string[] = []
  const warnings: string[] = []

  // Required variables
  const requiredVars = [
    { name: 'DATABASE_URL', description: 'Database connection string' },
    { name: 'BETTER_AUTH_SECRET', description: 'BetterAuth secret key' },
    { name: 'BETTER_AUTH_URL', description: 'BetterAuth base URL' },
  ]

  for (const { name, description } of requiredVars) {
    if (!process.env[name]) {
      errors.push(`Missing required environment variable: ${name} (${description})`)
    }
  }

  // Optional but recommended variables
  const optionalVars = [
    { 
      name: 'REDIS_URL', 
      description: 'Redis connection URL for rate limiting',
      checkPlaceholder: false
    },
    { 
      name: 'GOOGLE_CLIENT_ID', 
      description: 'Google OAuth client ID',
      checkPlaceholder: true,
      placeholder: 'your-google-client-id'
    },
    { 
      name: 'GOOGLE_CLIENT_SECRET', 
      description: 'Google OAuth client secret',
      checkPlaceholder: true,
      placeholder: 'your-google-client-secret'
    },
    { 
      name: 'APPLE_CLIENT_ID', 
      description: 'Apple OAuth client ID',
      checkPlaceholder: true,
      placeholder: 'your-apple-client-id'
    },
    { 
      name: 'APPLE_CLIENT_SECRET', 
      description: 'Apple OAuth client secret',
      checkPlaceholder: true,
      placeholder: 'your-apple-client-secret'
    },
  ]

  for (const { name, description, checkPlaceholder, placeholder } of optionalVars) {
    const value = process.env[name]
    if (!value) {
      warnings.push(`Optional environment variable not set: ${name} (${description})`)
    } else if (checkPlaceholder && placeholder && value.includes(placeholder)) {
      warnings.push(`Environment variable ${name} contains placeholder value. OAuth providers will be disabled.`)
    }
  }

  // Validate BETTER_AUTH_SECRET format
  const betterAuthSecret = process.env['BETTER_AUTH_SECRET']
  if (betterAuthSecret && betterAuthSecret.length < 32) {
    errors.push('BETTER_AUTH_SECRET must be at least 32 characters long for security')
  }

  // Validate DATABASE_URL format
  const databaseUrl = process.env['DATABASE_URL']
  if (databaseUrl && !databaseUrl.startsWith('postgresql://') && !databaseUrl.startsWith('mysql://')) {
    warnings.push('DATABASE_URL should start with postgresql:// or mysql://')
  }

  const isValid = errors.length === 0

  // Log results in development
  if (process.env['NODE_ENV'] !== 'production') {
    if (errors.length > 0) {
      console.error('Environment Variable Validation Errors:')
      errors.forEach(error => console.error(`  - ${error}`))
    }
    if (warnings.length > 0) {
      console.warn('Environment Variable Validation Warnings:')
      warnings.forEach(warning => console.warn(`  - ${warning}`))
    }
    if (isValid && warnings.length === 0) {
      console.log('Environment Variable Validation: All checks passed')
    }
  }

  return { isValid, errors, warnings }
}

// Run validation immediately when module is imported
if (typeof window === 'undefined') {
  const validation = validateEnvironmentVariables()
  if (!validation.isValid) {
    throw new Error(
      `Environment variable validation failed:\n${validation.errors.join('\n')}`
    )
  }
}
