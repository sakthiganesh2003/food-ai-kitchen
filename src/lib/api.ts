/**
 * Central API configuration.
 * Automatically removes any trailing slashes to prevent Vercel 308 Redirects on preflight requests.
 */
const rawUrl = process.env.NEXT_PUBLIC_API_URL || '';
const API_BASE_URL = rawUrl.endsWith('/') ? rawUrl.slice(0, -1) : rawUrl;

export default API_BASE_URL;

