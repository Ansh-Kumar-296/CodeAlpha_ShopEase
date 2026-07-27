import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getCart } from "../api/cartApi";
import { placeOrder } from "../api/orderApi";

const Checkout = () => {
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("user"));

  const [cart, setCart] = useState({
    items: [],
    subtotal: 0,
    shipping: 0,
    tax: 0,
    total: 0,
  });

  const [address, setAddress] = useState({
    fullName: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
    country: "India",
  });

  useEffect(() => {
    loadCart();
  }, []);

  const loadCart = async () => {
    const data = await getCart();
    setCart(data);
  };

  const handleChange = (e) => {
    setAddress({
      ...address,
      [e.target.name]: e.target.value,
    });
  };

  const handleOrder = async () => {
    try {
      await placeOrder({
        userId: user._id,
        shippingAddress: address,
        paymentMethod: "COD",
      });

      alert("Order Placed Successfully 🎉");

      navigate("/orders");
    } catch (err) {
      console.log(err);
      alert("Failed to place order");
    }
  };

  return (
    <div className="max-w-7xl mx-auto py-10 px-6 grid md:grid-cols-2 gap-10">

      <div>

        <h1 className="text-4xl font-bold mb-8">
          Shipping Address
        </h1>

        {[
          "fullName",
          "phone",
          "address",
          "city",
          "state",
          "pincode",
        ].map((field) => (
          <input
            key={field}
            name={field}
            placeholder={field}
            onChange={handleChange}
            className="w-full border rounded-lg p-3 mb-4"
          />
        ))}

      </div>

      <div className="border rounded-xl p-6 shadow">

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
          <span>Tax</span>
          <span>₹{cart.tax}</span>
        </div>

        <hr className="my-4" />

        <div className="flex justify-between text-2xl font-bold">
          <span>Total</span>
          <span>₹{cart.total}</span>
        </div>

        <button
          onClick={handleOrder}
          className="w-full mt-8 bg-black text-white py-3 rounded-xl"
        >
          Place Order (Cash on Delivery)
        </button>

      </div>

    </div>
  );
};

export default Checkout;