/**
 * Environment Configuration Sample
 * =================================
 * Angular uses TypeScript environment files instead of .env files.
 *
 * Setup:
 * 1. Copy this file to environment.ts for local development
 * 2. Copy this file to environment.prod.ts for production builds
 * 3. Update the values for each environment
 *
 * The build process uses angular.json fileReplacements to swap
 * environment.ts with environment.prod.ts for production builds.
 */

export const environment = {
  // Environment type: 'local', 'beta', or 'prod'
  type: 'local',

  // Backend API URL
  // Local: http://localhost:5000/api
  // Beta: https://your-beta-api.example.com/api
  // Prod: https://your-prod-api.example.com/api
  apiUrl: 'http://localhost:5000/api',

  // Google OAuth Client ID (from Google Cloud Console)
  // Must match the GOOGLE_CLIENT_ID in your backend .env
  googleClientId: 'your_google_client_id.apps.googleusercontent.com',
};
