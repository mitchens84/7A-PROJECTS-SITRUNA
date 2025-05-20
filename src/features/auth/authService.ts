import { setSessionStorageItem, getSessionStorageItem, removeSessionStorageItem } from '../../utils/localStorageUtils';

const AUTH_STATUS_KEY = 'isAuthenticated';

// IMPORTANT: This is a Tier 1 client-side-only authentication.
// The password should be hashed and stored in an environment variable.
// This service will hash the input and compare it against the stored hash.

/**
 * Hashes a password using SHA-256.
 * @param password The password to hash.
 * @returns A promise that resolves with the hex-encoded hash string.
 */
async function hashPassword(password: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(password);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  return hashHex;
}

/**
 * Attempts to log in the user.
 * @param enteredPassword The password entered by the user.
 * @returns A promise that resolves to true if login is successful, false otherwise.
 */
export async function login(enteredPassword: string): Promise<boolean> {
  const storedPasswordHash = import.meta.env.VITE_APP_PASSWORD_HASH;
  if (!storedPasswordHash) {
    console.error('VITE_APP_PASSWORD_HASH is not set in environment variables.');
    return false;
  }

  const enteredPasswordHash = await hashPassword(enteredPassword);

  if (enteredPasswordHash === storedPasswordHash) {
    setSessionStorageItem(AUTH_STATUS_KEY, 'true');
    return true;
  }
  return false;
}

/**
 * Logs out the user.
 */
export function logout(): void {
  removeSessionStorageItem(AUTH_STATUS_KEY);
}

/**
 * Checks if the user is authenticated.
 * @returns True if authenticated, false otherwise.
 */
export function isAuthenticated(): boolean {
  return getSessionStorageItem(AUTH_STATUS_KEY) === 'true';
}
