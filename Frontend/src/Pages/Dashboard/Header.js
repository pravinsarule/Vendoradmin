

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FiChevronDown, FiLogOut, FiMenu } from "react-icons/fi";
import { FaPlane, FaCar, FaHotel } from "react-icons/fa";
import Swal from "sweetalert2";
import {jwtDecode} from "jwt-decode";
import profilePlaceholder from "../../Assets/Images/profile.jpg";

// Hardcode API base URL (use http://localhost:5000 for local development)
const API_BASE_URL = "https://vendor-admin.onrender.com";

export const Header = ({ isSidebarOpen, setIsSidebarOpen }) => {
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
  const [isTravelDropdownOpen, setIsTravelDropdownOpen] = useState(false);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  // Check token validity
  const isTokenExpired = (token) => {
    if (!token) return true;
    try {
      const decoded = jwtDecode(token);
      const currentTime = Date.now() / 1000; // Current time in seconds
      return decoded.exp < currentTime;
    } catch (error) {
      console.error("Token decode error:", error);
      return true; // Treat invalid tokens as expired
    }
  };

  // Handle session expiration
  const handleSessionExpired = () => {
    Swal.fire({
      icon: "error",
      title: "Session Expired",
      text: "Your session has expired. Please log in again.",
      showConfirmButton: false,
      timer: 2000,
    });
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    sessionStorage.clear();
    caches.keys().then((names) => names.forEach((name) => caches.delete(name)));
    setUser(null);
    navigate("/login", { replace: true });
  };

  // Load user data and check token on mount
  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    const token = localStorage.getItem("token");

    if (token && isTokenExpired(token)) {
      handleSessionExpired();
    } else if (storedUser) {
      setUser(storedUser);
    }
  }, []);

  // Logout function
  const handleLogout = async () => {
    const token = localStorage.getItem("token");

    if (!token || isTokenExpired(token)) {
      handleSessionExpired();
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/logout`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        Swal.fire({
          icon: "success",
          title: "Logged Out",
          text: "You have been successfully logged out.",
          showConfirmButton: false,
          timer: 1500,
        });
        localStorage.removeItem("user");
        localStorage.removeItem("token");
        sessionStorage.clear();
        caches.keys().then((names) => names.forEach((name) => caches.delete(name)));
        setUser(null);
        navigate("/", { replace: true });
      } else if (response.status === 401) {
        handleSessionExpired();
      } else {
        const data = await response.json();
        Swal.fire({
          icon: "error",
          title: "Logout Failed",
          text: `Logout failed: ${data.message || "Unknown error"}`,
          confirmButtonText: "OK",
        });
      }
    } catch (error) {
      console.error("Logout error:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "An error occurred while logging out. Please try again.",
        confirmButtonText: "OK",
      });
    }
  };

  const travelOptions = [
    { icon: <FaPlane />, label: "Flights" },
    { icon: <FaCar />, label: "Cab Bookings" },
    { icon: <FaHotel />, label: "Hotel Reservations" },
  ];

  return (
    <header className="bg-white h-20 shadow-sm flex items-center justify-between p-6 sticky top-0 z-50">
      <div className="flex items-center space-x-4">
        <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="text-gray-600 hover:text-gray-800">
          <FiMenu size={24} />
        </button>
        <h2 className="text-gray-900 font-medium">Vendor Admin</h2>
      </div>
      <div className="flex items-center space-x-6">
        {/* Travel Dropdown */}
        <div className="relative">
          <button
            onClick={() => setIsTravelDropdownOpen(!isTravelDropdownOpen)}
            className="flex items-center space-x-2 text-gray-600 hover:text-gray-800"
          >
            <span className="hidden md:inline">Travel</span>
            <FiChevronDown />
          </button>
          {isTravelDropdownOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50">
              {travelOptions.map((option, index) => (
                <div key={index} className="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-100 cursor-pointer">
                  <span className="mr-2">{option.icon}</span>
                  <span>{option.label}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* User Dropdown */}
        <div className="relative">
          <button onClick={() => setIsUserDropdownOpen(!isUserDropdownOpen)} className="flex items-center space-x-3">
            <img
              src={user?.photo || profilePlaceholder}
              alt="User"
              className="h-8 w-8 rounded-full object-cover"
            />
            <span className="text-gray-700 hidden md:inline">{user?.name || "Admin"}</span>
            <FiChevronDown className="text-gray-600" />
          </button>

          {isUserDropdownOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50">
              <div className="px-4 py-2 text-gray-700 hover:bg-gray-100 cursor-pointer">Settings</div>
              <div
                className="flex items-center px-4 py-2 text-red-600 hover:bg-gray-100 cursor-pointer"
                onClick={() => {
                  handleLogout();
                  setIsUserDropdownOpen(false); // Close dropdown after logout
                }}
              >
                <FiLogOut className="mr-2" /> Logout
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};