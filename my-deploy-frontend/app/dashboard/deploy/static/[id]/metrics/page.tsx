import React from "react";

const LogsDashboard = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="w-full max-w-4xl bg-white shadow-md rounded-md border border-gray-300 p-6">
        {/* Title */}
        <h2 className="text-xl font-semibold text-gray-800">Network Metrics</h2>
        <p className="text-sm text-gray-500">Usage this month: 0 MB</p>

        {/* Chart-like Container */}
        <div className="mt-6 border-t border-gray-200 pt-4">
          <h3 className="text-lg font-medium text-gray-700">No metrics for static service</h3>
        </div>
      </div>
    </div>
  );
};

export default LogsDashboard;
