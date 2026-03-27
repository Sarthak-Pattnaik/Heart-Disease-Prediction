// components/PageToggle.tsx

import { useLocation, useNavigate } from "react-router-dom";

export default function PageToggle() {
  const location = useLocation();
  const navigate = useNavigate();

  const isAnalysis = location.pathname === "/dashboard";

  const handleClick = () => {
    navigate(isAnalysis ? "/" : "/dashboard");
  };

  return (
    <button
      onClick={handleClick}
      className="absolute top-4 right-4 bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg text-white font-medium z-30"
    >
      {isAnalysis ? "Prediction" : "Analysis"}
    </button>
  );
}