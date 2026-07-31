import mongoose from "mongoose";
import User from "../models/User.js";

// =========================
// Get All Users
// =========================
export const getUsers = async (req, res) => {
  try {
    const users = await User.find()
      .select("-password")
      .sort({ createdAt: -1 });

    res.status(200).json(users);
  } catch (error) {
    console.error("Get users error:", error);

    res.status(500).json({
      message: error.message || "Failed to load users",
    });
  }
};

// =========================
// Delete User
// =========================
export const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        message: "Invalid user ID",
      });
    }

    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    if (user.role === "admin") {
      return res.status(400).json({
        message: "Admin account cannot be deleted",
      });
    }

    await User.findByIdAndDelete(id);

    res.status(200).json({
      message: "User deleted successfully",
    });
  } catch (error) {
    console.error("Delete user error:", error);

    res.status(500).json({
      message: error.message || "Failed to delete user",
    });
  }
};