import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  getCart,
  removeCart,
  increaseQty,
  decreaseQty,
} from "../api/cartApi";

const Cart = () => {
  const [cart, setCart] = useState({
    items: [],
    subtotal: 0,
    shipping: 0,
    tax: 0,
    total: 0,
  });

  const loadCart = async () => {
    try {
      const data = await getCart();
      setCart(data);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    loadCart();

    const updateCart = () => {
      loadCart();
    };

    window.addEventListener("cartUpdated", updateCart);

    return () => {
      window.removeEventListener("cartUpdated", updateCart);
    };
  }, []);

  const handleIncrease = async (id) => {
    await increaseQty(id);
    await loadCart();
    window.dispatchEvent(new Event("cartUpdated"));
  };

  const handleDecrease = async (id) => {
    await decreaseQty(id);
    await loadCart();
    window.dispatchEvent(new Event("cartUpdated"));
  };

  const deleteItem = async (id) => {
    await removeCart(id);
    await loadCart();
    window.dispatchEvent(new Event("cartUpdated"));
  };

  return (
    <div className="max-w-7xl mx-auto px-8 py-12 grid md:grid-cols-3 gap-10">

      {/* Cart Items */}
      <div className="md:col-span-2">
        <h1 className="text-4xl font-bold mb-8">
          Shopping Cart
        </h1>

        {cart.items.length === 0 ? (
          <div className="bg-gray-100 rounded-xl p-10 text-center shadow">
            <h2 className="text-3xl font-bold mb-3">
              Your cart is empty 🛒
            </h2>

            <p className="text-gray-500 mb-6">
              Add some amazing products to get started.
            </p>

            <Link
              to="/"
              className="inline-block bg-black text-white px-6 py-3 rounded-xl hover:bg-gray-800 transition"
            >
              Continue Shopping
            </Link>
          </div>
        ) : (
          cart.items.map((item) => (
            <div
              key={item._id}
              className="flex flex-col md:flex-row items-center gap-6 border rounded-xl p-5 mb-5 shadow hover:shadow-lg transition"
            >
              <img
                src={item.productId.image}
                alt={item.productId.name}
                className="w-32 h-32 object-cover rounded-lg"
              />

              <div className="flex-1">
                <h2 className="text-2xl font-bold">
                  {item.productId.name}
                </h2>

                <p className="text-gray-500 mt-1">
                  {item.productId.description}
                </p>

                <h3 className="text-xl font-semibold mt-3">
                  ₹{item.productId.price}
                </h3>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={() => handleDecrease(item._id)}
                  className="bg-gray-200 hover:bg-gray-300 w-10 h-10 rounded-lg text-xl"
                >
                  -
                </button>

                <span className="text-xl font-bold">
                  {item.quantity}
                </span>

                <button
                  onClick={() => handleIncrease(item._id)}
                  className="bg-gray-200 hover:bg-gray-300 w-10 h-10 rounded-lg text-xl"
                >
                  +
                </button>
              </div>

              <button
                onClick={() => deleteItem(item._id)}
                className="bg-red-600 hover:bg-red-700 text-white px-5 py-2 rounded-lg"
              >
                Remove
              </button>
            </div>
          ))
        )}
      </div>

      {/* Order Summary */}
      <div className="border rounded-xl p-6 shadow-lg h-fit sticky top-28">

        <h2 className="text-3xl font-bold mb-6">
          Order Summary
        </h2>

        <div className="flex justify-between mb-3">
          <span>Subtotal</span>
          <span>₹{cart.subtotal}</span>
        </div>

        <div className="flex justify-between mb-3">
          <span>Shipping</span>
          <span>₹{cart.shipping}</span>
        </div>

        <div className="flex justify-between mb-3">
          <span>Tax (5%)</span>
          <span>₹{cart.tax}</span>
        </div>

        <hr className="my-4" />

        <div className="flex justify-between text-2xl font-bold">
          <span>Total</span>
          <span>₹{cart.total}</span>
        </div>

        {cart.items.length > 0 ? (
          <Link to="/checkout">
            <button className="w-full mt-8 bg-black hover:bg-gray-800 text-white py-3 rounded-xl transition">
              Proceed to Checkout
            </button>
          </Link>
        ) : (
          <button
            disabled
            className="w-full mt-8 bg-gray-400 text-white py-3 rounded-xl cursor-not-allowed"
          >
            Cart is Empty
          </button>
        )}
      </div>

    </div>
  );
};

export default Cart;