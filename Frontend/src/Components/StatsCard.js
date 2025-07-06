import React from "react";

const StatsCard = ({ title, value, percentage, icon }) => {
  return (
    <div className="bg-white p-6 rounded-2xl shadow-lg flex flex-col items-center justify-center text-center space-y-2 w-full">
      <h2 className="text-lg font-semibold text-gray-600">{title}</h2>
      <p className="text-3xl font-bold text-gray-900">{value}</p>
      <p className="text-green-500 text-sm font-medium">{percentage}</p>
    </div>
  );
};

export default StatsCard;
