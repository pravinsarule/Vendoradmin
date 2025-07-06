import React from "react";

const routes = [
  { route: "Paris (CDG) - New York (JFK)", distance: "5,834 km", passengers: "140,000" },
  { route: "Hong Kong (HKG) - Los Angeles (LAX)", distance: "11,062 km", passengers: "130,000" },
  { route: "Frankfurt (FRA) - Bangkok (BKK)", distance: "8,927 km", passengers: "120,000" },
];

const TopRoutesTable = () => {
  return (
    <div className="bg-white p-6 rounded-2xl shadow-lg w-full">
      <h3 className="text-lg font-semibold mb-3 text-gray-700">Top Flight Routes</h3>
      <table className="w-full text-left">
        <thead className="bg-gray-200">
          <tr>
            <th className="p-2">Route</th>
            <th className="p-2">Distance</th>
            <th className="p-2">Passengers</th>
          </tr>
        </thead>
        <tbody>
          {routes.map((route, index) => (
            <tr key={index} className="border-t">
              <td className="p-2">{route.route}</td>
              <td className="p-2">{route.distance}</td>
              <td className="p-2 font-semibold">{route.passengers}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TopRoutesTable;
