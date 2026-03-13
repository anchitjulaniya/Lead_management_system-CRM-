import { Link, useNavigate } from "react-router-dom";
import NotificationBell from "./NotificationBell";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { LuLogOut } from "react-icons/lu";

export default function Navbar() {
  const navigate = useNavigate();
  const { user, logout } = useContext(AuthContext);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };
  return (
    <div className="flex justify-between items-center p-4 bg-white shadow">
      
      <div className="flex flex-col">
        <h1 className="text-lg md:text-xl font-semibold md:font-bold flex">
        <Link to="/">CRM Dashboard</Link>
      </h1>
      <span className="text-[8px] capitalize text-blue-700"><span className="text-black">Role:</span> {user?.role}</span>

      </div>

     
      <div className="flex gap-5 ">
        <NotificationBell />
        <button
          onClick={handleLogout}
          className="bg-red-500 text-white hidden sm:flex px-3 py-1 rounded cursor-pointer"
        >
          Logout
        </button>
        <button
          onClick={handleLogout}
          className="bg-red-500 flex sm:hidden text-white px-1 py-1 rounded cursor-pointer"
        >
          <LuLogOut />
        </button>
      </div>
    </div>
  );
}
