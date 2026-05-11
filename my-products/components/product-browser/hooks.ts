import { useState, useEffect } from "react";
import { LoadState, ProductSummary, ProductsResponse, ProductDetails } from "./types";
import { getProductsUrl } from "./utils";

export function useDebouncedValue(value: string, delay = 350) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => window.clearTimeout(timeoutId);
  }, [delay, value]);

  return debouncedValue;
}

export function useCategories() {
  const [categories, setCategories] = useState<string[]>([]);
  const [categoryState, setCategoryState] = useState<LoadState>("idle");
  const [categoryError, setCategoryError] = useState("");

  useEffect(() => {
    const controller = new AbortController();

    async function loadCategories() {
      setCategoryState("loading");
      setCategoryError("");

      try {
        const response = await fetch(
          "https://dummyjson.com/products/category-list",
          { signal: controller.signal }
        );

        if (!response.ok) throw new Error("Category request failed.");

        const data = (await response.json()) as unknown;
        setCategories(Array.isArray(data) ? data : []);
        setCategoryState("success");
      } catch (error) {
        if (controller.signal.aborted) return;
        setCategories([]);
        setCategoryError(
          error instanceof Error ? error.message : "Unable to load categories."
        );
        setCategoryState("error");
      }
    }

    loadCategories();
    return () => controller.abort();
  }, []);

  return { categories, categoryState, categoryError };
}

export function useProducts(page: number, searchQuery: string, selectedCategory: string) {
  const [products, setProducts] = useState<ProductSummary[]>([]);
  const [totalProducts, setTotalProducts] = useState(0);
  const [listState, setListState] = useState<LoadState>("idle");
  const [listError, setListError] = useState("");

  useEffect(() => {
    const controller = new AbortController();

    async function loadProducts() {
      setListState("loading");
      setListError("");

      try {
        const response = await fetch(
          getProductsUrl(page, searchQuery, selectedCategory),
          { signal: controller.signal }
        );

        if (!response.ok) throw new Error("Product list request failed.");

        const data = (await response.json()) as ProductsResponse;
        const nextProducts = Array.isArray(data.products) ? data.products : [];

        setProducts(nextProducts);
        setTotalProducts(Number.isFinite(data.total) ? data.total : 0);
        setListState("success");
      } catch (error) {
        if (controller.signal.aborted) return;
        setProducts([]);
        setTotalProducts(0);
        setListError(
          error instanceof Error ? error.message : "Unable to load products."
        );
        setListState("error");
      }
    }

    loadProducts();
    return () => controller.abort();
  }, [page, searchQuery, selectedCategory]);

  return { products, totalProducts, listState, listError };
}

export function useProductDetails(selectedProductId: number | null) {
  const [productDetails, setProductDetails] = useState<ProductDetails | null>(null);
  const [detailState, setDetailState] = useState<LoadState>("idle");
  const [detailError, setDetailError] = useState("");

  useEffect(() => {
    if (selectedProductId === null) {
      setProductDetails(null);
      setDetailState("idle");
      return;
    }

    const controller = new AbortController();

    async function loadProductDetails() {
      setDetailState("loading");
      setDetailError("");

      try {
        const response = await fetch(
          `https://dummyjson.com/products/${selectedProductId}`,
          { signal: controller.signal }
        );

        if (!response.ok) throw new Error("Product detail request failed.");

        const data = (await response.json()) as ProductDetails;
        setProductDetails(data);
        setDetailState("success");
      } catch (error) {
        if (controller.signal.aborted) return;
        setProductDetails(null);
        setDetailError(
          error instanceof Error ? error.message : "Unable to load product details."
        );
        setDetailState("error");
      }
    }

    loadProductDetails();
    return () => controller.abort();
  }, [selectedProductId]);

  return { productDetails, detailState, detailError };
}
