export const API = process.env.NODE_ENV === 'production'
  ? process.env.NEXT_PUBLIC_API
  : process.env.NEXT_PUBLIC_API_DEVELOPMENT;

export const APP_NAME = process.env.NEXT_PUBLIC_APP_NAME;

export const DOMAIN = process.env.NODE_ENV === 'production'
  ? process.env.NEXT_PUBLIC_DOMAIN_PRODUCTION
  : process.env.NEXT_PUBLIC_DOMAIN_DEVELOPMENT;
