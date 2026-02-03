import { TrendingUp, Calendar, DollarSign, Target } from "lucide-react";

export default function BasicGrowthPlan() {
  const rows = [
    { investment: "$1 – $499", roi: "5%", days: "30", total: "150%", badge: "Starter" },
    { investment: "$500 – $4,999", roi: "5.5%", days: "30", total: "165%", badge: "Bronze" },
    { investment: "$5,000 – $24,999", roi: "6%", days: "30", total: "180%", badge: "Silver" },
    { investment: "$25,000 – $49,999", roi: "6.5%", days: "30", total: "195.5%", badge: "Gold" },
    { investment: "$50,000+", roi: "7%", days: "30", total: "210%", badge: "Platinum" },
  ];

  return (
    <div className="relative min-h-screen bg-transparent text-white flex items-center justify-center px-6 py-20">
      {/* Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-blue-500/10 rounded-full blur-3xl"></div>

      <div className="relative w-full max-w-6xl">
        {/* Header Section */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-blue-500/10 to-cyan-500/10 border border-blue-400/30 text-sm text-blue-300 mb-6 backdrop-blur-sm">
            <TrendingUp size={16} />
            <span>Investment Plans</span>
          </div>

          <h1 className="text-4xl md:text-6xl font-bold mb-4">
            <span className="bg-gradient-to-r from-blue-300 via-white to-cyan-300 bg-clip-text text-transparent">
              Basic Growth Plan
            </span>
          </h1>

          <p className="text-gray-300 text-lg">
            30-Day Investment Cycle with Daily Returns
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-12">
          <div className="p-6 rounded-2xl bg-gradient-to-br from-blue-900/30 to-black/30 border border-blue-500/30 backdrop-blur-xl">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 rounded-lg bg-blue-500/20">
                <Calendar className="text-blue-400" size={20} />
              </div>
              <span className="text-sm text-gray-400">Duration</span>
            </div>
            <p className="text-2xl font-bold text-white">30 Days</p>
          </div>

          <div className="p-6 rounded-2xl bg-gradient-to-br from-blue-900/30 to-black/30 border border-blue-500/30 backdrop-blur-xl">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 rounded-lg bg-blue-500/20">
                <DollarSign className="text-blue-400" size={20} />
              </div>
              <span className="text-sm text-gray-400">Min Investment</span>
            </div>
            <p className="text-2xl font-bold text-white">$1 USDT</p>
          </div>

          <div className="p-6 rounded-2xl bg-gradient-to-br from-cyan-900/30 to-black/30 border border-cyan-500/30 backdrop-blur-xl">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 rounded-lg bg-cyan-500/20">
                <Target className="text-cyan-400" size={20} />
              </div>
              <span className="text-sm text-gray-400">Max ROI</span>
            </div>
            <p className="text-2xl font-bold text-white">7% Daily</p>
          </div>
        </div>

        {/* Table */}
        <div className="rounded-3xl border border-blue-500/30 bg-gradient-to-br from-blue-900/20 to-black/40 backdrop-blur-2xl overflow-hidden shadow-2xl">
          {/* Header */}
          <div className="grid grid-cols-5 bg-gradient-to-r from-blue-600/20 to-cyan-600/20 border-b border-blue-400/30">
            <div className="p-6 font-bold text-blue-200">Tier</div>
            <div className="p-6 font-bold text-blue-200">Investment Range</div>
            <div className="p-6 text-center font-bold text-blue-200">Daily ROI</div>
            <div className="p-6 text-center font-bold text-blue-200">Duration</div>
            <div className="p-6 text-right font-bold text-blue-200">Total Return</div>
          </div>

          {/* Rows */}
          {rows.map((row, i) => (
            <div
              key={i}
              className="grid grid-cols-5 border-t border-blue-400/10 hover:bg-gradient-to-r hover:from-blue-500/10 hover:to-cyan-500/10 transition-all duration-300 group"
            >
              <div className="p-6 flex items-center">
                <span className="px-3 py-1 rounded-full bg-gradient-to-r from-blue-600 to-cyan-600 text-white text-xs font-bold">
                  {row.badge}
                </span>
              </div>

              <div className="p-6 flex items-center text-gray-200 font-medium">
                {row.investment}
              </div>

              <div className="p-6 flex items-center justify-center">
                <span className="px-4 py-2 rounded-lg bg-blue-500/20 text-blue-300 font-bold border border-blue-500/30">
                  {row.roi}
                </span>
              </div>

              <div className="p-6 flex items-center justify-center text-gray-300">
                {row.days} Days
              </div>

              <div className="p-6 flex items-center justify-end">
                <span className="px-4 py-2 rounded-lg bg-cyan-500/20 text-cyan-300 font-bold text-lg border border-cyan-500/30 group-hover:scale-110 transition-transform">
                  {row.total}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Footer Note */}
        <div className="mt-8 p-6 rounded-2xl bg-gradient-to-r from-blue-900/20 to-cyan-900/20 border border-blue-500/30 backdrop-blur-xl">
          <p className="text-sm text-gray-300 text-center">
            💡 <span className="font-semibold text-white">Note:</span> All returns are calculated daily and can be withdrawn anytime. ROI returns with capital up to 30 days.
          </p>
        </div>
      </div>
    </div>
  );
}
