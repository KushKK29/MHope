import React from "react";
import { useNavigate } from "react-router-dom";
import { FaExclamationTriangle, FaHome, FaSignInAlt } from "react-icons/fa";

const Unauthorized = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
        <div className="mb-6">
          <FaExclamationTriangle className="mx-auto text-6xl text-red-500 mb-4" />
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            Access Denied
          </h1>
          <p className="text-gray-600">
            You don't have permission to access this page. Please contact your
            administrator if you believe this is an error.
          </p>
        </div>

        <div className="space-y-3">
          <button
            onClick={() => navigate("/")}
            className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
          >
            <FaHome />
            Go to Home
          </button>

          <button
            onClick={() => navigate("/login")}
            className="w-full bg-gray-600 text-white py-3 px-4 rounded-lg hover:bg-gray-700 transition-colors flex items-center justify-center gap-2"
          >
            <FaSignInAlt />
            Login with Different Account
          </button>
        </div>
      </div>
    </div>
  );
};

export default Unauthorized;
