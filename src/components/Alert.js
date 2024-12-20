import React from "react";

const Alert = ({ message, type, onClose }) => {
  const alertColors = {
    success: "bg-green-500",
    error: "bg-red-500",
    info: "bg-blue-500",
    warning: "bg-yellow-500",
  };

  return (
    <div
      className={`fixed top-5 right-5 z-50 text-white px-4 py-3 rounded shadow-lg flex items-center ${
        alertColors[type] || alertColors.info
      }`}
    >
      <span className="mr-2">{message}</span>
      <button
        className="ml-4 text-xl font-bold hover:opacity-75"
        onClick={onClose}
      >
        &times;
      </button>
    </div>
  );
};

export default Alert;
