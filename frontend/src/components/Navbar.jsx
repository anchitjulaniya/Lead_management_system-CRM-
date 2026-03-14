import { Link, useNavigate } from "react-router-dom";
import NotificationBell from "./NotificationBell";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { LuLogOut } from "react-icons/lu";
import toast from "react-hot-toast";

export default function Navbar() {

  const navigate = useNavigate();
  const { user, logout } = useContext(AuthContext);

  const handleLogout = () => {

    logout();

    toast.success("Logged out successfully");

    navigate("/login");

  };

  return (

    <header className="sticky top-0 z-50 bg-white border-b shadow-sm">

      <div className="max-w-7xl mx-auto flex justify-between items-center px-4 py-3">

        {/* Left Section */}

        <div className="flex items-center gap-4">

          <Link
            to="/"
            className="text-lg md:text-xl font-bold text-blue-600 hover:opacity-80 transition"
          >
            CRM+
          </Link>

          <span className="hidden md:block text-gray-400">
            |
          </span>

          <span className="hidden md:block text-gray-600">
            Lead Management System
          </span>

        </div>


        {/* Right Section */}
         {!user && (
          <div className="flex items-center gap-6">
            <Link
              to="/login"
              className="px-4 py-2 text-sm md:text-base rounded-lg border border-blue-600 text-blue-600 hover:bg-blue-50 transition"
            >
              Login
            </Link>

            <Link
              to="/register"
              className="px-4 py-2 text-sm md:text-base rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition shadow"
            >
              Register
            </Link>
          </div>
        )}
        {user && <div className="flex items-center gap-4">

          {/* Role Badge */}

          <Link to="/profile">
            <span className="hidden hover:scale-110 transition-all sm:flex items-center px-3 py-1 rounded-full bg-blue-100 text-blue-700 text-sm capitalize">
              {user?.role}
            </span>
          </Link>


          {/* Notification Bell */}

          <NotificationBell />


          {/* Logout Button */}

          <button
            onClick={handleLogout}
            className="hidden sm:flex items-center gap-2 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition transform hover:-translate-y-0.5 shadow"
          >

            <LuLogOut size={16} />

            Logout

          </button>


          {/* Mobile Logout */}

          <button
            onClick={handleLogout}
            className="sm:hidden bg-red-500 hover:bg-red-600 text-white p-2 rounded-lg transition transform hover:scale-105"
          >
            <LuLogOut size={18} />
          </button>

        </div>}

      </div>

    </header>

  );

}