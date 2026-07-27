import { useEffect, useState } from "react";
import {
  getWishlist,
  removeWishlist,
} from "../api/wishlistApi";
import { addToCart } from "../api/cartApi";

const Wishlist = () => {
  const [items, setItems] = useState([]);

  const user = JSON.parse(localStorage.getItem("user"));

  const loadWishlist = async () => {
    if (!user) return;

    try {
      const data = await getWishlist(user._id);
      setItems(data);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    loadWishlist();
  }, []);

  const moveToCart = async (item) => {
    try {
      await addToCart(item.productId._id);
      await removeWishlist(item._id);

      loadWishlist();

      window.dispatchEvent(new Event("cartUpdated"));

      alert("Moved to Cart 🛒");
    } catch (err) {
      console.log(err);
      alert("Failed to move item");
    }
  };

  const removeItem = async (id) => {
    try {
      await removeWishlist(id);
      loadWishlist();
    } catch (err) {
      console.log(err);
    }
  };

  if (!user) {
    return (
      <div className="max-w-7xl mx-auto py-20 text-center">
        <h1 className="text-3xl font-bold">
          Please login to view your wishlist.
        </h1>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto py-12 px-6">

      <h1 className="text-4xl font-bold mb-10">
        My Wishlist
      </h1>

      {items.length === 0 ? (
        <div className="text-center py-20">
          <h2 className="text-2xl font-bold">
            No wishlist items
          </h2>
          <p className="text-gray-500 mt-2">
            Start adding products you love ❤️
          </p>
        </div>
      ) : (
        items.map((item) => (
          <div
            key={item._id}
            className="flex flex-col md:flex-row justify-between items-center gap-6 border rounded-xl p-5 mb-5 shadow-sm"
          >
            <div className="flex items-center gap-5">
              <img
                src={item.productId.image}
                alt={item.productId.name}
                className="w-24 h-24 rounded-lg object-cover"
              />

              <div>
                <h2 className="font-bold text-xl">
                  {item.productId.name}
                </h2>

                <p className="text-gray-500">
                  ₹{item.productId.price}
                </p>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => moveToCart(item)}
                className="bg-black text-white px-5 py-2 rounded-lg hover:bg-gray-800"
              >
                Move to Cart
              </button>

              <button
                onClick={() => removeItem(item._id)}
                className="bg-red-600 text-white px-5 py-2 rounded-lg hover:bg-red-700"
              >
                Remove
              </button>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default Wishlist;