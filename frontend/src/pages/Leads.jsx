import { useEffect, useState } from "react";
import API from "../api/axios";
import LeadForm from "../components/LeadForm";
import toast from "react-hot-toast";
import socket from "../socket/socket";


export default function Leads() {
  const [leads, setLeads] = useState([]);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [source, setSource] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [selectedLead, setSelectedLead] = useState(null);

  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);


  useEffect(() => {
    fetchLeads();

  socket.on("leadCreated", (lead) => {

  setLeads((prev) => {

    if (prev.find(l => l._id === lead._id)) return prev;

    return [lead, ...prev];

  });

});

  socket.on("leadUpdated", (updatedLead) => {

    setLeads((prev) =>
      prev.map((l) =>
        l._id === updatedLead._id ? updatedLead : l
      )
    );
    toast.success("Lead updated")

  });

  socket.on("leadDeleted", (id) => {

    setLeads((prev) =>
      prev.filter((l) => l._id !== id)
    );

  });

  return () => {

    socket.off("leadCreated");
    socket.off("leadUpdated");
    socket.off("leadDeleted");

  };
  }, [page, status, source, search]);

  const fetchLeads = async () => {
    try {
      const res = await API.get("/leads", {
        params: {
          q: search,
          status,
          source,
          page,
          limit: 10,
        },
      });

      setLeads(res.data.data);
      setTotalPages(res.data.pagination.totalPages);
    } catch (err) {
      console.error(err);
      toast.error("Something went wrong");
    }
  };

    const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this lead?",
    );

    if (!confirmDelete) return;

    try {
      await API.delete(`/leads/${id}`);

      fetchLeads();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold mb-6">Leads</h1>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-3 mb-6">
        <input
          type="text"
          placeholder="Search leads by name, email, mobile..."
          className="border py-1 px-2 rounded w-full md:w-1/3"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <select
          className="border py-1 px-2 rounded"
          value={status}
          onChange={(e) => setStatus(e.target.value)}
        >
          <option value="">All Status</option>
          <option value="new">New</option>
          <option value="contacted">Contacted</option>
          <option value="qualified">Qualified</option>
          <option value="won">Won</option>
          <option value="lost">Lost</option>
        </select>

        <select
          className="border py-1 px-2 rounded"
          value={source}
          onChange={(e) => setSource(e.target.value)}
        >
          <option value="">All Source</option>
          <option value="website">Website</option>
          <option value="referral">Referral</option>
          <option value="cold">Cold</option>
        </select>
      </div>
      <button
        onClick={() => {
          setSelectedLead(null);
          setShowForm(true);
        }}
        className="bg-blue-500 cursor-pointer text-white px-4 py-2 rounded mb-4"
      >
        Add Lead
      </button>
      {/* Desktop Table */}
      <div className="hidden md:block">
        <table className="w-full bg-white shadow rounded">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-3 text-left">Name</th>
              <th className="p-3 text-left">Phone</th>
              <th className="p-3 text-left">Email</th>
              <th className="p-3 text-left">Status</th>
              <th className="p-3 text-left">Source</th>
              <th className="p-3 text-left">Button</th>
            </tr>
          </thead>

          <tbody>
            {leads.map((lead, index) => (
              <tr key={lead._id} className={`border-t ${index%2 == 1 ? 'bg-blue-50' : ""}`}>
                <td className="p-3">{lead.name}</td>
                <td className="p-3">{lead.phone}</td>
                <td className="p-3">{lead.email}</td>
                <td className="p-3 capitalize">{lead.status}</td>
                <td className="p-3 capitalize">{lead.source}</td>
                <td>
                  <button
                    onClick={() => {
                      setSelectedLead(lead);
                      setShowForm(true);
                    }}
                    className="px-2 py-1 hover:bg-blue-300 rounded-lg transition-all cursor-pointer"
                  >
                    ✏️
                  </button>
                  <button
                    onClick={() => handleDelete(lead._id)}
                    className=" px-2 py-1 hover:bg-red-300 rounded-lg transition-all cursor-pointer"
                  >
                    ❌
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Cards */}
      <div className="grid md:hidden gap-4">
        {leads.map((lead) => (
          <div key={lead._id} className="bg-white p-4 rounded drop-shadow-xl">
            <h3 className="font-semibold">{lead.name}</h3>

            <p className="text-sm text-gray-600">{lead.phone}</p>
            <p className="text-sm text-gray-600">{lead.email}</p>

            <div className="flex justify-between mt-2 text-sm">
              <span>Status: {lead.status}</span>

              <span>Source: {lead.source}</span>
            </div>
            <button
              onClick={() => {
                setSelectedLead(lead);
                setShowForm(true);
              }}
              className="text-blue-700 bg-slate-200 rounded-lg shadow-md px-2 my-2 "
            >
              Edit
            </button>
          </div>
        ))}
      </div>

      {/* Pagination */}

      <div className="flex justify-center mt-6 gap-2">
        <button
          className="px-3 py-1 bg-gray-200 rounded"
          disabled={page === 1}
          onClick={() => setPage(page - 1)}
        >
          Prev
        </button>

        <span className="px-3 py-1">
          Page {page} / {totalPages}
        </span>

        <button
          className="px-3 py-1 bg-gray-200 rounded"
          disabled={page === totalPages}
          onClick={() => setPage(page + 1)}
        >
          Next
        </button>
      </div>

      {showForm && (
        <LeadForm
          lead={selectedLead}
          refresh={fetchLeads}
          onClose={() => setShowForm(false)}
        />
      )}
    </div>
  );
}
