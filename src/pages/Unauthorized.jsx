import React from "react";
import { Link } from "react-router-dom";

const Unauthorized = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md text-center">
        <svg
          className="mx-auto h-20 w-20 text-red-600"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
          />
        </svg>

        <h2 className="mt-4 text-2xl font-bold text-gray-800">
          Unauthorized Access
        </h2>

        <p className="mt-2 text-gray-600">
          You don't have permission to access this page.
        </p>

        <div className="mt-6">
          <Link
            to="/"
            className="inline-block px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-md"
          >
            Go to Home
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Unauthorized;
