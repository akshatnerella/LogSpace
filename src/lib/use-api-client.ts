// Custom hook for using the API client with authentication
'use client';

import { useMemo } from 'react';
import { createAuthenticatedApiClient } from './api-client';

export function useApiClient() {
  // Custom token getter function
  const getToken = async () => {
    // For now, return null (unauthenticated)
    // In the future, this would get JWT token from localStorage or cookies
    try {
      // Example: return localStorage.getItem('auth_token')
      return null;
    } catch (error) {
      return null;
    }
  };
  
  return useMemo(() => {
    return createAuthenticatedApiClient(getToken);
  }, []);
}

export * from './api-client';
