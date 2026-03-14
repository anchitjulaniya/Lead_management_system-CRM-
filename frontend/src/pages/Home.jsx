import { useContext } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import Navbar from "../components/Navbar";

export default function Home() {

  const {user} = useContext(AuthContext)

  return (

    

    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100">
      
      {/* Hero Section */}

      <div className="max-w-7xl mx-auto px-6 py-16 text-center">

        <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-6 animate-fadeIn">
          CRM Lead Management System
        </h1>

        <p className="text-gray-600 text-lg md:text-xl max-w-2xl mx-auto">
          Manage sales leads efficiently with real-time updates, analytics,
          and powerful role-based access control.
        </p>

        <div className="flex justify-center gap-4 mt-8 flex-wrap">

          <Link
            to="/leads"
            className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg shadow transition transform hover:-translate-y-1"
          >
            View Leads
          </Link>

          <Link
            to="/dashboard"
            className="px-6 py-3 bg-white border border-blue-600 text-blue-600 rounded-lg shadow hover:bg-blue-50 transition transform hover:-translate-y-1"
          >
            Dashboard
          </Link>

        </div>

      </div>


      {/* Features Section */}

      <div className="max-w-7xl mx-auto px-6 pb-16">

        <h2 className="text-2xl md:text-3xl font-semibold text-center mb-10">
          Powerful CRM Features
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

          <div className="bg-white p-6 rounded-xl shadow hover:shadow-lg transition transform hover:-translate-y-1">
            <h3 className="text-xl font-semibold mb-2">
              Lead Management
            </h3>
            <p className="text-gray-600">
              Create, update, assign, and track leads with a powerful
              management system.
            </p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow hover:shadow-lg transition transform hover:-translate-y-1">
            <h3 className="text-xl font-semibold mb-2">
              Real-time Notifications
            </h3>
            <p className="text-gray-600">
              Get instant updates whenever leads are created,
              assigned, or updated.
            </p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow hover:shadow-lg transition transform hover:-translate-y-1">
            <h3 className="text-xl font-semibold mb-2">
              Role Based Access
            </h3>
            <p className="text-gray-600">
              Secure access with Admin, Manager, and Sales roles
              controlling permissions.
            </p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow hover:shadow-lg transition transform hover:-translate-y-1">
            <h3 className="text-xl font-semibold mb-2">
              Analytics Dashboard
            </h3>
            <p className="text-gray-600">
              View powerful insights about leads by status
              and source.
            </p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow hover:shadow-lg transition transform hover:-translate-y-1">
            <h3 className="text-xl font-semibold mb-2">
              Advanced Filtering
            </h3>
            <p className="text-gray-600">
              Search, sort, and filter leads using multiple
              parameters.
            </p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow hover:shadow-lg transition transform hover:-translate-y-1">
            <h3 className="text-xl font-semibold mb-2">
              Mobile Friendly
            </h3>
            <p className="text-gray-600">
              Fully responsive design that works smoothly
              across all devices.
            </p>
          </div>

        </div>

      </div>


      {/* Footer */}

      <div className="text-center py-6 border-t text-gray-500 text-sm">

        © {new Date().getFullYear()} CRM+ Lead Management System

      </div>

    </div>

  );

}