import mongoose from "mongoose";
import Cart from "../models/Cart.js";
import Product from "../models/Product.js";

// =========================
// Get User Cart
// =========================
export const getCart = async (req, res) => {
  try {
    const { userId } = req.query;

    if (!userId) {
      return res.status(400).json({
        message: "User ID is required",
      });
    }

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({
        message: "Invalid user ID",
      });
    }

    const cart = await Cart.find({ userId }).populate(
      "productId"
    );

    const validItems = cart.filter(
      (item) => item.productId
    );

    let subtotal = 0;

    validItems.forEach((item) => {
      subtotal +=
        Number(item.productId.price || 0) *
        Number(item.quantity || 0);
    });

    const shipping =
      subtotal === 0 || subtotal >= 5000 ? 0 : 99;

    const tax =
      subtotal === 0
        ? 0
        : Math.round(subtotal * 0.05);

    const total = subtotal + shipping + tax;

    res.status(200).json({
      items: validItems,
      subtotal,
      shipping,
      tax,
      total,
    });
  } catch (err) {
    console.error("Get cart error:", err);

    res.status(500).json({
      message: err.message || "Failed to load cart",
    });
  }
};

// =========================
// Add Product to Cart
// =========================
export const addToCart = async (req, res) => {
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

    if (product.stock <= 0) {
      return res.status(400).json({
        message: "Product is out of stock",
      });
    }

    let cartItem = await Cart.findOne({
      userId,
      productId,
    });

    if (cartItem) {
      if (cartItem.quantity >= product.stock) {
        return res.status(400).json({
          message: "Cannot add more than available stock",
        });
      }

      cartItem.quantity += 1;
      await cartItem.save();

      return res.status(200).json(cartItem);
    }

    cartItem = await Cart.create({
      userId,
      productId,
      quantity: 1,
    });

    res.status(201).json(cartItem);
  } catch (err) {
    console.error("Add to cart error:", err);

    res.status(500).json({
      message: err.message || "Failed to add product",
    });
  }
};

// =========================
// Increase Quantity
// =========================
export const increaseQty = async (req, res) => {
  try {
    const cartItem = await Cart.findById(
      req.params.id
    ).populate("productId");

    if (!cartItem) {
      return res.status(404).json({
        message: "Cart item not found",
      });
    }

    if (!cartItem.productId) {
      return res.status(404).json({
        message: "Product not found",
      });
    }

    if (
      cartItem.quantity >= cartItem.productId.stock
    ) {
      return res.status(400).json({
        message: "Maximum available stock reached",
      });
    }

    cartItem.quantity += 1;
    await cartItem.save();

    res.status(200).json(cartItem);
  } catch (err) {
    console.error("Increase quantity error:", err);

    res.status(500).json({
      message:
        err.message || "Failed to increase quantity",
    });
  }
};

// =========================
// Decrease Quantity
// =========================
export const decreaseQty = async (req, res) => {
  try {
    const cartItem = await Cart.findById(
      req.params.id
    );

    if (!cartItem) {
      return res.status(404).json({
        message: "Cart item not found",
      });
    }

    if (cartItem.quantity > 1) {
      cartItem.quantity -= 1;
      await cartItem.save();
    }

    res.status(200).json(cartItem);
  } catch (err) {
    console.error("Decrease quantity error:", err);

    res.status(500).json({
      message:
        err.message || "Failed to decrease quantity",
    });
  }
};

// =========================
// Remove Cart Item
// =========================
export const removeCartItem = async (req, res) => {
  try {
    const cartItem = await Cart.findByIdAndDelete(
      req.params.id
    );

    if (!cartItem) {
      return res.status(404).json({
        message: "Cart item not found",
      });
    }

    res.status(200).json({
      message: "Cart item removed successfully",
    });
  } catch (err) {
    console.error("Remove cart item error:", err);

    res.status(500).json({
      message:
        err.message || "Failed to remove cart item",
    });
  }
};