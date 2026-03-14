import { useContext, useEffect, useState } from "react";
import API from "../api/axios";
import LeadForm from "../components/LeadForm";
import toast from "react-hot-toast";
import connectSocket from '../socket/socket';
import { AuthContext } from "../context/AuthContext";
import { useRef } from "react";

const socket = connectSocket;

export default function Leads() {

  const [leads, setLeads] = useState([]);

  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  const [createdFrom, setCreatedFrom] = useState("");
  const [createdTo, setCreatedTo] = useState("");

  const [sort, setSort] = useState("createdAt:desc");

  const [status, setStatus] = useState("");
  const [source, setSource] = useState("");

  const [showForm, setShowForm] = useState(false);
  const [selectedLead, setSelectedLead] = useState(null);

  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const controllerRef = useRef(null);

  const user = JSON.parse(sessionStorage.getItem("user"));

  const canCreateLead = user?.role === "admin" || user?.role === "manager";
  const canDeleteLead = user?.role === "admin";

  const cache = {};

  const fetchLeads = async () => {
     const key = `${page}-${status}-${search}`;

  if (cache[key]) {
    setLeads(cache[key]);
    console.log("leads cache")
    return;
  }
    try {

    if (controllerRef.current) {
      controllerRef.current.abort();
    }

    controllerRef.current = new AbortController();
      
      const res = await API.get("/leads", {
        params: {
          q: debouncedSearch,
          status,
          source,
          createdFrom,
          createdTo,
          sort,
          page,
          limit: 10,
        },
      });

      setLeads(res.data.data);
      setTotalPages(res.data.pagination.totalPages);

    } catch (err) {
      if (err.name !== "CanceledError") {
      console.error(err);
    }
    toast.error("Failed to fetch leads");

    }
  };

  const handleDelete = async (id) => {

  if (!id) {
    toast.error("Invalid lead ID");
    return;
  }

  const confirmDelete = window.confirm("Are you sure you want to delete this lead?");

  if (!confirmDelete) return;

  const toastId = toast.loading("Deleting lead...");

  try {

    const res = await API.delete(`/leads/${id}`);

    toast.success(
      res?.data?.message || "Lead deleted successfully",
      { id: toastId }
    );

    // update UI
    setLeads(prev => prev.filter(l => l._id !== id));

    // optional refresh
    fetchLeads();

  } catch (err) {

    console.error("Delete error:", err);

    if (!err.response) {

      toast.error("Network error. Please check your internet.", {
        id: toastId
      });

      return;
    }

    const status = err.response.status;
    const message = err.response?.data?.message;

    if (status === 403) {

      toast.error(message || "You are not allowed to delete this lead", {
        id: toastId
      });

    } else if (status === 404) {

      toast.error("Lead already deleted or not found", {
        id: toastId
      });

      // remove from UI anyway
      setLeads(prev => prev.filter(l => l._id !== id));

    } else if (status === 500) {

      toast.error("Server error. Please try again later.", {
        id: toastId
      });

    } else {

      toast.error(message || "Failed to delete lead", {
        id: toastId
      });

    }

  }

};

  useEffect(() => {

    const timer = setTimeout(() => {
      setDebouncedSearch(search);
    }, 400);

    return () => clearTimeout(timer);

  }, [search]);

  useEffect(() => {
    setPage(1);
  }, [debouncedSearch, status, source, createdFrom, createdTo, sort]);

  useEffect(() => {
    fetchLeads();
  }, [debouncedSearch, createdFrom, createdTo, sort, page, status, source]);

  useEffect(() => {

    socket.on("leadCreated", (lead) => {
      setLeads(prev => {
        if (prev.find(l => l._id === lead._id)) return prev;
        return [lead, ...prev];
      });
    });

    socket.on("leadUpdated", (lead) => {
      setLeads(prev => prev.map(l => l._id === lead._id ? lead : l));
    });

    socket.on("leadDeleted", (id) => {
      setLeads(prev => prev.filter(l => l._id !== id));
    });

    return () => {
      socket.off("leadCreated");
      socket.off("leadUpdated");
      socket.off("leadDeleted");
    };

  }, []);

  const statusColor = {
    new: "bg-blue-100 text-blue-700",
    contacted: "bg-yellow-100 text-yellow-700",
    qualified: "bg-purple-100 text-purple-700",
    won: "bg-green-100 text-green-700",
    lost: "bg-red-100 text-red-700",
  };

  return (
    <div className="p-4 md:p-6 max-w-7xl mx-auto">

      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Leads</h1>

        {canCreateLead && (
          <button
            onClick={() => {
              setSelectedLead(null);
              setShowForm(true);
            }}
            className="bg-blue-600 hover:bg-blue-700 transition text-white px-4 py-2 rounded shadow"
          >
            + Add Lead
          </button>
        )}
      </div>

      {/* Filters */}

      <div className="grid grid-cols-1 md:grid-cols-6 gap-3 mb-6">

        <input
          type="text"
          placeholder="Search..."
          className="border px-2 py-1 rounded col-span-2"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <input
          type="date"
          value={createdFrom}
          onChange={(e) => setCreatedFrom(e.target.value)}
          className="border px-2 py-1 rounded"
        />

        <input
          type="date"
          value={createdTo}
          onChange={(e) => setCreatedTo(e.target.value)}
          className="border px-2 py-1 rounded"
        />

        <select
          value={sort}
          onChange={(e) => setSort(e.target.value)}
          className="border px-2 py-1 rounded"
        >
          <option value="createdAt:desc">Newest</option>
          <option value="createdAt:asc">Oldest</option>
          <option value="name:asc">Name A-Z</option>
          <option value="name:desc">Name Z-A</option>
        </select>

        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="border px-2 py-1 rounded"
        >
          <option value="">All Status</option>
          <option value="new">New</option>
          <option value="contacted">Contacted</option>
          <option value="qualified">Qualified</option>
          <option value="won">Won</option>
          <option value="lost">Lost</option>
        </select>

        <select
          value={source}
          onChange={(e) => setSource(e.target.value)}
          className="border px-2 py-1 rounded"
        >
          <option value="">All Source</option>
          <option value="website">Website</option>
          <option value="referral">Referral</option>
          <option value="cold">Cold</option>
        </select>

      </div>

      {/* Leads Table */}

      <div className="bg-white rounded shadow overflow-hidden">

        <table className="w-full">

          <thead className="bg-gray-200 text-sm">
            <tr>
              <th className="p-3 text-left">Name</th>
              <th className="p-3 text-left">Phone</th>
              <th className="p-3 text-left hidden md:table-cell">Email</th>
              <th className="p-3 text-left">Status</th>
              <th className="p-3 text-left hidden md:table-cell">Source</th>
              <th className="p-3">Actions</th>
            </tr>
          </thead>

          <tbody>

            {leads.length === 0 && (
              <tr>
                <td colSpan="6" className="text-center p-6 text-gray-500">
                  No leads found
                </td>
              </tr>
            )}

            {leads.map((lead, index) => (
              <tr key={lead._id} className={`border-t hover:bg-gray-50 transition ${index%2==0 ? "bg-blue-50" : " "}`}>

                <td className="p-3 font-medium">{lead.name}</td>
                <td className="p-3">{lead.phone}</td>

                <td className="p-3 hidden md:table-cell">{lead.email}</td>

                <td className="p-3">
                  <span className={`px-2 py-1 text-xs rounded ${statusColor[lead.status]}`}>
                    {lead.status}
                  </span>
                </td>

                <td className="p-3 hidden md:table-cell capitalize">
                  {lead.source}
                </td>

                <td className="p-3 flex gap-2 justify-center">

                  <button
                    onClick={() => {
                      setSelectedLead(lead);
                      setShowForm(true);
                    }}
                    className="text-blue-600 hover:scale-125 transition cursor-pointer"
                  >
                    ✏️
                  </button>

                  {canDeleteLead && (
                    <button
                      onClick={() => handleDelete(lead._id)}
                      className="text-red-600 hover:scale-125 transition cursor-pointer"
                    >
                      ❌
                    </button>
                  )}

                </td>

              </tr>
            ))}

          </tbody>

        </table>

      </div>

      {/* Pagination */}

      <div className="flex justify-center mt-6 gap-4">

        <button
          className="px-4 py-2 bg-gray-200 rounded disabled:opacity-40"
          disabled={page === 1}
          onClick={() => setPage(page - 1)}
        >
          Prev
        </button>

        <span className="flex items-center font-medium">
          Page {page} / {totalPages}
        </span>

        <button
          className="px-4 py-2 bg-gray-200 rounded disabled:opacity-40"
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