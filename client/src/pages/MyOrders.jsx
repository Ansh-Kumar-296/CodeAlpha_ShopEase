import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Package } from "lucide-react";
import { getMyOrders } from "../api/orderApi";

const MyOrders = () => {
  const user = JSON.parse(localStorage.getItem("user"));

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    try {
      setLoading(true);
      setError("");

      if (!user?._id) {
        setError("Please log in again");
        setOrders([]);
        return;
      }

      const data = await getMyOrders(user._id);

      setOrders(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(
        "Failed to load orders:",
        err.response?.data || err
      );

      setError(
        err.response?.data?.message ||
          "Failed to load orders"
      );

      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  const getStatusClass = (status) => {
    switch (status) {
      case "Delivered":
        return "bg-green-100 text-green-700";

      case "Shipped":
        return "bg-blue-100 text-blue-700";

      case "Processing":
        return "bg-purple-100 text-purple-700";

      case "Cancelled":
        return "bg-red-100 text-red-700";

      default:
        return "bg-yellow-100 text-yellow-700";
    }
  };

  if (loading) {
    return (
      <div className="min-h-[calc(100vh-80px)] flex items-center justify-center">
        <h2 className="text-2xl font-semibold">
          Loading orders...
        </h2>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-[calc(100vh-80px)] flex items-center justify-center px-6">
        <div className="bg-red-50 border border-red-200 rounded-2xl p-8 text-center max-w-md w-full">
          <h2 className="text-2xl font-bold text-red-700">
            Unable to load orders
          </h2>

          <p className="text-red-600 mt-3">
            {error}
          </p>

          <button
            onClick={loadOrders}
            className="mt-6 bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-xl"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-80px)] bg-zinc-100">
      <div className="max-w-7xl mx-auto px-6 py-10">
        <div className="flex items-center gap-3 mb-8">
          <Package size={36} />

          <h1 className="text-4xl font-bold">
            My Orders
          </h1>
        </div>

        {orders.length === 0 ? (
          <div className="bg-white rounded-2xl p-12 text-center shadow-sm border border-zinc-200">
            <Package
              size={60}
              className="mx-auto text-zinc-400"
            />

            <h2 className="text-2xl font-bold mt-5">
              No Orders Yet 📦
            </h2>

            <p className="text-gray-500 mt-2">
              Start shopping to see your orders here.
            </p>

            <Link
              to="/"
              className="inline-block mt-6 bg-black text-white px-7 py-3 rounded-xl hover:bg-zinc-800"
            >
              Start Shopping
            </Link>
          </div>
        ) : (
          orders.map((order) => {
            const status =
              order.orderStatus || "Pending";

            const products = Array.isArray(
              order.products
            )
              ? order.products
              : [];

            return (
              <div
                key={order._id}
                className="bg-white border border-zinc-200 rounded-2xl shadow-sm p-6 mb-8"
              >
                <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-6">
                  <div>
                    <h2 className="text-xl font-bold">
                      Order #
                      {order._id
                        ?.slice(-6)
                        .toUpperCase()}
                    </h2>

                    <p className="text-gray-500 mt-1">
                      {order.createdAt
                        ? new Date(
                            order.createdAt
                          ).toLocaleString("en-IN")
                        : "Date unavailable"}
                    </p>
                  </div>

                  <span
                    className={`self-start md:self-auto px-4 py-2 rounded-full text-sm font-semibold ${getStatusClass(
                      status
                    )}`}
                  >
                    {status}
                  </span>
                </div>

                {products.length === 0 ? (
                  <div className="border rounded-xl p-6 text-center text-zinc-500">
                    No products found in this order
                  </div>
                ) : (
                  <div className="space-y-5">
                    {products.map((item, index) => {
                      const product =
                        item.productId;

                      return (
                        <div
                          key={
                            item._id ||
                            product?._id ||
                            index
                          }
                          className="flex flex-col sm:flex-row sm:items-center gap-5 border border-zinc-200 rounded-xl p-4"
                        >
                          {product?.image ? (
                            <img
                              src={product.image}
                              alt={
                                product.name ||
                                "Product"
                              }
                              className="w-24 h-24 object-cover rounded-lg"
                            />
                          ) : (
                            <div className="w-24 h-24 bg-zinc-200 rounded-lg flex items-center justify-center">
                              <Package
                                size={30}
                                className="text-zinc-500"
                              />
                            </div>
                          )}

                          <div className="flex-1">
                            <h3 className="text-xl font-bold">
                              {product?.name ||
                                "Product unavailable"}
                            </h3>

                            <p className="text-gray-500 mt-1">
                              Quantity:{" "}
                              {item.quantity || 0}
                            </p>

                            <p className="font-semibold mt-1">
                              ₹{Number(
                                item.price || 0
                              ).toFixed(2)}
                            </p>
                          </div>

                          <div className="sm:text-right">
                            <p className="text-sm text-zinc-500">
                              Item Total
                            </p>

                            <p className="font-bold text-lg">
                              ₹
                              {(
                                Number(
                                  item.price || 0
                                ) *
                                Number(
                                  item.quantity || 0
                                )
                              ).toFixed(2)}
                            </p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}

                <hr className="my-6 border-zinc-200" />

                <div className="flex flex-col md:flex-row justify-between gap-8">
                  <div>
                    <h3 className="font-bold text-lg mb-2">
                      Shipping Address
                    </h3>

                    {order.shippingAddress ? (
                      <div className="text-zinc-600 space-y-1">
                        <p>
                          {
                            order.shippingAddress
                              .fullName
                          }
                        </p>

                        <p>
                          {
                            order.shippingAddress
                              .address
                          }
                        </p>

                        <p>
                          {
                            order.shippingAddress
                              .city
                          }
                          {order.shippingAddress
                            .state
                            ? `, ${order.shippingAddress.state}`
                            : ""}
                        </p>

                        <p>
                          {
                            order.shippingAddress
                              .pincode
                          }
                        </p>

                        <p>
                          {
                            order.shippingAddress
                              .phone
                          }
                        </p>
                      </div>
                    ) : (
                      <p className="text-zinc-500">
                        Address unavailable
                      </p>
                    )}
                  </div>

                  <div className="md:text-right space-y-2">
                    <p>
                      <strong>
                        Payment Method:
                      </strong>{" "}
                      {order.paymentMethod ||
                        "Not specified"}
                    </p>

                    <p>
                      <strong>Subtotal:</strong>{" "}
                      ₹
                      {Number(
                        order.subtotal || 0
                      ).toFixed(2)}
                    </p>

                    <p>
                      <strong>Shipping:</strong>{" "}
                      ₹
                      {Number(
                        order.shipping || 0
                      ).toFixed(2)}
                    </p>

                    <p>
                      <strong>Tax:</strong> ₹
                      {Number(
                        order.tax || 0
                      ).toFixed(2)}
                    </p>

                    <p className="text-xl">
                      <strong>Total:</strong>{" "}
                      ₹
                      {Number(
                        order.total || 0
                      ).toFixed(2)}
                    </p>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default MyOrders;