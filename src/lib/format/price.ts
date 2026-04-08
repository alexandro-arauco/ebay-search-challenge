const formatterCache = new Map<string, Intl.NumberFormat>();

function getFormatter(currency: string): Intl.NumberFormat {
  const cached = formatterCache.get(currency);
  if (cached) {
    return cached;
  }

  const formatter = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
  });
  formatterCache.set(currency, formatter);
  return formatter;
}

export function formatPrice(value: number, currency: string): string {
  if (value <= 0) {
    return "Price unavailable";
  }

  return getFormatter(currency).format(value);
}
