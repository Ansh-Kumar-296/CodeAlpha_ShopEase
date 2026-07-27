import { useEffect, useState } from "react";
import {
  Users as UsersIcon,
  Trash2,
  Shield,
  User,
} from "lucide-react";
import {
  getUsers,
  deleteUser,
} from "../api/userApi";

function Users() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const loggedInUser = JSON.parse(
    localStorage.getItem("user")
  );

  const loadUsers = async () => {
    try {
      setLoading(true);

      const data = await getUsers();

      setUsers(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error(error);

      alert(
        error.response?.data?.message ||
          "Failed to load users"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this user?"
    );

    if (!confirmed) return;

    try {
      await deleteUser(id);

      alert("User deleted successfully");

      setUsers((previousUsers) =>
        previousUsers.filter(
          (user) => user._id !== id
        )
      );
    } catch (error) {
      console.error(error);

      alert(
        error.response?.data?.message ||
          "Failed to delete user"
      );
    }
  };

  const formatDate = (date) => {
    if (!date) return "N/A";

    return new Date(date).toLocaleDateString(
      "en-IN",
      {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }
    );
  };

  return (
    <div className="min-h-screen bg-zinc-100 px-6 py-10">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-zinc-900">
            Users
          </h1>

          <p className="text-zinc-500 mt-2">
            View and manage registered users
          </p>
        </div>

        {/* Users Table */}
        <div className="bg-white rounded-2xl shadow-sm border border-zinc-200 overflow-hidden">
          <div className="px-6 py-5 border-b border-zinc-200 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <UsersIcon size={26} />

              <h2 className="text-xl font-bold">
                All Users
              </h2>
            </div>

            <span className="bg-zinc-100 px-4 py-2 rounded-lg font-semibold">
              Total: {users.length}
            </span>
          </div>

          {loading ? (
            <div className="p-12 text-center text-zinc-500">
              Loading users...
            </div>
          ) : users.length === 0 ? (
            <div className="p-12 text-center text-zinc-500">
              No users found
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[900px]">
                <thead className="bg-zinc-50">
                  <tr className="text-left">
                    <th className="px-6 py-4">
                      User
                    </th>

                    <th className="px-6 py-4">
                      Email
                    </th>

                    <th className="px-6 py-4">
                      Role
                    </th>

                    <th className="px-6 py-4">
                      Joined
                    </th>

                    <th className="px-6 py-4 text-center">
                      Action
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {users.map((user) => (
                    <tr
                      key={user._id}
                      className="border-t border-zinc-200 hover:bg-zinc-50"
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="h-11 w-11 rounded-full bg-zinc-900 text-white flex items-center justify-center font-bold">
                            {user.name
                              ?.charAt(0)
                              .toUpperCase()}
                          </div>

                          <div>
                            <p className="font-semibold text-zinc-900">
                              {user.name}
                            </p>

                            {user._id ===
                              loggedInUser?._id && (
                              <p className="text-xs text-blue-600">
                                Current account
                              </p>
                            )}
                          </div>
                        </div>
                      </td>

                      <td className="px-6 py-4 text-zinc-600">
                        {user.email}
                      </td>

                      <td className="px-6 py-4">
                        {user.role === "admin" ? (
                          <span className="inline-flex items-center gap-2 bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm font-semibold">
                            <Shield size={15} />
                            Admin
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-2 bg-zinc-100 text-zinc-700 px-3 py-1 rounded-full text-sm font-semibold">
                            <User size={15} />
                            User
                          </span>
                        )}
                      </td>

                      <td className="px-6 py-4 text-zinc-600">
                        {formatDate(user.createdAt)}
                      </td>

                      <td className="px-6 py-4 text-center">
                        {user.role === "admin" ? (
                          <span className="text-zinc-400 text-sm">
                            Protected
                          </span>
                        ) : (
                          <button
                            onClick={() =>
                              handleDelete(user._id)
                            }
                            className="inline-flex items-center gap-2 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition"
                          >
                            <Trash2 size={17} />
                            Delete
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Users;