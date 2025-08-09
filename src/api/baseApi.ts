import { createApi, fetchBaseQuery, FetchBaseQueryError } from '@reduxjs/toolkit/query/react';
import { getAccessToken } from '../utils/tokenStorage';
import { clearCredentials } from '../features/auth/authSlice';
import { clearAuthData } from '../utils/authUtils';

let isHandling401Error = false;


const baseQueryWithAuth = fetchBaseQuery({
  baseUrl: 'http://localhost:4000/api',
  prepareHeaders: (headers) => {
    const token = getAccessToken();
    if (token) {
      headers.set('Authorization', `Bearer ${token}`);
    }
    return headers;
  },
});


export const baseQuery = async (args: any, api: any, extraOptions: any) => {
  let result = await baseQueryWithAuth(args, api, extraOptions);
  
  const isLoginRequest = typeof args === 'string' 
    ? args.includes('/auth/login') 
    : args.url?.includes('/auth/login');
  
  if (!isLoginRequest && result.error && (result.error as FetchBaseQueryError).status === 401) {
    if (!isHandling401Error) {
      isHandling401Error = true;
      
      try {
        api.dispatch(clearCredentials());
        clearAuthData();
        window.location.href = '/login';
      } finally {
        setTimeout(() => {
          isHandling401Error = false;
        }, 1000);
      }
    }
  }
  
  return result;
};

export const api = createApi({
  baseQuery,
  tagTypes: ['User', 'Quiz'],
  endpoints: () => ({}),
});
