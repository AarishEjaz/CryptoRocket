import React, { useState } from "react";
import { LandingRouters } from "../../../constants/routes";
import { useNavigate } from "react-router-dom";

const faqData = [
  {
    question: "What is ZeptoDeFi?",
    answer: [
      "ZeptoDeFi is a next-generation decentralized finance (DeFi) investment platform.",
      "It is designed to simplify market complexity using advanced technology and data-driven strategies.",
      "The platform focuses on transparency, sustainability, and long-term value creation.",
    ],
    icon: "🌌",
    color: "from-cyan-500 to-blue-500",
  },
  {
    question: "How do ZeptoDeFi investment plans work?",
    answer: [
      "Users choose from multiple growth plans based on duration and investment range.",
      "Each plan offers a fixed daily ROI for a defined number of days.",
      "Returns are automatically generated based on the selected plan rules.",
      "Higher investment tiers provide higher daily and total ROI percentages.",
    ],
    icon: "📈",
    color: "from-blue-500 to-indigo-500",
  },
  {
    question: "What investment plans are available?",
    answer: [
      "Basic Growth Plan: 30 days with up to 7% daily ROI depending on investment size.",
      "Economic Growth Plan: 45 days with 6% daily ROI.",
      "Diamond Growth Plan: 60 days with 7% daily ROI and the highest total returns.",
    ],
    icon: "💎",
    color: "from-cyan-500 to-sky-500",
  },
  {
    question: "How does the referral bonus system work?",
    answer: [
      "Users earn fixed referral bonuses based on their referral’s deposit amount.",
      "Higher referral investments unlock higher bonus rewards.",
      "Referral bonuses are credited instantly once conditions are met.",
    ],
    icon: "🤝",
    color: "from-blue-500 to-cyan-500",
  },
  {
    question: "What is Level ROI Dividend?",
    answer: [
      "Users earn additional ROI based on their team depth and unlocked levels.",
      "Levels 1–3 provide 5% ROI, while deeper levels provide decreasing percentages.",
      "Level unlocks depend on the number of direct referrals and minimum investment.",
    ],
    icon: "⭐",
    color: "from-sky-500 to-cyan-500",
  },
  {
    question: "What are the withdrawal rules?",
    answer: [
      "The minimum withdrawal amount is $1.",
      "A 10% deduction applies to every withdrawal.",
      "Withdrawals distribute income across upline and downline levels.",
    ],
    icon: "💸",
    color: "from-blue-500 to-sky-500",
  },
  {
    question: "Is ZeptoDeFi safe to use?",
    answer: [
      "The platform follows predefined rules with transparent investment structures.",
      "All plans, ROI rates, and conditions are clearly disclosed.",
      "Users retain full control over their participation and withdrawal actions.",
    ],
    icon: "🛡️",
    color: "from-cyan-500 to-indigo-500",
  },
];

const Faq1 = () => {
  const navigate = useNavigate();
  const [openIndex, setOpenIndex] = useState(0);
  const [hoveredIndex, setHoveredIndex] = useState(null);

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="relative container mx-auto lg:px-[115px] py-20 bg-primary text-primary" id="faq">

      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-10 left-1/4 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-10 right-1/4 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl animate-pulse" />
      </div>

      {/* Header */}
      <div className="relative flex flex-col items-center gap-6 max-w-[800px] mx-auto text-center mb-16">
        <div className="relative">
          <div className="absolute inset-0 bg-cyan-500/30 rounded-2xl blur-xl animate-pulse" />
          <div className="relative flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-cyan-400 to-blue-500 shadow-2xl">
            <span className="text-3xl">❓</span>
          </div>
        </div>

        <h2 className="text-4xl lg:text-6xl font-bold">
          <span className="bg-gradient-to-r from-cyan-300 via-cyan-400 to-blue-400 bg-clip-text text-transparent">
            Frequently Asked
          </span>
          <br />
          <span className="text-primary">Questions</span>
        </h2>

        <p className="text-lg text-secondary max-w-2xl">
          Everything you need to know about{" "}
          <span className="text-cyan-400 font-semibold">ZeptoDeFi</span>
        </p>
      </div>

      {/* FAQ */}
      <div className="max-w-[900px] mx-auto space-y-4">
        {faqData.map((item, index) => {
          const isOpen = openIndex === index;

          return (
            <div key={index}>
              <div
                onClick={() => toggleFAQ(index)}
                className={`rounded-2xl cursor-pointer transition-all duration-300 ${
                  isOpen
                    ? "bg-card border border-cyan-400/40 shadow-xl scale-[1.02]"
                    : "bg-card border border-light hover:border-cyan-400/30"
                }`}
              >
                <div className="flex items-start gap-4 p-6">
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${item.color} flex items-center justify-center text-2xl`}>
                    {item.icon}
                  </div>

                  <div className="flex-1">
                    <h3 className="text-lg font-semibold">{item.question}</h3>
                  </div>
                </div>

                {isOpen && (
                  <div className="px-6 pb-6 space-y-3">
                    {item.answer.map((line, i) => (
                      <div key={i} className="flex gap-3 text-secondary">
                        <span className="text-cyan-400">✔</span>
                        <span>{line}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* CTA */}
      <div className="mt-12 text-center">
        <button
          onClick={() => navigate(LandingRouters.USER_REGISTER)}
          className="px-8 py-3 rounded-full font-semibold text-white
                     bg-gradient-to-r from-cyan-400 to-blue-500
                     hover:shadow-xl hover:scale-105 transition"
        >
          Contact Support
        </button>
      </div>
    </section>
  );
};

export default Faq1;
