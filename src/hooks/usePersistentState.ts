// src/hooks/usePersistentState.ts
import { useState, useEffect, Dispatch, SetStateAction } from 'react';
import { getLocalStorageItem, setLocalStorageItem } from '../utils/localStorageUtils';

type StorageType = 'localStorage' | 'sessionStorage';

function getStorage(storageType: StorageType) {
  return storageType === 'localStorage' ? localStorage : sessionStorage;
}

function getStorageItem<T>(storageType: StorageType, key: string): T | null {
    try {
        const item = getStorage(storageType).getItem(key);
        return item ? JSON.parse(item) : null;
    } catch (error) {
        console.error(`Error getting item ${key} from ${storageType}:`, error);
        return null;
    }
}

function setStorageItem<T>(storageType: StorageType, key: string, value: T): void {
    try {
        getStorage(storageType).setItem(key, JSON.stringify(value));
    } catch (error) {
        console.error(`Error setting item ${key} in ${storageType}:`, error);
    }
}


/**
 * A custom hook to manage state that persists in localStorage or sessionStorage.
 * @param key The key for the storage item.
 * @param initialValue The initial value if no item is found in storage.
 * @param storageType The type of storage to use ('localStorage' or 'sessionStorage'). Defaults to 'localStorage'.
 * @returns A stateful value, and a function to update it.
 */
function usePersistentState<T>(
  key: string,
  initialValue: T,
  storageType: StorageType = 'localStorage'
): [T, Dispatch<SetStateAction<T>>] {
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = getStorageItem<T>(storageType, key);
      return item !== null ? item : initialValue;
    } catch (error) {
      console.error(`Error reading ${key} from ${storageType}:`, error);
      return initialValue;
    }
  });

  useEffect(() => {
    try {
      setStorageItem<T>(storageType, key, storedValue);
    } catch (error) {
      console.error(`Error writing ${key} to ${storageType}:`, error);
    }
  }, [key, storedValue, storageType]);

  return [storedValue, setStoredValue];
}

export default usePersistentState;
