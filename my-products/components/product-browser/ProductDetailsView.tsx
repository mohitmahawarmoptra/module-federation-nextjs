import { LoadState, ProductDetails } from "./types";
import { formatPrice } from "./utils";

export function ProductDetailsView({
  detailState,
  detailError,
  productDetails,
}: {
  detailState: LoadState;
  detailError: string;
  productDetails: ProductDetails | null;
}) {
  return (
    <section className="product-detail-panel" aria-label="Product details">
      {detailState === "idle" && (
        <div className="product-message">Select a product to view details.</div>
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
          <div className="product-detail-image-wrapper">
            <img
              className="product-detail-image"
              src={productDetails.images[0] || productDetails.thumbnail}
              alt={productDetails.title}
            />
          </div>
          
          <div className="product-detail-header">
            <h3>{productDetails.title}</h3>
            <strong>{formatPrice.format(productDetails.price)}</strong>
          </div>
          
          <p className="product-description">{productDetails.description}</p>
          
          <dl className="product-stats">
            <div className="product-stats-badge">
              <dt>Rating</dt>
              <dd>★ {productDetails.rating}</dd>
            </div>
            <div className="product-stats-badge">
              <dt>Stock</dt>
              <dd>{productDetails.stock}</dd>
            </div>
            <div className="product-stats-badge">
              <dt>Discount</dt>
              <dd>{productDetails.discountPercentage}%</dd>
            </div>
          </dl>
          
          <div className="product-fulfillment">
            <div className="product-fulfillment-badge">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20 6L9 17l-5-5"/>
              </svg>
              <span>{productDetails.warrantyInformation || "Warranty available"}</span>
            </div>
            <div className="product-fulfillment-badge">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20 6L9 17l-5-5"/>
              </svg>
              <span>{productDetails.shippingInformation || "Shipping available"}</span>
            </div>
          </div>
          
          <button className="add-to-cart-btn" type="button">
            Add to Cart
          </button>
        </article>
      )}
    </section>
  );
}
