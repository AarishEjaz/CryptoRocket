import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { setLoading } from "../../redux/slices/loadingSlice";
import { 
  getAvailableIncomeBalance, 
  reinvestFromIncome, 
  getReinvestmentHistory 
} from "../../api/user.api";
import { NumberFormatCommas } from "../../utils/FormatText";
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

// Quick Amount Button
const QuickAmountBtn = ({ amount, onClick, isSelected }) => (
  <button
    onClick={() => onClick(amount)}
    className={`px-4 py-2 rounded-lg font-medium transition-all ${
      isSelected
        ? "bg-emerald-500 text-white"
        : "bg-slate-800/60 text-slate-300 hover:bg-slate-700/60"
    }`}
  >
    ${amount}
  </button>
);

const ReinvestmentPage = () => {
  const dispatch = useDispatch();
  const [balanceData, setBalanceData] = useState(null);
  const [historyData, setHistoryData] = useState([]);
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

      // Fetch balance and history in parallel
      const [balanceRes, historyRes] = await Promise.all([
        getAvailableIncomeBalance(),
        getReinvestmentHistory()
      ]);

      if (balanceRes?.success) {
        setBalanceData(balanceRes.data);
      }

      if (historyRes?.success) {
        setHistoryData(historyRes.data?.history || []);
        setSummary(historyRes.data?.summary || null);
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

    if (reinvestAmount < 10) {
      toast.error("Minimum reinvestment amount is $10");
      return;
    }

    if (reinvestAmount > (balanceData?.currentIncome || 0)) {
      toast.error("Insufficient balance");
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await reinvestFromIncome({ amount: reinvestAmount });

      if (response?.success) {
        toast.success(response.message || "Reinvestment successful!");
        setAmount("");
        fetchData(); // Refresh data
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

  const handleMaxClick = () => {
    setAmount(balanceData?.currentIncome?.toFixed(2) || "0");
  };

  const quickAmounts = [10, 25, 50, 100, 250, 500];

  return (
    <div className="space-y-6 mt-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-white flex items-center gap-3">
          <i className="fa-solid fa-arrows-rotate text-emerald-500"></i>
          Reinvestment
        </h1>
        <p className="text-slate-400 mt-1">
          Reinvest your earned income (ROI, Level Income, etc.) back into your investment
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          icon="fa-wallet"
          label="Available Balance"
          value={`$${(balanceData?.currentIncome || 0).toFixed(2)}`}
          color="bg-emerald-500/20 text-emerald-400"
          subLabel="Available for reinvestment"
        />
        <StatCard
          icon="fa-sack-dollar"
          label="Current Investment"
          value={`$${(balanceData?.currentInvestment || 0).toFixed(2)}`}
          color="bg-blue-500/20 text-blue-400"
          subLabel="Total principal amount"
        />
        <StatCard
          icon="fa-coins"
          label="Total Earned"
          value={`$${(balanceData?.totalIncome || 0).toFixed(2)}`}
          color="bg-amber-500/20 text-amber-400"
          subLabel="Lifetime earnings"
        />
        <StatCard
          icon="fa-arrows-rotate"
          label="Total Reinvested"
          value={`$${(balanceData?.totalReinvested || 0).toFixed(2)}`}
          color="bg-purple-500/20 text-purple-400"
          subLabel={`${summary?.totalTransactions || 0} transactions`}
        />
      </div>

      {/* Reinvestment Form */}
      <div className="bg-slate-900/40 backdrop-blur-md border border-slate-700/60 rounded-2xl overflow-hidden">
        <div className="p-5 border-b border-slate-700/60 bg-gradient-to-r from-emerald-900/20 to-teal-900/10">
          <h3 className="text-xl font-bold text-white flex items-center gap-2">
            <i className="fa-solid fa-hand-holding-dollar text-emerald-400"></i>
            Reinvest Now
          </h3>
          <p className="text-slate-400 text-sm mt-1">
            Convert your income into investment and earn more ROI
          </p>
        </div>

        <div className="p-5 space-y-5">
          {/* Balance Info */}
          <div className="flex items-center justify-between p-4 bg-slate-800/40 rounded-xl">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 flex items-center justify-center rounded-lg bg-emerald-500/20 text-emerald-400">
                <i className="fa-solid fa-wallet"></i>
              </div>
              <div>
                <p className="text-slate-400 text-sm">Available for Reinvestment</p>
                <p className="text-white font-bold text-lg">
                  $<NumberFormatCommas value={balanceData?.currentIncome || 0} decimalScale={2} />
                </p>
              </div>
            </div>
            <button
              onClick={handleMaxClick}
              className="px-4 py-2 bg-emerald-500/20 text-emerald-400 rounded-lg text-sm font-medium hover:bg-emerald-500/30 transition-colors"
            >
              Max
            </button>
          </div>

          {/* Quick Amounts */}
          <div>
            <p className="text-slate-400 text-sm mb-3">Quick Select</p>
            <div className="flex flex-wrap gap-2">
              {quickAmounts.map((amt) => (
                <QuickAmountBtn
                  key={amt}
                  amount={amt}
                  onClick={(a) => setAmount(a.toString())}
                  isSelected={parseFloat(amount) === amt}
                />
              ))}
            </div>
          </div>

          {/* Amount Input */}
          <div>
            <label className="text-slate-400 text-sm mb-2 block">Reinvestment Amount</label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-lg">$</span>
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0.00"
                min="10"
                max={balanceData?.currentIncome || 0}
                className="w-full bg-slate-800/60 border border-slate-700 rounded-xl py-3.5 pl-10 pr-4 text-white text-lg placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                onKeyDown={(e) => ['ArrowUp', 'ArrowDown', 'e', 'E', '+', '-'].includes(e.key) && e.preventDefault()}
                onWheel={(e) => e.target.blur()}
              />
            </div>
            <p className="text-slate-500 text-xs mt-2">
              Minimum: $10 | Maximum: ${(balanceData?.currentIncome || 0).toFixed(2)}
            </p>
          </div>

          {/* Preview */}
          {amount && parseFloat(amount) > 0 && (
            <div className="p-4 bg-emerald-900/20 border border-emerald-500/30 rounded-xl">
              <h4 className="text-emerald-400 font-medium mb-3 flex items-center gap-2">
                <i className="fa-solid fa-calculator"></i>
                Reinvestment Preview
              </h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-slate-400">Current Investment</span>
                  <span className="text-white">${(balanceData?.currentInvestment || 0).toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Reinvesting</span>
                  <span className="text-emerald-400">+${parseFloat(amount || 0).toFixed(2)}</span>
                </div>
                <hr className="border-slate-700" />
                <div className="flex justify-between font-bold">
                  <span className="text-white">New Investment</span>
                  <span className="text-emerald-400">
                    ${((balanceData?.currentInvestment || 0) + parseFloat(amount || 0)).toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Remaining Balance</span>
                  <span className="text-amber-400">
                    ${((balanceData?.currentIncome || 0) - parseFloat(amount || 0)).toFixed(2)}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Submit Button */}
          <button
            onClick={handleReinvest}
            disabled={isSubmitting || !amount || parseFloat(amount) <= 0 || parseFloat(amount) > (balanceData?.currentIncome || 0)}
            className={`w-full py-4 rounded-xl font-bold text-lg transition-all flex items-center justify-center gap-2 ${
              isSubmitting || !amount || parseFloat(amount) <= 0 || parseFloat(amount) > (balanceData?.currentIncome || 0)
                ? "bg-slate-700 text-slate-400 cursor-not-allowed"
                : "bg-gradient-to-r from-emerald-600 to-teal-600 text-white hover:from-emerald-500 hover:to-teal-500 shadow-lg hover:shadow-emerald-500/25"
            }`}
          >
            {isSubmitting ? (
              <>
                <i className="fa-solid fa-spinner fa-spin"></i>
                Processing...
              </>
            ) : (
              <>
                <i className="fa-solid fa-arrows-rotate"></i>
                Reinvest Now
              </>
            )}
          </button>
        </div>
      </div>

      {/* Reinvestment History */}
      <div className="bg-slate-900/40 backdrop-blur-md border border-slate-700/60 rounded-2xl overflow-hidden">
        <div className="p-5 border-b border-slate-700/60">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
            <div>
              <h3 className="text-xl font-bold text-white flex items-center gap-2">
                <i className="fa-solid fa-clock-rotate-left text-blue-400"></i>
                Reinvestment History
              </h3>
              <p className="text-slate-400 text-sm mt-1">
                Your recent reinvestment transactions
              </p>
            </div>
            {summary && (
              <div className="flex items-center gap-4 text-sm">
                <div className="bg-slate-800/60 px-3 py-1.5 rounded-lg">
                  <span className="text-slate-400">Today: </span>
                  <span className="text-emerald-400 font-semibold">
                    ${(summary.todayTotal || 0).toFixed(2)}
                  </span>
                </div>
                <div className="bg-slate-800/60 px-3 py-1.5 rounded-lg">
                  <span className="text-slate-400">Total: </span>
                  <span className="text-white font-semibold">
                    ${(summary.totalReinvested || 0).toFixed(2)}
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-slate-800/40 text-slate-400 text-sm">
                <th className="text-left px-5 py-3 font-medium">#</th>
                <th className="text-left px-5 py-3 font-medium">Transaction ID</th>
                <th className="text-left px-5 py-3 font-medium">Amount</th>
                <th className="text-left px-5 py-3 font-medium">Status</th>
                <th className="text-left px-5 py-3 font-medium">Date & Time</th>
              </tr>
            </thead>
            <tbody>
              {visibleHistory.length > 0 ? (
                visibleHistory.map((tx, index) => (
                  <tr
                    key={tx._id || index}
                    className="border-b border-slate-700/40 hover:bg-slate-800/30 transition-colors"
                  >
                    <td className="px-5 py-4 text-slate-400">
                      {startIndex + index + 1}
                    </td>
                    <td className="px-5 py-4">
                      <span className="text-white font-medium">{tx.id || "N/A"}</span>
                    </td>
                    <td className="px-5 py-4">
                      <span className="text-emerald-400 font-semibold">
                        +$<NumberFormatCommas value={tx.investment || 0} decimalScale={2} />
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${
                        tx.status === "Completed"
                          ? "bg-blue-500/20 text-blue-400"
                          : tx.status === "Processing"
                          ? "bg-amber-500/20 text-amber-400"
                          : "bg-red-500/20 text-red-400"
                      }`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${
                          tx.status === "Completed"
                            ? "bg-blue-400"
                            : tx.status === "Processing"
                            ? "bg-amber-400"
                            : "bg-red-400"
                        }`}></span>
                        {tx.status}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-slate-400 text-sm">
                      {tx.createdAt ? moment(tx.createdAt).format("DD MMM YYYY, hh:mm A") : "N/A"}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="px-5 py-12 text-center">
                    <div className="flex flex-col items-center gap-2">
                      <i className="fa-solid fa-inbox text-4xl text-slate-600"></i>
                      <p className="text-slate-400">No reinvestment history found</p>
                      <p className="text-slate-500 text-sm">Start reinvesting to see your history here</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {historyData.length > itemsPerPage && (
          <div className="p-4 border-t border-slate-700/40">
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={(page) => setCurrentPage(page)}
            />
          </div>
        )}
      </div>

      {/* Info Note */}
      <div className="bg-slate-900/30 border border-slate-700/40 rounded-xl p-4">
        <div className="flex items-start gap-3">
          <i className="fa-solid fa-circle-info text-blue-400 mt-0.5"></i>
          <div className="text-sm">
            <p className="text-slate-300">
              <span className="font-semibold text-white">About Reinvestment:</span> Reinvesting your income adds to your principal investment amount, which will earn more daily ROI.
            </p>
            <ul className="mt-2 text-slate-400 space-y-1">
              <li className="flex items-center gap-2">
                <i className="fa-solid fa-check text-emerald-400 w-4"></i>
                <span>Minimum reinvestment: <strong className="text-white">$10</strong></span>
              </li>
              <li className="flex items-center gap-2">
                <i className="fa-solid fa-check text-emerald-400 w-4"></i>
                <span>Instantly added to your investment</span>
              </li>
              <li className="flex items-center gap-2">
                <i className="fa-solid fa-check text-emerald-400 w-4"></i>
                <span>Start earning higher ROI immediately</span>
              </li>
              <li className="flex items-center gap-2">
                <i className="fa-solid fa-check text-emerald-400 w-4"></i>
                <span>No transaction fees for reinvestment</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReinvestmentPage;

