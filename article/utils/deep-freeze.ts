/**
 * Deep Freeze Utility
 * Single Responsibility: Provide immutability utilities
 *
 * Eliminates Object.freeze() duplication in factory functions
 */

import { DeepReadonly } from '../types/utility-types';

/**
 * Deeply freezes an object and all its nested properties
 * This utility eliminates the need to manually freeze every nested object
 *
 * @param obj - The object to freeze
 * @returns The deeply frozen object
 */
export function deepFreeze<T extends object>(obj: T): DeepReadonly<T> {
  // Freeze the top-level object
  Object.freeze(obj);

  // Recursively freeze all properties
  Object.getOwnPropertyNames(obj).forEach(prop => {
    const value = (obj as any)[prop];

    // Only freeze non-null objects that aren't already frozen
    if (value && typeof value === 'object' && !Object.isFrozen(value)) {
      deepFreeze(value);
    }
  });

  return obj as DeepReadonly<T>;
}

/**
 * Creates a deeply frozen copy of an object
 * Useful when you need to freeze data from an external source
 *
 * @param obj - The object to copy and freeze
 * @returns A deeply frozen copy
 */
export function deepFreezeCopy<T extends object>(obj: T): DeepReadonly<T> {
  // Simple deep clone (for production, consider using structuredClone or a library)
  const clone = JSON.parse(JSON.stringify(obj)) as T;
  return deepFreeze(clone);
}

/**
 * Type guard to check if an object is frozen
 *
 * @param obj - The object to check
 * @returns True if the object is frozen
 */
export function isFrozen(obj: unknown): boolean {
  return typeof obj === 'object' && obj !== null && Object.isFrozen(obj);
}
