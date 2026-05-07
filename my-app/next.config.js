const NextFederationPlugin = require("@module-federation/nextjs-mf");
const { createRemotes } = require("./config/remotes");

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  webpack(config, options) {
    const { isServer } = options;

    config.plugins.push(
      new NextFederationPlugin({
        name: "myApp",
        filename: "static/chunks/remoteEntry.js",
        remotes: createRemotes(isServer),
        exposes: {},
        shared: {},
        extraOptions: {
          exposePages: false,
        },
      })
    );

    return config;
  },
};

module.exports = nextConfig;
