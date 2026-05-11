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
  );
}
