const express = require("express");
const {
  login,
  logout,
  addVendor,
  getAllVendors, // Corrected function name
  updateVendor,
  requestVendorDeactivation,
  requestVendorReactivation,
  resetVendorStatus,
} = require("../controllers/authController");
const { verifyToken } = require("../middleware/authMiddleware"); // Corrected path

const router = express.Router();

// Public Route: Login
router.post("/login", login);

// Protected Route: Logout
router.post("/logout", verifyToken, logout);

// Protected Routes: Vendor Management
router.post("/addVendor", verifyToken, addVendor);
router.get("/getAllVendors", verifyToken, getAllVendors); // Fixed route name
router.put("/update-vendor/:id", verifyToken, updateVendor);
router.post("/vendors/:id/deactivate", verifyToken, requestVendorDeactivation);
router.post("/vendors/:id/activate", verifyToken, requestVendorReactivation);
router.post("/vendors/:id/reset-status", verifyToken, resetVendorStatus);
// Corrected route name
module.exports = router;
