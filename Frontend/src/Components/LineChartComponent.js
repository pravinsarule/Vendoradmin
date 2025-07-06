import React from "react";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

const data = [
  { month: "Jan", domestic: 120, international: 100 },
  { month: "Feb", domestic: 140, international: 110 },
  { month: "Mar", domestic: 150, international: 120 },
  { month: "Apr", domestic: 180, international: 130 },
  { month: "May", domestic: 170, international: 140 },
  { month: "Jun", domestic: 160, international: 135 },
];

const LineChartComponent = () => {
  return (
    <div className="bg-white p-6 rounded-2xl shadow-lg w-full">
      <h3 className="text-lg font-semibold mb-3 text-gray-700">Flights Schedule</h3>
      <ResponsiveContainer width="100%" height={250}>
        <LineChart data={data}>
          <XAxis dataKey="month" />
          <YAxis />
          <Tooltip />
          <Line type="monotone" dataKey="domestic" stroke="#fbbf24" strokeWidth={3} />
          <Line type="monotone" dataKey="international" stroke="#000" strokeWidth={3} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default LineChartComponent;
