

import React from 'react';
import { Menu, X } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import logoLarge from "../../Assets/Images/logo.png";
import dashboardIcon from "../../Assets/Images/house-solid.svg";
import tripsIcon from "../../Assets/Images/calendar-solid.svg";

export const Sidebar = ({ isSidebarOpen, setIsSidebarOpen }) => {
  const location = useLocation(); // Get the current URL path

  const menuItems = [
    { icon: dashboardIcon, label: "Dashboard", path: "/Dashboard" },
    { icon: tripsIcon, label: "User Management", path: "/User" },
  ];

  return (
    <>
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
          onClick={() => setIsSidebarOpen(false)}
        ></div>
      )}

      <div
        className={`fixed h-full bg-white shadow-lg transition-all duration-300 z-50 
        ${isSidebarOpen ? "w-64 translate-x-0" : "w-20 -translate-x-full md:translate-x-0"}`}
      >
        <div className="flex items-center justify-center h-20 border-b px-4 relative">
          {isSidebarOpen ? (
            <img src={logoLarge} alt="Company Logo" className="h-10 w-auto" />
          ) : (
            <button
              className="md:hidden text-gray-600 absolute right-4"
              onClick={() => setIsSidebarOpen(false)}
            >
              <X size={24} />
            </button>
          )}
        </div>

        <nav className="mt-8">
          {menuItems.map((item, index) => {
            const isActive = location.pathname === item.path; // Check if the current path matches

            return (
              <Link to={item.path} key={index} className="block">
                <div
                  className={`flex items-center px-6 py-3 cursor-pointer rounded-lg 
                  hover:bg-gray-50 transition-all duration-200 
                  ${isActive ? "bg-gray-200 text-black-800 font-semibold" : "text-black"}`}
                >
                  <img src={item.icon} alt={item.label} className="w-6 h-6" /> {/* Reduced icon size */}
                  {isSidebarOpen && <span className="ml-4">{item.label}</span>}
                </div>
              </Link>
            );
          })}
        </nav>
      </div>
    </>
  );
};