import React, { useState } from "react";
import axios from "axios";
import { FaUser, FaLock } from "react-icons/fa";
import Icon from './assets/icons/theratrack-icon.png';

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    axios
        .post("http://localhost:8081/api/auth/login", {
            username: username,
            password: password
        })
        .then((response) => {
            localStorage.setItem("token", response.data); // Save JWT token in local storage
            alert("Login successful!");
            // Redirect or update UI after login
        })
        .catch((error) => {
            console.error("Login error:", error);
            setError("An error occurred during login");
        });
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gradient-to-r from-blue-500 to-indigo-600">
      <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-lg">
        <h1 className="text-2xl font-bold text-gray-800 text-center mb-6">
            Welcome To TheraTrack<img src={Icon} alt="TheraTrack Icon" className="w-20 h-20 mx-auto" />
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
          <button
            type="submit"
            className="w-full py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition duration-300"
          >
            Login
          </button>
        </form>
        {/* <p className="text-center mt-4 text-sm text-gray-600">
          Don't have an account?{" "}
          <a href="/signup" className="text-indigo-500 hover:underline">
            Sign Up
          </a>
        </p> */}
      </div>
    </div>
  );
}

export default Login;
