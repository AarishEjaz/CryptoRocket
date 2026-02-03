import React, { useState } from "react";
import {
  ArrowRightLeft,
  User,
  DollarSign,
  Send,
  Shield,
  CheckCircle,
  AlertCircle,
  UserCheck,
  X,
  Search,
  Copy,
  Wallet,
} from "lucide-react";
import {
  sendOtp,
  transferFunds,
  verifyOtp,
  verifyPayment,
  verifyUser,
} from "../../api/user.api";
import { toast } from "react-toastify";
import debounce from "lodash/debounce";
import { useSelector } from "react-redux";
import { sendUSDTToken } from "../../utils/helper";

// Mock function for demonstration
const getMoneySymbol = () => "$";

const UserFundTransfer = () => {
  const [formData, setFormData] = useState({
    username: "",
    amount: "",
  });
  const [loading, setLoading] = useState(false);
  const [userVerified, setUserVerified] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [userInfo, setUserInfo] = useState(null); // will hold user's name if verified
  const [userError, setUserError] = useState(null);
  const [otpModalOpen, setOtpModalOpen] = useState(false);
  const [verifyingOtp, setVerifyingOtp] = useState(false);
  const [copied, setCopied] = useState(false);
  const walletAddress = useSelector(
    (state) => state?.isLoggedUser?.data?.account
  );
  const [verifyPaymentDetails, setVerifyPaymentDetails] = useState(null);

  const OtpModal = ({ isOpen, onClose, onVerify, loading }) => {
    const [otp, setOtp] = useState("");

    if (!isOpen) return null;

    return (
      <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center px-4">
        <div className="bg-slate-900 border border-purple-700/30 rounded-2xl p-6 w-full max-w-md shadow-2xl relative">
          <button
            onClick={onClose}
            className="absolute top-3 right-3 text-slate-400 hover:text-white transition"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="text-center mb-5">
            <Shield className="w-10 h-10 text-purple-400 mx-auto mb-2" />
            <h3 className="text-xl font-bold text-white">OTP Verification</h3>
            <p className="text-sm text-slate-400 mt-1">
              Enter the 6-digit code sent to the registered device.
            </p>
          </div>

          <input
            type="text"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            placeholder="Enter OTP"
            maxLength={6}
            className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-white text-center text-lg tracking-widest mb-4 focus:outline-none focus:ring-2 focus:ring-purple-500"
          />

          <button
            onClick={() => onVerify(otp)}
            disabled={loading || otp.length !== 6}
            className={`w-full py-3 rounded-xl font-semibold text-white transition-all ${
              loading || otp.length !== 6
                ? "bg-slate-700 text-slate-500 cursor-not-allowed"
                : "bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500"
            }`}
          >
            {loading ? "Verifying..." : "Verify OTP"}
          </button>
        </div>
      </div>
    );
  };

  // Inside the component
  const debouncedVerifyUser = React.useCallback(
    debounce(async (username) => {
      setVerifying(true);
      try {
        const response = await verifyUser({ username: username.trim() });
        if (response?.success) {
          setUserInfo(response?.data);
          setUserVerified(true);
          setUserError(null);
        } else {
          setUserInfo(null);
          setUserVerified(false);
          setUserError("User not found");
        }
      } catch (err) {
        console.error("Verification error:", err);
        setUserInfo(null);
        setUserVerified(false);
        setUserError("An error occurred while verifying");
      } finally {
        setVerifying(false);
      }
    }, 500), // 500ms debounce delay
    []
  );

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (name === "username") {
      setUserVerified(false);
      setUserInfo(null);
      setUserError(null);

      // Trigger debounced API call if valid length
      if (value.length >= 8 && value.length <= 12) {
        debouncedVerifyUser(value);
      } else {
        debouncedVerifyUser.cancel(); // Cancel if user deletes or it's not in range
      }
    }
  };

  const handleFundTransfer = async () => {
    if (!formData.username.trim()) {
      toast.error("Please enter a username");
      return;
    }

    if (!formData.amount || Number(formData.amount) <= 0) {
      toast.error("Please enter a valid amount");
      return;
    }

    try {
      const res = await verifyPayment({
        receiverAccount: userInfo?.account,
        amount: formData.amount,
      });
      if (res?.success) {
        toast.success(res?.message || "OTP sent successfully");
        setVerifyPaymentDetails(res?.data);
        setOtpModalOpen(true); // show OTP modal
      } else {
        toast.error(res?.message || "Something went wrong");
      }
    } catch (error) {
      toast.error("Error sending OTP. Please try again after some time.");
      console.error("Error sending OTP:", error);
    }
  };

  const handleVerifyOtp = async (otp) => {
    setVerifyingOtp(true);
    try {
      // Step 1: Verify OTP
      const otpRes = await verifyOtp({
        localTxId: verifyPaymentDetails?.localTxId,
        otp,
      });

      if (!otpRes?.success) {
        toast.error(otpRes?.message || "Invalid OTP");
        return;
      }

      // Step 2: Send on-chain USDT transfer
      toast.info("Initiating USDT transfer via MetaMask...");
      const tx = await sendUSDTToken(userInfo?.account, formData.amount);

      toast.success("Transaction sent! Waiting for confirmation...");
      await tx.wait(); // Wait for 1 block confirmation (optional but good UX)

      // Step 3: Notify backend with txHash
      const transferRes = await transferFunds({
        localTxId: verifyPaymentDetails?.localTxId,
        txHash: tx.hash,
      });

      if (transferRes?.success) {
        toast.success("Fund transfer successful!");
        setFormData({ username: "", amount: "" });
        setUserVerified(false);
        setUserInfo(null);
        setOtpModalOpen(false);
      } else {
        toast.error(transferRes?.message || "Transfer verification failed");
      }
    } catch (error) {
      console.error("Transfer error:", error);
      toast.error(error?.message || "Something went wrong during the transfer");
    } finally {
      setVerifyingOtp(false);
      setLoading(false);
    }
  };

  const formatAmount = (amt) => {
    return amt ? Number(amt).toLocaleString() : "0";
  };

  const quickAmounts = [50, 100, 500, 1000];

  const setQuickAmount = (value) => {
    setFormData((prev) => ({ ...prev, amount: value.toString() }));
  };

  const isFormValid =
    formData.username.trim() && formData.amount && Number(formData.amount) > 0;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(walletAddress);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <>
      <div className="max-w-2xl mx-auto">
        <div className="relative bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 border border-blue-800/30 rounded-3xl p-8 shadow-2xl hover:shadow-blue-500/10 transition-all duration-500 overflow-hidden">
          {/* Background Pattern */}
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600/5 via-transparent to-purple-600/5"></div>
          <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-l from-purple-500/10 via-transparent to-transparent rounded-full blur-3xl"></div>

          {/* Header */}
          <div className="relative flex items-center justify-between mb-8">
            <div className="flex items-center gap-4">
              <div className="p-4 bg-gradient-to-br from-purple-500/20 to-blue-500/20 border border-purple-500/30 rounded-2xl shadow-lg shadow-purple-500/10">
                <ArrowRightLeft className="w-8 h-8 text-purple-400" />
              </div>
              <div>
                <h2 className="text-3xl font-bold text-white mb-1">
                  Fund Transfer
                </h2>
                <p className="text-slate-400">
                  Send funds to another user instantly
                </p>
              </div>
            </div>
          </div>

          {/* Security Notice */}
          <div className="relative mb-8 p-4 bg-gradient-to-r from-amber-500/10 to-orange-500/10 border border-amber-500/20 rounded-xl">
            <div className="flex items-center gap-3">
              <Shield className="w-5 h-5 text-amber-400 flex-shrink-0" />
              <div>
                <span className="text-amber-300 font-semibold">
                  Secure Transfer
                </span>
                <p className="text-amber-200/70 text-sm mt-1">
                  All transfers are processed instantly with end-to-end
                  encryption and cannot be reversed
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="group">
              <label className="flex items-center gap-2 text-sm font-semibold text-slate-300 mb-3">
                <Wallet className="w-4 h-4 text-cyan-400" />
                Origin Wallet Address
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={walletAddress}
                  disabled
                  className="w-full bg-slate-800/30 border border-slate-700/30 rounded-xl py-4 px-5 pr-12 text-slate-300 text-sm font-mono cursor-not-allowed transition-all duration-300"
                />
                <button
                  onClick={copyToClipboard}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-2 hover:bg-slate-700/50 rounded-lg transition-colors duration-200 group"
                  title="Copy address"
                >
                  {copied ? (
                    <CheckCircle className="w-4 h-4 text-blue-400" />
                  ) : (
                    <Copy className="w-4 h-4 text-slate-400 group-hover:text-blue-400" />
                  )}
                </button>

                {/* Copy feedback */}
                {copied && (
                  <div className="absolute -top-8 right-0 bg-blue-500/20 border border-blue-500/30 text-blue-400 text-xs px-2 py-1 rounded-lg">
                    Copied!
                  </div>
                )}
              </div>
              {/* <p className="text-xs text-slate-500 mt-2 flex items-center gap-1">
              <AlertCircle className="w-3 h-3" />
              Funds will be sent to this wallet address
            </p> */}
            </div>

            {/* Username Field */}
            <div className="group">
              <label className="flex items-center gap-2 text-sm font-semibold text-slate-300 mb-3">
                <User className="w-4 h-4 text-blue-400" />
                Recipient Username
              </label>
              <div className="flex gap-3">
                <div className="relative flex-1">
                  <input
                    type="text"
                    name="username"
                    value={formData.username}
                    onChange={handleChange}
                    placeholder="Enter recipient's username"
                    className="w-full bg-slate-800/50 border border-slate-700/50 rounded-xl py-4 px-5 text-white text-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500/50 transition-all duration-300 group-hover:border-blue-600/30 pr-12"
                  />
                  <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-blue-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
                </div>
              </div>
              {verifying && (
                <p className="mt-2 text-sm text-blue-400">
                  Verifying username...
                </p>
              )}

              {userVerified && userInfo?.username && (
                <div className="mt-2 flex items-center gap-2 text-blue-400 text-sm font-medium">
                  <UserCheck className="w-4 h-4" />
                  Verified as{" "}
                  <span className="font-semibold text-white">
                    {userInfo.username}
                  </span>
                  <span className="ml-1 text-blue-500">★</span>
                </div>
              )}

              {userError && (
                <p className="mt-2 text-sm text-red-400">{userError}</p>
              )}
            </div>

            <div className="group">
              <label className="flex items-center gap-2 text-sm font-semibold text-slate-300 mb-3">
                <Wallet className="w-4 h-4 text-cyan-400" />
                Destination Wallet Address
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={userInfo?.account}
                  disabled
                  className="w-full bg-slate-800/30 border border-slate-700/30 rounded-xl py-4 px-5 pr-12 text-slate-300 text-sm font-mono cursor-not-allowed transition-all duration-300"
                />
              </div>
              {/* <p className="text-xs text-slate-500 mt-2 flex items-center gap-1">
              <AlertCircle className="w-3 h-3" />
              Funds will be sent to this wallet address
            </p> */}
            </div>

            {/* Quick Amount Buttons */}
            <div className="relative">
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
                      formData.amount === value.toString()
                        ? "bg-gradient-to-r from-purple-600/30 to-blue-600/30 border-purple-500/50 text-purple-300"
                        : "bg-slate-800/50 border-slate-700/50 text-slate-300 hover:border-purple-600/30 hover:bg-purple-600/10"
                    }`}
                  >
                    {getMoneySymbol()}
                    {value.toLocaleString()}
                  </button>
                ))}
              </div>
            </div>

            {/* Amount Input */}
            <div className="group">
              <label className="flex items-center gap-2 text-sm font-semibold text-slate-300 mb-3">
                <DollarSign className="w-4 h-4 text-cyan-400" />
                Transfer Amount ({getMoneySymbol()})
              </label>
              <div className="relative">
                <input
                  type="number"
                  name="amount"
                  value={formData.amount}
                  onChange={handleChange}
                  placeholder="Enter amount to transfer"
                  className="w-full bg-slate-800/50 border border-slate-700/50 rounded-xl py-4 px-5 text-white text-2xl font-bold focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500/50 transition-all duration-300 group-hover:border-purple-600/30 pr-20"
                  onKeyDown={(e) => ['ArrowUp', 'ArrowDown', 'e', 'E', '+', '-'].includes(e.key) && e.preventDefault()}
                  onWheel={(e) => e.target.blur()}
                  min="0"
                />
                <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-purple-500/5 to-cyan-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>

                {/* Amount Preview */}
                {formData.amount && (
                  <div className="absolute right-5 top-1/2 -translate-y-1/2">
                    <span className="text-purple-400 font-bold text-sm">
                      {getMoneySymbol()}
                      {formatAmount(formData.amount)}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Transfer Summary */}
            {isFormValid && (
              <div className="relative p-5 bg-gradient-to-r from-purple-500/10 to-blue-500/10 border border-purple-500/20 rounded-xl">
                <h3 className="text-lg font-bold text-white mb-3 flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-blue-400" />
                  Transfer Summary
                </h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-slate-400">To:</span>
                    <span className="text-blue-400 font-semibold">
                      @{formData.username}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-400">Amount:</span>
                    <span className="text-white font-bold text-xl">
                      {getMoneySymbol()}
                      {formatAmount(formData.amount)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-400">Transfer Fee:</span>
                    <span className="text-blue-400 font-semibold">
                      {getMoneySymbol()}0.00
                    </span>
                  </div>
                  <div className="border-t border-slate-600/30 pt-3">
                    <div className="flex justify-between items-center">
                      <span className="text-slate-300 font-semibold">
                        Total Debit:
                      </span>
                      <span className="text-purple-400 font-bold text-2xl">
                        {getMoneySymbol()}
                        {formatAmount(formData.amount)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Submit Button */}
            <button
              onClick={handleFundTransfer}
              disabled={loading || !isFormValid}
              className={`relative w-full py-4 px-6 rounded-xl font-bold text-lg transition-all duration-300 overflow-hidden group ${
                loading || !isFormValid
                  ? "bg-slate-700/50 text-slate-500 cursor-not-allowed border border-slate-600/30"
                  : "bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white shadow-xl shadow-purple-500/25 hover:shadow-purple-500/40 hover:scale-[1.02] active:scale-[0.98] border border-purple-500/30"
              }`}
            >
              <div className="relative flex items-center justify-center gap-3">
                {loading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    <span>Processing Transfer...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-5 h-5" />
                    <span>
                      {!isFormValid
                        ? "Complete All Fields to Transfer"
                        : `Send ${getMoneySymbol()}${formatAmount(
                            formData.amount
                          )} to @${formData.username}`}
                    </span>
                  </>
                )}
              </div>

              {/* Button glow effect */}
              {!loading && isFormValid && (
                <div className="absolute inset-0 bg-gradient-to-r from-purple-400/20 via-blue-400/20 to-purple-400/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-xl"></div>
              )}
            </button>
          </div>

          {/* Important Notice */}
          <div className="mt-6 p-4 bg-slate-800/30 border border-slate-700/30 rounded-xl">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
              <div className="text-sm text-slate-400">
                <p className="mb-2">
                  <strong className="text-white">Important:</strong> Fund
                  transfers are instant and cannot be reversed. Please verify
                  the recipient username carefully before proceeding.
                </p>
                <p>
                  Ensure you have sufficient balance in your wallet before
                  initiating the transfer.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <OtpModal
        isOpen={otpModalOpen}
        onClose={() => setOtpModalOpen(false)}
        onVerify={handleVerifyOtp}
        loading={verifyingOtp}
      />
    </>
  );
};

export default UserFundTransfer;
