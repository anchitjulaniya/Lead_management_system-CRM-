import React, { useState, useContext, useRef, useEffect } from "react";
import { IoChevronDown } from "react-icons/io5";
import { Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

function NavbarDropDown() {

  const [open, setOpen] = useState(false);
  const { user } = useContext(AuthContext);

  const dropdownRef = useRef(null);

  useEffect(() => {

    function handleClickOutside(event) {

      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setOpen(false);
      }

    }

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };

  }, []);

  return (

    <div ref={dropdownRef} className="relative">

      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-1 text-gray-700 hover:text-blue-600 cursor-pointer bg-slate-100 rounded-lg px-2 py-1"
      >
        Pages <IoChevronDown size={16} />
      </button>

      {open && (

        <div className="absolute top-8 left-0 w-40 bg-white shadow-lg rounded-lg border overflow-hidden">

          <Link
            to="/dashboard"
            onClick={() => setOpen(false)}
            className="block px-4 py-2 hover:bg-gray-100"
          >
            Dashboard
          </Link>

          <Link
            to="/leads"
            onClick={() => setOpen(false)}
            className="block px-4 py-2 hover:bg-gray-100"
          >
            Leads
          </Link>

          {user?.role === "admin" && (
            <Link
              to="/users"
              onClick={() => setOpen(false)}
              className="block px-4 py-2 hover:bg-gray-100"
            >
              Users
            </Link>
          )}

          <Link
            to="/profile"
            onClick={() => setOpen(false)}
            className="block px-4 py-2 hover:bg-gray-100"
          >
            Profile
          </Link>

        </div>

      )}

    </div>

  );
}

export default NavbarDropDown;