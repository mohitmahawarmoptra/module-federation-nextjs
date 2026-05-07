# my-products

`my-products` is a Next.js Module Federation remote running on port `3002`.

It exposes:

```text
myProducts/Products
```

The exposed component fetches product pages from:

```text
https://dummyjson.com/products?limit=10&skip={offset}
```

and product details from:

```text
https://dummyjson.com/products/{id}
```

Run it with:

```bash
npm run dev
```
