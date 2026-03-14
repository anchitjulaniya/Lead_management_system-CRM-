export default function LeadsTable({
  leads,
  deleteLead,
  permissions,
  setSelectedLead,
  setShowForm
}) {

  const statusColor = {
    new: "bg-blue-100 text-blue-700",
    contacted: "bg-yellow-100 text-yellow-700",
    qualified: "bg-purple-100 text-purple-700",
    won: "bg-green-100 text-green-700",
    lost: "bg-red-100 text-red-700"
  };

  if (!leads.length)
    return (
      <p className="text-center py-8 text-gray-500">
        No leads found
      </p>
    );

  return (

    <div className="overflow-x-auto bg-white rounded shadow">

      <table className="w-full text-sm">

        <thead className="bg-gray-200">
          <tr>
            <th className="p-3 text-left">Name</th>
            <th className="p-3 text-left">Phone</th>
            <th className="p-3 text-left hidden md:table-cell">Email</th>
            <th className="p-3 text-left">Status</th>
            <th className="p-3 text-left hidden md:table-cell">Source</th>
            <th className="p-3 text-center">Actions</th>
          </tr>
        </thead>

        <tbody>

          {leads.map(lead => (

            <tr key={lead._id} className="border-t hover:bg-gray-50">

              <td className="p-3">{lead.name}</td>
              <td className="p-3">{lead.phone}</td>

              <td className="p-3 hidden md:table-cell">{lead.email}</td>

              <td className="p-3">
                <span className={`px-2 py-1 rounded text-xs ${statusColor[lead.status]}`}>
                  {lead.status}
                </span>
              </td>

              <td className="p-3 hidden md:table-cell">{lead.source}</td>

              <td className="p-3 flex justify-center gap-2">

                <button
                  onClick={() => {
                    setSelectedLead(lead);
                    setShowForm(true);
                  }}
                  className="text-blue-600"
                >
                  ✏️
                </button>

                {permissions.canDeleteLead && (
                  <button
                    onClick={() => deleteLead(lead._id)}
                    className="text-red-600"
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

  );
}