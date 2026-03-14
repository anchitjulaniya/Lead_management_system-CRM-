import { useState, useEffect, useContext } from "react";
import toast from "react-hot-toast";
import { AuthContext } from "../../context/AuthContext";
import { createLead, updateLead } from "../../services/leadService";
import useSalesUsers from "../../hooks/useSalesUsers";
import validateLead from "../../utils/validateLead";

export default function LeadForm({ lead, onClose, refresh }) {

  const { user } = useContext(AuthContext);

  const canAssign = user?.role === "admin" || user?.role === "manager";

  const users = useSalesUsers(canAssign);

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
        assignedTo: lead.assignedTo?._id || lead.assignedTo || ""
      });
    }

  }, [lead]);

  const handleChange = (e) => {

    const { name, value } = e.target;

    setForm(prev => ({
      ...prev,
      [name]: value
    }));

  };

  const handleSubmit = async (e) => {

    e.preventDefault();

    const error = validateLead(form, canAssign);

    if (error) {
      toast.error(error);
      return;
    }

    setLoading(true);

    try {

      const payload = { ...form };

      if (!payload.assignedTo) delete payload.assignedTo;

      if (lead) {

        await updateLead(lead._id, payload);
        toast.success("Lead updated successfully");

      } else {

        await createLead(payload);
        toast.success("Lead created successfully");

      }

      refresh();
      onClose();

    } catch (err) {

      toast.error(
        err.response?.data?.message || "Something went wrong"
      );

    } finally {

      setLoading(false);

    }

  };

  return (

    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 px-4">

      <div className="bg-white w-full max-w-lg rounded-xl shadow-xl p-6">

        <h2 className="text-2xl font-semibold mb-4">
          {lead ? "Edit Lead" : "Create Lead"}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-3">

          <input
            name="name"
            placeholder="Full name"
            value={form.name}
            onChange={handleChange}
            className="border p-3 rounded-lg w-full"
          />

          <input
            name="phone"
            placeholder="Phone number"
            value={form.phone}
            onChange={handleChange}
            className="border p-3 rounded-lg w-full"
          />

          <input
            name="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
            className="border p-3 rounded-lg w-full"
          />

          <select
            name="assignedTo"
            value={form.assignedTo}
            onChange={handleChange}
            disabled={!canAssign}
            className="border p-3 rounded-lg w-full"
          >

            <option value="">Assign to sales user</option>

            {users.map(u => (
              <option key={u._id} value={u._id}>
                {u.name}
              </option>
            ))}

          </select>

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

          <textarea
            name="notes"
            value={form.notes}
            onChange={handleChange}
            placeholder="Notes"
            className="border p-3 rounded-lg w-full h-24"
          />

          <div className="flex justify-end gap-3">

            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-200 rounded-lg"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg"
            >
              {loading ? "Saving..." : lead ? "Update Lead" : "Create Lead"}
            </button>

          </div>

        </form>

      </div>

    </div>

  );

}