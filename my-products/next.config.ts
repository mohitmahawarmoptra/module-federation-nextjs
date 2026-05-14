import type { NextConfig } from "next";
import NextFederationPlugin from "@module-federation/nextjs-mf";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  webpack(config) {
    config.plugins.push(
      new NextFederationPlugin({
        name: "myProducts",
        filename: "static/chunks/remoteEntry.js",
        remotes: {},
        exposes: {
          "./Products": "./components/ProductBrowser.tsx",
          "./ProductDetail": "./components/ProductDetailStandalone.tsx",
        },
        shared: {},
        extraOptions: {
          exposePages: false,
        },
      })
    );

    return config;
  },
};

export default nextConfig;
