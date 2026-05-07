import ProductBrowser from "../components/ProductBrowser";

export default function Home() {
  return (
    <main className="products-remote-shell">
      <section>
        <p className="products-kicker">Standalone remote app</p>
        <h1>my-products</h1>
        <p className="products-copy">
          Browse paginated products from DummyJSON and inspect each selected
          product with a detail request from the remote module.
        </p>
      </section>
      <ProductBrowser />
    </main>
  );
}
