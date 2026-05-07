import { useEffect, useMemo, useState } from "react";

const PAGE_SIZE = 10;
const MAX_PAGES = 5;

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

function getProductsUrl(page: number) {
  const skip = (page - 1) * PAGE_SIZE;
  return `https://dummyjson.com/products?limit=${PAGE_SIZE}&skip=${skip}`;
}

export default function ProductBrowser() {
  const [page, setPage] = useState(1);
  const [products, setProducts] = useState<ProductSummary[]>([]);
  const [selectedProductId, setSelectedProductId] = useState<number | null>(
    null
  );
  const [productDetails, setProductDetails] = useState<ProductDetails | null>(
    null
  );
  const [listState, setListState] = useState<LoadState>("idle");
  const [detailState, setDetailState] = useState<LoadState>("idle");
  const [listError, setListError] = useState("");
  const [detailError, setDetailError] = useState("");

  const pages = useMemo(
    () => Array.from({ length: MAX_PAGES }, (_, index) => index + 1),
    []
  );

  useEffect(() => {
    const controller = new AbortController();

    async function loadProducts() {
      setListState("loading");
      setListError("");

      try {
        const response = await fetch(getProductsUrl(page), {
          signal: controller.signal,
        });

        if (!response.ok) {
          throw new Error("Product list request failed.");
        }

        const data = (await response.json()) as ProductsResponse;
        setProducts(data.products);
        setSelectedProductId(data.products[0]?.id ?? null);
        setListState("success");
      } catch (error) {
        if (controller.signal.aborted) {
          return;
        }

        setProducts([]);
        setSelectedProductId(null);
        setListError(
          error instanceof Error ? error.message : "Unable to load products."
        );
        setListState("error");
      }
    }

    loadProducts();

    return () => controller.abort();
  }, [page]);

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

  return (
    <div className="product-browser">
      <div className="product-toolbar">
        <div>
          <p className="product-kicker">Products remote</p>
          <h3>Product catalog</h3>
        </div>
        <div className="product-page-summary">Page {page} of {MAX_PAGES}</div>
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

          {listState === "success" && (
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
                        {product.category} · {formatPrice.format(product.price)}
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
              disabled={page === 1}
            >
              Prev
            </button>
            {pages.map((pageNumber) => (
              <button
                aria-current={pageNumber === page ? "page" : undefined}
                className={pageNumber === page ? "active-page" : ""}
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
              disabled={page === MAX_PAGES}
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
                <span>{productDetails.warrantyInformation || "Warranty available"}</span>
                <span>{productDetails.shippingInformation || "Shipping available"}</span>
              </div>
            </article>
          )}
        </section>
      </div>
    </div>
  );
}
