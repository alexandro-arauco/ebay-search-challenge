/**
 * @module EbayAuthService
 * @description Handles eBay OAuth 2.0 Client Credentials flow.
 * Credentials NEVER leave this module — they are only used server-side.
 *
 * SOLID:
 * - SRP: only responsible for obtaining valid access tokens
 * - OCP: token storage is injected via cache module (swappable)
 */

import type { EbayTokenResponse } from "@/types";
import {
  getCachedToken,
  setCachedToken,
  clearCachedToken,
} from "@/lib/cache/tokenCache";
import { EbayAuthError } from "@/lib/ebay/errors";

function getEbayAuthUrl(environment: string): string {
  return environment === "production"
    ? "https://api.ebay.com/identity/v1/oauth2/token"
    : "https://api.sandbox.ebay.com/identity/v1/oauth2/token";
}

function buildBasicAuthHeader(clientId: string, clientSecret: string): string {
  const credentials = `${clientId}:${clientSecret}`;
  return `Basic ${Buffer.from(credentials).toString("base64")}`;
}

/**
 * Returns a valid eBay access token, using cache when available.
 * Fetches a new token only when cache is empty or expired.
 *
 * @throws Error with descriptive message if auth fails
 */
export async function getEbayAccessToken(): Promise<string> {
  const cached = getCachedToken();
  if (cached) return cached;

  const clientId = process.env.EBAY_CLIENT_ID;
  const clientSecret = process.env.EBAY_CLIENT_SECRET;
  const environment = process.env.EBAY_ENVIRONMENT ?? "sandbox";

  if (!clientId || !clientSecret) {
    throw new EbayAuthError(
      "EBAY_CLIENT_ID and EBAY_CLIENT_SECRET must be set in environment variables",
    );
  }

  const response = await fetch(getEbayAuthUrl(environment), {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Authorization: buildBasicAuthHeader(clientId, clientSecret),
    },
    body: "grant_type=client_credentials&scope=https%3A%2F%2Fapi.ebay.com%2Foauth%2Fapi_scope",
  });

  if (!response.ok) {
    const text = await response.text();
    throw new EbayAuthError(`eBay auth failed (${response.status}): ${text}`);
  }

  const token: EbayTokenResponse = await response.json();
  setCachedToken(token.access_token, token.expires_in);

  return token.access_token;
}

/** Forces a fresh token fetch on next call (used after 401 responses) */
export function invalidateToken(): void {
  clearCachedToken();
}
