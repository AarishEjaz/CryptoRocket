/* eslint-disable react/no-unescaped-entities */
/* eslint-disable react/prop-types */
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import { ethers } from "ethers";
import Swal from "sweetalert2";
import { getMoneySymbol } from "../../../utils/additionalFunc";
import { setLoading } from "../../../redux/slices/loadingSlice";
import { sendPaymentDetail, activateUserAccount } from "../../../api/user.api";
import { MainContent } from "../../../constants/mainContent";

const InvestmentModal = ({ plan, onClose }) => {
  const dispatch = useDispatch();
  const userInfo = useSelector((state) => state?.isLoggedUser?.data);
  console.log(userInfo)
  const [amount, setAmount] = useState(0);
  const MINIMUM_AMOUNT = 0.000001;

  useEffect(() => {
    console.log("plan", plan)
    // Use plan min if it's higher than global minimum, otherwise use global minimum
    const initialAmount = plan?.min && plan.min > MINIMUM_AMOUNT ? plan.min : MINIMUM_AMOUNT;
    setAmount(initialAmount);
  }, [plan]);

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

  const [isLoading, setIsLoading] = useState(false);

  const handleConnectAndPayment = async () => {
    const numberAmount = Number(amount);

    if (!amount || numberAmount <= 0) {
      toast.error("Please enter a valid amount");
      return;
    }

    // Determine the actual minimum (plan min or global minimum, whichever is higher)
    const actualMinimum = plan?.min && plan.min > MINIMUM_AMOUNT ? plan.min : MINIMUM_AMOUNT;

    if (numberAmount < actualMinimum) {
      toast.error(`Minimum investment amount is ${getMoneySymbol()}${actualMinimum}`);
      return;
    }

    // Check if amount exceeds plan max (if plan has max)
    if (plan?.max && plan.max !== Infinity && numberAmount > plan.max) {
      toast.error(`Maximum investment amount for this plan is ${getMoneySymbol()}${plan.max}`);
      return;
    }
    try {
      console.log("🚀 [Frontend] Starting payment process...");
      setIsLoading(true);
      dispatch(setLoading(true));

      if (window.ethereum) {
        console.log("🔌 [Frontend] Checking wallet connection...");
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
        console.log("👤 [Frontend] Connected wallet address:", userAddress);
        console.log("👤 [Frontend] Registered user address:", userInfo?.account);

        if (userAddress.toLowerCase() !== userInfo?.account?.toLowerCase()) {
          console.error("❌ [Frontend] Wallet mismatch!");
          throw new Error("Please connect to the registered wallet.");
        }
        const recipientAddress = import.meta.env.VITE_WALLET_ADDRESS;
        console.log("💰 [Frontend] Recipient address:", recipientAddress);

        if (!recipientAddress) {
          console.error("❌ [Frontend] Recipient address missing in env");
          toast.error("Please enter a recipient address");
          return;
        }

        const chainId = await window.ethereum.request({
          method: "eth_chainId",
        });
        console.log("🔗 [Frontend] Current Chain ID:", chainId);

        if (chainId !== "0x38") {
          console.error("❌ [Frontend] Wrong network");
          throw new Error("Please connect to BSC network first");
        }

        console.log("📝 [Frontend] Creating USDT contract instance...");
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

        console.log("💰 [Frontend] Checking USDT balance...");
        const balance = await usdtContract.balanceOf(userAddress);
        const amountInUSDT = ethers.parseUnits(amount.toString(), 18);
        console.log(`💰 [Frontend] Balance: ${ethers.formatUnits(balance, 18)} USDT, Required: ${amount} USDT`);

        if (balance < amountInUSDT) {
          console.error("❌ [Frontend] Insufficient balance");
          throw new Error("Insufficient USDT balance");
        }

        console.log("💸 [Frontend] Sending transfer transaction...");
        const tx = await usdtContract.transfer(recipientAddress, amountInUSDT);
        console.log("✅ [Frontend] Payment sent! Transaction hash:", tx.hash);
        console.log("⏳ [Frontend] Waiting for blockchain confirmation...");

        // Show non-closable loading state here

        await tx.wait();
        console.log("✅ [Frontend] Blockchain confirmed!");

        // Prepare data for backend
        const backendData = {
          packageId: !plan.isPlan ? plan._id : null,
          planId: plan.isPlan ? plan._id : null,
          txnHash: tx.hash,
          amount,
          toWalletAddress: recipientAddress,
          fromWalletAddress: userAddress,
        };

        console.log("📤 [Frontend] Sending payment details to backend API 'sendPaymentDetail'...", backendData);

        // DIRECT BACKEND API CALL
        try {
          const response = await sendPaymentDetail(backendData);
          console.log("📥 [Frontend] Backend response received:", response);

          if (response?.success) {
            console.log("✅ [Frontend] Backend Verified & Database updated successfully!");

            // Activate user
            console.log("🔄 [Frontend] Calling activateUserAccount...");
            await activateUserAccount();
            console.log("✅ [Frontend] User activation call completed.");

            toast.success("Investment successful! Your account is now active.");
            onClose();
            setTimeout(() => window.location.reload(), 1500);
          } else {
            console.error("❌ [Frontend] Backend returned error:", response?.message);
            toast.error(response?.message || "Failed to save transaction. Contact support with hash: " + tx.hash);
          }
        } catch (apiError) {
          console.error("❌ [Frontend] API call failed completely:", apiError);
          toast.error("Transaction successful but failed to save. Contact support with hash: " + tx.hash);
        }
      } else {
        console.error("❌ [Frontend] Wallet not installed");
        Swal.fire({
          icon: "error",
          title: "Connection Failed",
          text: "Wallet is not installed.",
        });
        throw new Error("Wallet is not installed.");
      }
    } catch (error) {
      console.error("❌ [Frontend] Error during wallet connection or payment process:", error);
      Swal.fire({
        icon: "error",
        title: "Operation Failed",
        text:
          error.message ||
          "Failed to connect wallet or complete payment. Please try again.",
      });
    } finally {
      console.log("🏁 [Frontend] Process finished, resetting loading state.");
      setIsLoading(false);
      dispatch(setLoading(false));
    }
  };

  if (!plan) return null;

  // Calculate the actual minimum (plan min or global minimum, whichever is higher)
  const actualMinimum = plan?.min && plan.min > MINIMUM_AMOUNT ? plan.min : MINIMUM_AMOUNT;
  const numberAmount = Number(amount);
  const isAmountValid = amount && numberAmount >= actualMinimum && (!plan?.max || plan.max === Infinity || numberAmount <= plan.max);

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50" style={{ pointerEvents: isLoading ? 'none' : 'auto' }}>
      <div className="bg-slate-800 border border-slate-700/50 rounded-2xl p-8 w-full max-w-md m-4 relative">
        {isLoading && (
          <div className="absolute inset-0 bg-slate-900/80 backdrop-blur-sm rounded-2xl flex flex-col items-center justify-center z-10 p-6 text-center">
            <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-4"></div>
            <h3 className="text-xl font-bold text-white mb-2">Processing Transaction</h3>
            <p className="text-sm text-slate-300">Please do not close this window or refresh the page.</p>
            <p className="text-xs text-slate-400 mt-2">Waiting for Blockchain & Backend confirmation...</p>
          </div>
        )}

        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-white">
            Invest in {MainContent.appName}
          </h2>
          <button
            onClick={!isLoading ? onClose : undefined}
            className={`text-slate-400 hover:text-white text-xl ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
            disabled={isLoading}
          >
            <i className="fa-solid fa-times"></i>
          </button>
        </div>

        <div className="space-y-4">
          <div className="text-sm text-slate-400">
            <span className="font-semibold text-white">
              Minimum Investment: {getMoneySymbol()}{actualMinimum}
            </span>
          </div>

          <div>
            <label className="text-sm text-slate-400 mb-2 block">
              Investment Amount ({getMoneySymbol()})
            </label>
            <input
              type="number"
              value={amount}
              onChange={handleChange}
              min={actualMinimum}
              placeholder={`Enter amount (minimum ${getMoneySymbol()}${actualMinimum})`}
              className="w-full bg-slate-900/50 border border-slate-700 rounded-lg py-3 px-4 text-white text-lg focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none"
              onKeyDown={(e) => ['ArrowUp', 'ArrowDown', 'e', 'E', '+', '-'].includes(e.key) && e.preventDefault()}
              onWheel={(e) => e.target.blur()}
              disabled={isLoading}
            />
            {amount && numberAmount < actualMinimum && (
              <p className="text-red-400 text-xs mt-1">
                Minimum investment amount is {getMoneySymbol()}{actualMinimum}
              </p>
            )}
          </div>

          <div className="text-xs text-slate-500 p-3 bg-slate-900/50 rounded-lg">
            You are investing **{amount}
            {getMoneySymbol()}** in the **{plan.title}** plan. Returns are
            calculated based on the plan's APY.
          </div>

          <button
            onClick={handleConnectAndPayment}
            disabled={!isAmountValid || isLoading}
            className={`w-full p-3 rounded-xl font-semibold text-lg transition-colors shadow-lg ${!isAmountValid || isLoading
              ? "bg-slate-700 text-slate-400 cursor-not-allowed"
              : "bg-blue-600 text-white hover:bg-blue-500 shadow-blue-600/30"
              }`}
          >
            {isLoading ? 'Processing...' : (!isAmountValid
              ? `Minimum ${getMoneySymbol()}${actualMinimum} Required`
              : `Confirm ${getMoneySymbol()}${amount}`
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default InvestmentModal;
