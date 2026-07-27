import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";

import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import Products from "./components/Products";
import ProtectedRoute from "./components/ProtectedRoute";

import Dashboard from "./pages/Dashboard";
import Admin from "./pages/Admin";
import AdminOrders from "./pages/AdminOrders";
import Users from "./pages/Users";
import ProductDetails from "./pages/ProductDetails";
import Cart from "./pages/Cart";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Checkout from "./pages/Checkout";
import MyOrders from "./pages/MyOrders";
import Wishlist from "./pages/Wishlist";

function Home() {
  return (
    <>
      <Hero />
      <Products />
    </>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Navbar />

      <Routes>
        {/* Home */}
        <Route path="/" element={<Home />} />

        {/* Product Details */}
        <Route
          path="/product/:id"
          element={<ProductDetails />}
        />

        {/* Cart */}
        <Route
          path="/cart"
          element={<Cart />}
        />

        {/* Wishlist */}
        <Route
          path="/wishlist"
          element={
            <ProtectedRoute>
              <Wishlist />
            </ProtectedRoute>
          }
        />

        {/* Authentication */}
        <Route
          path="/login"
          element={<Login />}
        />

        <Route
          path="/register"
          element={<Register />}
        />

        {/* Checkout */}
        <Route
          path="/checkout"
          element={
            <ProtectedRoute>
              <Checkout />
            </ProtectedRoute>
          }
        />

        {/* User Orders */}
        <Route
          path="/orders"
          element={
            <ProtectedRoute>
              <MyOrders />
            </ProtectedRoute>
          }
        />

        {/* Admin Dashboard */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute adminOnly={true}>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        {/* Product Management */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute adminOnly={true}>
              <Admin />
            </ProtectedRoute>
          }
        />

        {/* Order Management */}
        <Route
          path="/admin/orders"
          element={
            <ProtectedRoute adminOnly={true}>
              <AdminOrders />
            </ProtectedRoute>
          }
        />

        {/* User Management */}
        <Route
          path="/admin/users"
          element={
            <ProtectedRoute adminOnly={true}>
              <Users />
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;