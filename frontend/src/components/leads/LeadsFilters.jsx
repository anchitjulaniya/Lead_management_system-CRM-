export default function LeadsFilters({ filters, setFilters }) {

  const handleChange = (field, value) => {
    setFilters(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (

    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-3 mb-6">

      {/* Search */}
      <input
        type="text"
        placeholder="Search..."
        className="border px-3 py-2 rounded col-span-1 sm:col-span-2"
        value={filters.search}
        onChange={(e) => handleChange("search", e.target.value)}
      />

      {/* Created From */}
      <input
        type="date"
        className="border px-3 py-2 rounded"
        placeholder="created from"
        value={filters.createdFrom}
        onChange={(e) => handleChange("createdFrom", e.target.value)}
      />

      {/* Created To */}
      <input
        type="date"
        className="border px-3 py-2 rounded"
        value={filters.createdTo}
        onChange={(e) => handleChange("createdTo", e.target.value)}
      />

      {/* Sort */}
      <select
        value={filters.sort}
        onChange={(e) => handleChange("sort", e.target.value)}
        className="border px-3 py-2 rounded"
      >
        <option value="createdAt:desc">Newest</option>
        <option value="createdAt:asc">Oldest</option>
        <option value="name:asc">Name A-Z</option>
        <option value="name:desc">Name Z-A</option>
      </select>

      {/* Status */}
      <select
        value={filters.status}
        onChange={(e) => handleChange("status", e.target.value)}
        className="border px-3 py-2 rounded"
      >
        <option value="">All Status</option>
        <option value="new">New</option>
        <option value="contacted">Contacted</option>
        <option value="qualified">Qualified</option>
        <option value="won">Won</option>
        <option value="lost">Lost</option>
      </select>

      {/* Source */}
      <select
        value={filters.source}
        onChange={(e) => handleChange("source", e.target.value)}
        className="border px-3 py-2 rounded"
      >
        <option value="">All Source</option>
        <option value="website">Website</option>
        <option value="referral">Referral</option>
        <option value="cold">Cold</option>
      </select>

    </div>

  );
}