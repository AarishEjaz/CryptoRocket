import React, { useState, useEffect } from "react";
import { Wallet, ArrowUpRight, DollarSign, CreditCard, Shield, CheckCircle, AlertCircle, TrendingUp, Send, UserPlus, Search, X } from 'lucide-react';
import { toast } from "react-toastify";
import { getROIWalletBalance, depositFromROIWallet, depositForOtherUser, transferROIWallet } from "../../api/user.api";

const getMoneySymbol = () => "$";

const DepositCardPage = () => {
  const [activeTab, setActiveTab] = useState("deposit"); // deposit, topup, transfer
  const [amount, setAmount] = useState("");
  const [targetUserId, setTargetUserId] = useState("");
  const [loading, setLoading] = useState(false);
  const [walletBalance, setWalletBalance] = useState({
    roiWallet: 0,
    levelIncomeWallet: 0,
    totalDepositWallet: 0,
    currentIncome: 0
  });
  const [searchUser, setSearchUser] = useState("");
  const [searchedUser, setSearchedUser] = useState(null);

  // Calculate button disabled state
  const isButtonDisabled = React.useMemo(() => {
    const numAmount = Number(amount) || 0;
    const hasTargetId = targetUserId?.trim() || "";
    
    if (loading) return true;
    if (!amount) return true;
    if (numAmount < 5) return true;
    
    if (activeTab === "transfer") {
      if (!hasTargetId) return true;
      if (numAmount > (walletBalance.roiWallet || 0)) return true;
    }
    
    if (activeTab === "topup") {
      if (!hasTargetId) return true;
      if (numAmount > (walletBalance.totalDepositWallet || 0)) return true;
    }
    
    if (activeTab === "deposit") {
      if (numAmount > (walletBalance.totalDepositWallet || 0)) return true;
    }
    
    return false;
  }, [loading, amount, targetUserId, activeTab, walletBalance]);

  useEffect(() => {
    fetchWalletBalance();
  }, []);

  const fetchWalletBalance = async () => {
    try {
      const response = await getROIWalletBalance();
      if (response.success) {
        setWalletBalance(response.data);
      }
    } catch (error) {
      console.error("Error fetching wallet balance:", error);
    }
  };

  const handleDepositForOwn = async () => {
    const numberAmount = Number(amount);
    
    if (numberAmount <= 0) {
      toast.error("Deposit Amount must be greater than 0");
      return;
    }
    
    if (numberAmount < 5) {
      toast.error("Minimum deposit amount is $5");
      return;
    }

    if (numberAmount > walletBalance.totalDepositWallet) {
      toast.error(`Insufficient balance. Available: $${walletBalance.totalDepositWallet.toFixed(2)}`);
      return;
    }
    
    setLoading(true);
    try {
      const response = await depositFromROIWallet({ amount: numberAmount });
      if (response.success) {
        toast.success(response.message || "Deposit successful!");
        setAmount("");
        await fetchWalletBalance();
      } else {
        toast.error(response.message || "Deposit failed");
      }
    } catch (error) {
      console.error("Error in deposit:", error);
      toast.error(error.response?.data?.message || "Error processing deposit");
    } finally {
      setLoading(false);
    }
  };

  const handleDepositForOther = async () => {
    const numberAmount = Number(amount);
    
    if (numberAmount <= 0) {
      toast.error("Deposit Amount must be greater than 0");
      return;
    }
    
    if (numberAmount < 5) {
      toast.error("Minimum deposit amount is $5");
      return;
    }

    if (!targetUserId?.trim()) {
      toast.error("Please enter target user ID");
      return;
    }

    if (numberAmount > walletBalance.totalDepositWallet) {
      toast.error(`Insufficient balance. Available: $${walletBalance.totalDepositWallet.toFixed(2)}`);
      return;
    }
    
    setLoading(true);
    try {
      const response = await depositForOtherUser({ 
        amount: numberAmount,
        targetUserId: targetUserId.trim()
      });
      if (response.success) {
        toast.success(response.message || "Top-up successful!");
        setAmount("");
        setTargetUserId("");
        setSearchedUser(null);
        await fetchWalletBalance();
      } else {
        toast.error(response.message || "Top-up failed");
      }
    } catch (error) {
      console.error("Error in top-up:", error);
      toast.error(error.response?.data?.message || "Error processing top-up");
    } finally {
      setLoading(false);
    }
  };

  const handleTransfer = async () => {
    const numberAmount = Number(amount);
    
    if (numberAmount <= 0) {
      toast.error("Transfer Amount must be greater than 0");
      return;
    }

    if (!targetUserId?.trim()) {
      toast.error("Please enter target user ID");
      return;
    }

    if (numberAmount > walletBalance.roiWallet) {
      toast.error(`Insufficient ROI wallet balance. Available: $${walletBalance.roiWallet.toFixed(2)}`);
      return;
    }
    
    setLoading(true);
    try {
      const response = await transferROIWallet({ 
        amount: numberAmount,
        targetUserId: targetUserId.trim()
      });
      if (response.success) {
        toast.success(response.message || "Transfer successful!");
        setAmount("");
        setTargetUserId("");
        setSearchedUser(null);
        await fetchWalletBalance();
      } else {
        toast.error(response.message || "Transfer failed");
      }
    } catch (error) {
      console.error("Error in transfer:", error);
      toast.error(error.response?.data?.message || "Error processing transfer");
    } finally {
      setLoading(false);
    }
  };

  const formatAmount = (amt) => {
    return amt ? Number(amt).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : "0.00";
  };

  const quickAmounts = [5, 10, 25, 50, 100, 500];

  const setQuickAmount = (value) => {
    setAmount(value.toString());
  };

  return (
    <div className="max-w-4xl mx-auto">
      {/* Wallet Balance Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-gradient-to-br from-blue-900/50 to-blue-800/30 border border-blue-700/30 rounded-xl p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-blue-300 text-sm">ROI Wallet</span>
            <TrendingUp className="w-4 h-4 text-blue-400" />
          </div>
          <p className="text-2xl font-bold text-white">{getMoneySymbol()}{formatAmount(walletBalance.roiWallet)}</p>
        </div>
        <div className="bg-gradient-to-br from-purple-900/50 to-purple-800/30 border border-purple-700/30 rounded-xl p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-purple-300 text-sm">Level Income Wallet</span>
            <UserPlus className="w-4 h-4 text-purple-400" />
          </div>
          <p className="text-2xl font-bold text-white">{getMoneySymbol()}{formatAmount(walletBalance.levelIncomeWallet)}</p>
        </div>
        <div className="bg-gradient-to-br from-blue-900/50 to-blue-800/30 border border-blue-700/30 rounded-xl p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-blue-300 text-sm">Total Deposit Wallet</span>
            <Wallet className="w-4 h-4 text-blue-400" />
          </div>
          <p className="text-2xl font-bold text-white">{getMoneySymbol()}{formatAmount(walletBalance.totalDepositWallet)}</p>
        </div>
      </div>

      {/* Main Card */}
      <div className="relative bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 border border-blue-800/30 rounded-3xl p-8 shadow-2xl hover:shadow-blue-500/10 transition-all duration-500 overflow-hidden">
        
        {/* Background Pattern */}
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/5 via-transparent to-cyan-600/5"></div>
        
        {/* Header */}
        <div className="relative flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <div className="p-4 bg-gradient-to-br from-blue-500/20 to-emerald-500/20 border border-blue-500/30 rounded-2xl shadow-lg shadow-blue-500/10">
              <CreditCard className="w-8 h-8 text-blue-400" />
            </div>
            <div>
              <h2 className="text-3xl font-bold text-white mb-1">
                Deposit Card
              </h2>
              <p className="text-slate-400">Manage ROI & Level Income wallets</p>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="relative mb-6 flex gap-2 border-b border-slate-700/50">
          <button
            onClick={() => {
              setActiveTab("deposit");
              setAmount("");
              setTargetUserId("");
              setSearchedUser(null);
            }}
            className={`px-6 py-3 font-semibold transition-all duration-300 border-b-2 ${
              activeTab === "deposit"
                ? "border-blue-500 text-blue-400"
                : "border-transparent text-slate-400 hover:text-slate-300"
            }`}
          >
            Deposit for Own ID
          </button>
          <button
            onClick={() => {
              setActiveTab("topup");
              setAmount("");
              setTargetUserId("");
              setSearchedUser(null);
            }}
            className={`px-6 py-3 font-semibold transition-all duration-300 border-b-2 ${
              activeTab === "topup"
                ? "border-blue-500 text-blue-400"
                : "border-transparent text-slate-400 hover:text-slate-300"
            }`}
          >
            Top-up for Other User
          </button>
          <button
            onClick={() => {
              setActiveTab("transfer");
              setAmount("");
              setTargetUserId("");
              setSearchedUser(null);
            }}
            className={`px-6 py-3 font-semibold transition-all duration-300 border-b-2 ${
              activeTab === "transfer"
                ? "border-blue-500 text-blue-400"
                : "border-transparent text-slate-400 hover:text-slate-300"
            }`}
          >
            Transfer ROI Wallet
          </button>
        </div>

        {/* Quick Amount Buttons */}
        <div className="relative mb-6">
          <label className="flex items-center gap-2 text-sm font-semibold text-slate-300 mb-3">
            <DollarSign className="w-4 h-4 text-blue-400" />
            Quick Select Amount
          </label>
          <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
            {quickAmounts.map((value) => (
              <button
                key={value}
                onClick={() => setQuickAmount(value)}
                className={`p-3 rounded-xl text-sm font-semibold transition-all duration-300 border ${
                  amount === value.toString()
                    ? 'bg-gradient-to-r from-blue-600/30 to-emerald-600/30 border-blue-500/50 text-blue-300'
                    : 'bg-slate-800/50 border-slate-700/50 text-slate-300 hover:border-blue-600/30 hover:bg-blue-600/10'
                }`}
              >
                {getMoneySymbol()}{value.toLocaleString()}
              </button>
            ))}
          </div>
        </div>

        {/* Amount Input */}
        <div className="relative mb-6">
          <label className="flex items-center gap-2 text-sm font-semibold text-slate-300 mb-3">
            <Wallet className="w-4 h-4 text-cyan-400" />
            {activeTab === "transfer" ? "Transfer Amount" : "Deposit Amount"} ({getMoneySymbol()})
          </label>
          <div className="relative group">
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="Enter amount"
              min="5"
              step="0.01"
              className="w-full bg-slate-800/50 border border-slate-700/50 rounded-xl py-4 px-5 text-white text-2xl font-bold focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500/50 transition-all duration-300 group-hover:border-blue-600/30 pr-20"
              onKeyDown={(e) => ['ArrowUp', 'ArrowDown', 'e', 'E', '+', '-'].includes(e.key) && e.preventDefault()}
              onWheel={(e) => e.target.blur()}
            />
            {amount && (
              <div className="absolute right-5 top-1/2 -translate-y-1/2">
                <span className="text-blue-400 font-bold text-sm">
                  {getMoneySymbol()}{formatAmount(amount)}
                </span>
              </div>
            )}
          </div>
          {amount && Number(amount) > 0 && (
            <div className="mt-2">
              {Number(amount) >= 5 ? (
                <p className="text-xs text-blue-400 flex items-center gap-1">
                  <CheckCircle className="w-3 h-3" />
                  Amount is valid
                </p>
              ) : (
                <p className="text-xs text-red-400 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" />
                  Minimum amount is $5
                </p>
              )}
            </div>
          )}
        </div>

        {/* Target User Input (for topup and transfer) */}
        {(activeTab === "topup" || activeTab === "transfer") && (
          <div className="relative mb-6">
            <label className="flex items-center gap-2 text-sm font-semibold text-slate-300 mb-3">
              <UserPlus className="w-4 h-4 text-purple-400" />
              Target User ID
            </label>
            <div className="relative">
              <input
                type="text"
                value={targetUserId}
                onChange={(e) => setTargetUserId(e.target.value.trimStart())}
                placeholder="Enter user ID"
                className="w-full bg-slate-800/50 border border-slate-700/50 rounded-xl py-4 px-5 text-white font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500/50 transition-all duration-300"
              />
            </div>
            {activeTab === "transfer" && amount && Number(amount) > 0 && (
              <div className="mt-2">
                {Number(amount) > (walletBalance.roiWallet || 0) ? (
                  <p className="text-xs text-red-400 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" />
                    Insufficient ROI wallet balance. Available: ${(walletBalance.roiWallet || 0).toFixed(2)}
                  </p>
                ) : targetUserId?.trim() ? (
                  <p className="text-xs text-blue-400 flex items-center gap-1">
                    <CheckCircle className="w-3 h-3" />
                    Ready to transfer
                  </p>
                ) : null}
              </div>
            )}
          </div>
        )}

        {/* Submit Button */}
        <button
          onClick={
            activeTab === "deposit" 
              ? handleDepositForOwn 
              : activeTab === "topup" 
              ? handleDepositForOther 
              : handleTransfer
          }
          disabled={isButtonDisabled}
          className={`relative w-full py-4 px-6 rounded-xl font-bold text-lg transition-all duration-300 overflow-hidden group ${
            isButtonDisabled
              ? 'bg-slate-700/50 text-slate-500 cursor-not-allowed border border-slate-600/30'
              : 'bg-gradient-to-r from-blue-600 to-emerald-600 hover:from-blue-500 hover:to-emerald-500 text-white shadow-xl shadow-blue-500/25 hover:shadow-blue-500/40 hover:scale-[1.02] active:scale-[0.98] border border-blue-500/30'
          }`}
        >
          <div className="relative flex items-center justify-center gap-3">
            {loading ? (
              <>
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                <span>Processing...</span>
              </>
            ) : (
              <>
                {activeTab === "deposit" && <ArrowUpRight className="w-5 h-5" />}
                {activeTab === "topup" && <UserPlus className="w-5 h-5" />}
                {activeTab === "transfer" && <Send className="w-5 h-5" />}
                <span>
                  {activeTab === "deposit" && `Deposit ${getMoneySymbol()}${formatAmount(amount)}`}
                  {activeTab === "topup" && `Top-up ${getMoneySymbol()}${formatAmount(amount)}`}
                  {activeTab === "transfer" && `Transfer ${getMoneySymbol()}${formatAmount(amount)}`}
                </span>
              </>
            )}
          </div>
        </button>

        {/* Info Notice */}
        <div className="mt-6 p-4 bg-slate-800/30 border border-slate-700/30 rounded-xl">
          <p className="text-xs text-slate-400 flex items-start gap-2">
            <Shield className="w-4 h-4 text-blue-400 flex-shrink-0 mt-0.5" />
            <span>
              {activeTab === "deposit" && "ROI and Level Income can only be used for deposits. They cannot be withdrawn directly to your main wallet."}
              {activeTab === "topup" && "You can top-up/activate any user's ID using your ROI and Level Income wallets. Minimum amount is $5."}
              {activeTab === "transfer" && "Transfer ROI wallet balance to another user's ROI wallet. Only ROI wallet balance can be transferred."}
            </span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default DepositCardPage;

