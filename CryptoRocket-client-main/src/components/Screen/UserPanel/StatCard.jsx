/* eslint-disable react/prop-types */
import { useNavigate } from "react-router-dom";

const StatCard = ({
  title,
  value,
  icon,
  iconImage,
  change,
  changeType,
  path,
  data,
}) => {
  const isPositive = changeType === "positive";
  const navigate = useNavigate();

  const handleNavigate = () => {
    if (path) navigate(path, { state: data });
  };

  return (
    <div
      className="cursor-pointer bg-cyan-900/20 backdrop-blur-md border border-cyan-800/50 rounded-2xl p-4 shadow-lg hover:shadow-cyan-400/50 transition-all duration-300"
      onClick={handleNavigate}
    >
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 flex items-center justify-center rounded-full bg-cyan-800/50 border border-cyan-700/50">
          <img
            src={iconImage || icon}
            alt={title}
            className="w-8 h-8 object-contain"
          />
        </div>
        <div className="flex-1">
          <p className="text-sm text-cyan-200">{title}</p>
          <p className="text-2xl font-bold text-cyan-100">{value || 0}</p>
        </div>
      </div>

      {change && (
        <div
          className={`mt-4 text-xs flex items-center font-semibold ${
            isPositive ? "text-cyan-400" : "text-red-400"
          }`}
        >
          <i
            className={`fa-solid ${
              isPositive ? "fa-arrow-up" : "fa-arrow-down"
            } mr-1`}
          ></i>
          {change} in last 7 days
        </div>
      )}
    </div>
  );
};

export default StatCard;
