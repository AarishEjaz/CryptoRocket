import { Users, Share2, TrendingUp } from "lucide-react";

const points = [
  {
    icon: Users,
    text: "A growing community of global participants working together.",
  },
  {
    icon: Share2,
    text: "Referral-based growth that rewards collaboration and trust.",
  },
  {
    icon: TrendingUp,
    text: "Community engagement drives long-term sustainability.",
  },
];

export default function Community() {
  return (
    <section className="py-24 bg-primary text-primary">
      <div className="max-w-6xl mx-auto px-6">

        {/* Heading */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-semibold bg-gradient-to-r from-cyan-300 via-cyan-400 to-blue-400 bg-clip-text text-transparent">
            Community-Driven Growth
          </h2>
          <p className="mt-4 text-secondary max-w-2xl mx-auto">
            Participants grow together through referrals, collaboration,
            and shared incentives.
          </p>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {points.map((item, i) => {
            const Icon = item.icon;
            return (
              <div
                key={i}
                className="
                  p-8 rounded-2xl
                  bg-card
                  border border-light
                  backdrop-blur-md
                  transition-all duration-300
                  hover:shadow-cyan
                  hover:-translate-y-1
                  hover:border-accent
                  text-center
                "
              >
                <div className="w-14 h-14 mx-auto mb-6 flex items-center justify-center rounded-xl bg-cyan-400/10">
                  <Icon className="text-cyan-400" size={28} />
                </div>

                <p className="text-lg text-secondary leading-relaxed">
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
