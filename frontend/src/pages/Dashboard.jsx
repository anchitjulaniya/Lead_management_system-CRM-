import { useEffect, useState } from "react";
import API from "../api/axios";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

export default function Dashboard() {

  const [stats, setStats] = useState(null);
  const navigate = useNavigate();
  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {

    try {

      const res = await API.get("/dashboard/summary");
      console.log("dashboard/summary")
      setStats(res.data);

    } catch (err) {
      if (err.response?.status === 403) {
        toast.error("You do not have permission to view dashboard");
      console.log("You do not have permission to view dashboard");
      navigate('/leads')
    } else {
      console.log("Failed to load dashboard data");
    }
    }

  };

  if (!stats)
    return (
      <div className="flex justify-center items-center h-[60vh]">
        <div className="animate-pulse text-lg text-gray-500">
          Loading dashboard...
        </div>
      </div>
    );

  const statusCards = [
    { label: "New", value: stats.byStatus?.new || 0, color: "bg-blue-100 text-blue-700" },
    { label: "Contacted", value: stats.byStatus?.contacted || 0, color: "bg-yellow-100 text-yellow-700" },
    { label: "Qualified", value: stats.byStatus?.qualified || 0, color: "bg-purple-100 text-purple-700" },
    { label: "Won", value: stats.byStatus?.won || 0, color: "bg-green-100 text-green-700" },
    { label: "Lost", value: stats.byStatus?.lost || 0, color: "bg-red-100 text-red-700" },
  ];

  const sourceCards = [
    { label: "Website", value: stats.bySource?.website || 0 },
    { label: "Referral", value: stats.bySource?.referral || 0 },
    { label: "Cold", value: stats.bySource?.cold || 0 },
  ];

  return (

    <div className="p-4 md:p-6 max-w-7xl mx-auto space-y-8">

      <h1 className="text-3xl font-bold">Dashboard</h1>

      {/* Total Leads Card */}

      <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-6 rounded-xl shadow-lg hover:scale-[1.02] transition">

        <h2 className="text-lg">Total Leads</h2>

        <p className="text-4xl font-bold mt-2">{stats.totalLeads}</p>

      </div>


      {/* Leads by Status */}

      <div>

        <h2 className="text-xl font-semibold mb-4">
          Leads by Status
        </h2>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">

          {statusCards.map((card) => (

            <div
              key={card.label}
              className={`p-5 rounded-xl shadow hover:shadow-lg transition transform hover:-translate-y-1 ${card.color}`}
            >

              <p className="text-sm">{card.label}</p>

              <p className="text-2xl font-bold mt-1">{card.value}</p>

            </div>

          ))}

        </div>

      </div>


      {/* Leads by Source */}

      <div>

        <h2 className="text-xl font-semibold mb-4">
          Leads by Source
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">

          {sourceCards.map((card) => (

            <div
              key={card.label}
              className="bg-white p-6 rounded-xl shadow hover:shadow-lg transition transform hover:-translate-y-1"
            >

              <p className="text-gray-600">{card.label}</p>

              <p className="text-3xl font-bold mt-2">{card.value}</p>

            </div>

          ))}

        </div>

      </div>

    </div>

  );
}