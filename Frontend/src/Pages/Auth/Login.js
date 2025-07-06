
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import backgroundVideo from "../../Assets/Images/vido.mp4";

export const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // If already logged in, redirect to dashboard
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      navigate("/dashboard", { replace: true });
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    if (!email || !password) {
      setError("All fields are required");
      setLoading(false);
      return;
    }

    try {
      const response = await axios.post("https://vendoradmin.onrender.com/api/auth/login", { email, password });

      if (response.data.token) {
        localStorage.setItem("token", response.data.token);
        navigate("/dashboard", { replace: true }); // Prevent back navigation
      } else {
        setError("Failed to authenticate. Please try again.");
      }

    } catch (error) {
      setError(error.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative flex items-center justify-center min-h-screen bg-black overflow-hidden">
      {/* Background Video */}
      <video
        src={backgroundVideo}
        autoPlay
        loop
        muted
        playsInline
        className="absolute top-0 left-0 w-full h-full object-cover"
      />

      {/* Darkened Overlay */}
      <div className="absolute top-0 left-0 w-full h-full bg-black opacity-60"></div>

      {/* Login Form */}
      <div className="relative w-full max-w-md p-8 space-y-6 bg-white shadow-2xl rounded-2xl border-2 border-blue-900 bg-opacity-95 z-10">
        <h2 className="text-2xl font-bold text-center text-red-700 uppercase">
          Login
        </h2>

        {error && <p className="text-red-600 text-center font-semibold">{error}</p>}

        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <label className="block text-blue-900 font-bold">Email</label>
            <input
              type="email"
              className="w-full px-4 py-2 mt-1 border border-blue-300 rounded-lg bg-white text-black focus:outline-none focus:ring-2 focus:ring-red-500"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-blue-900 font-bold">Password</label>
            <input
              type="password"
              className="w-full px-4 py-2 mt-1 border border-blue-300 rounded-lg bg-white text-black focus:outline-none focus:ring-2 focus:ring-red-500"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <button
            type="submit"
            className="w-full px-6 py-3 text-lg font-bold text-white bg-blue-900 rounded-lg hover:bg-red-700 transition duration-300"
            disabled={loading}
          >
            {loading ? "Please wait..." : "Continue"}
          </button>
        </form>
      </div>
    </div>
  );
};
