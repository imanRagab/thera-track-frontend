import React, { useState } from "react";
import { FaUser, FaLock } from "react-icons/fa";
import Icon from '../assets/icons/theratrack-icon.png';
import apiClient from "../api/apiClient"; // Assuming you already have this set up
import { useNavigate } from "react-router-dom";

function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate(); // For navigation

  const handleSubmit = async (e) => {
    e.preventDefault();
    localStorage.removeItem("token");
    try {
      const response = await apiClient.post("/auth/login", {
        username: username,
        password: password,
      });

      // Save the token to localStorage
      localStorage.setItem("token", response.data);

      // Redirect to the dashboard or another page after login
      navigate("/dashboard");
    } catch (err) {
      console.error("Login error:", err);
      setError("Invalid username or password. Please try again.");
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gradient-to-r from-blue-500 to-indigo-600">
      <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-lg">
        <h1 className="text-2xl font-bold text-gray-800 text-center mb-6">
          Welcome To TheraTrack
          <img src={Icon} alt="TheraTrack Icon" className="w-20 h-20 mx-auto" />
        </h1>
        <p className="text-gray-600 text-center mb-6">Please sign in to continue</p>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative">
            <FaUser className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Username"
              className="w-full pl-10 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>
          <div className="relative">
            <FaLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="password"
              placeholder="Password"
              className="w-full pl-10 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          {error && <p className="text-red-500 text-center">{error}</p>}
          <button
            type="submit"
            className="w-full py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition duration-300"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
}

export default LoginPage;

