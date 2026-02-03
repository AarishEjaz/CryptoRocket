/* eslint-disable react/prop-types */

import { getMoneySymbol } from "../../../utils/additionalFunc";


const PlanCard = ({ plan, onSelect, isAdmin = false }) => {
  const isRecommended = plan.recommended;
  const inActive = plan.status === false;
  const type = plan.planType || "BASIC";

  const typeConfig = {
    BASIC: {
      gradient: "from-blue-600/20 to-indigo-600/10",
      border: "border-blue-500/30",
      glow: "shadow-blue-500/10",
      button: "bg-gradient-to-r from-blue-600 to-indigo-600",
      accent: "text-blue-400"
    },
    ECONOMIC: {
      gradient: "from-emerald-600/20 to-teal-600/10",
      border: "border-emerald-500/30",
      glow: "shadow-emerald-500/10",
      button: "bg-gradient-to-r from-emerald-600 to-teal-600",
      accent: "text-emerald-400"
    },
    DIAMOND: {
      gradient: "from-purple-600/20 to-pink-600/10",
      border: "border-purple-500/30",
      glow: "shadow-purple-500/10",
      button: "bg-gradient-to-r from-purple-600 to-pink-600",
      accent: "text-purple-400"
    }
  }[type] || {
    gradient: "from-slate-600/20 to-slate-800/10",
    border: "border-slate-700/50",
    glow: "shadow-slate-500/5",
    button: "bg-slate-700",
    accent: "text-slate-400"
  };

  return (
    <div
      className={`
        group relative flex flex-col p-6 rounded-[2rem] transition-all duration-500 hover:-translate-y-2
        bg-slate-900/40 backdrop-blur-xl border-2 ${typeConfig.border} ${typeConfig.glow}
        hover:shadow-2xl hover:bg-slate-900/60
        ${inActive ? "opacity-60 grayscale" : ""}
      `}
    >
      {/* Decorative Background Elements */}
      <div className={`absolute inset-0 bg-gradient-to-br ${typeConfig.gradient} rounded-[2rem] -z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-500`}></div>
      <div className="absolute -top-4 -right-4 w-20 h-20 bg-gradient-to-br from-white/10 to-transparent rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700"></div>

      {/* Badges */}
      <div className="flex justify-between items-start mb-6">
        <div className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-[0.2em] bg-slate-800/80 border border-slate-700/50 ${typeConfig.accent}`}>
          {type} PlAN
        </div>
        {isRecommended && (
          <div className="px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-[0.2em] bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-lg shadow-orange-500/20">
            Recommended
          </div>
        )}
      </div>

      {/* Pricing & Info */}
      <div className="text-center mb-6">
        <h3 className="text-xl font-black text-white uppercase tracking-tight mb-1 group-hover:tracking-wider transition-all duration-300">
          {plan.title}
        </h3>
        <div className="flex items-baseline justify-center gap-1">
          <span className="text-4xl font-black text-white tracking-tighter">
            {getMoneySymbol()}{plan.min}
          </span>
          <span className="text-slate-500 font-bold uppercase text-[10px] tracking-widest">entry</span>
        </div>
      </div>

      {/* Stats Table */}
      <div className="grid grid-cols-2 gap-3 mb-6">
        <div className="bg-slate-800/40 p-3 rounded-2xl border border-slate-700/30 text-center">
          <p className="text-[9px] font-bold text-slate-500 uppercase tracking-widest mb-1">Daily ROI</p>
          <p className={`text-lg font-black ${typeConfig.accent}`}>{plan.dailyRoi}%</p>
        </div>
        <div className="bg-slate-800/40 p-3 rounded-2xl border border-slate-700/30 text-center">
          <p className="text-[9px] font-bold text-slate-500 uppercase tracking-widest mb-1">Duration</p>
          <p className="text-lg font-black text-white">{plan.duration}D</p>
        </div>
      </div>

      {/* Features */}
      <div className="space-y-3 mb-8 flex-grow">
        {(plan.features || []).slice(0, 4).map((feature, index) => (
          <div key={index} className="flex items-center gap-2 group/item">
            <div className={`w-4 h-4 rounded-full flex items-center justify-center bg-slate-800/80 border border-slate-700/50 group-hover/item:scale-110 transition-transform`}>
              <i className={`fa-solid fa-check ${typeConfig.accent} text-[7px]`}></i>
            </div>
            <span className="text-xs font-medium text-slate-400 group-hover/item:text-slate-200 transition-colors truncate">{feature}</span>
          </div>
        ))}
      </div>

      {/* Footer / Action */}
      <button
        onClick={() => onSelect(plan)}
        disabled={inActive}
        className={`
          w-full py-3.5 rounded-2xl font-black text-xs uppercase tracking-[0.2em] transition-all duration-300
          ${inActive
            ? "bg-slate-800 text-slate-600 cursor-not-allowed"
            : `${typeConfig.button} text-white shadow-xl hover:shadow-2xl hover:brightness-110 active:scale-[0.98]`
          }
        `}
      >
        {isAdmin ? "Edit Configuration" : "Start Growing"}
      </button>

      {/* Total Returns Indicator */}
      <div className="mt-4 text-center">
        <p className="text-[9px] font-bold text-slate-600 uppercase tracking-[0.15em]">
          EXPECTED TOTAL RETURN: <span className="text-slate-400">{plan.totalRoi}%</span>
        </p>
      </div>
    </div>
  );
};

export default PlanCard;
