import React, { useState } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";

const CalendarComponent = () => {
  const [date, setDate] = useState(new Date());

  return (
    <div className="w-80 bg-white p-4 rounded-2xl shadow-lg">
      <h2 className="text-xl font-semibold text-gray-800 mb-3">Timeline</h2>
      <Calendar
        onChange={setDate}
        value={date}
        className="border-none"
      />
      <button className="mt-4 w-full py-2 bg-blue-500 text-white rounded-lg">
        Add Event +
      </button>
    </div>
  );
};

export default CalendarComponent;
