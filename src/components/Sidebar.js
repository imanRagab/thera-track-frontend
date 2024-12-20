import React from "react";
import { FaUser, FaCalendar, FaClipboard, FaSignOutAlt } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

function Sidebar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token"); // Clear the token
    navigate("/login"); // Redirect to login
  };

  return (
    <div className="h-screen w-64 bg-blue-800 text-white flex flex-col">
      <div className="text-center py-6">
        <h1 className="text-2xl font-bold">TheraTrack</h1>
      </div>
      <nav className="flex-1">
        <ul>
          <li
            className="p-4 hover:bg-blue-700 cursor-pointer flex items-center"
            onClick={() => navigate("/dashboard")}
          >
            <FaUser className="mr-2" />
            Dashboard
          </li>
          <li
            className="p-4 hover:bg-blue-700 cursor-pointer flex items-center"
            onClick={() => navigate("/appointments")}
          >
            <FaCalendar className="mr-2" />
            Appointments
          </li>
          <li
            className="p-4 hover:bg-blue-700 cursor-pointer flex items-center"
            onClick={() => navigate("/patients")}
          >
            <FaClipboard className="mr-2" />
            Patients
          </li>
        <li
            className="p-4 hover:bg-blue-700 cursor-pointer flex items-center"
            onClick={() => navigate("/therapists")}
          >
            <FaClipboard className="mr-2" />
            Therapists
          </li>
        </ul>
      </nav>
      <div
        className="p-4 hover:bg-blue-700 cursor-pointer flex items-center"
        onClick={handleLogout}
      >
        <FaSignOutAlt className="mr-2" />
        Logout
      </div>
    </div>
  );
}

export default Sidebar;
