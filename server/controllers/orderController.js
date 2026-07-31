import mongoose from "mongoose";

import Order from "../models/Order.js";
import Cart from "../models/Cart.js";
import Product from "../models/Product.js";

// =========================
// Place Order
// =========================
export const placeOrder = async (req, res) => {
  try {
    const {
      userId,
      shippingAddress,
      paymentMethod,
    } = req.body;

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

    if (
      !shippingAddress?.fullName ||
      !shippingAddress?.phone ||
      !shippingAddress?.address ||
      !shippingAddress?.city ||
      !shippingAddress?.state ||
      !shippingAddress?.pincode
    ) {
      return res.status(400).json({
        message: "Complete shipping address is required",
      });
    }

    const cartItems = await Cart.find({
      userId,
    }).populate("productId");

    const validCartItems = cartItems.filter(
      (item) => item.productId
    );

    if (validCartItems.length === 0) {
      return res.status(400).json({
        message: "Cart is empty",
      });
    }

    for (const item of validCartItems) {
      if (item.productId.stock < item.quantity) {
        return res.status(400).json({
          message: `Only ${item.productId.stock} unit(s) of ${item.productId.name} are available`,
        });
      }
    }

    const products = validCartItems.map((item) => ({
      productId: item.productId._id,
      quantity: item.quantity,
      price: Number(item.productId.price),
    }));

    const subtotal = validCartItems.reduce(
      (sum, item) =>
        sum +
        Number(item.productId.price) *
          Number(item.quantity),
      0
    );

    // Same shipping rule as cart controller
    const shipping =
      subtotal === 0 || subtotal >= 5000 ? 0 : 99;

    const tax =
      subtotal === 0
        ? 0
        : Math.round(subtotal * 0.05);

    const total = subtotal + shipping + tax;

    const order = await Order.create({
      userId,
      products,
      shippingAddress,
      subtotal,
      shipping,
      tax,
      total,
      paymentMethod: paymentMethod || "COD",
    });

    for (const item of validCartItems) {
      await Product.findByIdAndUpdate(
        item.productId._id,
        {
          $inc: {
            stock: -item.quantity,
          },
        }
      );
    }

    await Cart.deleteMany({
      userId,
    });

    res.status(201).json(order);
  } catch (err) {
    console.error("Place order error:", err);

    res.status(500).json({
      message: err.message || "Failed to place order",
    });
  }
};

// =========================
// Get Logged-in User Orders
// =========================
export const getMyOrders = async (req, res) => {
  try {
    const { userId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({
        message: "Invalid user ID",
      });
    }

    const orders = await Order.find({
      userId,
    })
      .populate("products.productId")
      .sort({ createdAt: -1 });

    res.status(200).json(orders);
  } catch (err) {
    console.error("Get user orders error:", err);

    res.status(500).json({
      message:
        err.message || "Failed to load user orders",
    });
  }
};

// =========================
// Get All Orders (Admin)
// =========================
export const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate("userId", "name email")
      .populate("products.productId")
      .sort({ createdAt: -1 });

    res.status(200).json(orders);
  } catch (err) {
    console.error("Get all orders error:", err);

    res.status(500).json({
      message: err.message || "Failed to load orders",
    });
  }
};

// =========================
// Update Order Status (Admin)
// =========================
export const updateOrderStatus = async (
  req,
  res
) => {
  try {
    const { orderStatus } = req.body;

    const allowedStatuses = [
      "Pending",
      "Processing",
      "Shipped",
      "Delivered",
      "Cancelled",
    ];

    if (!allowedStatuses.includes(orderStatus)) {
      return res.status(400).json({
        message: "Invalid order status",
      });
    }

    if (
      !mongoose.Types.ObjectId.isValid(req.params.id)
    ) {
      return res.status(400).json({
        message: "Invalid order ID",
      });
    }

    const order = await Order.findByIdAndUpdate(
      req.params.id,
      {
        orderStatus,
      },
      {
        new: true,
        runValidators: true,
      }
    );

    if (!order) {
      return res.status(404).json({
        message: "Order not found",
      });
    }

    res.status(200).json(order);
  } catch (err) {
    console.error("Update order status error:", err);

    res.status(500).json({
      message:
        err.message || "Failed to update order status",
    });
  }
};