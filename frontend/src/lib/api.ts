/**
 * Central API configuration.
 * In development: uses localhost:5000
 * In production (Vercel): uses NEXT_PUBLIC_API_URL environment variable
 */
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

export default API_BASE_URL;
