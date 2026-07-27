import { useEffect, useState } from "react";
import {
  getAllOrders,
  updateOrderStatus,
} from "../api/orderApi";

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);

  const loadOrders = async () => {
    try {
      const data = await getAllOrders();
      setOrders(data);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    loadOrders();
  }, []);

  const handleStatusChange = async (id, status) => {
    try {
      await updateOrderStatus(id, status);
      loadOrders();
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-8">

      <h1 className="text-4xl font-bold mb-8">
        Manage Orders
      </h1>

      <div className="overflow-x-auto">

        <table className="w-full border shadow rounded-xl">

          <thead className="bg-black text-white">

            <tr>
              <th className="p-4">Customer</th>
              <th className="p-4">Products</th>
              <th className="p-4">Total</th>
              <th className="p-4">Payment</th>
              <th className="p-4">Status</th>
              <th className="p-4">Date</th>
            </tr>

          </thead>

          <tbody>

            {orders.map((order) => (

              <tr
                key={order._id}
                className="border-b text-center"
              >

                <td className="p-4">
                  <div className="font-bold">
                    {order.userId?.name}
                  </div>

                  <div className="text-sm text-gray-500">
                    {order.userId?.email}
                  </div>
                </td>

                <td className="p-4">

                  {order.products.map((item) => (

                    <div key={item._id}>
                      {item.productId?.name} × {item.quantity}
                    </div>

                  ))}

                </td>

                <td className="p-4 font-semibold">
                  ₹{order.total}
                </td>

                <td className="p-4">
                  {order.paymentStatus}
                </td>

                <td className="p-4">

                  <select
                    value={order.orderStatus}
                    onChange={(e) =>
                      handleStatusChange(
                        order._id,
                        e.target.value
                      )
                    }
                    className="border rounded-lg p-2"
                  >
                    <option>Pending</option>
                    <option>Processing</option>
                    <option>Shipped</option>
                    <option>Delivered</option>
                    <option>Cancelled</option>
                  </select>

                </td>

                <td className="p-4">
                  {new Date(
                    order.createdAt
                  ).toLocaleDateString()}
                </td>

              </tr>

            ))}

          </tbody>

        </table>

      </div>

    </div>
  );
};

export default AdminOrders;