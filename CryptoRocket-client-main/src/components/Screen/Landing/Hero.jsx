import { ArrowRight, TrendingUp, Shield, Zap } from "lucide-react";

export default function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-transparent py-20">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-cyan-500/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 text-center max-w-6xl px-6">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-gradient-to-r from-blue-500/10 to-cyan-500/10 border border-blue-400/30 text-sm text-blue-200 mb-8 backdrop-blur-sm hover:border-blue-400/50 transition-all duration-300 animate-fade-in">
          <TrendingUp size={16} className="animate-bounce" />
          <span className="font-medium">
            Start with just 1 USDT • Powered by BSC Network
          </span>
        </div>

        {/* Heading */}
        <h1 className="text-5xl md:text-7xl lg:text-8xl font-extrabold leading-tight animate-fade-in-up">
          <span className="bg-gradient-to-r from-blue-300 via-blue-400 to-cyan-400 bg-clip-text text-transparent drop-shadow-2xl">
            AI Automation and Smart Agents for
          </span>
          <br />
          <span className="bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
            Transparent Digital Markets
          </span>
        </h1>

        {/* Description */}
        <p className="mt-8 text-gray-300 text-xl max-w-3xl mx-auto leading-relaxed animate-fade-in-up delay-200">
          Experience the future of decentralized finance with our cutting-edge platform.
          Earn passive income with transparent, secure, and automated smart contracts on BSC.
        </p>

        {/* Feature Pills */}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-4 animate-fade-in-up delay-300">
          <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-sm text-gray-300">
            <Shield size={14} className="text-blue-400" />
            <span>100% Secure</span>
          </div>
          <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-sm text-gray-300">
            <Zap size={14} className="text-cyan-400" />
            <span>Instant Withdrawals</span>
          </div>
        </div>

        {/* Buttons */}
        <div className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-6 animate-fade-in-up delay-400">
          <button className="group flex items-center gap-2 px-10 py-5 rounded-2xl bg-gradient-to-r from-blue-600 via-cyan-600 to-blue-600 text-white font-bold text-lg shadow-[0_0_40px_rgba(59,130,246,0.6)] hover:shadow-[0_0_60px_rgba(59,130,246,1)] transition-all duration-300 hover:scale-105 active:scale-95">
            Start Investing Now
            <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
          </button>

          <button className="px-10 py-5 rounded-2xl border-2 border-blue-400/50 text-white font-semibold text-lg hover:bg-blue-500/10 hover:border-blue-400 backdrop-blur-sm transition-all duration-300 hover:scale-105 active:scale-95">
            View Documentation
          </button>
        </div>

        {/* Stats Grid */}
        <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto animate-fade-in-up delay-500">
          <div className="group rounded-2xl bg-gradient-to-br from-blue-900/50 to-black/50 border border-blue-500/30 backdrop-blur-xl px-6 py-8 hover:border-blue-400/60 hover:shadow-[0_0_30px_rgba(59,130,246,0.4)] transition-all duration-300 hover:scale-105">
            <p className="text-xs text-blue-300 tracking-widest uppercase font-semibold">
              Total Value Locked
            </p>
            <p className="mt-3 text-3xl font-bold bg-gradient-to-r from-white to-blue-200 bg-clip-text text-transparent">
              $1M+
            </p>
          </div>

          <div className="group rounded-2xl bg-gradient-to-br from-cyan-900/50 to-black/50 border border-cyan-500/30 backdrop-blur-xl px-6 py-8 hover:border-cyan-400/60 hover:shadow-[0_0_30px_rgba(34,211,238,0.4)] transition-all duration-300 hover:scale-105">
            <p className="text-xs text-cyan-300 tracking-widest uppercase font-semibold">
              Active Investors
            </p>
            <p className="mt-3 text-3xl font-bold bg-gradient-to-r from-white to-cyan-200 bg-clip-text text-transparent">
              4000+
            </p>
          </div>

          <div className="group rounded-2xl bg-gradient-to-br from-blue-900/50 to-black/50 border border-blue-500/30 backdrop-blur-xl px-6 py-8 hover:border-blue-400/60 hover:shadow-[0_0_30px_rgba(59,130,246,0.4)] transition-all duration-300 hover:scale-105">
            <p className="text-xs text-blue-300 tracking-widest uppercase font-semibold">
              Daily Returns
            </p>
            <p className="mt-3 text-3xl font-bold bg-gradient-to-r from-white to-blue-200 bg-clip-text text-transparent">
              Up to 7%
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

