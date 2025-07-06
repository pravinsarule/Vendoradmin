import React from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

const data = [
  { name: "Sun", sales: 1000 },
  { name: "Mon", sales: 2000 },
  { name: "Tue", sales: 4000 },
  { name: "Wed", sales: 3000 },
  { name: "Thu", sales: 3500 },
  { name: "Fri", sales: 2000 },
  { name: "Sat", sales: 1500 },
];

const BarChartComponent = () => {
  return (
    <div className="bg-white p-6 rounded-2xl shadow-lg w-full">
      <h3 className="text-lg font-semibold mb-3 text-gray-700">Ticket Sales</h3>
      <ResponsiveContainer width="100%" height={250}>
        <BarChart data={data}>
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="sales" fill="#fbbf24" radius={[8, 8, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default BarChartComponent;
