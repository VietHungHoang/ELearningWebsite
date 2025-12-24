import type { UserRole } from "../types/api";

export interface DecodedUser {
  sub: string; // User ID
  name: string;
  email: string;
  preferred_username: string;
  given_name?: string;
  email_verified: boolean;
  exp: number;
  iat: number;
  iss: string;
  aud: string;
  realm_access?: {
    roles: string[];
  };
  resource_access?: {
    [key: string]: {
      roles: string[];
    };
  };
  scope: string;
}

/**
 * Decode JWT token payload without verification
 * @param token JWT token string
 * @returns Decoded payload or null if invalid
 */
export const decodeJwt = (token: string): DecodedUser | null => {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );

    return JSON.parse(jsonPayload) as DecodedUser;
  } catch (error) {
    console.error('Failed to decode JWT token:', error);
    return null;
  }
};

/**
 * Check if JWT token is expired
 * @param token JWT token string
 * @returns true if expired, false otherwise
 */
export const isTokenExpired = (token: string): boolean => {
  const decoded = decodeJwt(token);
  if (!decoded) return true;

  const currentTime = Date.now() / 1000;
  return decoded.exp < currentTime;
};

/**
 * Extract user role from JWT claims (realm_access.roles)
 * This is a placeholder - implement based on your role mapping logic
 * @param decoded Decoded JWT payload
 * @returns User role or null if not found
 */
export const extractUserRole = (decoded: DecodedUser): UserRole => {
  const roles = (decoded.realm_access?.roles || []).map(r => r.toLowerCase());

  // Example mapping - adjust based on your Keycloak realm configuration
  if (roles.includes('tutor')) return 'tutor';
  if (roles.includes('student')) return 'student';
  return null; // Default to null if no matching role
};

/**
 * Get current user info from stored access token
 * @returns User object or null if not authenticated or token invalid
 */
export const getCurrentUserFromToken = (): { id: string; name: string; email: string; role?: UserRole } | null => {
  const token = localStorage.getItem('accessToken');
  if (!token) return null;

  const decoded = decodeJwt(token);
  if (!decoded || isTokenExpired(token)) return null;

  return {
    id: decoded.sub,
    name: decoded.name,
    email: decoded.email,
    role: extractUserRole(decoded) || undefined,
  };
};