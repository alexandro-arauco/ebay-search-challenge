import { normalizeProduct, normalizeProducts } from "@/lib/ebay/normalizer";
import type { EbayItemSummary } from "@/types";

const baseItem: EbayItemSummary = {
  itemId: "v1|123456|0",
  title: "Apple MacBook Pro 14 M3",
  price: { value: "1499.99", currency: "USD" },
  condition: "New",
  image: { imageUrl: "https://i.ebayimg.com/images/g/test.jpg" },
  itemWebUrl: "https://www.ebay.com/itm/123456",
  seller: { username: "tech_seller" },
  itemLocation: { city: "San Jose", country: "US" },
};

describe("normalizeProduct", () => {
  it("maps all fields correctly", () => {
    const product = normalizeProduct(baseItem);
    expect(product).not.toBeNull();
    expect(product?.id).toBe("v1|123456|0");
    expect(product?.title).toBe("Apple MacBook Pro 14 M3");
    expect(product?.price).toEqual({ value: 1499.99, currency: "USD" });
    expect(product?.condition).toBe("NEW");
    expect(product?.image?.url).toBe("https://i.ebayimg.com/images/g/test.jpg");
    expect(product?.listingUrl).toBe("https://www.ebay.com/itm/123456");
    expect(product?.seller).toBe("tech_seller");
    expect(product?.location).toBe("San Jose, US");
  });

  it("normalizes condition variants", () => {
    const cases: [string, string][] = [
      ["New with tags", "NEW"],
      ["Used - Excellent", "USED"],
      ["Pre-Owned", "USED"],
    ];

    for (const [raw, expected] of cases) {
      const item = { ...baseItem, condition: raw };
      const product = normalizeProduct(item);
      expect(product?.condition).toBe(expected);
    }
  });

  it("handles missing price gracefully", () => {
    const item = { ...baseItem, price: undefined };
    const product = normalizeProduct(item);
    expect(product?.price).toEqual({ value: 0, currency: "USD" });
  });

  it("returns null for missing image", () => {
    const item = { ...baseItem, image: undefined };
    const product = normalizeProduct(item);
    expect(product?.image).toBeNull();
  });

  it("returns null for item without id", () => {
    const item = { ...baseItem, itemId: "" };
    const product = normalizeProduct(item);
    expect(product).toBeNull();
  });

  it("returns null for item without title", () => {
    const item = { ...baseItem, title: "" };
    const product = normalizeProduct(item);
    expect(product).toBeNull();
  });

  it("handles missing optional fields", () => {
    const minimal: EbayItemSummary = {
      itemId: "v1|999|0",
      title: "Minimal item",
      itemWebUrl: "https://www.ebay.com/itm/999",
    };
    const product = normalizeProduct(minimal);
    expect(product).not.toBeNull();
    expect(product?.seller).toBeNull();
    expect(product?.location).toBeNull();
    expect(product?.image).toBeNull();
    expect(product?.condition).toBe("ALL");
  });
});

describe("normalizeProducts", () => {
  it("filters out null results", () => {
    const items: EbayItemSummary[] = [
      baseItem,
      { ...baseItem, itemId: "" }, // invalid → null
      { ...baseItem, itemId: "v1|999|0", title: "Second item" },
    ];
    const products = normalizeProducts(items);
    expect(products).toHaveLength(2);
    expect(products[0].id).toBe("v1|123456|0");
    expect(products[1].id).toBe("v1|999|0");
  });

  it("returns empty array for empty input", () => {
    expect(normalizeProducts([])).toEqual([]);
  });
});
