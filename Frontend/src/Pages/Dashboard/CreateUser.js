
import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Header } from "../Dashboard/Header";
import { Sidebar } from "../Dashboard/Sidebar";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import Swal from "sweetalert2";
import { FaEye, FaEyeSlash } from "react-icons/fa";

// Hardcode API base URL (use http://localhost:5000 for local development)
const API_BASE_URL = "https://vendoradmin.onrender.com";

export const CreateUser = () => {
  const [formData, setFormData] = useState({
    name: "",
    company_name: "",
    company_type: "",
    gstin: "",
    contact_number: "",
    email: "",
    password: "",
    address: "",
    pincode: "",
  });

  const [errors, setErrors] = useState({});
  const [editingUserId, setEditingUserId] = useState(null);
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [countryCode, setCountryCode] = useState("in"); // default to India
  const [loading, setLoading] = useState(false); // Loading state
  const navigate = useNavigate();
  const location = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    const state = location.state;
    if (state?.user) {
      setEditingUserId(state.user.id);
      setFormData({
        name: state.user.name || "",
        company_name: state.user.company_name || "",
        company_type: state.user.company_type || "",
        gstin: state.user.gstin || "",
        contact_number: state.user.contact_number || "",
        email: state.user.email || "",
        password: "",
        address: state.user.address || "",
        pincode: state.user.pincode || "",
      });
    }
  }, [location.state]);

  const getPincodeLengthByCountry = (code) => {
    const map = {
      in: 6, us: 5, ca: 6, au: 4, gb: 5, de: 5, fr: 5, it: 5,
      es: 5, br: 8, ru: 6, cn: 6, jp: 7, kr: 5, mx: 5, id: 5,
      pk: 5, bd: 4, np: 5, lk: 5, my: 5, sg: 6, za: 4, nz: 4,
      tr: 5, ph: 4, th: 5, vn: 6
    };
    return map[code.toLowerCase()] || 5;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    let validatedValue = value;

    if (["name", "company_name", "company_type"].includes(name)) {
      validatedValue = value.replace(/[^A-Za-z\s]/g, "");
    }
    if (name === "email") {
      validatedValue = value.replace(/[^A-Za-z0-9@._-]/g, "");
    }
    if (name === "gstin") {
      validatedValue = value.replace(/[^A-Za-z0-9]/g, "").toUpperCase();
    }
    if (name === "pincode") {
      validatedValue = value.replace(/[^0-9]/g, "");
    }
    if (name === "address") {
      validatedValue = value; // Allow all characters for address
    }

    setFormData({ ...formData, [name]: validatedValue });
    setErrors({ ...errors, [name]: "" });
  };

  const handlePhoneChange = (value, data) => {
    setFormData({ ...formData, contact_number: value });
    setCountryCode(data.countryCode?.toLowerCase() || "in");
    setErrors({ ...errors, contact_number: "" });
  };

  const validateFields = () => {
    const requiredFields = [
      "name", "email", "company_name", "company_type", "gstin",
      "contact_number", "address", "pincode"
    ];

    if (!editingUserId) requiredFields.push("password");

    const newErrors = {};

    // Required field validation
    requiredFields.forEach((field) => {
      if (!formData[field]) {
        newErrors[field] = `${field.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())} is required`;
      }
    });

    // Name validation: only letters and spaces
    if (formData.name && !/^[A-Za-z\s]+$/.test(formData.name)) {
      newErrors.name = "Name must contain only letters and spaces";
    }

    // Email validation
    if (formData.email && !/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(formData.email)) {
      newErrors.email = "Invalid email format";
    }

    // Password validation (for new vendors or if provided during edit)
    if (formData.password && !/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(formData.password)) {
      newErrors.password = "Password must be at least 8 characters, with 1 uppercase, 1 lowercase, 1 number, and 1 special character";
    }

    // GSTIN validation (India-specific, 15 characters: 2 digits, 10 digits/letters, 1 digit, 1 letter, 1 digit)
    if (formData.gstin && !/^[0-9]{2}[A-Z0-9]{10}[0-9][A-Z][0-9]$/.test(formData.gstin)) {
      newErrors.gstin = "Invalid GSTIN format (e.g., 22ABCDE1234F1Z5)";
    }

    // Contact number validation (ensure non-empty and reasonable length)
    if (formData.contact_number && (formData.contact_number.length < 10 || formData.contact_number.length > 15)) {
      newErrors.contact_number = "Contact number must be 10-15 digits including country code";
    }

    // Pincode validation
    const expectedLength = getPincodeLengthByCountry(countryCode);
    if (formData.pincode && formData.pincode.length !== expectedLength) {
      newErrors.pincode = `Pincode must be ${expectedLength} digits for ${countryCode.toUpperCase()}`;
    }

    // Company type validation (ensure selection)
    if (formData.company_type && !["LLP", "PVT", "OPC", "PROP", "OTHER"].includes(formData.company_type)) {
      newErrors.company_type = "Invalid company type";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validateFields()) {
      Swal.fire({
        icon: "error",
        title: "Validation Error",
        text: "Please correct the errors in the form!",
      });
      return;
    }

    setLoading(true); // Start loading

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        Swal.fire({
          icon: "error",
          title: "Authentication Error",
          text: "No authentication token found. Please log in.",
        });
        navigate("/login");
        return;
      }

      const url = editingUserId
        ? `${API_BASE_URL}/api/auth/update-vendor/${editingUserId}`
        : `${API_BASE_URL}/api/auth/addVendor`;

      const method = editingUserId ? "PUT" : "POST";
      const requestData = { ...formData };

      if (editingUserId && !formData.password) {
        delete requestData.password;
      }

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(requestData),
      });

      if (!response.ok) {
        const errorData = await response.text();
        throw new Error(`HTTP ${response.status}: ${errorData || response.statusText}`);
      }

      const contentType = response.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) {
        throw new Error("Response is not JSON");
      }

      const data = await response.json();

      Swal.fire({
        icon: "success",
        title: editingUserId ? "Vendor Updated!" : "Vendor Created!",
        showConfirmButton: false,
        timer: 1500,
      });
      navigate("/user");
    } catch (error) {
      console.error("Save error:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: `Failed to ${editingUserId ? "update" : "create"} vendor: ${error.message}`,
      });
    } finally {
      setLoading(false); // Stop loading
    }
  };

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar isSidebarOpen={isSidebarOpen} setIsSidebarOpen={setIsSidebarOpen} />
      <div className={`flex flex-col w-full transition-all duration-300 ${isSidebarOpen ? "ml-64" : "ml-20"}`}>
        <Header isSidebarOpen={isSidebarOpen} setIsSidebarOpen={setIsSidebarOpen} />
        <div className="p-6">
          <div className="bg-white p-6 rounded-lg shadow-md w-full">
            <h2 className="text-lg font-bold mb-6 text-center">
              {editingUserId ? "Edit Vendor" : "Create Vendor"}
            </h2>

            <div className="grid grid-cols-2 gap-4">
              {[
                { label: "Name", name: "name" },
                { label: "Email", name: "email" },
                { label: editingUserId ? "New Password (optional)" : "Password", name: "password" },
                { label: "Company Name", name: "company_name" },
                { label: "GSTIN", name: "gstin" },
                { label: "Pincode", name: "pincode" },
                { label: "Address", name: "address" },
              ].map(({ label, name }) => (
                <div key={name}>
                  <label htmlFor={name} className="block text-sm font-medium text-gray-700 mb-1">
                    {label}
                  </label>
                  <div className="relative">
                    <input
                      id={name}
                      name={name}
                      value={formData[name]}
                      onChange={handleInputChange}
                      placeholder={`Enter ${label}`}
                      type={name === "password" && !passwordVisible ? "password" : "text"}
                      className={`w-full p-2 border rounded bg-white ${errors[name] ? "border-red-500" : "border-gray-300"}`}
                    />
                    {name === "password" && (
                      <button
                        type="button"
                        onClick={() => setPasswordVisible(!passwordVisible)}
                        className="absolute right-2 top-2 text-gray-500"
                      >
                        {passwordVisible ? <FaEyeSlash /> : <FaEye />}
                      </button>
                    )}
                  </div>
                  {errors[name] && <p className="text-red-500 text-xs">{errors[name]}</p>}
                </div>
              ))}

              <div>
                <label htmlFor="company_type" className="block text-sm font-medium text-gray-700 mb-1">
                  Company Type
                </label>
                <select
                  id="company_type"
                  name="company_type"
                  value={formData.company_type}
                  onChange={handleInputChange}
                  className={`w-full p-2 border rounded bg-white ${errors.company_type ? "border-red-500" : "border-gray-300"}`}
                >
                  <option value="">Select Type</option>
                  <option value="LLP">LLP</option>
                  <option value="PVT">PVT</option>
                  <option value="OPC">OPC</option>
                  <option value="PROP">PROP</option>
                  <option value="OTHER">OTHER</option>
                </select>
                {errors.company_type && <p className="text-red-500 text-xs">{errors.company_type}</p>}
              </div>

              <div>
                <label htmlFor="contact_number" className="block text-sm font-medium text-gray-700 mb-1">
                  Contact Number
                </label>
                <PhoneInput
                  country={"in"}
                  value={formData.contact_number}
                  onChange={handlePhoneChange}
                  inputStyle={{
                    width: "100%",
                    height: "40px",
                    borderRadius: "6px",
                    borderColor: errors.contact_number ? "red" : "#d1d5db",
                    backgroundColor: "white",
                  }}
                />
                {errors.contact_number && <p className="text-red-500 text-xs">{errors.contact_number}</p>}
              </div>
            </div>

            <div className="flex justify-end space-x-2 mt-6">
              <button
                onClick={handleSave}
                disabled={loading}
                className={`flex items-center justify-center bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded ${loading ? "opacity-50 cursor-not-allowed" : ""}`}
              >
                {loading ? (
                  <>
                    <svg
                      className="animate-spin h-5 w-5 mr-2 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    {editingUserId ? "Updating..." : "Creating..."}
                  </>
                ) : (
                  editingUserId ? "Update" : "Create"
                )}
              </button>
              <button
                onClick={() => navigate("/user")}
                className="bg-gray-500 hover:bg-gray-600 text-white px-6 py-2 rounded"
                disabled={loading}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateUser;