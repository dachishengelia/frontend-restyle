import React from "react";
import { useNavigate } from "react-router-dom";

export default function BackButton({ className = "" }) {
  const navigate = useNavigate();

  return (
    <button
      onClick={() => navigate(-1)}
      className={`text-2xl font-bold text-gray-900 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400 transition-colors mb-4 ${className}`}
      aria-label="Go back"
    >
      {"<"}
    </button>
  );
}