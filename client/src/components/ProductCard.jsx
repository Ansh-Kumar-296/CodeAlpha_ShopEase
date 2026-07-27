import { Link } from "react-router-dom";
import {
  Heart,
  ShoppingCart,
  Star,
} from "lucide-react";

import { addToCart } from "../api/cartApi";
import { addWishlist } from "../api/wishlistApi";

const ProductCard = ({ product }) => {
  const user = JSON.parse(
    localStorage.getItem("user")
  );

  const handleCart = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!user) {
      alert("Please login first");
      return;
    }

    if (product.stock <= 0) {
      alert("Product is out of stock");
      return;
    }

    try {
      await addToCart(product._id);

      window.dispatchEvent(
        new Event("cartUpdated")
      );

      alert("Added to Cart 🛒");
    } catch (err) {
      console.error(err);

      alert(
        err.response?.data?.message ||
          "Failed to add product"
      );
    }
  };

  const handleWishlist = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!user) {
      alert("Please login first");
      return;
    }

    try {
      await addWishlist({
        userId: user._id,
        productId: product._id,
      });

      alert("Added to Wishlist ❤️");
    } catch (err) {
      console.error(err);

      alert(
        err.response?.data?.message ||
          "Already in Wishlist"
      );
    }
  };

  const rating = Number(product.rating || 0);

  return (
    <Link
      to={`/product/${product._id}`}
      className="block h-full"
    >
      <article className="relative h-full bg-white border border-zinc-200 rounded-2xl shadow-md overflow-hidden hover:-translate-y-1 hover:shadow-xl transition duration-300 flex flex-col">
        {/* Wishlist */}
        <button
          type="button"
          onClick={handleWishlist}
          className="absolute top-3 right-3 z-10 bg-white text-zinc-800 rounded-full p-2 shadow-md border border-zinc-200 hover:bg-red-500 hover:text-white hover:border-red-500 transition"
          aria-label="Add to wishlist"
        >
          <Heart size={20} />
        </button>

        {/* Product Image */}
        <div className="h-60 bg-zinc-100 overflow-hidden">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-contain p-3 hover:scale-105 transition duration-300"
          />
        </div>

        {/* Product Information */}
        <div className="p-5 flex flex-col flex-1">
          <p className="text-xs font-semibold uppercase tracking-wide text-blue-600 mb-2">
            {product.category || "Product"}
          </p>

          <h2 className="text-lg font-bold text-zinc-900 line-clamp-2 min-h-[56px]">
            {product.name}
          </h2>

          <p className="text-sm text-zinc-600 mt-2 line-clamp-2 min-h-[40px] leading-5">
            {product.description}
          </p>

          {/* Rating */}
          <div className="flex items-center gap-2 mt-4">
            <Star
              size={18}
              className="fill-yellow-400 text-yellow-400"
            />

            <span className="text-sm font-semibold text-zinc-800">
              {rating.toFixed(1)}
            </span>

            <span className="text-xs text-zinc-500">
              ({product.numReviews || 0} Reviews)
            </span>
          </div>

          {/* Stock */}
          <p
            className={`text-sm font-semibold mt-3 ${
              product.stock > 0
                ? "text-green-600"
                : "text-red-600"
            }`}
          >
            {product.stock > 0
              ? `${product.stock} in stock`
              : "Out of stock"}
          </p>

          {/* Price and Cart */}
          <div className="flex items-center justify-between gap-3 mt-auto pt-5">
            <span className="font-extrabold text-2xl text-zinc-950">
              ₹{Number(product.price || 0).toLocaleString("en-IN")}
            </span>

            <button
              type="button"
              onClick={handleCart}
              disabled={product.stock <= 0}
              className="flex items-center gap-2 bg-black text-white px-4 py-2.5 rounded-xl hover:bg-zinc-800 disabled:bg-zinc-400 disabled:cursor-not-allowed transition whitespace-nowrap"
            >
              <ShoppingCart size={17} />

              {product.stock > 0
                ? "Add to Cart"
                : "Unavailable"}
            </button>
          </div>
        </div>
      </article>
    </Link>
  );
};

export default ProductCard;