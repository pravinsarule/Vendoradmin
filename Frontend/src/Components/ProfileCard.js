// src/components/ProfileCard.js
import React from "react";

const ProfileCard = ({ children, className }) => {
  return (
    <div className={`bg-white p-6 shadow-md rounded-lg ${className}`}>
      {children}
    </div>
  );
};

export default ProfileCard;
