import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Heart } from "lucide-react";

import { getProduct } from "../api/productApi";
import { addToCart } from "../api/cartApi";
import { addWishlist } from "../api/wishlistApi";
import {
  getReviews,
  addReview,
} from "../api/reviewApi";

const ProductDetails = () => {
  const { id } = useParams();

  const [product, setProduct] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [reviewLoading, setReviewLoading] =
    useState(false);

  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");

  const user = JSON.parse(
    localStorage.getItem("user")
  );

  useEffect(() => {
    loadProduct();
    loadReviews();
  }, [id]);

  const loadProduct = async () => {
    try {
      const data = await getProduct(id);
      setProduct(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const loadReviews = async () => {
    try {
      const data = await getReviews(id);

      setReviews(
        Array.isArray(data) ? data : []
      );
    } catch (err) {
      console.error(err);
      setReviews([]);
    }
  };

  const handleAddToCart = async () => {
    if (!user) {
      alert("Please login first");
      return;
    }

    try {
      await addToCart(product._id);

      window.dispatchEvent(
        new Event("cartUpdated")
      );

      alert("Product added to Cart 🛒");
    } catch (err) {
      console.error(err);

      alert(
        err.response?.data?.message ||
          "Failed to add product"
      );
    }
  };

  const handleWishlist = async () => {
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

  const handleReview = async () => {
    if (!user) {
      alert("Please login first");
      return;
    }

    if (!user._id) {
      alert(
        "User information is missing. Please logout and login again."
      );
      return;
    }

    if (!user.name) {
      alert(
        "User name is missing. Please logout and login again."
      );
      return;
    }

    if (!comment.trim()) {
      alert("Write a review");
      return;
    }

    try {
      setReviewLoading(true);

      await addReview({
        productId: id,
        userId: user._id,
        name: user.name,
        rating: Number(rating),
        comment: comment.trim(),
      });

      alert("Review added successfully ⭐");

      setComment("");
      setRating(5);

      await Promise.all([
        loadProduct(),
        loadReviews(),
      ]);
    } catch (err) {
      console.error(
        "Review submission error:",
        err.response?.data || err
      );

      alert(
        err.response?.data?.message ||
          "Failed to submit review"
      );
    } finally {
      setReviewLoading(false);
    }
  };

  if (loading) {
    return (
      <h1 className="text-center text-2xl mt-20">
        Loading...
      </h1>
    );
  }

  if (!product) {
    return (
      <h1 className="text-center text-2xl mt-20">
        Product not found
      </h1>
    );
  }

  const displayedRating = Number(
    product.rating || 0
  ).toFixed(1);

  return (
    <div className="max-w-7xl mx-auto px-6 py-16">
      {/* Product */}
      <div className="grid md:grid-cols-2 gap-12">
        <div className="relative">
          <img
            src={product.image}
            alt={product.name}
            className="w-full rounded-2xl shadow-lg"
          />

          <button
            onClick={handleWishlist}
            className="absolute top-4 right-4 bg-white p-3 rounded-full shadow-lg hover:bg-red-500 hover:text-white transition"
          >
            <Heart size={22} />
          </button>
        </div>

        <div className="flex flex-col justify-center">
          <span className="uppercase text-sm text-gray-500">
            {product.category}
          </span>

          <h1 className="text-5xl font-bold mt-2">
            {product.name}
          </h1>

          <p className="text-gray-600 mt-6 leading-7">
            {product.description}
          </p>

          <div className="flex items-center gap-3 mt-6">
            <span className="text-yellow-500 text-xl">
              ⭐
            </span>

            <span className="font-semibold">
              {displayedRating} / 5
            </span>

            <span className="text-gray-500">
              ({product.numReviews || 0} Reviews)
            </span>
          </div>

          <h2 className="text-4xl font-bold mt-8">
            ₹{product.price}
          </h2>

          <p className="mt-3">
            Stock:{" "}
            <span className="font-semibold">
              {product.stock}
            </span>
          </p>

          <div className="flex gap-4 mt-10">
            <button
              onClick={handleAddToCart}
              disabled={product.stock <= 0}
              className="bg-black hover:bg-gray-800 disabled:bg-gray-400 text-white px-8 py-4 rounded-xl transition"
            >
              {product.stock > 0
                ? "Add To Cart"
                : "Out of Stock"}
            </button>

            <button
              onClick={handleWishlist}
              className="border-2 border-red-500 text-red-500 hover:bg-red-500 hover:text-white px-6 py-4 rounded-xl transition"
            >
              <Heart size={20} />
            </button>
          </div>
        </div>
      </div>

      {/* Review Form */}
      {user ? (
        <div className="mt-20 border rounded-2xl p-8 shadow">
          <h2 className="text-3xl font-bold mb-6">
            Write a Review
          </h2>

          <select
            value={rating}
            onChange={(e) =>
              setRating(Number(e.target.value))
            }
            className="w-full border rounded-lg p-3 mb-4"
          >
            <option value={5}>
              ⭐⭐⭐⭐⭐ 5 Stars
            </option>

            <option value={4}>
              ⭐⭐⭐⭐ 4 Stars
            </option>

            <option value={3}>
              ⭐⭐⭐ 3 Stars
            </option>

            <option value={2}>
              ⭐⭐ 2 Stars
            </option>

            <option value={1}>
              ⭐ 1 Star
            </option>
          </select>

          <textarea
            rows="5"
            value={comment}
            onChange={(e) =>
              setComment(e.target.value)
            }
            placeholder="Write your review..."
            className="w-full border rounded-lg p-3"
          />

          <button
            onClick={handleReview}
            disabled={reviewLoading}
            className="mt-5 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white px-8 py-3 rounded-lg"
          >
            {reviewLoading
              ? "Submitting..."
              : "Submit Review"}
          </button>
        </div>
      ) : (
        <div className="mt-20 border rounded-2xl p-8 text-center">
          <p className="text-gray-600">
            Please login to submit a review.
          </p>
        </div>
      )}

      {/* Customer Reviews */}
      <div className="mt-20">
        <h2 className="text-3xl font-bold mb-8">
          Customer Reviews
        </h2>

        {reviews.length === 0 ? (
          <div className="border rounded-xl p-8 text-center text-gray-500">
            No reviews yet.
          </div>
        ) : (
          reviews.map((review) => (
            <div
              key={review._id}
              className="border rounded-xl p-6 mb-5 shadow-sm"
            >
              <div className="flex justify-between">
                <h3 className="font-bold text-lg">
                  {review.name}
                </h3>

                <span className="text-yellow-500 font-semibold">
                  ⭐ {review.rating}
                </span>
              </div>

              <p className="text-gray-700 mt-3">
                {review.comment}
              </p>

              <p className="text-sm text-gray-400 mt-3">
                {new Date(
                  review.createdAt
                ).toLocaleDateString()}
              </p>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ProductDetails;