const remoteApps = {
  myCart: {
    global: "myCart",
    url: process.env.NEXT_PUBLIC_MY_CART_URL || "http://localhost:3001",
  },
};

function createRemotes(isServer) {
  const location = isServer ? "ssr" : "chunks";

  return Object.entries(remoteApps).reduce((remotes, [scope, remote]) => {
    remotes[scope] =
      `${remote.global}@${remote.url}/_next/static/${location}/remoteEntry.js`;
    return remotes;
  }, {});
}

module.exports = {
  createRemotes,
  remoteApps,
};
