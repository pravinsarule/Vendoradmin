

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const pool = require('../config/db');
const VendorAdminModel = require('../models/adminModel');
const { verifyToken } = require('../middleware/authMiddleware');
const { sendEmail } = require('../services/mailService');
require('dotenv').config();

// Login Controller
// exports.login = async (req, res) => {
//   const { email, password } = req.body;

//   try {
//     const admin = await VendorAdminModel.findByEmail(email);
//     if (!admin)
//       return res.status(404).json({ message: 'Vendor Admin not found' });

//     const isMatch = await bcrypt.compare(password, admin.password);
//     if (!isMatch)
//       return res.status(400).json({ message: 'Invalid credentials' });

//     const token = jwt.sign(
//       { id: admin.id, role: admin.role },
//       process.env.JWT_SECRET,
//       { expiresIn: '1h' }
//     );

//     res.status(200).json({ message: 'Login successful', token });
//   } catch (error) {
//     res.status(500).json({ message: 'Server error', error });
//   }
// };
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log('Login request body:', req.body);

    const admin = await VendorAdminModel.findByEmail(email);
    if (!admin) {
      console.log('No admin found');
      return res.status(404).json({ message: 'Vendor Admin not found' });
    }

    console.log('Admin found:', admin);

    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      console.log('Invalid password');
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { id: admin.id, role: admin.role },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    res.status(200).json({ message: 'Login successful', token });
  } catch (error) {
    console.error('Login Error:', error); // 🔥 Very important
    res.status(500).json({ message: 'Server error' });
  }
};

// Logout Controller
exports.logout = (req, res) => {
  try {
    res.clearCookie('token');
    res.status(200).json({ message: 'Logout successful' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

// Add Vendor
exports.addVendor = [
  verifyToken,
  async (req, res) => {
    const {
      name,
      company_name,
      company_type,
      gstin,
      contact_number,
      email,
      password,
      address,
      pincode,
    } = req.body;

    try {
      if (req.user.role !== 'vendor') {
        return res
          .status(403)
          .json({ message: 'Unauthorized: Only Vendor Admins can add Vendors' });
      }

      if (
        !name ||
        !company_name ||
        !company_type ||
        !gstin ||
        !contact_number ||
        !email ||
        !password ||
        !address ||
        !pincode
      ) {
        return res.status(400).json({ message: 'All fields are required' });
      }

      const existingVendor = await pool.query(
        'SELECT * FROM vendors WHERE email = $1',
        [email]
      );
      if (existingVendor.rows.length > 0) {
        return res
          .status(400)
          .json({ message: 'Vendor with this email already exists' });
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      const newVendor = await pool.query(
        `INSERT INTO vendors (name, company_name, company_type, gstin, contact_number, email, password, address, pincode)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
         RETURNING id, name, company_name, email, company_type, is_active, deactivation_status`,
        [
          name,
          company_name,
          company_type,
          gstin,
          contact_number,
          email,
          hashedPassword,
          address,
          pincode,
        ]
      );

      await sendEmail(email, password, 'Your Vendor Account Details');

      // Emit Socket.IO event
      const io = req.app.get('io');
      io.emit('vendor_added', newVendor.rows[0]);

      res
        .status(201)
        .json({
          message: 'Vendor added successfully',
          vendor: newVendor.rows[0],
        });
    } catch (error) {
      console.error('Error adding vendor:', error.message);
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  },
];

// Update Vendor
exports.updateVendor = [
  verifyToken,
  async (req, res) => {
    const { id } = req.params;
    const {
      name,
      company_name,
      company_type,
      gstin,
      contact_number,
      email,
      address,
      pincode,
      password,
    } = req.body;

    try {
      if (req.user.role !== 'vendor') {
        return res.status(403).json({
          message: 'Unauthorized: Only Vendor Admins can update vendors',
        });
      }

      const vendorExists = await pool.query(
        'SELECT id FROM vendors WHERE id = $1',
        [id]
      );

      if (vendorExists.rows.length === 0) {
        return res.status(404).json({ message: 'Vendor not found' });
      }

      let hashedPassword = null;
      if (password) {
        hashedPassword = await bcrypt.hash(password, 10);
      }

      const updatedVendor = await pool.query(
        `UPDATE vendors
         SET name = $1,
             company_name = $2,
             company_type = $3,
             gstin = $4,
             contact_number = $5,
             email = $6,
             address = $7,
             pincode = $8
             ${password ? ', password = $9' : ''}
         WHERE id = $${password ? 10 : 9}
         RETURNING id, name, company_name, email, company_type, is_active, deactivation_status`,
        password
          ? [
              name,
              company_name,
              company_type,
              gstin,
              contact_number,
              email,
              address,
              pincode,
              hashedPassword,
              id,
            ]
          : [
              name,
              company_name,
              company_type,
              gstin,
              contact_number,
              email,
              address,
              pincode,
              id,
            ]
      );

      if (password) {
        await sendEmail(email, password, 'Your Vendor Account Updated');
      }

      // Emit Socket.IO event
      const io = req.app.get('io');
      io.emit('vendor_updated', updatedVendor.rows[0]);

      res.status(200).json({
        message: 'Vendor updated successfully',
        vendor: updatedVendor.rows[0],
      });
    } catch (error) {
      console.error('Error updating vendor:', error.message);
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  },
];

// Request Vendor Deactivation
exports.requestVendorDeactivation = [
  verifyToken,
  async (req, res) => {
    const { id } = req.params;

    try {
      if (req.user.role !== 'vendor') {
        return res.status(403).json({
          message:
            'Unauthorized: Only Vendor Admins can request vendor deactivation',
        });
      }

      const vendorExists = await pool.query(
        'SELECT id, email, name, deactivation_status, is_active FROM vendors WHERE id = $1',
        [id]
      );

      if (vendorExists.rows.length === 0) {
        return res.status(404).json({ message: 'Vendor not found' });
      }

      const vendor = vendorExists.rows[0];

      if (vendor.deactivation_status === 'pending_deactivation') {
        return res.status(400).json({
          message: 'A deactivation request is already pending for this vendor',
        });
      }

      if (vendor.deactivation_status === 'deactivated' || !vendor.is_active) {
        return res.status(400).json({
          message: 'Vendor is already deactivated',
        });
      }

      const updatedVendor = await pool.query(
        `UPDATE vendors 
         SET deactivation_status = 'pending_deactivation', 
             deactivation_requested_by = $1, 
             deactivation_requested_at = CURRENT_TIMESTAMP,
             is_active = FALSE
         WHERE id = $2
         RETURNING id, name, company_name, email, company_type, is_active, deactivation_status`,
        [req.user.id, id]
      );

      // Emit Socket.IO event
      const io = req.app.get('io');
      io.emit('vendor_status_changed', updatedVendor.rows[0]);

      res.status(200).json({
        message:
          'Vendor deactivation request submitted successfully. Awaiting Super Admin approval.',
      });
    } catch (error) {
      console.error(
        'Error submitting vendor deactivation request:',
        error.message
      );
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  },
];

// Reset Vendor Status (Updated for PostgreSQL)
exports.resetVendorStatus = [
  verifyToken,
  async (req, res) => {
    const { id } = req.params;

    try {
      if (req.user.role !== 'vendor') {
        return res.status(403).json({
          message: 'Unauthorized: Only Vendor Admins can reset vendor status',
        });
      }

      const vendorExists = await pool.query(
        'SELECT id FROM vendors WHERE id = $1',
        [id]
      );

      if (vendorExists.rows.length === 0) {
        return res.status(404).json({ message: 'Vendor not found' });
      }

      const updatedVendor = await pool.query(
        `UPDATE vendors 
         SET is_active = TRUE,
             deactivation_status = 'active',
             deactivation_requested_by = NULL,
             deactivation_requested_at = NULL
         WHERE id = $1
         RETURNING id, name, company_name, email, company_type, is_active, deactivation_status`,
        [id]
      );

      // Emit Socket.IO event
      const io = req.app.get('io');
      io.emit('vendor_status_changed', updatedVendor.rows[0]);

      res.status(200).json({ message: 'Vendor reactivated successfully', vendor: updatedVendor.rows[0] });
    } catch (error) {
      console.error('Error resetting vendor status:', error.message);
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  },
];

// Request Vendor Reactivation
exports.requestVendorReactivation = [
  verifyToken,
  async (req, res) => {
    const { id } = req.params;

    try {
      if (req.user.role !== 'vendor') {
        return res.status(403).json({
          message: 'Unauthorized: Only Vendor Admins can request reactivation',
        });
      }

      const result = await pool.query(
        'SELECT id, deactivation_status, is_active FROM vendors WHERE id = $1',
        [id]
      );

      if (result.rows.length === 0) {
        return res.status(404).json({ message: 'Vendor not found' });
      }

      const vendor = result.rows[0];

      if (vendor.deactivation_status === 'pending_activation') {
        return res
          .status(400)
          .json({ message: 'Activation request is already pending' });
      }

      if (vendor.is_active && vendor.deactivation_status === 'active') {
        return res
          .status(400)
          .json({ message: 'Vendor is already active' });
      }

      const updatedVendor = await pool.query(
        `UPDATE vendors 
         SET deactivation_status = 'pending_activation',
             deactivation_requested_by = $1,
             deactivation_requested_at = CURRENT_TIMESTAMP
         WHERE id = $2
         RETURNING id, name, company_name, email, company_type, is_active, deactivation_status`,
        [req.user.id, id]
      );

      // Emit Socket.IO event
      const io = req.app.get('io');
      io.emit('vendor_status_changed', updatedVendor.rows[0]);

      res.status(200).json({
        message:
          'Vendor activation request submitted successfully. Awaiting Super Admin approval.',
      });
    } catch (error) {
      console.error('Error in reactivation request:', error.message);
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  },
];

// Get All Vendors
exports.getAllVendors = [
  verifyToken,
  async (req, res) => {
    try {
      if (req.user.role !== 'vendor') {
        return res.status(403).json({
          message: 'Unauthorized: Only Vendor Admins can view Vendors',
        });
      }

      const result = await pool.query(
        `SELECT 
          id, 
          name, 
          company_name, 
          company_type, 
          gstin, 
          contact_number, 
          email, 
          address, 
          pincode, 
          created_at,
          is_active,
          deactivation_status
        FROM vendors`
      );

      const vendors = result.rows;

      res.status(200).json({
        message: 'Vendors fetched successfully',
        vendors,
      });
    } catch (error) {
      console.error('Error fetching vendors:', error.message);
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  },
];