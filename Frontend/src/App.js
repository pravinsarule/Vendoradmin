
// src/App.js
import React from 'react';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Login } from "./Pages/Auth/Login.js";
import { Dashboard } from './Pages/Dashboard/Dashboard.js';
import { Home } from './Pages/Home/Home';
import User from './Pages/Dashboard/User.js';
import CreateUser from "./Pages/Dashboard/CreateUser";
import ProtectedRoute from './Pages/Auth/ProtectedRoute'; // Path to your ProtectedRoute

export const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/Home" element={<Home />} />
        <Route path="/Login" element={<Login />} />

        {/* Protected Routes */}
        <Route
          path="/Dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/User"
          element={
            <ProtectedRoute>
              <User />
            </ProtectedRoute>
          }
        />
        <Route
          path="/create-user"
          element={
            <ProtectedRoute>
              <CreateUser />
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
};
