export default function ReferralBonus() {
  const bonuses = [
    { range: "$100 – $499", bonus: "$10" },
    { range: "$500 – $4,999", bonus: "$25" },
    { range: "$5,000 – $24,999", bonus: "$75" },
    { range: "$25,000 – $49,999", bonus: "$200" },
    { range: "$50,000 & Above", bonus: "$500" },
  ];

  return (
    <div className="min-h-screen bg-primary text-primary px-6 py-20">
      <div className="max-w-6xl mx-auto">
        
        {/* PAGE HEADING */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-semibold bg-gradient-to-r from-blue-300 via-blue-400 to-cyan-400 bg-clip-text text-transparent">
            Referral Bonus
          </h1>
          <p className="mt-4 text-secondary">
            Earn instant rewards when your referrals make a deposit
          </p>
        </div>

        {/* TABLE CARD */}
        <div
          className="
            rounded-2xl
            border border-white/10
            bg-card
            backdrop-blur-md
            overflow-hidden
            transition-all duration-300
            hover:shadow-[0_0_30px_rgba(59,130,246,0.35)]
          "
        >
          {/* HEADER */}
          <div className="grid grid-cols-2 text-white bg-gradient-to-r from-blue-600 via-cyan-600 to-blue-600 border-b border-white/10">
            <div className="p-6 text-lg font-semibold">
              Deposit Amount
            </div>
            <div className="p-6 text-lg text-right font-semibold">
              Bonus
            </div>
          </div>

          {/* ROWS */}
          {bonuses.map((item, index) => (
            <div
              key={index}
              className="
                grid grid-cols-2
                border-t border-white/10
                hover:bg-white/5
                transition-colors duration-200
              "
            >
              <div className="p-6 text-lg text-primary">
                {item.range}
              </div>

              <div className="p-6 text-right font-semibold text-lg bg-gradient-to-r from-blue-300 to-cyan-300 bg-clip-text text-transparent">
                {item.bonus}
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}
