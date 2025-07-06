import React from "react";
import {Navbar} from "../../Components/Navbar/Navbar";
import BackImage from '../../Assets/Images/Home.jpeg'
import { Footer } from "../../Components/Footer";
import { useNavigate } from "react-router-dom";

export const Home = () => {
      const navigate = useNavigate();
    
  return (
    
    <>
      
    
     <Navbar/>
     <div className="relative w-full h-screen flex items-center justify-center text-center text-white">
      
      {/* Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center blur-md"
        style={{ backgroundImage: `url(${BackImage})` }}
      ></div>

      
      {/* <div className="absolute inset-0 bg-white bg-opacity-40"></div>  */}

      {/* Content */}
      <div className="relative z-10">
        <h1 className="text-4xl md:text-5xl font-bold mb-4 text-black">Welcome Vendor Admin</h1>
        <p className="text-lg md:text-xl mb-6 text-black">Manage flights, bookings more efficiently.</p>
        
        {/* Get Started Button */}
        <button className="px-6 py-3 bg-blue-600 hover:bg-blue-800 text-white font-semibold rounded-lg shadow-lg transition " onClick={() => navigate("/Login")}>
          Get Started
        </button>
      </div>
    </div>
    <Footer/>
    </>
  );
};
