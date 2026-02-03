export default function PlanPage() {
  const plans = [
    {
      title: "Economic Growth Plan",
      duration: "45 Days",
      rows: [
        { range: "$5,000 – $24,999", dailyROI: "6%", totalROI: "270%" },
      ],
    },
    {
      title: "Diamond Growth Plan",
      duration: "60 Days",
      rows: [
        { range: "$25,000 – $99,999", dailyROI: "7%", totalROI: "420%" },
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-primary text-primary px-6 py-20">
      <div className="max-w-7xl mx-auto">

        {/* PAGE HEADING */}
        <div className="text-center mb-14">
          <h1 className="text-4xl md:text-5xl font-semibold bg-gradient-to-r from-cyan-300 via-cyan-400 to-blue-400 bg-clip-text text-transparent">
            Investment Growth Plans
          </h1>
          <p className="mt-4 text-secondary">
            Choose the plan that fits your investment goals
          </p>
        </div>

        {/* GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          {plans.map((plan, index) => (
            <div
              key={index}
              className="
                rounded-2xl
                border border-light
                bg-card
                backdrop-blur-md
                overflow-hidden
                transition-all duration-300
                hover:shadow-cyan
                hover:-translate-y-1
              "
            >
              {/* CARD TITLE */}
              <div className="px-8 py-6 border-b border-light bg-gradient-to-r from-cyan-500/20 to-blue-500/20">
                <h2 className="text-2xl font-semibold text-light">
                  {plan.title} –{" "}
                  <span className="text-light">{plan.duration}</span>
                </h2>
              </div>

              {/* TABLE HEADER */}
              <div className="grid grid-cols-3 text-primary border-b border-light text-sm font-semibold">
                <div className="p-6">Deposit Range</div>
                <div className="p-6 text-center">Daily ROI</div>
                <div className="p-6 text-right">Total ROI</div>
              </div>

              {/* ROWS */}
              {plan.rows.map((row, i) => (
                <div
                  key={i}
                  className="grid grid-cols-3 border-t border-light hover:bg-secondary transition-colors duration-200"
                >
                  <div className="p-6 text-lg text-primary">{row.range}</div>
                  <div className="p-6 text-center text-cyan-400 font-semibold text-lg">
                    {row.dailyROI}
                  </div>
                  <div className="p-6 text-right text-blue-400 font-semibold text-lg">
                    {row.totalROI}
                  </div>
                </div>
              ))}
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}

