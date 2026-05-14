import { useEffect, useState } from "react";
import { useProductDetails } from "./product-browser/hooks";
import { ProductDetailsView } from "./product-browser/ProductDetailsView";

export default function ProductDetailStandalone({ productId }: { productId?: number }) {
  const { productDetails, detailState, detailError } = useProductDetails(productId || null);

  if (!productId) {
    return (
      <div className="product-browser">
        <div className="product-inline-error" role="alert">
          Product ID is required.
        </div>
      </div>
    );
  }

  return (
    <div className="product-browser">
      <ProductDetailsView
        detailState={detailState}
        detailError={detailError}
        productDetails={productDetails}
      />
    </div>
  );
}
