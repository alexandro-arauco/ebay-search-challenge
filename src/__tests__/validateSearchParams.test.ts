import { validateSearchParams } from "@/specs/searchParams.spec";

describe("validateSearchParams", () => {
  describe("valid inputs", () => {
    it("accepts a minimal valid query", () => {
      const result = validateSearchParams({ q: "laptop" });
      expect(result.valid).toBe(true);
      if (result.valid) {
        expect(result.params.q).toBe("laptop");
        expect(result.params.page).toBe(1);
        expect(result.params.limit).toBe(20);
      }
    });

    it("trims whitespace from query", () => {
      const result = validateSearchParams({ q: "  iphone  " });
      expect(result.valid).toBe(true);
      if (result.valid) {
        expect(result.params.q).toBe("iphone");
      }
    });

    it("clamps limit to [1, 50]", () => {
      const over = validateSearchParams({ q: "test", limit: 200 });
      expect(over.valid).toBe(true);
      if (over.valid) expect(over.params.limit).toBe(50);

      const under = validateSearchParams({ q: "test", limit: 0 });
      expect(under.valid).toBe(true);
      if (under.valid) expect(under.params.limit).toBe(1);
    });

    it("defaults page to 1 for invalid page values", () => {
      const result = validateSearchParams({ q: "watch", page: -5 });
      expect(result.valid).toBe(true);
      if (result.valid) expect(result.params.page).toBe(1);
    });

    it("accepts valid price range", () => {
      const result = validateSearchParams({ q: "sneakers", minPrice: 10, maxPrice: 100 });
      expect(result.valid).toBe(true);
      if (result.valid) {
        expect(result.params.minPrice).toBe(10);
        expect(result.params.maxPrice).toBe(100);
      }
    });
  });

  describe("invalid inputs", () => {
    it("rejects empty query", () => {
      const result = validateSearchParams({ q: "" });
      expect(result.valid).toBe(false);
      if (!result.valid) expect(result.error.code).toBe("INVALID_QUERY");
    });

    it("rejects whitespace-only query", () => {
      const result = validateSearchParams({ q: "   " });
      expect(result.valid).toBe(false);
    });

    it("rejects null input", () => {
      const result = validateSearchParams(null);
      expect(result.valid).toBe(false);
    });

    it("rejects negative minPrice", () => {
      const result = validateSearchParams({ q: "test", minPrice: -10 });
      expect(result.valid).toBe(false);
      if (!result.valid) expect(result.error.code).toBe("INVALID_QUERY");
    });

    it("rejects maxPrice <= minPrice", () => {
      const result = validateSearchParams({ q: "test", minPrice: 100, maxPrice: 50 });
      expect(result.valid).toBe(false);
      if (!result.valid) expect(result.error.code).toBe("INVALID_QUERY");
    });

    it("rejects equal min and max price", () => {
      const result = validateSearchParams({ q: "test", minPrice: 50, maxPrice: 50 });
      expect(result.valid).toBe(false);
    });
  });
});
