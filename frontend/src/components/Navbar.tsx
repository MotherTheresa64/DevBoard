// src/components/Navbar.tsx

import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  return (
    <nav className="bg-gray-900 text-white py-4 px-8 shadow-md flex justify-between items-center">
      <h1 className="text-xl font-bold">DevBoard</h1>
      <div className="flex gap-4">
        {user ? (
          <>
            <Link to="/dashboard" className="hover:text-blue-400">Dashboard</Link>
            <Link to="/add" className="hover:text-blue-400">Add Job</Link>
            <button onClick={handleLogout} className="bg-red-600 hover:bg-red-700 px-3 py-1 rounded">
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login" className="hover:text-blue-400">Login</Link>
            <Link to="/signup" className="hover:text-blue-400">Sign Up</Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
