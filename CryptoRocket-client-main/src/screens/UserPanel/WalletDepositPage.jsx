import React, { useState } from "react";
import { Wallet, ArrowUpRight, DollarSign, CreditCard, Shield, CheckCircle, AlertCircle, TrendingUp, X } from 'lucide-react';
import { toast } from "react-toastify";

// Mock function for demonstration
const getMoneySymbol = () => "$";

const WalletDepositPage = () => {
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const value = e.target.value;
    setAmount(value);
  };

  const handleWalletDepositRequest = async () => {
    const numberAmount = Number(amount);
    
    if (numberAmount <= 0) {
      toast.error("Deposit Amount must be greater than 0");
      return;
    }
    
    if (numberAmount < 100) {
      toast.error("Minimum deposit amount is $100");
      return;
    }
    
    setLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      toast.success("Deposit Request Generated Successfully");
      setAmount("");
    } catch (error) {
      console.error("Error in deposit request:", error);
      toast.error("Error processing deposit request");
    } finally {
      setLoading(false);
    }
  };

  const formatAmount = (amt) => {
    return amt ? Number(amt).toLocaleString() : "0";
  };

  const quickAmounts = [100, 500, 1000, 5000];

  const setQuickAmount = (value) => {
    setAmount(value.toString());
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="relative bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 border border-blue-800/30 rounded-3xl p-8 shadow-2xl hover:shadow-blue-500/10 transition-all duration-500 overflow-hidden">
        
        {/* Background Pattern */}
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/5 via-transparent to-cyan-600/5"></div>
        <div className="absolute top-0 left-0 w-96 h-96 bg-gradient-to-r from-blue-500/10 via-transparent to-transparent rounded-full blur-3xl"></div>
        
        {/* Header */}
        <div className="relative flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <div className="p-4 bg-gradient-to-br from-blue-500/20 to-emerald-500/20 border border-blue-500/30 rounded-2xl shadow-lg shadow-blue-500/10">
              <ArrowUpRight className="w-8 h-8 text-blue-400" />
            </div>
            <div>
              <h2 className="text-3xl font-bold text-white mb-1">
                Wallet Deposit
              </h2>
              <p className="text-slate-400">Add funds to your investment wallet</p>
            </div>
          </div>
        </div>

        {/* Security Badge */}
        <div className="relative mb-8 p-4 bg-gradient-to-r from-blue-500/10 to-emerald-500/10 border border-blue-500/20 rounded-xl">
          <div className="flex items-center gap-3">
            <Shield className="w-5 h-5 text-blue-400 flex-shrink-0" />
            <div>
              <span className="text-blue-300 font-semibold">Secure Deposit</span>
              <p className="text-blue-200/70 text-sm mt-1">
                Your funds are protected with bank-level encryption and instant processing
              </p>
            </div>
          </div>
        </div>

        {/* Quick Amount Buttons */}
        <div className="relative mb-6">
          <label className="flex items-center gap-2 text-sm font-semibold text-slate-300 mb-3">
            <DollarSign className="w-4 h-4 text-blue-400" />
            Quick Select Amount
          </label>
          <div className="grid grid-cols-4 gap-3">
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
        <div className="relative mb-8">
          <label className="flex items-center gap-2 text-sm font-semibold text-slate-300 mb-3">
            <Wallet className="w-4 h-4 text-cyan-400" />
            Deposit Amount ({getMoneySymbol()})
          </label>
          <div className="relative group">
            <input
              type="number"
              value={amount}
              onChange={handleChange}
              placeholder="Enter amount"
              className="w-full bg-slate-800/50 border border-slate-700/50 rounded-xl py-4 px-5 text-white text-2xl font-bold focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500/50 transition-all duration-300 group-hover:border-blue-600/30 pr-20"
              onKeyDown={(e) => ['ArrowUp', 'ArrowDown', 'e', 'E', '+', '-'].includes(e.key) && e.preventDefault()}
              onWheel={(e) => e.target.blur()}
              min="0"
            />
            <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-blue-500/5 to-emerald-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
            
            {/* Amount Preview */}
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
              {Number(amount) >= 100 ? (
                <p className="text-xs text-blue-400 flex items-center gap-1">
                  <CheckCircle className="w-3 h-3" />
                  Amount looks good for deposit
                </p>
              ) : (
                <p className="text-xs text-red-400 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" />
                  Minimum deposit amount is $100
                </p>
              )}
            </div>
          )}
        </div>

        {/* Deposit Summary */}
        {amount && Number(amount) >= 100 && (
          <div className="relative mb-8 p-5 bg-gradient-to-r from-blue-500/10 to-emerald-500/10 border border-blue-500/20 rounded-xl">
            <h3 className="text-lg font-bold text-white mb-3 flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-blue-400" />
              Deposit Summary
            </h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-slate-400">Deposit Amount:</span>
                <span className="text-white font-bold text-xl">{getMoneySymbol()}{formatAmount(amount)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-400">Processing Fee:</span>
                <span className="text-blue-400 font-semibold">{getMoneySymbol()}0.00</span>
              </div>
              <div className="border-t border-slate-600/30 pt-3">
                <div className="flex justify-between items-center">
                  <span className="text-slate-300 font-semibold">You will receive:</span>
                  <span className="text-blue-400 font-bold text-2xl">{getMoneySymbol()}{formatAmount(amount)}</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Submit Button */}
        <button
          onClick={handleWalletDepositRequest}
          disabled={loading || !amount || Number(amount) < 100}
          className={`relative w-full py-4 px-6 rounded-xl font-bold text-lg transition-all duration-300 overflow-hidden group ${
            loading || !amount || Number(amount) < 100
              ? 'bg-slate-700/50 text-slate-500 cursor-not-allowed border border-slate-600/30'
              : 'bg-gradient-to-r from-blue-600 to-emerald-600 hover:from-blue-500 hover:to-emerald-500 text-white shadow-xl shadow-blue-500/25 hover:shadow-blue-500/40 hover:scale-[1.02] active:scale-[0.98] border border-blue-500/30'
          }`}
        >
          <div className="relative flex items-center justify-center gap-3">
            {loading ? (
              <>
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                <span>Processing Deposit...</span>
              </>
            ) : (
              <>
                <TrendingUp className="w-5 h-5" />
                <span>
                  {!amount || Number(amount) < 100 
                    ? 'Minimum deposit amount is $100'
                    : `Confirm Deposit ${getMoneySymbol()}${formatAmount(amount)}`
                  }
                </span>
              </>
            )}
          </div>
          
          {/* Button glow effect */}
          {!loading && amount && Number(amount) >= 100 && (
            <div className="absolute inset-0 bg-gradient-to-r from-blue-400/20 via-emerald-400/20 to-blue-400/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-xl"></div>
          )}
        </button>

        {/* Security Notice */}
        <div className="mt-6 p-4 bg-slate-800/30 border border-slate-700/30 rounded-xl">
          <p className="text-xs text-slate-400 flex items-start gap-2">
            <Shield className="w-4 h-4 text-blue-400 flex-shrink-0 mt-0.5" />
            <span>
              All deposits are processed instantly and secured with military-grade encryption. Your funds will be available for investment immediately after confirmation.
            </span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default WalletDepositPage;