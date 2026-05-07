const cartItems = [
  { name: "Wireless Keyboard", quantity: 1, price: 74 },
  { name: "USB-C Hub", quantity: 2, price: 42 },
  { name: "Desk Mat", quantity: 1, price: 2900 },
];

export default function Cart() {
  const subtotal = cartItems.reduce(
    (total, item) => total + item.quantity * item.price,
    0
  );

  return (
    <div className="cart-card">
      <div className="cart-header">
        <div>
          <p className="cart-kicker">Remote micro frontend</p>
          <h3>my-cart</h3>
        </div>
        <strong>${subtotal}</strong>
      </div>

      <ul className="cart-list" aria-label="Cart items">
        {cartItems.map((item) => (
          <li key={item.name}>
            <span>
              {item.name}
              <small>Qty {item.quantity}</small>
            </span>
            <strong>${item.quantity * item.price}</strong>
          </li>
        ))}
      </ul>

      <button className="checkout-button" type="button">
        Checkout
      </button>
    </div>
  );
}
