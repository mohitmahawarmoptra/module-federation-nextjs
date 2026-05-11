import FederatedRemote from "../components/FederatedRemote";
import { remoteApps } from "../config/remotes";

const microFrontends = [
  // {
  //   name: "Cart",
  //   scope: "myCart",
  //   description: "Loaded from the my-cart remote app on port 3001.",
  //   module: "./Cart",
  //   loadingText: "Loading cart...",
  // },
  {
    name: "Products",
    scope: "myProducts",
    description:
      "Loaded from the my-products remote app on port 3002 with paginated product data.",
    module: "./Products",
    loadingText: "Loading products...",
  },
] satisfies Array<{
  name: string;
  scope: keyof typeof remoteApps;
  description: string;
  module: string;
  loadingText: string;
}>;

function getRemoteEntryUrl(scope: keyof typeof remoteApps) {
  return `${remoteApps[scope].url}/_next/static/chunks/remoteEntry.js`;
}

export default function Home() {
  return (
    <main className="shell">
      <section className="intro">
        <p className="eyebrow">Host app</p>
        <h1>my-app</h1>
        <p>
          This app is the module federation host. Remote micro frontends are
          registered once in the federation config and rendered as independent
          sections here.
        </p>
      </section>

      <section className="remote-grid" aria-label="Micro frontends">
        {microFrontends.map(({ name, scope, description, module, loadingText }) => (
          <article className="remote-panel" key={scope}>
            <div className="remote-panel-header">
              <div>
                <p className="eyebrow">{scope}</p>
                <h2>{name}</h2>
              </div>
              <span>Remote</span>
            </div>
            <p>{description}</p>
            <FederatedRemote
              global={remoteApps[scope].global}
              loadingText={loadingText}
              module={module}
              remoteEntryUrl={getRemoteEntryUrl(scope)}
            />
          </article>
        ))}
      </section>
    </main>
  );
}
