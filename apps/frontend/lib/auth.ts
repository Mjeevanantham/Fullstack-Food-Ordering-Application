export interface User {
  id: string;
  email: string;
  role: 'ADMIN' | 'MANAGER' | 'MEMBER';
  countryId?: string;
}

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  user: User;
}

export function getAccessToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('accessToken');
}

export function getRefreshToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('refreshToken');
}

export function setTokens(accessToken: string, refreshToken: string): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem('accessToken', accessToken);
  localStorage.setItem('refreshToken', refreshToken);
}

export function clearTokens(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem('accessToken');
  localStorage.removeItem('refreshToken');
}

export function getUser(): User | null {
  if (typeof window === 'undefined') return null;
  const userStr = localStorage.getItem('user');
  if (!userStr) return null;
  try {
    return JSON.parse(userStr);
  } catch {
    return null;
  }
}

export function setUser(user: User): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem('user', JSON.stringify(user));
}

export function clearUser(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem('user');
}

export function isAuthenticated(): boolean {
  return !!getAccessToken();
}

export function hasRole(role: 'ADMIN' | 'MANAGER' | 'MEMBER'): boolean {
  const user = getUser();
  return user?.role === role;
}

export function canCheckout(): boolean {
  const user = getUser();
  return user?.role === 'ADMIN' || user?.role === 'MANAGER';
}

export function canCancelOrder(): boolean {
  const user = getUser();
  return user?.role === 'ADMIN' || user?.role === 'MANAGER';
}

export function canManagePaymentMethods(): boolean {
  const user = getUser();
  return user?.role === 'ADMIN';
}

