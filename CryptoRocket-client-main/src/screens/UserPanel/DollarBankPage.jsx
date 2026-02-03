import React, { useState, useEffect } from "react";
import { DollarSign, TrendingUp, Lock, Calendar, CheckCircle, AlertCircle, Building2, Eye, X, Wallet } from 'lucide-react';
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { ethers } from "ethers";
import Swal from "sweetalert2";
import { setLoading } from "../../redux/slices/loadingSlice";
import { investInDollarBank, investInDollarBankFromWithdrawalWallet } from "../../api/user.api";
import { AuthenticatedUserRouters } from "../../constants/routes";

const getMoneySymbol = () => "$";

const DollarBankPage = () => {
  const [amount, setAmount] = useState("");
  const [investmentData, setInvestmentData] = useState(null);
  const [showDollarBankModal, setShowDollarBankModal] = useState(false);
  const [dollarBankAmount, setDollarBankAmount] = useState("");
  const [withdrawalAmount, setWithdrawalAmount] = useState(0);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const userInfo = useSelector((state) => state?.isLoggedUser?.data);

  // Get the withdrawable amount from Redux
  const reduxWithdrawalAmount =
    useSelector(
      (state) => state?.isLoggedUser?.data?.incomeDetails?.income?.currentIncome
    ) || 0;

  // Set withdrawalAmount when reduxWithdrawalAmount changes
  useEffect(() => {
    setWithdrawalAmount(reduxWithdrawalAmount);
  }, [reduxWithdrawalAmount]);

  const USDT_ADDRESS = import.meta.env.VITE_USDT_ADDRESS || "0x55d398326f99059fF775485246999027B3197955";
  const USDT_ABI = [
    "function allowance(address owner, address spender) view returns (uint256)",
    "function approve(address spender, uint256 amount) returns (bool)",
    "function transfer(address to, uint256 amount) returns (bool)",
    "function balanceOf(address account) view returns (uint256)",
    "function decimals() view returns (uint8)",
  ];

  const handleChange = (e) => {
    const value = e.target.value;
    setAmount(value);
  };

  const handleConnectAndPayment = async () => {
    const numberAmount = Number(amount);
    
    if (!amount || numberAmount <= 0) {
      toast.error("Please enter a valid amount");
      return;
    }
    
    if (numberAmount < 100) {
      toast.error("Minimum investment amount is $100");
      return;
    }
    
    try {
      dispatch(setLoading(true));

      if (window.ethereum) {
        const walletType = sessionStorage.getItem("walletType");
        if (walletType === "safepal") {
          const isSafePal =
            window.ethereum.isSafePal ||
            navigator.userAgent.toLowerCase().includes("safepal");
          if (!isSafePal) {
            throw new Error("Please use SafePal wallet.");
          }
        }
        if (walletType === "metamask") {
          const isMetaMask = window.ethereum.isMetaMask;
          if (!isMetaMask) {
            throw new Error("Please use MetaMask wallet.");
          }
        }
        if (walletType === "trustwallet") {
          const isTrustWallet = window.ethereum.isTrust;
          if (!isTrustWallet) {
            throw new Error("Please use Trust Wallet.");
          }
        }
        await window.ethereum.request({ method: "eth_requestAccounts" });

        try {
          await window.ethereum.request({
            method: "wallet_switchEthereumChain",
            params: [{ chainId: "0x38" }],
          });
        } catch (switchError) {
          if (switchError.code === 4902) {
            try {
              await window.ethereum.request({
                method: "wallet_addEthereumChain",
                params: [
                  {
                    chainId: "0x38",
                    chainName: "Binance Smart Chain",
                    nativeCurrency: {
                      name: "BNB",
                      symbol: "BNB",
                      decimals: 18,
                    },
                    rpcUrls: ["https://bsc-dataseed1.binance.org/"],
                    blockExplorerUrls: ["https://bscscan.com/"],
                  },
                ],
              });
            } catch (addError) {
              console.error("Error adding BSC network:", addError);
              throw new Error("Failed to add BSC network");
            }
          } else {
            throw switchError;
          }
        }

        const provider = new ethers.BrowserProvider(window.ethereum);
        const signer = await provider.getSigner();
        const userAddress = await signer.getAddress();
        console.log("Connected wallet address:", userAddress);
        
        if (userAddress != userInfo?.account) {
          throw new Error("Please connect to the registered wallet.");
        }
        
        const recipientAddress = import.meta.env.VITE_WALLET_ADDRESS;
        if (!recipientAddress) {
          toast.error("Please enter a recipient address");
          return;
        }

        const chainId = await window.ethereum.request({
          method: "eth_chainId",
        });
        if (chainId !== "0x38") {
          throw new Error("Please connect to BSC network first");
        }

        const usdtContract = new ethers.Contract(
          USDT_ADDRESS,
          USDT_ABI,
          signer
        );

        try {
          const decimals = await usdtContract.decimals();
          console.log(`Token decimals: ${decimals}`);
        } catch (error) {
          console.error("Error fetching USDT decimals:", error);
          throw new Error("Invalid USDT contract on BSC network");
        }

        const balance = await usdtContract.balanceOf(userAddress);
        const amountInUSDT = ethers.parseUnits(amount.toString(), 18);

        if (balance < amountInUSDT) {
          throw new Error("Insufficient USDT balance");
        }

        const tx = await usdtContract.transfer(recipientAddress, amountInUSDT);
        await tx.wait();
        console.log("Transaction hash:", tx.hash);

        // After successful payment, call the investment API
        await onPaymentSuccess({
          txnHash: tx.hash,
          amount: numberAmount,
          toWalletAddress: recipientAddress,
          fromWalletAddress: userAddress,
        });
      } else {
        Swal.fire({
          icon: "error",
          title: "Connection Failed",
          text: "Wallet is not installed.",
        });
        throw new Error("Wallet is not installed.");
      }
    } catch (error) {
      console.error("Error during wallet connection or payment:", error);
      Swal.fire({
        icon: "error",
        title: "Operation Failed",
        text:
          error.message ||
          "Failed to connect wallet or complete payment. Please try again.",
      });
    } finally {
      dispatch(setLoading(false));
    }
  };

  const onPaymentSuccess = async (paymentData) => {
    try {
      dispatch(setLoading(true));
      const response = await investInDollarBank({ 
        amount: paymentData.amount,
        txnHash: paymentData.txnHash,
        toWalletAddress: paymentData.toWalletAddress,
        fromWalletAddress: paymentData.fromWalletAddress,
      });
      
      if (response?.success) {
        setInvestmentData(response?.data);
        toast.success(response?.message || "Investment successful!");
        setAmount("");
      } else {
        const errorMessage = response?.response?.data?.message || response?.message || "Something went wrong";
        toast.error(errorMessage);
      }
    } catch (error) {
      console.error("Error in investment:", error);
      const errorMessage = error?.response?.data?.message || error?.message || "Something went wrong";
      toast.error(errorMessage);
    } finally {
      dispatch(setLoading(false));
    }
  };

  const formatAmount = (amt) => {
    return amt ? Number(amt).toLocaleString() : "0";
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
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
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-l from-yellow-500/10 via-transparent to-transparent rounded-full blur-3xl"></div>
        
        {/* Header */}
        <div className="relative flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <div className="p-4 bg-gradient-to-br from-yellow-500/20 to-amber-500/20 border border-yellow-500/30 rounded-2xl shadow-lg shadow-yellow-500/10">
              <Building2 className="w-8 h-8 text-yellow-400" />
            </div>
            <div>
              <h2 className="text-3xl font-bold text-white mb-1">
                Dollar Bank Investment
              </h2>
              <p className="text-slate-400">Invest and earn 25% profit locked for 1 year</p>
            </div>
          </div>
          <button
            onClick={() => navigate(AuthenticatedUserRouters.DOLLAR_BANK_INVESTMENTS)}
            className="px-4 py-2 bg-yellow-500/20 hover:bg-yellow-500/30 text-yellow-400 border border-yellow-500/30 rounded-lg transition-colors flex items-center gap-2"
          >
            <Eye className="w-4 h-4" />
            View My Investments
          </button>
        </div>

        {/* Investment Info */}
        <div className="relative mb-8 p-4 bg-gradient-to-r from-yellow-500/10 to-amber-500/10 border border-yellow-500/20 rounded-xl">
          <div className="flex items-center gap-3">
            <TrendingUp className="w-5 h-5 text-yellow-400 flex-shrink-0" />
            <div>
              <span className="text-yellow-300 font-semibold">25% Annual Profit</span>
              <p className="text-yellow-200/70 text-sm mt-1">
                Your investment will be locked for 1 year with guaranteed 25% profit return
              </p>
            </div>
          </div>
        </div>

        {/* Add Fund to Dollar Bank from Withdrawal Wallet Button */}
        <div className="relative mb-6">
          <button
            onClick={() => setShowDollarBankModal(true)}
            className="w-full py-3 px-6 bg-gradient-to-r from-blue-500/20 to-cyan-500/20 hover:from-blue-500/30 hover:to-cyan-500/30 border border-blue-500/30 rounded-xl font-semibold text-blue-400 transition-all duration-300 flex items-center justify-center gap-3 hover:shadow-lg hover:shadow-blue-500/20"
          >
            <Wallet className="w-5 h-5" />
            <span>Add Fund to Dollar Bank from Withdrawal Wallet</span>
          </button>
        </div>

        {!investmentData ? (
          <>
            {/* Quick Amount Buttons */}
            <div className="relative mb-6">
              <label className="flex items-center gap-2 text-sm font-semibold text-slate-300 mb-3">
                <DollarSign className="w-4 h-4 text-yellow-400" />
                Quick Select Amount
              </label>
              <div className="grid grid-cols-4 gap-3">
                {quickAmounts.map((value) => (
                  <button
                    key={value}
                    onClick={() => setQuickAmount(value)}
                    className={`px-4 py-2 rounded-lg font-semibold transition-all duration-200 ${
                      amount === value.toString()
                        ? "bg-yellow-500 text-slate-900 border-2 border-yellow-400"
                        : "bg-slate-800/50 text-slate-300 border border-slate-700 hover:bg-slate-700/50 hover:border-yellow-500/50"
                    }`}
                  >
                    {getMoneySymbol()}{value}
                  </button>
                ))}
              </div>
            </div>

            {/* Investment Amount Input */}
            <div className="relative mb-8">
              <label className="flex items-center gap-2 text-sm font-semibold text-slate-300 mb-3">
                <DollarSign className="w-4 h-4 text-yellow-400" />
                Investment Amount ({getMoneySymbol()})
              </label>
              <div className="relative">
                <input
                  type="number"
                  inputMode="decimal"
                  value={amount}
                  onChange={handleChange}
                  placeholder="Enter investment amount"
                  className="remove-arrows w-full bg-slate-800/50 border border-slate-700/50 rounded-xl py-4 px-5 text-white text-lg font-semibold focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500/50 transition-all duration-300"
                  onKeyDown={(e) => ['ArrowUp', 'ArrowDown', 'e', 'E', '+', '-'].includes(e.key) && e.preventDefault()}
                  onWheel={(e) => e.target.blur()}
                  min="0"
                />
                {amount && (
                  <div className="absolute right-5 top-1/2 -translate-y-1/2">
                    <span className="text-yellow-400 font-bold text-sm">
                      {getMoneySymbol()}
                      {formatAmount(amount)}
                    </span>
                  </div>
                )}
              </div>
              <p className="text-xs text-slate-500 mt-2 flex items-center gap-1">
                <AlertCircle className="w-3 h-3" />
                Minimum investment: {getMoneySymbol()}100
              </p>
            </div>

            {/* Investment Summary */}
            {amount && Number(amount) >= 100 && (
              <div className="relative mb-8 p-5 bg-gradient-to-r from-yellow-500/10 to-amber-500/10 border border-yellow-500/20 rounded-xl">
                <h3 className="text-lg font-bold text-white mb-3 flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-yellow-400" />
                  Investment Summary
                </h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Investment Amount:</span>
                    <span className="text-white font-semibold">
                      {getMoneySymbol()}
                      {formatAmount(amount)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Profit Rate:</span>
                    <span className="text-yellow-400 font-semibold">25%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Lock Period:</span>
                    <span className="text-white font-semibold">1 Year</span>
                  </div>
                </div>
              </div>
            )}

            {/* Submit Button */}
            <button
              onClick={handleConnectAndPayment}
              disabled={!amount || Number(amount) < 100}
              className={`relative w-full py-4 px-6 rounded-xl font-bold text-lg transition-all duration-300 overflow-hidden group ${
                !amount || Number(amount) < 100
                  ? "bg-slate-700/50 text-slate-500 cursor-not-allowed border border-slate-600/30"
                  : "bg-gradient-to-r from-yellow-600 to-amber-600 hover:from-yellow-500 hover:to-amber-500 text-white shadow-xl shadow-yellow-500/25 hover:shadow-yellow-500/40 hover:scale-[1.02] active:scale-[0.98] border border-yellow-500/30"
              }`}
            >
              <div className="relative flex items-center justify-center gap-3">
                <TrendingUp className="w-5 h-5" />
                <span>
                  {!amount || Number(amount) < 100
                    ? "Enter Valid Amount (Min $100)"
                    : `Connect Wallet & Invest ${getMoneySymbol()}${formatAmount(amount)}`}
                </span>
              </div>
              {amount &&
                Number(amount) >= 100 && (
                  <div className="absolute inset-0 bg-gradient-to-r from-yellow-400/20 via-amber-400/20 to-yellow-400/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-xl"></div>
                )}
            </button>
          </>
        ) : (
          /* Investment Success Display */
          <div className="relative space-y-6">
            <div className="p-6 bg-gradient-to-r from-blue-500/10 to-emerald-500/10 border border-blue-500/20 rounded-xl">
              <div className="flex items-center gap-3 mb-4">
                <CheckCircle className="w-8 h-8 text-blue-400" />
                <h3 className="text-xl font-bold text-white">Investment Successful!</h3>
              </div>
              <p className="text-blue-300 mb-6">{investmentData?.note || "Your investment has been successfully processed."}</p>
              
              <div className="space-y-4">
                <div className="flex justify-between items-center p-3 bg-slate-800/50 rounded-lg">
                  <span className="text-slate-400">Investment ID:</span>
                  <span className="text-white font-mono font-semibold">{investmentData?.investmentId}</span>
                </div>
                
                <div className="flex justify-between items-center p-3 bg-slate-800/50 rounded-lg">
                  <span className="text-slate-400">Investment Amount:</span>
                  <span className="text-white font-semibold text-lg">
                    {getMoneySymbol()}
                    {formatAmount(investmentData?.investment)}
                  </span>
                </div>
                
                <div className="flex justify-between items-center p-3 bg-slate-800/50 rounded-lg">
                  <span className="text-slate-400">Profit Rate:</span>
                  <span className="text-yellow-400 font-semibold text-lg">25%</span>
                </div>
                
                <div className="flex justify-between items-center p-3 bg-slate-800/50 rounded-lg">
                  <span className="text-slate-400 flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    Investment Date:
                  </span>
                  <span className="text-white font-semibold">
                    {formatDate(investmentData?.investmentDate)}
                  </span>
                </div>
                
                <div className="flex justify-between items-center p-3 bg-slate-800/50 rounded-lg">
                  <span className="text-slate-400 flex items-center gap-2">
                    <Lock className="w-4 h-4" />
                    Maturity Date:
                  </span>
                  <span className="text-white font-semibold">
                    {formatDate(investmentData?.maturityDate)}
                  </span>
                </div>
                
                <div className="flex justify-between items-center p-3 bg-slate-800/50 rounded-lg">
                  <span className="text-slate-400">Status:</span>
                  <span className="px-3 py-1 bg-blue-500/20 text-blue-400 font-semibold rounded-lg border border-blue-500/30">
                    {investmentData?.status}
                  </span>
                </div>
              </div>
            </div>

            <button
              onClick={() => {
                setInvestmentData(null);
                setAmount("");
              }}
              className="w-full py-3 px-6 rounded-xl font-semibold bg-slate-700/50 text-white hover:bg-slate-600/50 transition-colors border border-slate-600/30"
            >
              Make Another Investment
            </button>
          </div>
        )}

        {/* Info Notice */}
        <div className="mt-6 p-4 bg-slate-800/30 border border-slate-700/30 rounded-xl">
          <p className="text-xs text-slate-400 flex items-start gap-2">
            <AlertCircle className="w-4 h-4 text-yellow-400 flex-shrink-0 mt-0.5" />
            <span>
              Your investment will be locked for 1 year. You can only withdraw the amount after the maturity date. 
              The 25% profit will be added to your account upon maturity.
            </span>
          </p>
        </div>
      </div>

      {/* Dollar Bank Investment Modal */}
      {showDollarBankModal && (
        <DollarBankModal
          show={showDollarBankModal}
          onClose={() => {
            setShowDollarBankModal(false);
            setDollarBankAmount("");
          }}
          amount={dollarBankAmount}
          setAmount={setDollarBankAmount}
          withdrawalAmount={withdrawalAmount}
          setWithdrawalAmount={setWithdrawalAmount}
        />
      )}
    </div>
  );
};

// Dollar Bank Investment Modal Component
const DollarBankModal = ({
  show,
  onClose,
  amount,
  setAmount,
  withdrawalAmount,
  setWithdrawalAmount,
}) => {
  const dispatch = useDispatch();

  const handleSubmit = async () => {
    const numberAmount = Number(amount);

    if (!amount || numberAmount <= 0) {
      toast.error("Please enter a valid amount");
      return;
    }

    if (numberAmount > withdrawalAmount) {
      toast.error("Amount exceeds your available withdrawal balance");
      return;
    }

    try {
      dispatch(setLoading(true));
      const res = await investInDollarBankFromWithdrawalWallet({
        amount: numberAmount,
      });

      if (res?.success) {
        toast.success(res?.message || "Funds transferred to Dollar Bank successfully");
        
        // Update withdrawal amount after successful transfer
        const remainingBalance = withdrawalAmount - numberAmount;
        setWithdrawalAmount(remainingBalance >= 0 ? remainingBalance : 0);

        // Close modal and reset amount
        onClose();
      } else {
        const errorMessage =
          res?.response?.data?.message ||
          res?.message ||
          res?.response?.data?.error ||
          "Something went wrong";
        toast.error(errorMessage);
      }
    } catch (error) {
      console.log("Error in Dollar Bank investment:", error);
      const errorMessage =
        error?.response?.data?.message ||
        error?.message ||
        "Something went wrong";
      toast.error(errorMessage);
    } finally {
      dispatch(setLoading(false));
    }
  };

  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-yellow-500/30 p-6 rounded-xl w-full max-w-md shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-to-br from-yellow-500/20 to-amber-500/20 border border-yellow-500/30 rounded-lg">
              <Building2 className="w-5 h-5 text-yellow-400" />
            </div>
            <h2 className="text-white text-xl font-bold">
              Add Fund to Dollar Bank
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-800 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-slate-400" />
          </button>
        </div>

        {/* Available Balance */}
        <div className="mb-4 p-3 bg-slate-800/50 rounded-lg">
          <div className="flex justify-between items-center">
            <span className="text-slate-400 text-sm">Available Balance:</span>
            <span className="font-bold text-blue-400">
              {getMoneySymbol()}
              {withdrawalAmount?.toLocaleString() || "0"}
            </span>
          </div>
        </div>

        {/* Amount Input */}
        <div className="mb-4">
          <label className="flex items-center gap-2 text-sm font-semibold text-slate-300 mb-3">
            <DollarSign className="w-4 h-4 text-yellow-400" />
            Investment Amount ({getMoneySymbol()})
          </label>
          <input
            type="number"
            inputMode="decimal"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="Enter amount"
            className="w-full bg-slate-800/50 border border-slate-700/50 rounded-xl py-3 px-4 text-white text-lg font-semibold focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500/50 transition-all duration-300"
            onKeyDown={(e) => ['ArrowUp', 'ArrowDown', 'e', 'E', '+', '-'].includes(e.key) && e.preventDefault()}
            onWheel={(e) => e.target.blur()}
            min="0"
          />
        </div>

        {/* Info Notice */}
        <div className="mb-6 p-3 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
          <p className="text-xs text-yellow-200/80 flex items-start gap-2">
            <AlertCircle className="w-4 h-4 text-yellow-400 flex-shrink-0 mt-0.5" />
            <span>
              Your investment will be locked for 1 year with 25% annual profit.
              You can withdraw this amount only after the maturity date.
            </span>
          </p>
        </div>

        {/* Buttons */}
        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-700 text-white rounded-lg hover:bg-slate-600 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={
              !amount ||
              Number(amount) <= 0 ||
              Number(amount) > withdrawalAmount
            }
            className={`px-4 py-2 rounded-lg font-semibold transition-all duration-300 ${
              !amount ||
              Number(amount) <= 0 ||
              Number(amount) > withdrawalAmount
                ? "bg-slate-700/50 text-slate-500 cursor-not-allowed"
                : "bg-gradient-to-r from-yellow-500 to-amber-500 hover:from-yellow-400 hover:to-amber-400 text-white shadow-lg shadow-yellow-500/25"
            }`}
          >
            Submit
          </button>
        </div>
      </div>
    </div>
  );
};

export default DollarBankPage;

