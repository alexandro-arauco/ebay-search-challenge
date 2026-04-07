/**
 * @module TokenCache
 * @description In-memory token cache. Single Responsibility: stores and
 * retrieves eBay OAuth tokens, invalidating on expiry.
 *
 * Uses a 60s safety buffer before actual expiry to avoid edge cases.
 */

import type { CachedToken } from "@/types";

const EXPIRY_BUFFER_MS = 60_000; // 60 seconds safety margin

let cached: CachedToken | null = null;

/**
 * Returns the cached token if still valid, otherwise null.
 * Pure read — no side effects.
 */
export function getCachedToken(): string | null {
  if (!cached) return null;
  const now = Date.now();
  const isValid = cached.expiresAt - EXPIRY_BUFFER_MS > now;
  return isValid ? cached.accessToken : null;
}

/**
 * Stores a new token with its expiry timestamp.
 * @param accessToken - The OAuth access token
 * @param expiresInSeconds - TTL reported by eBay (typically 7200s)
 */
export function setCachedToken(accessToken: string, expiresInSeconds: number): void {
  cached = {
    accessToken,
    expiresAt: Date.now() + expiresInSeconds * 1000,
  };
}

/**
 * Clears the cached token. Used on auth failures to force re-fetch.
 */
export function clearCachedToken(): void {
  cached = null;
}
