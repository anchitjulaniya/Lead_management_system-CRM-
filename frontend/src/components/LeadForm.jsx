import { useState, useEffect } from "react";
import API from "../api/axios";
import toast from "react-hot-toast";
import { AuthContext } from "../context/AuthContext";
import { useContext } from "react";

export default function LeadForm({ lead, onClose, refresh }) {
  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    source: "website",
    status: "new",
    notes: "",
    assignedTo: "",
  });
  const [users, setUsers] = useState([]);
  const { user } = useContext(AuthContext);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (lead) {
        await API.patch(`/leads/${lead._id}`, form);
      } else {
        await API.post("/leads", form);
      }

      toast.success("Lead created successfully");
      refresh();
      onClose();
    } catch (err) {
      console.error(err);
      toast.error("Something went wrong");
    }
  };
  const fetchUsers = async () => {
    try {
      const res = await API.get("/users");
        
      const salesUsers = res.data.data.filter((user) => user.role === "sales");

      setUsers(salesUsers);
    } catch (err) {
      console.error(err);
    }
  };
 useEffect(() => {

  if (canAssign) {
    fetchUsers();
  }

  if (lead) {
    setForm(lead);
  }

}, [lead]);

  const canAssign = user?.role === "admin" || user?.role === "manager";

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-[rgba(0,0,0,0.5)] bg-opacity-30">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded shadow w-full max-w-md"
      >
        <h2 className="text-xl mb-4">{lead ? "Edit Lead" : "Add Lead"}</h2>

        <input
          name="name"
          placeholder="Name"
          className="border p-2 w-full mb-3 rounded-lg"
          value={form.name}
          onChange={handleChange}
          required
        />

        <input
          name="phone"
          placeholder="Phone"
          className="border p-2 w-full mb-3 rounded-lg"
          value={form.phone}
          onChange={handleChange}
          required
        />

        <input
          name="email"
          placeholder="Email"
          className="border p-2 w-full mb-3 rounded-lg"
          value={form.email}
          onChange={handleChange}
        />
        <select
          name="assignedTo"
          className={`border p-2 w-full rounded-lg  ${!canAssign ? ' cursor-not-allowed': ""}`}
          value={form.assignedTo || ""}
          onChange={handleChange}
          disabled={!canAssign}
        >
          <option value="">Assign to user</option>
         

          {users.map((user) => (
            <option key={user._id} value={user._id}>
              {user.name}
            </option>
          ))}
           </select>
        
          {!canAssign && (
            <p className="text-[10px] ml-2 text-gray-500">
              Only Admin or Manager can assign leads
            </p>
          )}
        

        <select
          name="source"
          className="border p-2 w-full mt-2 mb-3 rounded-lg"
          value={form.source}
          onChange={handleChange}
        >
          <option value="website">Website</option>
          <option value="referral">Referral</option>
          <option value="cold">Cold</option>
        </select>

        <select
          name="status"
          className="border p-2 w-full mb-3 rounded-lg"
          value={form.status}
          onChange={handleChange}
        >
          <option value="new">New</option>
          <option value="contacted">Contacted</option>
          <option value="qualified">Qualified</option>
          <option value="won">Won</option>
          <option value="lost">Lost</option>
        </select>

        <textarea
          name="notes"
          placeholder="Notes"
          className="border p-2 w-full mb-3 rounded-lg"
          value={form.notes}
          onChange={handleChange}
        />

        <div className="flex justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-gray-200 rounded"
          >
            Cancel
          </button>

          <button
            type="submit"
            className="px-4 py-2 bg-blue-500 text-white rounded"
          >
            Save
          </button>
        </div>
      </form>
    </div>
  );
}
