import mongoose from "mongoose";
import Wishlist from "../models/Wishlist.js";
import Product from "../models/Product.js";

// =========================
// Add Product to Wishlist
// =========================
export const addToWishlist = async (req, res) => {
  try {
    const { userId, productId } = req.body;

    if (!userId || !productId) {
      return res.status(400).json({
        message: "User ID and product ID are required",
      });
    }

    if (
      !mongoose.Types.ObjectId.isValid(userId) ||
      !mongoose.Types.ObjectId.isValid(productId)
    ) {
      return res.status(400).json({
        message: "Invalid user ID or product ID",
      });
    }

    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json({
        message: "Product not found",
      });
    }

    const exists = await Wishlist.findOne({
      userId,
      productId,
    });

    if (exists) {
      return res.status(400).json({
        message: "Already in wishlist",
      });
    }

    const wishlist = await Wishlist.create({
      userId,
      productId,
    });

    res.status(201).json(wishlist);
  } catch (err) {
    console.error("Add wishlist error:", err);

    res.status(500).json({
      message: err.message || "Failed to add to wishlist",
    });
  }
};

// =========================
// Get User Wishlist
// =========================
export const getWishlist = async (req, res) => {
  try {
    const { userId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({
        message: "Invalid user ID",
      });
    }

    const wishlist = await Wishlist.find({
      userId,
    })
      .populate("productId")
      .sort({ createdAt: -1 });

    const validItems = wishlist.filter(
      (item) => item.productId
    );

    res.status(200).json(validItems);
  } catch (err) {
    console.error("Get wishlist error:", err);

    res.status(500).json({
      message: err.message || "Failed to load wishlist",
    });
  }
};

// =========================
// Remove Wishlist Item
// =========================
export const removeWishlistItem = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        message: "Invalid wishlist item ID",
      });
    }

    const item = await Wishlist.findByIdAndDelete(id);

    if (!item) {
      return res.status(404).json({
        message: "Wishlist item not found",
      });
    }

    res.status(200).json({
      message: "Removed successfully",
    });
  } catch (err) {
    console.error("Remove wishlist error:", err);

    res.status(500).json({
      message:
        err.message || "Failed to remove wishlist item",
    });
  }
};

// =========================
// Clear User Wishlist
// =========================
export const clearWishlist = async (req, res) => {
  try {
    const { userId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({
        message: "Invalid user ID",
      });
    }

    await Wishlist.deleteMany({
      userId,
    });

    res.status(200).json({
      message: "Wishlist cleared",
    });
  } catch (err) {
    console.error("Clear wishlist error:", err);

    res.status(500).json({
      message: err.message || "Failed to clear wishlist",
    });
  }
};