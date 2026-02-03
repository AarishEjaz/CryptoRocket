import React, { useEffect, useState } from "react";
import {
  getAllDollarBankWithdrawalRequests,
  updateDollarBankWithdrawalStatus,
} from "../../api/admin.api";
import { setLoading } from "../../redux/slices/loadingSlice";
import DataTable from "../../components/Screen/UserPanel/DataTable";
import Swal from "sweetalert2";
import { useDispatch } from "react-redux";
import { maskWalletAddress } from "../../utils/additionalFunc";
import { useLocation } from "react-router-dom";
import { isToday } from "../../utils/helper";
import { FaCheck, FaRegCopy } from "react-icons/fa6";
import { QRCodeCanvas } from "qrcode.react";
import StatCard from "../../components/Screen/UserPanel/StatCard";
import { Building2 } from "lucide-react";

const DollarBankWithdrawalRequests = () => {
  const [allWithdrawalRequests, setAllWithdrawalRequests] = useState([]);
  const [selectedWithdrawal, setSelectedWithdrawal] = useState(null);
  const [copied, setCopied] = useState(false);
  const dispatch = useDispatch();
  const location = useLocation();
  const data = location?.state;

  const fetchAllWithdrawalRequests = async () => {
    try {
      dispatch(setLoading(true));
      const response = await getAllDollarBankWithdrawalRequests();
      if (response?.success) {
        const requestsData = Array.isArray(response?.data)
          ? response?.data
          : Array.isArray(response?.data?.history)
          ? response?.data?.history
          : Array.isArray(response?.data?.requests)
          ? response?.data?.requests
          : [];
        setAllWithdrawalRequests(requestsData);
      }
    } catch (err) {
      console.log(err);
    } finally {
      dispatch(setLoading(false));
    }
  };

  useEffect(() => {
    fetchAllWithdrawalRequests();
  }, []);

  const filteredRequests =
    data === "today"
      ? allWithdrawalRequests.filter((item) =>
          isToday(new Date(item.createdAt))
        )
      : allWithdrawalRequests;

  const handleCopy = async () => {
    if (!selectedWithdrawal?.clientAddress) return;
    try {
      await navigator.clipboard.writeText(selectedWithdrawal?.clientAddress);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Copy failed:", err);
    }
  };

  const updateStatus = async (transactionId, status) => {
    try {
      dispatch(setLoading(true));
      const payload = { 
        transactionId: transactionId,
        status: status 
      };
      const response = await updateDollarBankWithdrawalStatus(payload);

      if (response?.success) {
        setAllWithdrawalRequests((prev) =>
          prev.map((item) =>
            (item?.id === transactionId || item?._id === transactionId) 
              ? { ...item, status: status } 
              : item
          )
        );
        Swal.fire({
          text: response.message || "Status updated successfully",
          icon: "success",
          toast: true,
          position: "top-end",
          timer: 1500,
          timerProgressBar: true,
          showConfirmButton: false,
        });
        fetchAllWithdrawalRequests(); // Refresh the list
      } else {
        Swal.fire({
          text: response?.message ?? "Something went wrong",
          icon: "error",
          toast: true,
          position: "top-end",
          timer: 1500,
          timerProgressBar: true,
          showConfirmButton: false,
        });
      }
    } catch (error) {
      console.error("Error updating withdrawal status:", error);
      Swal.fire({
        text: error?.response?.data?.message || error?.message || "Something went wrong",
        icon: "error",
        toast: true,
        position: "top-end",
        timer: 1500,
        timerProgressBar: true,
        showConfirmButton: false,
      });
    } finally {
      dispatch(setLoading(false));
      setSelectedWithdrawal(null);
    }
  };

  const formatAmount = (amt) => {
    return amt
      ? Number(amt).toLocaleString("en-US", {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        })
      : "0.00";
  };

  const columns = [
    {
      header: "S/N",
      accessor: "_id",
      cell: (row, rowIndex) => (
        <span className="font-medium text-white">{rowIndex + 1}</span>
      ),
    },
    {
      header: "Transaction ID",
      accessor: "id",
      cell: (row) => (
        <span className="font-medium text-white font-mono text-xs">
          {row?.id}
        </span>
      ),
    },
    {
      header: "Investment ID",
      accessor: "investmentId",
      cell: (row) => (
        <span className="font-medium text-white font-mono text-xs">
          {row?.investmentId || row?.investment?.id || "N/A"}
        </span>
      ),
    },
    {
      header: "User ID / Name",
      accessor: "user.username",
      cell: (row) => (
        <span className="font-medium text-white">
          {row?.user?.username || row?.user?.id || "N/A"}
        </span>
      ),
      searchValue: (row) => row?.user?.username || row?.user?.id,
    },
    {
      header: "Client Address",
      accessor: "clientAddress",
      cell: (row) => (
        <span className="font-medium text-white">
          {maskWalletAddress(row?.clientAddress || row?.walletAddress)}
        </span>
      ),
    },
    {
      header: "Main Address",
      accessor: "mainAddress",
      cell: (row) => (
        <span className="font-medium text-white">
          {maskWalletAddress(row?.mainAddress)}
        </span>
      ),
    },
    {
      header: "Investment Amount",
      accessor: "investment",
      cell: (row) => {
        const amount =
          row?.investment ||
          row?.investmentAmount ||
          row?.investment?.investment ||
          0;
        return (
          <span className="font-medium text-white">$ {formatAmount(amount)}</span>
        );
      },
    },
    {
      header: "Gas Fees",
      accessor: "gasFee",
      cell: (row) => {
        const gasFee = row?.gasFee ?? 0;
        return (
          <span className="font-medium text-red-400">
            $ {formatAmount(gasFee)}
          </span>
        );
      },
    },
    {
      header: "Net Amount",
      accessor: "netAmount",
      cell: (row) => {
        const netAmount = row?.netAmount ?? 0;
        return (
          <span className="font-medium text-blue-400">
            $ {formatAmount(netAmount)}
          </span>
        );
      },
    },
    {
      header: "Status",
      accessor: "status",
      cell: (row) => (
        <span
          className={`font-medium ${
            row?.status === "Completed"
              ? "text-blue-500"
              : row?.status === "Cancelled"
              ? "text-red-500"
              : "text-yellow-400"
          }`}
        >
          {row?.status}
        </span>
      ),
      searchValue: (row) => row?.status,
    },
    {
      header: "Created At",
      accessor: "createdAt",
      cell: (row) => (
        <span className="text-slate-300">
          {new Date(row?.createdAt).toLocaleString()}
        </span>
      ),
      searchValue: (row) => {
        return new Date(row?.createdAt)?.toLocaleDateString();
      },
    },
    {
      header: "Action",
      exportable: false,
      cell: (row) => (
        <div className="flex items-center gap-2">
          <button
            className={`px-4 py-1 text-xs font-semibold text-white ${
              row?.status === "Completed" || row?.status === "Cancelled"
                ? "bg-gray-500 cursor-not-allowed"
                : "bg-blue-500 hover:bg-blue-600 cursor-pointer"
            } rounded-md`}
            onClick={() => setSelectedWithdrawal(row)}
            disabled={
              row?.status === "Completed" || row?.status === "Cancelled"
            }
          >
            Process
          </button>
        </div>
      ),
    },
  ];

  const cardData = [
    {
      title: "Total Requests",
      value: `${allWithdrawalRequests.length}`,
      icon: "https://img.icons8.com/3d-fluency/94/money-bag.png",
    },
    {
      title: "Processing",
      value: `${
        allWithdrawalRequests.filter((item) => item.status === "Processing")
          .length
      }`,
      icon: "https://img.icons8.com/3d-fluency/94/clock.png",
    },
    {
      title: "Completed",
      value: `${
        allWithdrawalRequests.filter((item) => item.status === "Completed")
          .length
      }`,
      icon: "https://img.icons8.com/3d-fluency/94/checkmark.png",
    },
  ];

  return (
    <div className="space-y-5 mt-5">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <div className="p-3 bg-gradient-to-br from-yellow-500/20 to-amber-500/20 border border-yellow-500/30 rounded-xl">
          <Building2 className="w-6 h-6 text-yellow-400" />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-white">
            Dollar Bank Withdrawal Requests
          </h1>
          <p className="text-slate-400 mt-1">
            Manage Dollar Bank withdrawal requests from users
          </p>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {cardData.map((item) => (
          <StatCard
            key={item.title}
            title={item.title}
            value={item.value}
            iconImage={item.icon}
          />
        ))}
      </div>

      <DataTable
        title="Dollar Bank Withdrawal Requests"
        columns={columns}
        data={filteredRequests}
        pageSize={10}
      />
      {selectedWithdrawal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-2">
          <div className="relative w-full max-w-sm rounded-lg bg-white text-black p-4 shadow-lg">
            <button
              onClick={() => setSelectedWithdrawal(null)}
              className="absolute right-3 top-2 text-2xl font-bold leading-none text-black/60 hover:text-black"
            >
              &times;
            </button>

            <h2 className="mb-2 text-center text-lg font-semibold">
              Wallet Address QR
            </h2>
            <p className="break-words text-xs p-1 px-2 rounded whitespace-nowrap bg-slate-100">
              {selectedWithdrawal.clientAddress ||
                selectedWithdrawal.walletAddress}
            </p>

            <div className="my-2 flex justify-center">
              <button
                onClick={handleCopy}
                aria-label="Copy address"
                className="flex items-center justify-center rounded-md bg-[#6EB72D] px-2 py-1 text-sm text-white transition active:scale-95 hover:bg-[#5da625]"
              >
                {copied ? <FaCheck className="animate-pulse" /> : <FaRegCopy />}
              </button>
            </div>

            <div className="flex justify-center">
              <QRCodeCanvas
                value={
                  selectedWithdrawal.clientAddress ||
                  selectedWithdrawal.walletAddress
                }
                size={150}
              />
            </div>

            <div className="py-2 flex items-center justify-center flex-col space-y-1">
              <p>
                Investment Amount: $
                {formatAmount(
                  selectedWithdrawal?.investment ||
                    selectedWithdrawal?.investmentAmount ||
                    selectedWithdrawal?.investment?.investment
                )}
              </p>
              <p>
                Gas Fees: $
                {formatAmount(selectedWithdrawal?.gasFee ?? 0)}
              </p>
              <p>
                Net Amount: $
                {formatAmount(selectedWithdrawal?.netAmount ?? 0)}
              </p>
            </div>

            <div className="mt-3 grid grid-cols-2 gap-2">
              <button
                onClick={() =>
                  updateStatus(selectedWithdrawal.id || selectedWithdrawal._id, "Completed")
                }
                disabled={selectedWithdrawal.status !== "Processing"}
                className="rounded-md border border-white/40 bg-[#6EB72D] px-2 py-1 text-sm text-white transition active:scale-95 disabled:cursor-not-allowed disabled:opacity-70 hover:bg-[#5da625]"
              >
                Approve
              </button>
              <button
                onClick={() =>
                  updateStatus(selectedWithdrawal.id || selectedWithdrawal._id, "Cancelled")
                }
                disabled={selectedWithdrawal.status !== "Processing"}
                className="rounded-md border border-white/40 bg-red-500 px-2 py-1 text-sm text-white transition active:scale-95 disabled:cursor-not-allowed disabled:opacity-70 hover:bg-red-600"
              >
                Reject
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DollarBankWithdrawalRequests;

