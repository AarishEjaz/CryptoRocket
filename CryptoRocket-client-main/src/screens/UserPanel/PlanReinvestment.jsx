import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { setLoading } from "../../redux/slices/loadingSlice";
import {
    getAvailableIncomeBalance,
    getPlanReinvestmentHistory,
    reinvestFromIncomeForPlan,
    getPlanInfo
} from "../../api/user.api";
import { NumberFormatCommas } from "../../utils/FormatText";
import { getMoneySymbol } from "../../utils/additionalFunc";
import { toast } from "react-toastify";
import moment from "moment";
import Pagination from "../../components/Screen/UserPanel/Pagination";

// Stats Card Component
const StatCard = ({ icon, label, value, color, subLabel }) => (
    <div className="bg-slate-900/40 backdrop-blur-md border border-slate-700/60 rounded-xl p-5 hover:border-slate-600 transition-all">
        <div className="flex items-center gap-4">
            <div className={`w-14 h-14 flex items-center justify-center rounded-xl ${color}`}>
                <i className={`fa-solid ${icon} text-2xl`}></i>
            </div>
            <div>
                <p className="text-slate-400 text-sm">{label}</p>
                <p className="text-white font-bold text-xl">{value}</p>
                {subLabel && <p className="text-slate-500 text-xs mt-0.5">{subLabel}</p>}
            </div>
        </div>
    </div>
);

const PlanReinvestment = () => {
    const dispatch = useDispatch();
    const [balanceData, setBalanceData] = useState(null);
    const [historyData, setHistoryData] = useState([]);
    const [plans, setPlans] = useState([]);
    const [selectedPlanId, setSelectedPlanId] = useState("");
    const [summary, setSummary] = useState(null);
    const [amount, setAmount] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    const totalPages = Math.ceil(historyData.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const visibleHistory = historyData.slice(startIndex, startIndex + itemsPerPage);

    const fetchData = async () => {
        try {
            dispatch(setLoading(true));
            const [balanceRes, historyRes, plansRes] = await Promise.all([
                getAvailableIncomeBalance(),
                getPlanReinvestmentHistory(),
                getPlanInfo()
            ]);

            if (balanceRes?.success) setBalanceData(balanceRes.data);
            if (historyRes?.success) {
                setHistoryData(historyRes.data?.history || []);
                setSummary(historyRes.data?.summary || null);
            }
            if (plansRes?.success) {
                const activePlans = (plansRes.data || []).filter(p => p.status !== false);
                setPlans(activePlans);
                if (activePlans.length > 0) setSelectedPlanId(activePlans[0]._id);
            }
        } catch (error) {
            console.error("Error fetching data:", error);
            toast.error("Failed to load data");
        } finally {
            dispatch(setLoading(false));
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleReinvest = async () => {
        const reinvestAmount = parseFloat(amount);
        if (!reinvestAmount || reinvestAmount <= 0) {
            toast.error("Please enter a valid amount");
            return;
        }
        if (reinvestAmount < 1) {
            toast.error("Minimum reinvestment amount is $1");
            return;
        }
        if (!selectedPlanId) {
            toast.error("Please select a plan");
            return;
        }
        if (reinvestAmount > (balanceData?.currentIncome || 0)) {
            toast.error("Insufficient balance");
            return;
        }

        setIsSubmitting(true);
        try {
            const response = await reinvestFromIncomeForPlan({ amount: reinvestAmount, planId: selectedPlanId });
            if (response?.success) {
                toast.success(response.message || "Plan reinvestment successful!");
                setAmount("");
                fetchData();
            } else {
                toast.error(response?.message || "Reinvestment failed");
            }
        } catch (error) {
            console.error("Reinvestment error:", error);
            toast.error("Failed to process reinvestment");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="space-y-6 pt-4">
            <div>
                <h1 className="text-2xl md:text-3xl font-bold text-white flex items-center gap-3">
                    <i className="fa-solid fa-arrows-rotate text-purple-500"></i>
                    Plan Reinvestment
                </h1>
                <p className="text-slate-400 mt-1">Reinvest your income back into growth plans to compound your returns.</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                <StatCard
                    icon="fa-wallet"
                    label="Available Balance"
                    value={`${getMoneySymbol()}${(balanceData?.currentIncome || 0).toFixed(2)}`}
                    color="bg-purple-500/20 text-purple-400"
                />
                <StatCard
                    icon="fa-arrows-rotate"
                    label="Total Plan Reinvested"
                    value={`${getMoneySymbol()}${(summary?.totalReinvested || 0).toFixed(2)}`}
                    color="bg-blue-500/20 text-blue-400"
                    subLabel={`${summary?.totalTransactions || 0} plan transactions`}
                />
                <StatCard
                    icon="fa-chart-line"
                    label="Active Investment"
                    value={`${getMoneySymbol()}${(balanceData?.currentInvestment || 0).toFixed(2)}`}
                    color="bg-blue-500/20 text-blue-400"
                />
            </div>

            <div className="bg-slate-900/40 backdrop-blur-md border border-slate-700/60 rounded-2xl overflow-hidden p-6">
                <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                    <i className="fa-solid fa-seedling text-blue-400"></i>
                    Compound Growth
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-4">
                        <div>
                            <label className="text-slate-400 text-sm mb-2 block">Select Plan</label>
                            <select
                                value={selectedPlanId}
                                onChange={(e) => setSelectedPlanId(e.target.value)}
                                className="w-full bg-slate-800/60 border border-slate-700 rounded-xl py-3 px-4 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                            >
                                {plans.map(p => (
                                    <option key={p._id} value={p._id}>{p.title} ({p.dailyRoi}% ROI)</option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="text-slate-400 text-sm mb-2 block">Amount to Reinvest</label>
                            <div className="relative">
                                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">$</span>
                                <input
                                    type="number"
                                    value={amount}
                                    onChange={(e) => setAmount(e.target.value)}
                                    placeholder="0.00"
                                    onKeyDown={(e) => ['ArrowUp', 'ArrowDown', 'e', 'E', '+', '-'].includes(e.key) && e.preventDefault()}
                                    onWheel={(e) => e.target.blur()}
                                    min="1"
                                    className="w-full bg-slate-800/60 border border-slate-700 rounded-xl py-3 pl-10 pr-4 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                                />
                            </div>
                            <div className="flex justify-between mt-2">
                                <span className="text-xs text-slate-500">Min: $1</span>
                                <button
                                    onClick={() => setAmount(balanceData?.currentIncome?.toFixed(2) || "0")}
                                    className="text-xs text-purple-400 hover:text-purple-300"
                                >
                                    Max available
                                </button>
                            </div>
                        </div>

                        <button
                            onClick={handleReinvest}
                            disabled={isSubmitting || !amount || parseFloat(amount) < 1}
                            className="w-full py-4 rounded-xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 text-white hover:from-purple-500 hover:to-blue-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-purple-600/20"
                        >
                            {isSubmitting ? "Processing..." : "Reinvest in Plan"}
                        </button>
                    </div>

                    <div className="bg-slate-800/40 p-5 rounded-xl border border-slate-700/40">
                        <h4 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">Summary</h4>
                        <div className="space-y-3 text-sm">
                            <div className="flex justify-between">
                                <span className="text-slate-400">Available Balance</span>
                                <span className="text-white">${balanceData?.currentIncome?.toFixed(2) || "0.00"}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-slate-400">Reinvest Amount</span>
                                <span className="text-purple-400 font-bold">${parseFloat(amount || 0).toFixed(2)}</span>
                            </div>
                            <div className="border-t border-slate-700 my-2"></div>
                            <div className="flex justify-between">
                                <span className="text-slate-400">Remaining After</span>
                                <span className="text-amber-400">${Math.max(0, (balanceData?.currentIncome || 0) - parseFloat(amount || 0)).toFixed(2)}</span>
                            </div>
                        </div>
                        <div className="mt-6 p-3 bg-blue-500/10 border border-blue-500/20 rounded-lg">
                            <p className="text-xs text-blue-300">
                                <i className="fa-solid fa-info-circle mr-2"></i>
                                Reinvesting into a plan will add to your total investment and start generating ROI based on the selected plan's individual percentage.
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* History */}
            <div className="bg-slate-900/40 backdrop-blur-md border border-slate-700/60 rounded-2xl overflow-hidden">
                <div className="p-5 border-b border-slate-700/60 flex justify-between items-center">
                    <h3 className="font-bold text-white">Recent Plan Reinvestments</h3>
                    <span className="text-xs text-slate-400">{historyData.length} records found</span>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="bg-slate-800/60 text-slate-400 text-left">
                                <th className="px-6 py-3">Transaction ID</th>
                                <th className="px-6 py-3">Plan</th>
                                <th className="px-6 py-3">Amount</th>
                                <th className="px-6 py-3">Date</th>
                                <th className="px-6 py-3 text-right">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-800">
                            {visibleHistory.map(tx => (
                                <tr key={tx._id} className="hover:bg-slate-800/40 transition-colors">
                                    <td className="px-6 py-4 text-slate-300 font-mono">{tx.id}</td>
                                    <td className="px-6 py-4 text-blue-400">{tx.plan?.title || "Plan"}</td>
                                    <td className="px-6 py-4 text-white font-bold">${tx.investment}</td>
                                    <td className="px-6 py-4 text-slate-400">{moment(tx.createdAt).format("DD MMM, YYYY")}</td>
                                    <td className="px-6 py-4 text-right">
                                        <span className="px-2 py-1 bg-blue-500/20 text-blue-400 rounded text-[10px] font-bold uppercase tracking-wider">
                                            {tx.status}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                            {visibleHistory.length === 0 && (
                                <tr>
                                    <td colSpan="5" className="px-6 py-10 text-center text-slate-500 italic">No plan reinvestment history found.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
                {totalPages > 1 && (
                    <div className="p-4 border-t border-slate-800">
                        <Pagination
                            currentPage={currentPage}
                            totalPages={totalPages}
                            onPageChange={setCurrentPage}
                        />
                    </div>
                )}
            </div>
        </div>
    );
};

export default PlanReinvestment;
