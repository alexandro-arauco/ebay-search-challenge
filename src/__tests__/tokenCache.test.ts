import { getCachedToken, setCachedToken, clearCachedToken } from "@/lib/cache/tokenCache";

describe("TokenCache", () => {
  beforeEach(() => {
    clearCachedToken();
  });

  it("returns null when cache is empty", () => {
    expect(getCachedToken()).toBeNull();
  });

  it("returns the token when set and not expired", () => {
    setCachedToken("test-token-123", 7200); // 2 hours
    expect(getCachedToken()).toBe("test-token-123");
  });

  it("returns null when token has expired", () => {
    setCachedToken("expired-token", -10); // already expired
    expect(getCachedToken()).toBeNull();
  });

  it("returns null after clear", () => {
    setCachedToken("some-token", 7200);
    clearCachedToken();
    expect(getCachedToken()).toBeNull();
  });

  it("replaces old token on re-set", () => {
    setCachedToken("old-token", 7200);
    setCachedToken("new-token", 7200);
    expect(getCachedToken()).toBe("new-token");
  });
});
