# Module Federation Frontend

This workspace contains three Next.js applications connected through Module Federation:

- `my-app` is the host application.
- `my-cart` is a remote application, also called a micro frontend.
- `my-products` is a remote application for product listing and details.

The host loads the cart UI from the remote app at runtime. This keeps `my-cart` independently owned and deployable, while still allowing it to appear inside `my-app`.

## Package Used

We are using:

```bash
@module-federation/nextjs-mf
```

This package provides `NextFederationPlugin`, which integrates Webpack Module Federation with Next.js.

We also added these supporting dev dependencies:

```bash
webpack
enhanced-resolve
cross-env
```

Why they are needed:

- `webpack`: `@module-federation/nextjs-mf` requires local Webpack access.
- `enhanced-resolve`: pinned to a compatible resolver version for the Next.js/Webpack federation build path.
- `cross-env`: sets environment variables consistently on Windows, macOS, and Linux.

## Important Router Decision

The installed `@module-federation/nextjs-mf` package does not support the Next.js App Router. It explicitly supports the Pages Router flow.

Because of that, the apps were moved from:

```text
app/
```

to:

```text
pages/
```

This is why both applications now use:

```text
pages/_app.tsx
pages/index.tsx
```

## Project Structure

```text
module-federations-frontend/
  my-app/
    config/
      remotes.js
    pages/
      _app.tsx
      index.tsx
    styles/
      globals.css
    types/
      remotes.d.ts
    next.config.js
    package.json

  my-cart/
    components/
      Cart.tsx
    pages/
      _app.tsx
      index.tsx
    styles/
      globals.css
    next.config.ts
    package.json

  my-products/
    components/
      ProductBrowser.tsx
    pages/
      _app.tsx
      index.tsx
    styles/
      globals.css
    next.config.ts
    package.json
```

## How `my-cart` Works as a Remote

`my-cart` exposes its cart component from `components/Cart.tsx`.

In `my-cart/next.config.ts`:

```ts
new NextFederationPlugin({
  name: "myCart",
  filename: "static/chunks/remoteEntry.js",
  remotes: {},
  exposes: {
    "./Cart": "./components/Cart.tsx",
  },
  shared: {},
  extraOptions: {
    exposePages: false,
  },
});
```

Key fields:

- `name: "myCart"` is the remote container/global name.
- `filename: "static/chunks/remoteEntry.js"` creates the remote entry file.
- `exposes["./Cart"]` makes the cart component available to other apps as `myCart/Cart`.

The exposed module is:

```text
myCart/Cart
```

## How `my-app` Works as the Host

`my-app` consumes the exposed cart module from `my-cart`.

In `my-app/next.config.js`:

```js
new NextFederationPlugin({
  name: "myApp",
  filename: "static/chunks/remoteEntry.js",
  remotes: createRemotes(isServer),
  exposes: {},
  shared: {},
  extraOptions: {
    exposePages: false,
  },
});
```

The host uses `my-app/config/remotes.js` to keep remote apps centralized:

```js
const remoteApps = {
  myCart: {
    global: "myCart",
    url: process.env.NEXT_PUBLIC_MY_CART_URL || "http://localhost:3001",
  },
  myProducts: {
    global: "myProducts",
    url: process.env.NEXT_PUBLIC_MY_PRODUCTS_URL || "http://localhost:3002",
  },
};
```

This function builds the correct remote entry URL for server and browser builds:

```js
function createRemotes(isServer) {
  const location = isServer ? "ssr" : "chunks";

  return Object.entries(remoteApps).reduce((remotes, [scope, remote]) => {
    remotes[scope] =
      `${remote.global}@${remote.url}/_next/static/${location}/remoteEntry.js`;
    return remotes;
  }, {});
}
```

This matters because Next.js produces different remote entry locations for server-side and client-side bundles.

## Rendering the Remote in the Host

In `my-app/pages/index.tsx`, the remote component is loaded dynamically:

```tsx
const CartRemote = dynamic(() => import("myCart/Cart"), {
  ssr: false,
  loading: () => <div className="remote-loading">Loading cart...</div>,
});
```

Then the host renders it like a normal React component:

```tsx
<CartRemote />
```

We also added a TypeScript declaration in `my-app/types/remotes.d.ts`:

```ts
declare module "myCart/Cart" {
  import type { ComponentType } from "react";

  const Cart: ComponentType;
  export default Cart;
}
```

This prevents TypeScript from failing because `myCart/Cart` does not exist inside the host source code at compile time. It is resolved at runtime through Module Federation.

## Scripts

Both apps set `NEXT_PRIVATE_LOCAL_WEBPACK=true` before running Next.js:

```json
"dev": "cross-env NEXT_PRIVATE_LOCAL_WEBPACK=true next dev -p 3000",
"build": "cross-env NEXT_PRIVATE_LOCAL_WEBPACK=true next build",
"start": "cross-env NEXT_PRIVATE_LOCAL_WEBPACK=true next start"
```

For `my-cart`, the dev port is `3001`:

```json
"dev": "cross-env NEXT_PRIVATE_LOCAL_WEBPACK=true next dev -p 3001"
```

For `my-products`, the dev port is `3002`:

```json
"dev": "cross-env NEXT_PRIVATE_LOCAL_WEBPACK=true next dev -p 3002"
```

This environment variable is required by `@module-federation/nextjs-mf`.

## Running the Apps

Open three terminals.

Terminal 1:

```bash
cd my-cart
npm run dev
```

Terminal 2:

```bash
cd my-products
npm run dev
```

Terminal 3:

```bash
cd my-app
npm run dev
```

Then open:

```text
http://localhost:3000
```

The host app should render the cart and products micro frontends from:

```text
http://localhost:3001
http://localhost:3002
```

You can also open the remote directly:

```text
http://localhost:3001
http://localhost:3002
```

## Runtime Flow

1. `my-cart` starts on port `3001`.
2. `my-products` starts on port `3002`.
3. `my-cart` exposes `./Cart` through its `remoteEntry.js`.
4. `my-products` exposes `./Products` through its `remoteEntry.js`.
5. `my-app` starts on port `3000`.
6. `my-app` reads the remote configuration from `config/remotes.js`.
7. `my-app` loads `myCart/Cart` and `myProducts/Products` at runtime.
8. The remote UIs are rendered inside the host app.

## How This Is Scalable

The scalable part is the centralized remote registry:

```text
my-app/config/remotes.js
```

To add another micro frontend later, add one more entry to `remoteApps`.

Example:

```js
const remoteApps = {
  myCart: {
    global: "myCart",
    url: process.env.NEXT_PUBLIC_MY_CART_URL || "http://localhost:3001",
  },
  myProfile: {
    global: "myProfile",
    url: process.env.NEXT_PUBLIC_MY_PROFILE_URL || "http://localhost:3003",
  },
};
```

Then expose a module from the new remote app:

```js
exposes: {
  "./Profile": "./components/Profile.tsx",
}
```

And import it in the host:

```tsx
const ProfileRemote = dynamic(() => import("myProfile/Profile"), {
  ssr: false,
});
```

Also add a TypeScript declaration:

```ts
declare module "myProfile/Profile" {
  import type { ComponentType } from "react";

  const Profile: ComponentType;
  export default Profile;
}
```

## Environment Variables

Remote URLs can be changed without editing code:

```bash
NEXT_PUBLIC_MY_CART_URL=https://cart.example.com
NEXT_PUBLIC_MY_PRODUCTS_URL=https://products.example.com
```

The host will then load:

```text
https://cart.example.com/_next/static/chunks/remoteEntry.js
https://products.example.com/_next/static/chunks/remoteEntry.js
```

for browser bundles and:

```text
https://cart.example.com/_next/static/ssr/remoteEntry.js
https://products.example.com/_next/static/ssr/remoteEntry.js
```

for server bundles.

## Summary

We achieved Module Federation by:

- Installing `@module-federation/nextjs-mf`.
- Enabling local Webpack with `NEXT_PRIVATE_LOCAL_WEBPACK=true`.
- Making `my-cart` a remote app.
- Exposing `my-cart/components/Cart.tsx` as `myCart/Cart`.
- Making `my-products` a remote app.
- Exposing `my-products/components/ProductBrowser.tsx` as `myProducts/Products`.
- Making `my-app` a host app.
- Registering remote apps in `my-app/config/remotes.js`.
- Loading the remote cart and products components dynamically inside `my-app`.
- Adding TypeScript module declarations for remote imports.
- Using the Pages Router because the installed federation package does not support the App Router.
