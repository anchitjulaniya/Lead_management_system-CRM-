import { useEffect, useState, useContext } from "react";
import API from "../api/axios";
import toast from "react-hot-toast";
import { AuthContext } from "../context/AuthContext";

export default function Users() {

  const { user } = useContext(AuthContext);

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {

    try {

      const res = await API.get("/users");

      setUsers(res.data.data);

    } catch (err) {

      toast.error(
        err.response?.data?.message || "Failed to fetch users"
      );

    } finally {

      setLoading(false);

    }

  };

  const updateRole = async (id, role) => {

    setUpdatingId(id);

    try {

      const res = await API.patch(`/users/${id}/role`, { role });

      toast.success(res.data.message || "Role updated");

      setUsers(prev =>
        prev.map(u =>
          u._id === id ? { ...u, role } : u
        )
      );

    } catch (err) {

      toast.error(
        err.response?.data?.message ||
        "Failed to update role"
      );

    } finally {

      setUpdatingId(null);

    }

  };

  const getRoleColor = (role) => {

    switch (role) {
      case "admin":
        return "bg-red-100 text-red-600";
      case "manager":
        return "bg-blue-100 text-blue-600";
      default:
        return "bg-green-100 text-green-600";
    }

  };

  if (loading) {

    return (
      <div className="p-10 text-center text-gray-500">
        Loading users...
      </div>
    );

  }

  if (user?.role !== "admin") {

    return (
      <div className="p-10 text-center text-red-500">
        You are not authorized to view this page
      </div>
    );

  }

  return (

    <div className="p-6 space-y-6">

      <h1 className="text-3xl font-semibold">
        User Management
      </h1>

      {/* Desktop Table */}

      <div className="hidden md:block bg-white shadow-lg rounded-xl overflow-hidden">

        <table className="w-full">

          <thead className="bg-gray-100">

            <tr>

              <th className="p-4 text-left">Name</th>
              <th className="p-4 text-left">Email</th>
              <th className="p-4 text-left">Role</th>
              <th className="p-4 text-left">Update Role</th>

            </tr>

          </thead>

          <tbody>

            {users.map((u, i) => (

              <tr
                key={u._id}
                className={`border-t transition hover:bg-gray-50 ${
                  i % 2 === 0 ? "bg-white" : "bg-gray-50"
                }`}
              >

                <td className="p-4 font-medium">
                  {u.name}
                </td>

                <td className="p-4 text-gray-600">
                  {u.email}
                </td>

                <td className="p-4">

                  <span
                    className={`px-3 py-1 text-sm rounded-full capitalize ${getRoleColor(
                      u.role
                    )}`}
                  >
                    {u.role}
                  </span>

                </td>

                <td className="p-4">

                  <select
                    value={u.role}
                    disabled={updatingId === u._id}
                    onChange={(e) =>
                      updateRole(u._id, e.target.value)
                    }
                    className="border rounded-lg p-2 focus:ring-2 focus:ring-blue-400"
                  >

                    <option value="sales">Sales</option>
                    <option value="manager">Manager</option>
                    <option value="admin">Admin</option>

                  </select>

                </td>

              </tr>

            ))}

          </tbody>

        </table>

      </div>

      {/* Mobile Cards */}

      <div className="grid md:hidden gap-4">

        {users.map((u) => (

          <div
            key={u._id}
            className="bg-white p-4 rounded-xl shadow hover:shadow-lg transition"
          >

            <h3 className="font-semibold text-lg">
              {u.name}
            </h3>

            <p className="text-sm text-gray-500">
              {u.email}
            </p>

            <div className="flex justify-between items-center mt-3">

              <span
                className={`px-3 py-1 text-xs rounded-full capitalize ${getRoleColor(
                  u.role
                )}`}
              >
                {u.role}
              </span>

              <select
                value={u.role}
                disabled={updatingId === u._id}
                onChange={(e) =>
                  updateRole(u._id, e.target.value)
                }
                className="border rounded-lg p-1 text-sm"
              >

                <option value="sales">Sales</option>
                <option value="manager">Manager</option>
                <option value="admin">Admin</option>

              </select>

            </div>

          </div>

        ))}

      </div>

    </div>

  );

}