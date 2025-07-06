
import React from "react";

export const DashboardCards = ({ activeVendorCount = 0 }) => {
  const cards = [
    { title: "Total Revenue", value: "$124,563", increase: "+14%" },
    {
      title: "Active Vendors",
      value: activeVendorCount.toLocaleString(), // safe now
      increase: "+7.2%",
    },
    { title: "Pending Bookings", value: "45", increase: "+2.5%" },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
      {cards.map((card, index) => (
        <div
          key={index}
          className="bg-white rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow"
        >
          <h3 className="text-gray-500 text-sm">{card.title}</h3>
          <div className="flex items-center justify-between mt-2">
            <span className="text-2xl font-semibold">{card.value}</span>
            <span className="text-green-500 text-sm">{card.increase}</span>
          </div>
        </div>
      ))}
    </div>
  );
};