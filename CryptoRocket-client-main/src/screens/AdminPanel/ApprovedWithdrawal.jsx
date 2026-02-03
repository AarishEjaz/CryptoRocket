import React, { useEffect, useState } from "react";
import {
  getAllWithdrawalRequests,
  getIncomeTotalForAdmin,
  requestWithdrawalStatus,
  withdrawalRequestApproveReject,
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
import { AuthenticatedAdminRouters } from "../../constants/routes";

const ApprovedWithdrawal = () => {
  const [allWithdrawalHistory, setAllWithdrawalHistory] = useState([]);
  const [selectedWithdrawal, setSelectedWithdrawal] = useState(null);
  const [totalIncome, setTotalIncome] = useState({});
  const [copied, setCopied] = useState(false);
  const dispatch = useDispatch();
  const location = useLocation();
  const data = location?.state;
  const fetchAllWithdrawalHistory = async () => {
    try {
      dispatch(setLoading(true));
      const response = await getAllWithdrawalRequests();
      setAllWithdrawalHistory(response?.data?.history);
    } catch (err) {
      console.log(err);
    } finally {
      dispatch(setLoading(false));
    }
  };
  useEffect(() => {
    fetchAllWithdrawalHistory();
  }, []);

  const filteredIncomeHistory =
    data === "today"
      ? allWithdrawalHistory.filter((item) => isToday(new Date(item.createdAt)))
      : allWithdrawalHistory;

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

  const updateStatus = async (id, status) => {
    try {
      dispatch(setLoading(true));
      const payload = { id, status };
      const response = await requestWithdrawalStatus(payload);

      if (response?.success) {
        setAllWithdrawalHistory((prev) =>
          prev.map((item) =>
            item._id === id ? { ...item, status: status } : item
          )
        );
        Swal.fire({
          text: response.message,
          icon: "success",
          toast: true,
          position: "top-end",
          timer: 1500,
          timerProgressBar: true,
          showConfirmButton: false,
        });
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
      console.error(error);
    } finally {
      dispatch(setLoading(false));
      setSelectedWithdrawal(null);
    }
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
      cell: (row) => <span className="font-medium text-white">{row?.id}</span>,
    },
    {
      header: "User ID / Name",
      accessor: "user.username",
      cell: (row) => (
        <span className="font-medium text-white">{row?.user?.username}</span>
      ),
      searchValue: (row) => row?.user?.username,
    },
    {
      header: "Client Address",
      accessor: "clientAddress",
      cell: (row) => (
        <span className="font-medium text-white">
          {maskWalletAddress(row?.clientAddress)}
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
      header: "Withdrawal",
      accessor: "investment",
      cell: (row) => (
        <span className="font-medium text-white">$ {row?.investment}</span>
      ),
    },
    {
      header: "Gas Fees",
      accessor: "gasFee",
      cell: (row) => {
        const gasFee = row?.gasFee ?? 0;
        return (
          <span className="font-medium text-white">
            $ {Number(gasFee).toFixed(2)}
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
            row?.status === "Completed" ? "text-blue-500" : "text-yellow-400"
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
            Withdraw
          </button>
          {/* <button
            className="px-4 py-1 text-xs font-semibold text-white bg-red-500 rounded-md hover:bg-red-600"
            onClick={() => handleApproveReject(row?._id, "reject")}
          >
            Reject
          </button> */}
        </div>
      ),
    },
  ];

  const cardData = [
    {
      title: "Today Withdraw",
      value: `$ ${Number(totalIncome?.todayWithdraw ?? 0).toFixed(2)}`,
      icon: "https://img.icons8.com/3d-fluency/94/atm.png",
    },
    {
      title: "Total Withdraw",
      value: `$ ${Number(totalIncome?.totalWithdraw ?? 0).toFixed(2)}`,
      icon: "https://img.icons8.com/3d-fluency/94/money-bag.png",
    },
  ];

  const fetchCardData = async (page = 1) => {
    try {
      dispatch(setLoading(true));
      const response = await getIncomeTotalForAdmin();
      if (response?.success) {
        setTotalIncome(response || {});
      } else {
        toast.error(response?.message || "Something went wrong");
        setTotalIncome({});
      }
    } catch (err) {
      toast.error("Failed to fetch income history");
    } finally {
      dispatch(setLoading(false));
    }
  };

  useEffect(() => {
    fetchCardData();
  }, []);

  return (
    <div className="space-y-5 mt-5">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {cardData.map((item) => (
          <StatCard
            key={item.title}
            title={item.title}
            value={item.value}
            iconImage={item.icon}
            change={item.change}
            changeType={item.changeType}
          />
        ))}
      </div>
      <DataTable
        title="Withdrawal History"
        columns={columns}
        data={filteredIncomeHistory}
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
              {selectedWithdrawal.clientAddress}
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
                value={selectedWithdrawal.clientAddress}
                size={150}
              />
            </div>

            <div className="py-2 flex items-center justify-center flex-col">
              <p>Total Amount : ${selectedWithdrawal?.investment}</p>
              <p>Gas Fees : ${Number(selectedWithdrawal?.gasFee ?? 0).toFixed(2)}</p>
              <p>
                Withdrawal amount : $
                {selectedWithdrawal?.netAmount
                  ? Number(selectedWithdrawal.netAmount).toFixed(2)
                  : selectedWithdrawal?.investment
                  ? (selectedWithdrawal.investment - (selectedWithdrawal.gasFee ?? 0)).toFixed(2)
                  : "0"}
              </p>
            </div>

            <div className="mt-3 grid grid-cols-2 gap-2">
              <button
                onClick={() =>
                  updateStatus(selectedWithdrawal._id, "Completed")
                }
                disabled={selectedWithdrawal.status !== "Processing"}
                className="rounded-md border border-white/40 bg-[#6EB72D] px-2 py-1 text-sm text-white transition active:scale-95 disabled:cursor-not-allowed disabled:opacity-70"
              >
                Approve
              </button>
              <button
                onClick={() =>
                  updateStatus(selectedWithdrawal._id, "Cancelled")
                }
                disabled={selectedWithdrawal.status !== "Processing"}
                className="rounded-md border border-white/40 bg-red-500 px-2 py-1 text-sm text-white transition active:scale-95 disabled:cursor-not-allowed disabled:opacity-70"
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

export default ApprovedWithdrawal;
