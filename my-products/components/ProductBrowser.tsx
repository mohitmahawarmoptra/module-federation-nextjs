import { useEffect, useMemo, useState } from "react";
import { ALL_CATEGORIES, MAX_PAGES, PAGE_SIZE } from "./product-browser/constants";
import { useCategories, useDebouncedValue, useProductDetails, useProducts } from "./product-browser/hooks";
import { ProductFilters } from "./product-browser/ProductFilters";
import { ProductList } from "./product-browser/ProductList";
import { ProductDetailsView } from "./product-browser/ProductDetailsView";

export default function ProductBrowser({ onProductClick }: { onProductClick?: (id: number) => void }) {
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

  // Select first product when list loads, only if we are displaying details inline
  useEffect(() => {
    if (!onProductClick) {
      if (listState === "success" && products.length > 0) {
        setSelectedProductId(products[0].id);
      } else if (listState === "success" && products.length === 0) {
        setSelectedProductId(null);
      }
    }
  }, [listState, products, onProductClick]);

  function clearFilters() {
    setSearchInput("");
    setSelectedCategory(ALL_CATEGORIES);
  }

  const handleProductSelect = (id: number) => {
    if (onProductClick) {
      onProductClick(id);
    } else {
      setSelectedProductId(id);
    }
  };

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
        <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
          <div className="product-page-summary">
            Page {page} of {visiblePageCount}
          </div>
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

      <div 
        className="product-content-grid" 
        style={onProductClick ? { gridTemplateColumns: "1fr" } : undefined}
      >
        <ProductList
          listState={listState}
          listError={listError}
          products={products}
          selectedProductId={selectedProductId}
          setSelectedProductId={handleProductSelect}
          page={page}
          setPage={setPage}
          pages={pages}
          visiblePageCount={visiblePageCount}
        />

        {!onProductClick && (
          <ProductDetailsView
            detailState={detailState}
            detailError={detailError}
            productDetails={productDetails}
          />
        )}
      </div>
    </div>
  );
}
