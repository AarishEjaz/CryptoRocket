import React from 'react';
import { Gift, DollarSign, TrendingUp } from 'lucide-react';

const ReferralBonusTable = () => {
    const bonusTiers = [
        { range: "$100 - $499", bonus: "$10", color: "from-blue-500/20 to-cyan-500/20", borderColor: "border-blue-500/30" },
        { range: "$500 - $4,999", bonus: "$25", color: "from-purple-500/20 to-pink-500/20", borderColor: "border-purple-500/30" },
        { range: "$5,000 - $24,999", bonus: "$75", color: "from-orange-500/20 to-yellow-500/20", borderColor: "border-orange-500/30" },
        { range: "$25,000 - $49,999", bonus: "$200", color: "from-emerald-500/20 to-teal-500/20", borderColor: "border-emerald-500/30" },
        { range: "$50,000 & Above", bonus: "$500", color: "from-amber-500/20 to-orange-500/20", borderColor: "border-amber-500/30" },
    ];

    return (
        <div className="card hero-glass p-6 space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-glass-border pb-4">
                <div className="flex items-center gap-3">
                    <div className="p-3 rounded-xl bg-gradient-to-br from-hero-primary/20 to-delft-blue/20 border border-hero-primary/30">
                        <Gift className="w-6 h-6 text-hero-primary" />
                    </div>
                    <div>
                        <h2 className="text-2xl font-bold hero-text-gradient">Referral Bonus Structure</h2>
                        <p className="text-hero-secondary text-sm">Earn instant rewards for every referral deposit</p>
                    </div>
                </div>
                <div className="hidden md:flex items-center gap-2 px-4 py-2 rounded-lg bg-emerald-500/10 border border-emerald-500/30">
                    <TrendingUp className="w-5 h-5 text-emerald-400" />
                    <span className="text-emerald-400 font-semibold">Up to $500</span>
                </div>
            </div>

            {/* Desktop Table View */}
            <div className="hidden md:block overflow-hidden rounded-xl border border-glass-border">
                <table className="w-full">
                    <thead>
                        <tr className="bg-gradient-to-r from-space-cadet/50 to-delft-blue/30">
                            <th className="px-6 py-4 text-left">
                                <div className="flex items-center gap-2">
                                    <DollarSign className="w-5 h-5 text-hero-primary" />
                                    <span className="text-hero-primary font-bold text-lg">Deposit Amount</span>
                                </div>
                            </th>
                            <th className="px-6 py-4 text-left">
                                <div className="flex items-center gap-2">
                                    <Gift className="w-5 h-5 text-emerald-400" />
                                    <span className="text-emerald-400 font-bold text-lg">Bonus</span>
                                </div>
                            </th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-glass-border">
                        {bonusTiers.map((tier, index) => (
                            <tr
                                key={index}
                                className={`bg-gradient-to-r ${tier.color} hover:brightness-110 transition-all duration-300 group`}
                            >
                                <td className="px-6 py-5">
                                    <div className="flex items-center gap-3">
                                        <div className={`w-2 h-2 rounded-full bg-hero-primary group-hover:scale-150 transition-transform duration-300`}></div>
                                        <span className="text-white font-bold text-xl tracking-wide">{tier.range}</span>
                                    </div>
                                </td>
                                <td className="px-6 py-5">
                                    <div className="flex items-center gap-2">
                                        <span className="text-emerald-400 font-extrabold text-2xl group-hover:scale-110 transition-transform duration-300">
                                            {tier.bonus}
                                        </span>
                                        {index === bonusTiers.length - 1 && (
                                            <span className="px-3 py-1 rounded-full bg-amber-500/20 border border-amber-500/30 text-amber-400 text-xs font-bold animate-pulse">
                                                MAX
                                            </span>
                                        )}
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Mobile Card View */}
            <div className="md:hidden space-y-3">
                {bonusTiers.map((tier, index) => (
                    <div
                        key={index}
                        className={`p-4 rounded-xl bg-gradient-to-br ${tier.color} border ${tier.borderColor} hover:scale-[1.02] transition-all duration-300`}
                    >
                        <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-2">
                                <DollarSign className="w-4 h-4 text-hero-primary" />
                                <span className="text-hero-secondary text-xs font-medium">Deposit Range</span>
                            </div>
                            {index === bonusTiers.length - 1 && (
                                <span className="px-2 py-1 rounded-full bg-amber-500/20 border border-amber-500/30 text-amber-400 text-xs font-bold">
                                    MAX
                                </span>
                            )}
                        </div>
                        <div className="text-white font-bold text-lg mb-3">{tier.range}</div>
                        <div className="flex items-center justify-between pt-3 border-t border-glass-border">
                            <div className="flex items-center gap-2">
                                <Gift className="w-4 h-4 text-emerald-400" />
                                <span className="text-hero-secondary text-xs font-medium">Bonus Earned</span>
                            </div>
                            <span className="text-emerald-400 font-extrabold text-xl">{tier.bonus}</span>
                        </div>
                    </div>
                ))}
            </div>

            {/* Footer Note */}
            <div className="flex items-start gap-3 p-4 rounded-lg bg-blue-500/10 border border-blue-500/20">
                <div className="p-2 rounded-lg bg-blue-500/20">
                    <svg className="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                </div>
                <div className="flex-1">
                    <h4 className="text-blue-400 font-bold mb-1">Important Note</h4>
                    <p className="text-hero-secondary text-sm leading-relaxed">
                        Referral bonuses are credited <span className="text-white font-semibold">instantly</span> when your referred user makes a deposit.
                        Multiple referrals = Multiple bonuses! There's <span className="text-emerald-400 font-semibold">no limit</span> to how much you can earn.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default ReferralBonusTable;
