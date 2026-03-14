import { useState } from "react";
import LeadForm from "../components/leads/LeadForm";
import LeadsTable from "../components/leads/LeadsTable";
import LeadsFilters from "../components/leads/LeadsFilters";
import LeadsPagination from "../components/leads/LeadsPagination";
import useLeads from "../hooks/useLeads";

export default function Leads() {

  const {
    leads,
    page,
    setPage,
    totalPages,
    filters,
    setFilters,
    loading,
    fetchLeads,
    deleteLead,
    permissions
  } = useLeads();

  const [showForm, setShowForm] = useState(false);
  const [selectedLead, setSelectedLead] = useState(null);

  return (
    <div className="p-4 md:p-6 max-w-7xl mx-auto">

      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-6">

        <h1 className="text-2xl font-bold">Leads</h1>

        {permissions.canCreateLead && (
          <button
            onClick={() => {
              setSelectedLead(null);
              setShowForm(true);
            }}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded shadow"
          >
            + Add Lead
          </button>
        )}

      </div>

      <LeadsFilters filters={filters} setFilters={setFilters} />

      <LeadsTable
        leads={leads}
        deleteLead={deleteLead}
        permissions={permissions}
        setSelectedLead={setSelectedLead}
        setShowForm={setShowForm}
      />

      <LeadsPagination
        page={page}
        totalPages={totalPages}
        setPage={setPage}
      />

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