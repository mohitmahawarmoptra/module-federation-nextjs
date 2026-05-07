import dynamic from "next/dynamic";

const CartRemote = dynamic(() => import("myCart/Cart"), {
  ssr: false,
  loading: () => <div className="remote-loading">Loading cart...</div>,
});

const microFrontends = [
  {
    name: "Cart",
    scope: "myCart",
    description: "Loaded from the my-cart remote app on port 3001.",
    Component: CartRemote,
  },
];

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
        {microFrontends.map(({ name, scope, description, Component }) => (
          <article className="remote-panel" key={scope}>
            <div className="remote-panel-header">
              <div>
                <p className="eyebrow">{scope}</p>
                <h2>{name}</h2>
              </div>
              <span>Remote</span>
            </div>
            <p>{description}</p>
            <Component />
          </article>
        ))}
      </section>
    </main>
  );
}
