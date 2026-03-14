import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { fetchLeadsApi, deleteLeadApi } from "../services/leadService";
import { getLeadPermissions } from "../utils/leadPermissions";
import useDebounce  from "./useDebounce";

export default function useLeads() {
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(false);

  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  
  const [filters, setFilters] = useState({
    search: "",
    status: "",
    source: "",
    createdFrom: "",
    createdTo: "",
    sort: "createdAt:desc",
  });

  const debouncedSearch = useDebounce(filters.search, 400);


  const user = JSON.parse(sessionStorage.getItem("user"));
  const permissions = getLeadPermissions(user);

  const fetchLeads = async () => {
    setLoading(true);

    try {
      const res = await fetchLeadsApi(
        {
          ...filters,
          search: debouncedSearch,
        },
        page,
      );

      setLeads(res.data.data);
      setTotalPages(res.data.pagination.totalPages);
    } catch (err) {
      toast.error("Failed to load leads");
    } finally {
      setLoading(false);
    }
  };

  const deleteLead = async (id) => {
    if (!window.confirm("Delete this lead?")) return;

    try {
      await deleteLeadApi(id);

      setLeads((prev) => prev.filter((l) => l._id !== id));

      toast.success("Lead deleted");
    } catch {
      toast.error("Unable to delete lead");
    }
  };

  useEffect(() => {
  fetchLeads();
}, [debouncedSearch, filters.status, filters.source, filters.createdFrom, filters.createdTo, filters.sort, page]);

  return {
    leads,
    loading,
    page,
    setPage,
    totalPages,
    filters,
    setFilters,
    fetchLeads,
    deleteLead,
    permissions,
  };
}
