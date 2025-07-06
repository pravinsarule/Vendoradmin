import React from "react";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";

const data = [
  { name: "SkyHigh Airlines", value: 35 },
  { name: "FlyFast Airways", value: 30 },
  { name: "AeroJet", value: 20 },
  { name: "Nimbus Airlines", value: 15 },
];

const COLORS = ["#fbbf24", "#000", "#8884d8", "#ff8042"];

const PieChartComponent = () => {
  return (
    <div className="bg-white p-6 rounded-2xl shadow-lg w-full">
      <h3 className="text-lg font-semibold mb-3 text-gray-700">Popular Airlines</h3>
      <ResponsiveContainer width="100%" height={250}>
        <PieChart>
          <Pie data={data} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80}>
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

export default PieChartComponent;
