import { Wallet, Layers, Cpu, ArrowDownUp, Sparkles } from "lucide-react";

const steps = [
  {
    icon: Wallet,
    title: "Connect Wallet",
    desc: "Link your BSC-compatible wallet in seconds with secure Web3 integration.",
    gradient: "from-blue-500 to-cyan-500",
  },
  {
    icon: Layers,
    title: "Choose Your Plan",
    desc: "Pick from flexible investment tiers designed for every budget and goal.",
    gradient: "from-cyan-500 to-blue-400",
  },
  {
    icon: Cpu,
    title: "Auto-Invest",
    desc: "Smart contracts handle everything automatically—secure, transparent, audited.",
    gradient: "from-blue-400 to-cyan-500",
  },
  {
    icon: ArrowDownUp,
    title: "Earn Daily",
    desc: "Watch your returns grow daily with instant withdrawal access anytime.",
    gradient: "from-cyan-500 to-blue-500",
  },
];

export default function HowItWorks() {
  return (
    <section className="relative max-w-7xl mx-auto px-6 py-32 text-primary overflow-hidden">
      {/* Background Decoration */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-blue-500/10 rounded-full blur-3xl"></div>

      {/* Heading */}
      <div className="relative text-center mb-20">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/10 border border-blue-400/30 text-sm text-blue-300 mb-6 backdrop-blur-sm">
          <Sparkles size={16} />
          <span>Simple Process</span>
        </div>

        <h2 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-blue-300 via-blue-400 to-cyan-400 bg-clip-text text-transparent">
          How It Works
        </h2>

        <p className="mt-6 text-secondary text-lg max-w-2xl mx-auto">
          Get started in minutes with our streamlined investment process
        </p>
      </div>

      {/* Steps Grid */}
      <div className="relative grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {steps.map((step, i) => {
          const Icon = step.icon;
          return (
            <div
              key={i}
              className="group relative p-8 rounded-3xl bg-card border border-white/10 backdrop-blur-xl transition-all duration-500 hover:scale-105 hover:border-blue-400/50 hover:shadow-[0_0_30px_rgba(59,130,246,0.35)]"
            >
              {/* Step Number */}
              <div className="absolute -top-4 -right-4 w-12 h-12 flex items-center justify-center rounded-full bg-gradient-to-br from-blue-600 to-cyan-600 text-white font-bold text-lg shadow-[0_0_20px_rgba(59,130,246,0.6)]">
                {i + 1}
              </div>

              {/* Icon */}
              <div
                className={`relative w-16 h-16 flex items-center justify-center rounded-2xl bg-gradient-to-br ${step.gradient} mb-6 shadow-[0_0_20px_rgba(34,211,238,0.4)] group-hover:scale-110 transition-transform duration-300`}
              >
                <Icon className="text-white" size={28} strokeWidth={2.5} />
              </div>

              {/* Title */}
              <h3 className="text-2xl font-bold mb-4 text-primary">
                {step.title}
              </h3>

              {/* Description */}
              <p className="text-secondary leading-relaxed">
                {step.desc}
              </p>

              {/* Hover Glow */}
              <div
                className={`absolute inset-0 rounded-3xl bg-gradient-to-br ${step.gradient} opacity-0 group-hover:opacity-10 blur-xl transition-opacity duration-500`}
              />
            </div>
          );
        })}
      </div>

      {/* Connection Line (Desktop) */}
      <div className="hidden lg:block absolute top-[280px] left-0 right-0 h-0.5">
        <div className="max-w-7xl mx-auto px-6 relative">
          <div className="absolute left-[12.5%] right-[12.5%] h-0.5 bg-gradient-to-r from-transparent via-blue-400/30 to-transparent"></div>
        </div>
      </div>
    </section>
  );
}

