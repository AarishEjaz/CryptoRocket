// Stats.jsx
export default function Stats() {
  return (
    <section className="py-24 bg-secondary text-primary">
      <div className="max-w-[900px] mx-auto grid sm:grid-cols-2 lg:grid-cols-4 gap-6 px-6">
        {[
          ["23,470+", "Active Users"],
          ["100%", "On-chain Transparency"],
          ["1 USDT", "Minimum Entry"],
          ["Global", "Community Access"],
        ].map(([value, label], i) => (
          <div key={i} className="p-6 rounded-xl border border-light bg-card text-center shadow-medium hover:shadow-blue transition-all duration-300">
            <p className="text-3xl font-bold text-success">{value}</p>
            <p className="text-secondary text-sm mt-2">{label}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
