import { jwtDecode } from 'jwt-decode';

export function getToken() {
  return localStorage.getItem('token');
}

export function getUserFromToken() {
  const token = getToken();
  if (!token) return null;

  try {
    const decoded = jwtDecode(token);
    const now = Date.now() / 1000;

    if (decoded.exp && decoded.exp < now) {
      localStorage.removeItem('token');
      return null;
    }

    return decoded;
  } catch {
    localStorage.removeItem('token');
    return null;
  }
}

export function isAuthenticated() {
  return getUserFromToken() !== null;
}

export function isAdmin() {
  const user = getUserFromToken();
  return user?.role === 'ADMIN';
}
