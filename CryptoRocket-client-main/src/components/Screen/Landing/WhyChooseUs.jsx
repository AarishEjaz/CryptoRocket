import { ShieldCheck, Eye, Coins, Users } from "lucide-react";

const points = [
  {
    icon: ShieldCheck,
    text: "Fully decentralized & non-custodial",
  },
  {
    icon: Eye,
    text: "Transparent smart contract execution",
  },
  {
    icon: Coins,
    text: "Low entry barrier (1 USDT)",
  },
  {
    icon: Users,
    text: "Community-driven ecosystem",
  },
];

export default function WhyChooseUs() {
  return (
    <section className="py-24 bg-secondary text-primary">
      <div className="max-w-6xl mx-auto px-6">

        {/* Heading */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-semibold bg-gradient-to-r from-cyan-300 via-cyan-400 to-blue-400 bg-clip-text text-transparent">
            Why Choose Us
          </h2>
          <p className="mt-4 text-secondary">
            Built for transparency, security, and long-term growth
          </p>
        </div>

        {/* Points */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
          {points.map((item, i) => {
            const Icon = item.icon;
            return (
              <div
                key={i}
                className="
                  flex items-center gap-4
                  p-6 rounded-2xl
                  bg-card
                  border border-light
                  backdrop-blur-md
                  transition-all duration-300
                  hover:shadow-cyan
                  hover:border-accent
                "
              >
                <div className="w-12 h-12 flex items-center justify-center rounded-xl bg-cyan-400/10">
                  <Icon className="text-cyan-400" size={26} />
                </div>

                <p className="text-lg font-medium text-primary">
                  {item.text}
                </p>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
