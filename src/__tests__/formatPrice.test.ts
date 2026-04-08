import { formatPrice } from "@/lib/format/price";

describe("formatPrice", () => {
  it("formats positive values with currency", () => {
    expect(formatPrice(199.99, "USD")).toBe("$199.99");
  });

  it("returns fallback label for zero and negative values", () => {
    expect(formatPrice(0, "USD")).toBe("Price unavailable");
    expect(formatPrice(-1, "USD")).toBe("Price unavailable");
  });
});
