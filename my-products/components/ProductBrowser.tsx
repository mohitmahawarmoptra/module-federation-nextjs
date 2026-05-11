import { useEffect, useMemo, useState } from "react";
import { ALL_CATEGORIES, MAX_PAGES, PAGE_SIZE } from "./product-browser/constants";
import { useCategories, useDebouncedValue, useProductDetails, useProducts } from "./product-browser/hooks";
import { ProductFilters } from "./product-browser/ProductFilters";
import { ProductList } from "./product-browser/ProductList";
import { ProductDetailsView } from "./product-browser/ProductDetailsView";

export default function ProductBrowser() {
  const [page, setPage] = useState(1);
  const [searchInput, setSearchInput] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(ALL_CATEGORIES);
  const [selectedProductId, setSelectedProductId] = useState<number | null>(null);

  const searchQuery = useDebouncedValue(searchInput.trim());
  const { categories, categoryState, categoryError } = useCategories();
  const { products, totalProducts, listState, listError } = useProducts(
    page,
    searchQuery,
    selectedCategory
  );
  const { productDetails, detailState, detailError } = useProductDetails(selectedProductId);

  const totalPages = Math.max(1, Math.ceil(totalProducts / PAGE_SIZE));
  const visiblePageCount = Math.min(MAX_PAGES, totalPages);
  const pages = useMemo(
    () => Array.from({ length: visiblePageCount }, (_, index) => index + 1),
    [visiblePageCount]
  );

  // Reset to page 1 on filter changes
  useEffect(() => {
    setPage(1);
  }, [searchQuery, selectedCategory]);

  // Adjust page if it exceeds visible pages
  useEffect(() => {
    if (page > visiblePageCount && visiblePageCount > 0) {
      setPage(visiblePageCount);
    }
  }, [page, visiblePageCount]);

  // Select first product when list loads
  useEffect(() => {
    if (listState === "success" && products.length > 0) {
      setSelectedProductId(products[0].id);
    } else if (listState === "success" && products.length === 0) {
      setSelectedProductId(null);
    }
  }, [listState, products]);

  function clearFilters() {
    setSearchInput("");
    setSelectedCategory(ALL_CATEGORIES);
  }

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

      <ProductFilters
        searchInput={searchInput}
        setSearchInput={setSearchInput}
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
        categories={categories}
        clearFilters={clearFilters}
      />

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
        <ProductList
          listState={listState}
          listError={listError}
          products={products}
          selectedProductId={selectedProductId}
          setSelectedProductId={setSelectedProductId}
          page={page}
          setPage={setPage}
          pages={pages}
          visiblePageCount={visiblePageCount}
        />

        <ProductDetailsView
          detailState={detailState}
          detailError={detailError}
          productDetails={productDetails}
        />
      </div>
    </div>
  );
}
