export type ProductSummary = {
  id: number;
  title: string;
  price: number;
  thumbnail: string;
  category: string;
  rating: number;
  stock: number;
};

export type ProductsResponse = {
  products: ProductSummary[];
  total: number;
  skip: number;
  limit: number;
};

export type ProductDetails = ProductSummary & {
  brand?: string;
  description: string;
  discountPercentage: number;
  images: string[];
  warrantyInformation?: string;
  shippingInformation?: string;
};

export type LoadState = "idle" | "loading" | "success" | "error";
