import React from 'react'
import { BrowserRouter, Routes, Route, Router } from "react-router-dom";
import {Login} from "../Pages/Auth/Login.js";
import { Home } from "../Pages/Home/Home.js";
import { RouterProvider } from 'react-router-dom';
// import { AuthProvider } from "./Login/AuthContext.js";
import { Dashboard } from '../Pages/Dashboard/Dashboard.js';

export const routes = () => {
  return (
    <Router>
        <Routes>
          
          <Route path="/" element={<Home/>} />
          <Route path="/Login" element={<Login />} />
          <Route path="/Dashboard" element={<Dashboard/>} />
          
        </Routes>
    </Router>
  )
}
