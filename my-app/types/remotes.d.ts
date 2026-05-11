declare module "myCart/Cart" {
  import type { ComponentType } from "react";

  const Cart: ComponentType;
  export default Cart;
}

declare module "myProducts/Products" {
  import type { ComponentType } from "react";

  const Products: ComponentType;
  export default Products;
}

declare module "../config/remotes" {
  export const remoteApps: {
    myCart: {
      global: string;
      url: string;
    };
    myProducts: {
      global: string;
      url: string;
    };
  };
}
