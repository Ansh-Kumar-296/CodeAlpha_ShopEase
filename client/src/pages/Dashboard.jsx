import { useEffect, useState } from "react";
import { getDashboardStats } from "../api/dashboardApi";
import { Package, ShoppingCart, Users, IndianRupee } from "lucide-react";

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalUsers: 0,
    totalOrders: 0,
    totalRevenue: 0,
    recentOrders: [],
  });

  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    try {
      const data = await getDashboardStats();
      setStats(data);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-8">

      <h1 className="text-4xl font-bold mb-10">
        Admin Dashboard
      </h1>

      {/* Stats Cards */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">

        <div className="bg-white rounded-xl shadow p-6">
          <Package size={40} />
          <h2 className="text-gray-500 mt-4">Products</h2>
          <h1 className="text-4xl font-bold">
            {stats.totalProducts}
          </h1>
        </div>

        <div className="bg-white rounded-xl shadow p-6">
          <ShoppingCart size={40} />
          <h2 className="text-gray-500 mt-4">Orders</h2>
          <h1 className="text-4xl font-bold">
            {stats.totalOrders}
          </h1>
        </div>

        <div className="bg-white rounded-xl shadow p-6">
          <Users size={40} />
          <h2 className="text-gray-500 mt-4">Users</h2>
          <h1 className="text-4xl font-bold">
            {stats.totalUsers}
          </h1>
        </div>

        <div className="bg-white rounded-xl shadow p-6">
          <IndianRupee size={40} />
          <h2 className="text-gray-500 mt-4">
            Revenue
          </h2>
          <h1 className="text-4xl font-bold">
            ₹{stats.totalRevenue}
          </h1>
        </div>

      </div>

      {/* Recent Orders */}
      <div className="mt-12 bg-white rounded-xl shadow p-6">

        <h2 className="text-3xl font-bold mb-6">
          Recent Orders
        </h2>

        <table className="w-full">

          <thead>

            <tr className="border-b">

              <th className="text-left p-3">Customer</th>
              <th className="text-left p-3">Email</th>
              <th className="text-left p-3">Total</th>
              <th className="text-left p-3">Status</th>

            </tr>

          </thead>

          <tbody>

            {stats.recentOrders.map((order) => (

              <tr
                key={order._id}
                className="border-b"
              >

                <td className="p-3">
                  {order.userId?.name}
                </td>

                <td className="p-3">
                  {order.userId?.email}
                </td>

                <td className="p-3">
                  ₹{order.total}
                </td>

                <td className="p-3">
                  {order.orderStatus}
                </td>

              </tr>

            ))}

          </tbody>

        </table>

      </div>

    </div>
  );
};

export default Dashboard;