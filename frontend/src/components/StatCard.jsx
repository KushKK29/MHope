import React from "react";

const StatCard = ({ title, value, icon }) => {
  // Convert value to string and handle undefined/null
  const displayValue =
    value !== undefined && value !== null ? value.toString() : "0";

  return (
    <div className="bg-white shadow-lg rounded-xl p-4 hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 border-l-4 border-blue-500">
      <div className="flex items-center justify-between mb-2">
        <h5 className="text-sm font-medium text-gray-700">{title || "N/A"}</h5>
        <div className="text-blue-600 bg-blue-100 p-2 rounded-full">{icon}</div>
      </div>
      <p className="text-2xl font-bold text-gray-900">{displayValue}</p>
    </div>
  );
};

export default StatCard;
// This component is a reusable card that displays statistics.
