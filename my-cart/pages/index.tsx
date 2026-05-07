import Cart from "../components/Cart";

export default function Home() {
  return (
    <main className="remote-shell">
      <section>
        <p className="cart-kicker">Standalone remote app</p>
        <h1>my-cart</h1>
        <p className="remote-copy">
          This page lets the cart remote run by itself while also exposing the
          same cart module to the host through module federation.
        </p>
      </section>
      <Cart />
    </main>
  );
}
