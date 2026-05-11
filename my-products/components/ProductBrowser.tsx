import { useEffect, useMemo, useState } from "react";

const PAGE_SIZE = 10;
const MAX_PAGES = 5;
const ALL_CATEGORIES = "all";

type ProductSummary = {
  id: number;
  title: string;
  price: number;
  thumbnail: string;
  category: string;
  rating: number;
  stock: number;
};

type ProductsResponse = {
  products: ProductSummary[];
  total: number;
  skip: number;
  limit: number;
};

type ProductDetails = ProductSummary & {
  brand?: string;
  description: string;
  discountPercentage: number;
  images: string[];
  warrantyInformation?: string;
  shippingInformation?: string;
};

type LoadState = "idle" | "loading" | "success" | "error";

const formatPrice = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
});

function getProductsUrl(page: number, searchQuery: string, category: string) {
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

function useDebouncedValue(value: string, delay = 350) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => window.clearTimeout(timeoutId);
  }, [delay, value]);

  return debouncedValue;
}

export default function ProductBrowser() {
  const [page, setPage] = useState(1);
  const [searchInput, setSearchInput] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(ALL_CATEGORIES);
  const [categories, setCategories] = useState<string[]>([]);
  const [products, setProducts] = useState<ProductSummary[]>([]);
  const [selectedProductId, setSelectedProductId] = useState<number | null>(
    null
  );
  const [productDetails, setProductDetails] = useState<ProductDetails | null>(
    null
  );
  const [listState, setListState] = useState<LoadState>("idle");
  const [detailState, setDetailState] = useState<LoadState>("idle");
  const [categoryState, setCategoryState] = useState<LoadState>("idle");
  const [totalProducts, setTotalProducts] = useState(0);
  const [listError, setListError] = useState("");
  const [detailError, setDetailError] = useState("");
  const [categoryError, setCategoryError] = useState("");

  const searchQuery = useDebouncedValue(searchInput.trim());
  const totalPages = Math.max(1, Math.ceil(totalProducts / PAGE_SIZE));
  const visiblePageCount = Math.min(MAX_PAGES, totalPages);
  const pages = useMemo(
    () => Array.from({ length: visiblePageCount }, (_, index) => index + 1),
    [visiblePageCount]
  );

  useEffect(() => {
    const controller = new AbortController();

    async function loadCategories() {
      setCategoryState("loading");
      setCategoryError("");

      try {
        const response = await fetch(
          "https://dummyjson.com/products/category-list",
          {
            signal: controller.signal,
          }
        );

        if (!response.ok) {
          throw new Error("Category request failed.");
        }

        const data = (await response.json()) as unknown;
        setCategories(Array.isArray(data) ? data : []);
        setCategoryState("success");
      } catch (error) {
        if (controller.signal.aborted) {
          return;
        }

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

  useEffect(() => {
    setPage(1);
  }, [searchQuery, selectedCategory]);

  useEffect(() => {
    const controller = new AbortController();

    async function loadProducts() {
      setListState("loading");
      setListError("");

      try {
        const response = await fetch(
          getProductsUrl(page, searchQuery, selectedCategory),
          {
            signal: controller.signal,
          }
        );

        if (!response.ok) {
          throw new Error("Product list request failed.");
        }

        const data = (await response.json()) as ProductsResponse;
        const nextProducts = Array.isArray(data.products) ? data.products : [];

        setProducts(nextProducts);
        setTotalProducts(Number.isFinite(data.total) ? data.total : 0);
        setSelectedProductId(nextProducts[0]?.id ?? null);
        setListState("success");
      } catch (error) {
        if (controller.signal.aborted) {
          return;
        }

        setProducts([]);
        setTotalProducts(0);
        setSelectedProductId(null);
        setListError(
          error instanceof Error ? error.message : "Unable to load products."
        );
        setListState("error");
      }
    }

    loadProducts();

    return () => controller.abort();
  }, [page, searchQuery, selectedCategory]);

  useEffect(() => {
    if (page <= visiblePageCount) {
      return;
    }

    setPage(visiblePageCount);
  }, [page, visiblePageCount]);

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
          {
            signal: controller.signal,
          }
        );

        if (!response.ok) {
          throw new Error("Product detail request failed.");
        }

        const data = (await response.json()) as ProductDetails;
        setProductDetails(data);
        setDetailState("success");
      } catch (error) {
        if (controller.signal.aborted) {
          return;
        }

        setProductDetails(null);
        setDetailError(
          error instanceof Error
            ? error.message
            : "Unable to load product details."
        );
        setDetailState("error");
      }
    }

    loadProductDetails();

    return () => controller.abort();
  }, [selectedProductId]);

  function clearFilters() {
    setSearchInput("");
    setSelectedCategory(ALL_CATEGORIES);
  }

  const hasProducts = products.length > 0;
  const activeFilterLabel = searchQuery
    ? `Search: ${searchQuery}`
    : selectedCategory === ALL_CATEGORIES
    ? "All products"
    : `Category: ${selectedCategory}`;

  return (
    <div className="product-browser">
      <div className="product-toolbar">
        <div>
          <p className="product-kicker">Products remote</p>
          <h3>Product catalog</h3>
        </div>
        <div className="product-page-summary">
          Page {page} of {visiblePageCount}
        </div>
      </div>

      <div className="product-filters" aria-label="Product filters">
        <label>
          <span>Search</span>
          <input
            placeholder="Search products"
            type="search"
            value={searchInput}
            onChange={(event) => setSearchInput(event.target.value)}
          />
        </label>

        <label>
          <span>Category</span>
          <select
            value={selectedCategory}
            onChange={(event) => setSelectedCategory(event.target.value)}
          >
            <option value={ALL_CATEGORIES}>All categories</option>
            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </label>

        <button type="button" onClick={clearFilters}>
          Clear
        </button>
      </div>

      {categoryState === "error" && (
        <div className="product-inline-error" role="alert">
          {categoryError}
        </div>
      )}

      <div className="product-active-filter">
        <span>{activeFilterLabel}</span>
        <span>{totalProducts} results</span>
      </div>

      <div className="product-content-grid">
        <section className="product-list-panel" aria-label="Product list">
          {listState === "loading" && (
            <div className="product-message">Loading products...</div>
          )}

          {listState === "error" && (
            <div className="product-message" role="alert">
              {listError}
            </div>
          )}

          {listState === "success" && !hasProducts && (
            <div className="product-message">No products found.</div>
          )}

          {listState === "success" && hasProducts && (
            <ul className="product-list">
              {products.map((product) => (
                <li key={product.id}>
                  <button
                    className={`product-button ${
                      product.id === selectedProductId ? "selected" : ""
                    }`}
                    type="button"
                    onClick={() => setSelectedProductId(product.id)}
                  >
                    <img src={product.thumbnail} alt="" />
                    <span>
                      <strong>{product.title}</strong>
                      <small>
                        {product.category} - {formatPrice.format(product.price)}
                      </small>
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          )}

          <nav className="product-pagination" aria-label="Product pages">
            <button
              type="button"
              onClick={() => setPage((currentPage) => currentPage - 1)}
              disabled={page === 1 || listState === "loading"}
            >
              Prev
            </button>
            {pages.map((pageNumber) => (
              <button
                aria-current={pageNumber === page ? "page" : undefined}
                className={pageNumber === page ? "active-page" : ""}
                disabled={listState === "loading"}
                key={pageNumber}
                type="button"
                onClick={() => setPage(pageNumber)}
              >
                {pageNumber}
              </button>
            ))}
            <button
              type="button"
              onClick={() => setPage((currentPage) => currentPage + 1)}
              disabled={page === visiblePageCount || listState === "loading"}
            >
              Next
            </button>
          </nav>
        </section>

        <section className="product-detail-panel" aria-label="Product details">
          {detailState === "idle" && (
            <div className="product-message">Select a product.</div>
          )}

          {detailState === "loading" && (
            <div className="product-message">Loading product details...</div>
          )}

          {detailState === "error" && (
            <div className="product-message" role="alert">
              {detailError}
            </div>
          )}

          {detailState === "success" && productDetails && (
            <article>
              <img
                className="product-detail-image"
                src={productDetails.images[0] || productDetails.thumbnail}
                alt={productDetails.title}
              />
              <div className="product-detail-header">
                <div>
                  <p className="product-kicker">
                    {productDetails.brand || productDetails.category}
                  </p>
                  <h3>{productDetails.title}</h3>
                </div>
                <strong>{formatPrice.format(productDetails.price)}</strong>
              </div>
              <p className="product-description">{productDetails.description}</p>
              <dl className="product-stats">
                <div>
                  <dt>Rating</dt>
                  <dd>{productDetails.rating}</dd>
                </div>
                <div>
                  <dt>Stock</dt>
                  <dd>{productDetails.stock}</dd>
                </div>
                <div>
                  <dt>Discount</dt>
                  <dd>{productDetails.discountPercentage}%</dd>
                </div>
              </dl>
              <div className="product-fulfillment">
                <span>
                  {productDetails.warrantyInformation || "Warranty available"}
                </span>
                <span>
                  {productDetails.shippingInformation || "Shipping available"}
                </span>
              </div>
            </article>
          )}
        </section>
      </div>
    </div>
  );
}
