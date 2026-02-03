import React, { useState } from "react";
import { getMoneySymbol } from "../../utils/additionalFunc";
import { useDispatch } from "react-redux";
import { setLoading } from "../../redux/slices/loadingSlice";
import { toast } from "react-toastify";
import { AddUserFund } from "../../api/admin.api";

const AddFund = () => {
  const [amount, setAmount] = useState("");
  const [username, setUsername] = useState("");
  const dispatch = useDispatch();
  const handleChange = (e) => {
    const value = e.target.value;
    setAmount(value); // Simply set the amount without validation
  };

  const handleAddUserFund = async () => {
    if (!username.trim()) {
      toast.error("Username is required");
      return;
    }

    if (amount <= 0) {
      toast.error("Deposit Amount must be greater than 0");
      return;
    }

    dispatch(setLoading(true));
    const numberAmount = Number(amount);

    try {
      const res = await AddUserFund({
        username: username.trim(),
        amount: numberAmount,
      });

      if (res?.success) {
        toast.success(res?.message || "Deposit Request Generated Successfully");
        setAmount("");
        setUsername(""); // Clear username as well
      } else {
        toast.error(res?.message || "Something went wrong");
      }
    } catch (error) {
      console.error("Error submitting deposit request:", error);
      toast.error("Server Error");
    } finally {
      dispatch(setLoading(false));
    }
  };

  return (
    <div>
      <div className="bg-slate-800 border border-slate-700/50 rounded-2xl p-8 w-full my-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-white">Add Fund</h2>
        </div>

        <div className="space-y-4">
          {/* <div className="text-sm text-slate-400">
            <span className="font-semibold text-white">
              Minimum Deposit: {getMoneySymbol()} 10
            </span>
          </div> */}
          <div>
            <label className="text-sm text-slate-400 mb-2 block">
              UserId or Wallet Address
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter UserId or Wallet Address"
              className="w-full bg-slate-900/50 border border-slate-700 rounded-lg py-3 px-4 text-white text-base focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="text-sm text-slate-400 mb-2 block">
              Fund Amount ({getMoneySymbol()})
            </label>
            <input
              type="number"
              value={amount}
              onChange={handleChange}
              className="w-full bg-slate-900/50 border border-slate-700 rounded-lg py-3 px-4 text-white text-base focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none"
              onKeyDown={(e) => ['ArrowUp', 'ArrowDown', 'e', 'E', '+', '-'].includes(e.key) && e.preventDefault()}
              onWheel={(e) => e.target.blur()}
              min="0"
            />
          </div>

          {/* <div className="text-xs text-slate-500 p-3 bg-slate-900/50 rounded-lg">
            You are investing **{amount}
            {getMoneySymbol()}** in the **{plan.title}** plan. Returns are
            calculated based on the plan's APY.
          </div> */}

          <button
            // onClick={handleConnectAndPayment}
            className="w-full bg-blue-600 text-white p-3 rounded-xl font-semibold text-lg hover:bg-blue-500 transition-colors shadow-lg shadow-blue-600/30 cursor-pointer"
            onClick={handleAddUserFund}
          >
            Confirm {getMoneySymbol()}
            {amount}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddFund;
