
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Sidebar } from "../Dashboard/Sidebar";
import { Header } from "../Dashboard/Header";
import { Pencil, Ban, RotateCw } from "lucide-react";
import io from "socket.io-client";
import Swal from "sweetalert2";

const socket = io("https://vendor-admin.onrender.com");

const User = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [usersData, setUsersData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [filter, setFilter] = useState("");
  const navigate = useNavigate();

  const fetchVendors = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch("https://vendor-admin.onrender.com/api/auth/getAllVendors", {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await response.json();

      if (response.ok) {
        const sortedVendors = [...(data.vendors || [])].reverse();
        setUsersData(sortedVendors);
        setFilteredData(sortedVendors);
      } else {
        Swal.fire("Error", data.message || "Failed to fetch vendors", "error");
      }
    } catch (error) {
      Swal.fire("Error", "An error occurred while fetching vendors.", "error");
    }
  };

  useEffect(() => {
    fetchVendors();
    socket.on("vendorUpdated", fetchVendors);
    return () => {
      socket.off("vendorUpdated", fetchVendors);
    };
  }, []);

  const handleEdit = (user) => {
    navigate("/create-user", { state: { user } });
  };

  const handleDeactivate = async (id) => {
    const confirm = await Swal.fire({
      title: "Are you sure?",
      text: "Do you want to deactivate this vendor?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, deactivate it!",
    });

    if (confirm.isConfirmed) {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch(`https://vendor-admin.onrender.com/api/auth/vendors/${id}/deactivate`, {
          method: "POST",
          headers: { Authorization: `Bearer ${token}` },
        });

        const data = await response.json();

        if (response.ok) {
          Swal.fire("Deactivated!", "Vendor has been deactivated.", "success");
          fetchVendors();
        } else {
          Swal.fire("Error", data.message || "Failed to deactivate vendor", "error");
        }
      } catch (error) {
        Swal.fire("Error", "Something went wrong. Try again.", "error");
      }
    }
  };

  const handleRequestReactivation = async (id) => {
    const confirm = await Swal.fire({
      title: "Reactivation Request?",
      text: "Do you want to request reactivation for this vendor?",
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#aaa",
      confirmButtonText: "Yes, reactivate",
    });

    if (confirm.isConfirmed) {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch(`https://vendor-admin.onrender.com/api/auth/vendors/${id}/activate`, {
          method: "POST",
          headers: { Authorization: `Bearer ${token}` },
        });

        const data = await response.json();

        if (response.ok) {
          Swal.fire("Reactivated!", "Vendor reactivation request sent successfully.", "success");
          fetchVendors();
        } else {
          Swal.fire("Error", data.message || "Failed to reactivate vendor", "error");
        }
      } catch (error) {
        Swal.fire("Error", "Something went wrong. Try again.", "error");
      }
    }
  };

  const handleFilterChange = () => {
    const filtered = usersData.filter((user) => {
      const lowerCaseFilter = filter.toLowerCase();
      return (
        (user.name && user.name.toLowerCase().includes(lowerCaseFilter)) ||
        (user.email && user.email.toLowerCase().includes(lowerCaseFilter)) ||
        (user.contact_number && user.contact_number.includes(filter))
      );
    });

    setFilteredData(filtered);
    setCurrentPage(1);
  };

  const handlePaginationChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const indexOfLastUser = currentPage * itemsPerPage;
  const indexOfFirstUser = indexOfLastUser - itemsPerPage;
  const currentUsers = filteredData.slice(indexOfFirstUser, indexOfLastUser);
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar isSidebarOpen={isSidebarOpen} setIsSidebarOpen={setIsSidebarOpen} />
      <div className={`flex flex-col w-full transition-all duration-300 ${isSidebarOpen ? "ml-64" : "ml-20"}`}>
        <Header isSidebarOpen={isSidebarOpen} setIsSidebarOpen={setIsSidebarOpen} />

        <div className="bg-gray-100 min-h-screen p-4">
          <div className="bg-white p-4 rounded-lg shadow-md w-full overflow-x-auto">
            <div className="flex flex-col md:flex-row justify-between items-center mb-4">
              <h1 className="text-xl font-semibold mb-2 md:mb-0">Manage People</h1>
              <button
                className="border border-gray-300 rounded px-3 py-1 bg-blue-500 text-white text-sm"
                onClick={() => navigate("/create-user")}
              >
                Create
              </button>
            </div>

            {/* Filter Section */}
            <div className="mb-4 flex gap-4">
              <input
                type="text"
                className="px-3 py-2 border rounded"
                placeholder="Filter by name, email, or contact_number"
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
              />
              <button className="px-4 py-2 bg-blue-500 text-white rounded" onClick={handleFilterChange}>
                Apply Filter
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="bg-gray-200 text-left">
                    <th className="px-3 py-2 pl-6">Sr No</th>
                    <th className="px-3 py-2">Name</th>
                    <th className="px-2 py-2">Email</th>
                    <th className="px-2 py-2">Contact</th>
                    <th className="px-2 py-2">Status</th>
                    <th className="px-3 py-2 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {currentUsers.length === 0 ? (
                    <tr>
                      <td colSpan="6" className="text-center py-4 text-gray-500">
                        No users found.
                      </td>
                    </tr>
                  ) : (
                    currentUsers.map((user, index) => (
                      <tr key={user.id || index} className="border-b hover:bg-gray-50">
                        <td className="px-3 py-2 pl-6">{indexOfFirstUser + index + 1}</td>
                        <td className="px-3 py-2">{user.name}</td>
                        <td className="px-2 py-2">{user.email}</td>
                        <td className="px-2 py-2">{user.contact_number || "N/A"}</td>
                        <td className="px-2 py-2">
                          <span
                            className={`px-2 py-1 rounded text-xs font-semibold ${
                              user.is_active ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                            }`}
                          >
                            {user.is_active ? "Active" : "Inactive"}
                          </span>
                        </td>
                        <td className="px-3 py-2 text-right">
                          <div className="flex justify-end gap-2">
                            <button
                              className="w-9 h-9 flex items-center justify-center bg-yellow-500 text-white rounded"
                              onClick={() => handleEdit(user)}
                              title="Edit"
                            >
                              <Pencil size={16} />
                            </button>

                            {user.is_active ? (
                              <button
                                className="w-9 h-9 flex items-center justify-center bg-red-500 text-white rounded"
                                onClick={() => handleDeactivate(user.id)}
                                title="Request Deactivation"
                              >
                                <Ban size={16} />
                              </button>
                            ) : (
                              <button
                                className="w-9 h-9 flex items-center justify-center bg-blue-600 text-white rounded"
                                onClick={() => handleRequestReactivation(user.id)}
                                title="Request Reactivation"
                              >
                                <RotateCw size={16} />
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="flex justify-center mt-4">
              <button
                onClick={() => handlePaginationChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="px-4 py-2 bg-gray-300 text-gray-600 rounded-l"
              >
                Previous
              </button>
              <span className="px-4 py-2 bg-gray-100 text-gray-600">{currentPage}</span>
              <button
                onClick={() => handlePaginationChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="px-4 py-2 bg-gray-300 text-gray-600 rounded-r"
              >
                Next
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default User;
