import { LoadState, ProductSummary } from "./types";
import { formatPrice } from "./utils";
import { ProductPagination } from "./ProductPagination";

export function ProductList({
  listState,
  listError,
  products,
  selectedProductId,
  setSelectedProductId,
  page,
  setPage,
  pages,
  visiblePageCount,
}: {
  listState: LoadState;
  listError: string;
  products: ProductSummary[];
  selectedProductId: number | null;
  setSelectedProductId: (id: number) => void;
  page: number;
  setPage: (val: number | ((prev: number) => number)) => void;
  pages: number[];
  visiblePageCount: number;
}) {
  const hasProducts = products.length > 0;

  return (
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
                <div className="product-button-image-wrapper">
                  <img src={product.thumbnail} alt={product.title} />
                </div>
                <div className="product-button-content">
                  <small>{product.category}</small>
                  <strong>{product.title}</strong>
                  <span className="product-button-price">
                    {formatPrice.format(product.price)}
                  </span>
                </div>
              </button>
            </li>
          ))}
        </ul>
      )}

      <ProductPagination
        page={page}
        setPage={setPage}
        pages={pages}
        visiblePageCount={visiblePageCount}
        listState={listState}
      />
    </section>
  );
}
