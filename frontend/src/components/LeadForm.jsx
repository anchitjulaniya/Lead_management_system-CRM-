import { useState, useEffect, useContext } from "react";
import API from "../api/axios";
import toast from "react-hot-toast";
import { AuthContext } from "../context/AuthContext";

export default function LeadForm({ lead, onClose, refresh }) {

  const { user } = useContext(AuthContext);

  const canAssign = user?.role === "admin" || user?.role === "manager";

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    source: "website",
    status: "new",
    notes: "",
    assignedTo: ""
  });

  useEffect(() => {

    if (lead) {
      setForm({
        name: lead.name || "",
        phone: lead.phone || "",
        email: lead.email || "",
        source: lead.source || "website",
        status: lead.status || "new",
        notes: lead.notes || "",
        assignedTo: lead.assignedTo?._id ||  lead.assignedTo || ""
      });
    }

    if (canAssign) {
      fetchUsers();
    }

  }, [lead, canAssign]);

  const fetchUsers = async () => {

    try {

      const res = await API.get("/users");
      // console.log("response", res);

      const salesUsers =
        res.data.data.filter(u => u.role === "sales");

        // console.log("salesUsers", salesUsers);

      setUsers(salesUsers);

    } catch (err) {
      console.error(err);
    }

  };

  const handleChange = (e) => {

    setForm({
      ...form,
      [e.target.name]: e.target.value
    });

  };

  const validateForm = () => {

    if (!form.name.trim()) {
      toast.error("Name is required");
      return false;
    }

    if (form.name.length < 2) {
      toast.error("Name must be at least 2 characters");
      return false;
    }

    const phoneRegex = /^[0-9]{10}$/;

    if (!phoneRegex.test(form.phone)) {
      toast.error("Enter valid 10 digit phone number");
      return false;
    }

    if (form.email) {

      const emailRegex =
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

      if (!emailRegex.test(form.email)) {
        toast.error("Invalid email format");
        return false;
      }

    }
    if(!form.assignedTo){
      toast.error("Select Sales user");
      return false;
    }

    return true;

  };

const handleSubmit = async (e) => {

  e.preventDefault();

  if (!validateForm()) return;

  setLoading(true);

  try {

    const payload = { ...form };

    if (!payload.assignedTo) {
      delete payload.assignedTo;
    }

    if (lead) {

      await API.patch(`/leads/${lead._id}`, payload);

      toast.success("Lead updated successfully");

    } else {

      const res = await API.post("/leads", payload);
      console.log("post res",res)
      toast.success("Lead created successfully");

    }

    refresh();
    onClose();

  } catch (err) {

    console.error(err);

    toast.error(
      err.response?.data?.message ||
      "Something went wrong"
    );

  } finally {

    setLoading(false);

  }

};

  return (

    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 px-4">

      <div className="bg-white w-full max-w-lg rounded-xl shadow-xl p-6 animate-[fadeIn_0.3s]">

        <h2 className="text-2xl font-semibold mb-4">
          {lead ? "Edit Lead" : "Create Lead"}
        </h2>

        <form
          onSubmit={handleSubmit}
          className="space-y-3"
        >

          {/* Name */}

          <input
            name="name"
            placeholder="Full name"
            value={form.name}
            onChange={handleChange}
            className="border p-3 rounded-lg w-full focus:ring-2 focus:ring-blue-500 outline-none"
          />

          {/* Phone */}

          <input
            name="phone"
            placeholder="Phone number"
            value={form.phone}
            onChange={handleChange}
            className="border p-3 rounded-lg w-full focus:ring-2 focus:ring-blue-500 outline-none"
          />

          {/* Email */}

          <input
            name="email"
            placeholder="Email (optional)"
            value={form.email}
            onChange={handleChange}
            className="border p-3 rounded-lg w-full focus:ring-2 focus:ring-blue-500 outline-none"
          />

          {/* Assign User */}

          <select
            name="assignedTo"
            value={form.assignedTo || ""}
            onChange={handleChange}
            disabled={!canAssign}
            className={`border p-3 rounded-lg w-full ${
              !canAssign ? "cursor-not-allowed bg-gray-100" : ""
            }`}
          >

            <option value="">
              Assign to sales user
            </option>

            {users.map((u) => (
              <option key={u._id} value={u._id}>
                {u.name}
              </option>
            ))}

          </select>

          {!canAssign && (
            <p className="text-xs text-gray-500">
              Only Admin or Manager can assign leads
            </p>
          )}

          {/* Source */}

          <select
            name="source"
            value={form.source}
            onChange={handleChange}
            className="border p-3 rounded-lg w-full"
          >

            <option value="website">Website</option>
            <option value="referral">Referral</option>
            <option value="cold">Cold</option>

          </select>

          {/* Status */}

          <select
            name="status"
            value={form.status}
            onChange={handleChange}
            className="border p-3 rounded-lg w-full"
          >

            <option value="new">New</option>
            <option value="contacted">Contacted</option>
            <option value="qualified">Qualified</option>
            <option value="won">Won</option>
            <option value="lost">Lost</option>

          </select>

          {/* Notes */}

          <textarea
            name="notes"
            placeholder="Notes"
            value={form.notes}
            onChange={handleChange}
            className="border p-3 rounded-lg w-full h-24"
          />

          {/* Buttons */}

          <div className="flex justify-end gap-3 pt-2">

            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-lg transition cursor-pointer"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition flex items-center gap-2 cursor-pointer"
            >

              {loading && (
                <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
              )}

              {lead ? "Update Lead" : "Create Lead"}

            </button>

          </div>

        </form>

      </div>

    </div>

  );

}