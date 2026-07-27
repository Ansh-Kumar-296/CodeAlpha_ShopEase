import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Menu,
  X,
  ShoppingCart,
  Heart,
  Shield,
  Users,
} from "lucide-react";

import { getCart } from "../api/cartApi";

function Navbar() {
  const navigate = useNavigate();

  const [keyword, setKeyword] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);
  const [cartCount, setCartCount] = useState(0);

  const user = JSON.parse(localStorage.getItem("user"));
  const isAdmin = user?.role === "admin";

  const loadCartCount = async () => {
    try {
      if (!user || isAdmin) {
        setCartCount(0);
        return;
      }

      const data = await getCart();

      if (data.items && Array.isArray(data.items)) {
        const total = data.items.reduce(
          (sum, item) => sum + item.quantity,
          0
        );

        setCartCount(total);
      } else {
        setCartCount(0);
      }
    } catch (err) {
      console.log(err);
      setCartCount(0);
    }
  };

  useEffect(() => {
    loadCartCount();

    window.addEventListener("cartUpdated", loadCartCount);

    return () => {
      window.removeEventListener(
        "cartUpdated",
        loadCartCount
      );
    };
  }, []);

  const handleSearch = (e) => {
    if (e.key === "Enter") {
      const value = keyword.trim();

      if (value === "") {
        navigate("/");
      } else {
        navigate(
          `/?search=${encodeURIComponent(value)}`
        );
      }

      setMenuOpen(false);
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.location.href = "/";
  };

  return (
    <nav className="sticky top-0 z-50 bg-black/90 backdrop-blur-xl border-b border-zinc-800 shadow-lg">
      <div className="max-w-7xl mx-auto h-20 px-6 flex items-center justify-between">
        {/* Logo */}
        <Link
          to={isAdmin ? "/dashboard" : "/"}
          className="text-4xl font-extrabold text-white"
        >
          ShopEase
        </Link>

        {/* Search */}
        {!isAdmin && (
          <div className="hidden lg:flex flex-1 justify-center px-10">
            <input
              type="text"
              placeholder="Search products..."
              value={keyword}
              onChange={(e) =>
                setKeyword(e.target.value)
              }
              onKeyDown={handleSearch}
              className="w-full max-w-xl bg-zinc-900 border border-zinc-700 rounded-xl px-5 py-3 text-white outline-none focus:border-white"
            />
          </div>
        )}

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-5">
          {!isAdmin && (
            <>
              <Link
                to="/"
                className="text-white hover:text-gray-300"
              >
                Home
              </Link>

              <Link
                to="/"
                className="text-white hover:text-gray-300"
              >
                Shop
              </Link>

              {user && (
                <>
                  <Link
                    to="/wishlist"
                    className="flex items-center gap-2 text-white hover:text-gray-300"
                  >
                    <Heart size={18} />
                    Wishlist
                  </Link>

                  <Link
                    to="/orders"
                    className="text-white hover:text-gray-300"
                  >
                    My Orders
                  </Link>
                </>
              )}

              <Link
                to="/cart"
                className="relative flex items-center gap-2 bg-white text-black px-5 py-2 rounded-xl hover:bg-gray-200 transition"
              >
                <ShoppingCart size={18} />
                Cart

                {cartCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs font-bold h-6 w-6 rounded-full flex items-center justify-center">
                    {cartCount}
                  </span>
                )}
              </Link>
            </>
          )}

          {isAdmin && (
            <>
              <Link
                to="/dashboard"
                className="flex items-center gap-2 bg-blue-600 text-white px-5 py-2 rounded-xl hover:bg-blue-700 transition"
              >
                <Shield size={18} />
                Admin
              </Link>

              <Link
                to="/dashboard"
                className="text-white hover:text-gray-300"
              >
                Dashboard
              </Link>

              <Link
                to="/admin"
                className="text-white hover:text-gray-300"
              >
                Products
              </Link>

              <Link
                to="/admin/orders"
                className="text-white hover:text-gray-300"
              >
                Orders
              </Link>

              <Link
                to="/admin/users"
                className="flex items-center gap-2 text-white hover:text-gray-300"
              >
                <Users size={18} />
                Users
              </Link>
            </>
          )}

          {user ? (
            <>
              <span className="text-white font-semibold">
                Hi, {user.name}
              </span>

              <button
                onClick={logout}
                className="bg-red-600 hover:bg-red-700 text-white px-5 py-2 rounded-xl transition"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="text-white border border-zinc-700 px-5 py-2 rounded-xl hover:border-white"
              >
                Login
              </Link>

              <Link
                to="/register"
                className="bg-white text-black px-5 py-2 rounded-xl hover:bg-gray-200"
              >
                Register
              </Link>
            </>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="md:hidden text-white"
        >
          {menuOpen ? (
            <X size={30} />
          ) : (
            <Menu size={30} />
          )}
        </button>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden bg-zinc-950 border-t border-zinc-800 px-6 py-6 space-y-5">
          {!isAdmin && (
            <input
              type="text"
              placeholder="Search..."
              value={keyword}
              onChange={(e) =>
                setKeyword(e.target.value)
              }
              onKeyDown={handleSearch}
              className="w-full bg-zinc-900 border border-zinc-700 rounded-xl px-4 py-3 text-white"
            />
          )}

          {!isAdmin && (
            <>
              <Link
                to="/"
                onClick={() => setMenuOpen(false)}
                className="block text-white"
              >
                Home
              </Link>

              <Link
                to="/"
                onClick={() => setMenuOpen(false)}
                className="block text-white"
              >
                Shop
              </Link>

              {user && (
                <>
                  <Link
                    to="/wishlist"
                    onClick={() =>
                      setMenuOpen(false)
                    }
                    className="block text-white"
                  >
                    Wishlist
                  </Link>

                  <Link
                    to="/orders"
                    onClick={() =>
                      setMenuOpen(false)
                    }
                    className="block text-white"
                  >
                    My Orders
                  </Link>
                </>
              )}

              <Link
                to="/cart"
                onClick={() => setMenuOpen(false)}
                className="flex justify-between items-center bg-white text-black px-4 py-3 rounded-xl"
              >
                <div className="flex items-center gap-2">
                  <ShoppingCart size={18} />
                  Cart
                </div>

                {cartCount > 0 && (
                  <span className="bg-red-600 text-white text-xs font-bold h-6 w-6 rounded-full flex items-center justify-center">
                    {cartCount}
                  </span>
                )}
              </Link>
            </>
          )}

          {isAdmin && (
            <>
              <Link
                to="/dashboard"
                onClick={() => setMenuOpen(false)}
                className="flex items-center gap-2 bg-blue-600 text-white px-4 py-3 rounded-xl"
              >
                <Shield size={18} />
                Admin Dashboard
              </Link>

              <Link
                to="/admin"
                onClick={() => setMenuOpen(false)}
                className="block text-white"
              >
                Manage Products
              </Link>

              <Link
                to="/admin/orders"
                onClick={() => setMenuOpen(false)}
                className="block text-white"
              >
                Manage Orders
              </Link>

              <Link
                to="/admin/users"
                onClick={() => setMenuOpen(false)}
                className="flex items-center gap-2 text-white"
              >
                <Users size={18} />
                Manage Users
              </Link>
            </>
          )}

          {user ? (
            <>
              <div className="text-white font-semibold">
                Hi, {user.name}
              </div>

              <button
                onClick={logout}
                className="w-full bg-red-600 text-white py-3 rounded-xl hover:bg-red-700"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                onClick={() => setMenuOpen(false)}
                className="block text-center border border-zinc-700 text-white py-3 rounded-xl"
              >
                Login
              </Link>

              <Link
                to="/register"
                onClick={() => setMenuOpen(false)}
                className="block text-center bg-white text-black py-3 rounded-xl"
              >
                Register
              </Link>
            </>
          )}
        </div>
      )}
    </nav>
  );
}

export default Navbar;