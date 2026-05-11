import { PAGE_SIZE, ALL_CATEGORIES } from "./constants";

export const formatPrice = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
});

export function getProductsUrl(page: number, searchQuery: string, category: string) {
  const skip = (page - 1) * PAGE_SIZE;
  const params = `limit=${PAGE_SIZE}&skip=${skip}`;

  if (searchQuery) {
    return `https://dummyjson.com/products/search?q=${encodeURIComponent(
      searchQuery
    )}&${params}`;
  }

  if (category !== ALL_CATEGORIES) {
    return `https://dummyjson.com/products/category/${encodeURIComponent(
      category
    )}?${params}`;
  }

  return `https://dummyjson.com/products?${params}`;
}
