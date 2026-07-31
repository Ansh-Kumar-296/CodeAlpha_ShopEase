import mongoose from "mongoose";
import Product from "../models/Product.js";

// ============================
// Get All Products
// ============================
export const getProducts = async (req, res) => {
  try {
    const {
      search = "",
      category = "All",
      sort = "newest",
      minPrice,
      maxPrice,
    } = req.query;

    const filter = {};
    const searchText = search.trim();

    if (searchText) {
      filter.$or = [
        {
          name: {
            $regex: searchText,
            $options: "i",
          },
        },
        {
          description: {
            $regex: searchText,
            $options: "i",
          },
        },
        {
          category: {
            $regex: searchText,
            $options: "i",
          },
        },
      ];
    }

    if (category !== "All") {
      filter.category = category;
    }

    if (minPrice !== undefined || maxPrice !== undefined) {
      filter.price = {};

      if (
        minPrice !== undefined &&
        minPrice !== ""
      ) {
        filter.price.$gte = Number(minPrice);
      }

      if (
        maxPrice !== undefined &&
        maxPrice !== ""
      ) {
        filter.price.$lte = Number(maxPrice);
      }
    }

    let sortOption;

    switch (sort) {
      case "priceLow":
        sortOption = { price: 1 };
        break;

      case "priceHigh":
        sortOption = { price: -1 };
        break;

      case "rating":
        sortOption = { rating: -1 };
        break;

      case "popular":
        sortOption = { numReviews: -1 };
        break;

      case "oldest":
        sortOption = { createdAt: 1 };
        break;

      case "newest":
      default:
        sortOption = { createdAt: -1 };
        break;
    }

    const products = await Product.find(filter).sort(
      sortOption
    );

    res.status(200).json(products);
  } catch (error) {
    console.error("Get products error:", error);

    res.status(500).json({
      message:
        error.message || "Failed to load products",
    });
  }
};

// ============================
// Get Single Product
// ============================
export const getProductById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        message: "Invalid product ID",
      });
    }

    const product = await Product.findById(id);

    if (!product) {
      return res.status(404).json({
        message: "Product not found",
      });
    }

    res.status(200).json(product);
  } catch (error) {
    console.error("Get product error:", error);

    res.status(500).json({
      message:
        error.message || "Failed to load product",
    });
  }
};

// ============================
// Add Product
// ============================
export const addProduct = async (req, res) => {
  try {
    const {
      name,
      price,
      category,
      description,
      image,
      stock,
    } = req.body;

    if (
      !name ||
      price === undefined ||
      !category ||
      !description ||
      !image ||
      stock === undefined
    ) {
      return res.status(400).json({
        message: "All product fields are required",
      });
    }

    const product = await Product.create({
      name: name.trim(),
      price: Number(price),
      category: category.trim(),
      description: description.trim(),
      image: image.trim(),
      stock: Number(stock),
    });

    res.status(201).json(product);
  } catch (error) {
    console.error("Add product error:", error);

    res.status(500).json({
      message:
        error.message || "Failed to add product",
    });
  }
};

// ============================
// Update Product
// ============================
export const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        message: "Invalid product ID",
      });
    }

    const updateData = { ...req.body };

    if (updateData.price !== undefined) {
      updateData.price = Number(updateData.price);
    }

    if (updateData.stock !== undefined) {
      updateData.stock = Number(updateData.stock);
    }

    const product = await Product.findByIdAndUpdate(
      id,
      updateData,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!product) {
      return res.status(404).json({
        message: "Product not found",
      });
    }

    res.status(200).json(product);
  } catch (error) {
    console.error("Update product error:", error);

    res.status(500).json({
      message:
        error.message || "Failed to update product",
    });
  }
};

// ============================
// Delete Product
// ============================
export const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        message: "Invalid product ID",
      });
    }

    const product = await Product.findByIdAndDelete(id);

    if (!product) {
      return res.status(404).json({
        message: "Product not found",
      });
    }

    res.status(200).json({
      message: "Product deleted successfully",
    });
  } catch (error) {
    console.error("Delete product error:", error);

    res.status(500).json({
      message:
        error.message || "Failed to delete product",
    });
  }
};