import {
  buildSearchQueryParams,
  getRawSearchParamInput,
} from "@/lib/search/searchParams";

describe("searchParams helpers", () => {
  describe("getRawSearchParamInput", () => {
    it("maps URLSearchParams values to validation input", () => {
      const params = new URLSearchParams({
        q: "iphone",
        page: "2",
        limit: "10",
        minPrice: "100",
        maxPrice: "500",
        condition: "NEW",
      });

      expect(getRawSearchParamInput(params)).toEqual({
        q: "iphone",
        page: "2",
        limit: "10",
        minPrice: "100",
        maxPrice: "500",
        condition: "NEW",
      });
    });
  });

  describe("buildSearchQueryParams", () => {
    it("builds required query params and omits condition ALL", () => {
      const params = buildSearchQueryParams({
        q: "macbook",
        page: 3,
        limit: 20,
        condition: "ALL",
      });

      expect(params.get("q")).toBe("macbook");
      expect(params.get("page")).toBe("3");
      expect(params.get("limit")).toBe("20");
      expect(params.get("condition")).toBeNull();
    });

    it("includes optional filters when provided", () => {
      const params = buildSearchQueryParams({
        q: "camera",
        minPrice: 100,
        maxPrice: 900,
        condition: "USED",
      });

      expect(params.get("minPrice")).toBe("100");
      expect(params.get("maxPrice")).toBe("900");
      expect(params.get("condition")).toBe("USED");
      expect(params.get("page")).toBe("1");
      expect(params.get("limit")).toBe("20");
    });
  });
});
