import { useEffect, useState } from "react";
import API from "../api/axios";

export default function Dashboard() {

  const [stats, setStats] = useState(null);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {

    try {

      const res = await API.get("/dashboard/summary");

      setStats(res.data);

    } catch (err) {
      console.error(err);
    }

  };

  if (!stats) return <div className="p-6">Loading...</div>;

  return (

    <div className="p-6 space-y-6">

      <h1 className="text-3xl font-semibold">Dashboard</h1>

      {/* Total Leads */}
      <div className="bg-blue-500 text-white p-6 rounded shadow">
        <h2 className="text-xl">Total Leads</h2>
        <p className="text-3xl font-bold">{stats.totalLeads}</p>
      </div>

      {/* Leads by Status */}
      <div>
        <h2 className="text-xl mb-3">Leads by Status</h2>

        <div className="grid grid-cols-5 gap-4">

          <div className="bg-white shadow p-4 rounded">
            New: {stats.byStatus?.new || 0}
          </div>

          <div className="bg-white shadow p-4 rounded">
            Contacted: {stats.byStatus?.contacted || 0}
          </div>

          <div className="bg-white shadow p-4 rounded">
            Qualified: {stats.byStatus?.qualified || 0}
          </div>

          <div className="bg-white shadow p-4 rounded">
            Won: {stats.byStatus?.won || 0}
          </div>

          <div className="bg-white shadow p-4 rounded">
            Lost: {stats.byStatus?.lost || 0}
          </div>

        </div>
      </div>

      {/* Leads by Source */}
      <div>
        <h2 className="text-xl mb-3">Leads by Source</h2>

        <div className="grid grid-cols-3 gap-4">

          <div className="bg-white shadow p-4 rounded">
            Website: {stats.bySource?.website || 0}
          </div>

          <div className="bg-white shadow p-4 rounded">
            Referral: {stats.bySource?.referral || 0}
          </div>

          <div className="bg-white shadow p-4 rounded">
            Cold: {stats.bySource?.cold || 0}
          </div>

        </div>
      </div>

    </div>

  );

}