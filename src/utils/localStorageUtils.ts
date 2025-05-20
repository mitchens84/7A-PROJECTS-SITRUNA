// src/utils/localStorageUtils.ts

/**
 * Retrieves an item from localStorage.
 * @param key The key of the item to retrieve.
 * @returns The retrieved item, or null if not found or an error occurs.
 */
export function getLocalStorageItem<T>(key: string): T | null {
  try {
    const item = localStorage.getItem(key);
    return item ? (JSON.parse(item) as T) : null;
  } catch (error) {
    console.error(`Error getting item ${key} from localStorage:`, error);
    return null;
  }
}

/**
 * Sets an item in localStorage.
 * @param key The key of the item to set.
 * @param value The value to set.
 */
export function setLocalStorageItem<T>(key: string, value: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error(`Error setting item ${key} in localStorage:`, error);
  }
}

/**
 * Removes an item from localStorage.
 * @param key The key of the item to remove.
 */
export function removeLocalStorageItem(key: string): void {
  try {
    localStorage.removeItem(key);
  } catch (error) {
    console.error(`Error removing item ${key} from localStorage:`, error);
  }
}

/**
 * Retrieves an item from sessionStorage.
 * @param key The key of the item to retrieve.
 * @returns The retrieved item, or null if not found or an error occurs.
 */
export function getSessionStorageItem<T>(key: string): T | null {
  try {
    const item = sessionStorage.getItem(key);
    return item ? (JSON.parse(item) as T) : null;
  } catch (error) {
    // It's common for JSON.parse to fail if the item isn't JSON (e.g., simple string 'true')
    // Try returning raw item if parse fails and it's not null
    const rawItem = sessionStorage.getItem(key);
    if (rawItem !== null) {
        // console.warn(`Item "${key}" from sessionStorage was not valid JSON. Returning raw value.`, error);
        return rawItem as unknown as T; // Use with caution, type assertion
    }
    console.error(`Error getting item "${key}" from sessionStorage:`, error);
    return null;
  }
}

/**
 * Sets an item in sessionStorage.
 * @param key The key of the item to set.
 * @param value The value to set.
 */
export function setSessionStorageItem<T>(key: string, value: T): void {
  try {
    sessionStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error(`Error setting item ${key} in sessionStorage:`, error);
  }
}

/**
 * Removes an item from sessionStorage.
 * @param key The key of the item to remove.
 */
export function removeSessionStorageItem(key: string): void {
  try {
    sessionStorage.removeItem(key);
  } catch (error) {
    console.error(`Error removing item ${key} from sessionStorage:`, error);
  }
}
