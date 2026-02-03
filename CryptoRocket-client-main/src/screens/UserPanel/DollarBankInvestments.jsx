import React, { useEffect, useState } from "react";
import { setLoading } from "../../redux/slices/loadingSlice";
import DataTable from "../../components/Screen/UserPanel/DataTable";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import { useLocation } from "react-router-dom";
import { isToday } from "../../utils/helper";
import {
  getUserDollarBankInvestments,
  requestDollarBankWithdrawal,
} from "../../api/user.api";
import { Building2, Calendar, Lock, DollarSign, CheckCircle, ArrowDownLeft } from "lucide-react";
import Swal from "sweetalert2";

const DollarBankInvestments = () => {
  const [allInvestments, setAllInvestments] = useState([]);
  const dispatch = useDispatch();
  const location = useLocation();
  const data = location?.state;

  const fetchAllInvestments = async () => {
    try {
      dispatch(setLoading(true));
      const response = await getUserDollarBankInvestments();
      if (response?.success) {
        const investmentsData = Array.isArray(response?.data)
          ? response?.data
          : Array.isArray(response?.data?.investments)
          ? response?.data?.investments
          : Array.isArray(response?.data?.history)
          ? response?.data?.history
          : [];
        setAllInvestments(investmentsData);
      } else {
        toast.error(response?.message || "Something went wrong");
        setAllInvestments([]);
      }
    } catch (err) {
      console.log(err);
      setAllInvestments([]);
    } finally {
      dispatch(setLoading(false));
    }
  };

  useEffect(() => {
    fetchAllInvestments();
  }, []);

  const isMaturityDateToday = (maturityDate) => {
    if (!maturityDate) return false;
    const maturity = new Date(maturityDate);
    const today = new Date();
    return (
      maturity.getDate() === today.getDate() &&
      maturity.getMonth() === today.getMonth() &&
      maturity.getFullYear() === today.getFullYear()
    );
  };

  const isMaturityDatePassed = (maturityDate) => {
    if (!maturityDate) return false;
    const maturity = new Date(maturityDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    maturity.setHours(0, 0, 0, 0);
    return maturity <= today;
  };

  const handleWithdrawalRequest = async (investment) => {
    Swal.fire({
      title: "Confirm Withdrawal",
      text: `Do you want to request withdrawal for Investment ID: ${investment?.id}?`,
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Yes, Request Withdrawal",
      cancelButtonText: "Cancel",
      confirmButtonColor: "#10b981",
      cancelButtonColor: "#6b7280",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          dispatch(setLoading(true));
          const response = await requestDollarBankWithdrawal({
            investmentId: investment?.id || investment?._id,
          });

          if (response?.success) {
            toast.success(
              response?.message || "Withdrawal request submitted successfully"
            );
            fetchAllInvestments(); // Refresh the list
          } else {
            const errorMessage =
              response?.response?.data?.message ||
              response?.message ||
              "Something went wrong";
            toast.error(errorMessage);
          }
        } catch (error) {
          console.error("Error in withdrawal request:", error);
          const errorMessage =
            error?.response?.data?.message ||
            error?.message ||
            "Something went wrong";
          toast.error(errorMessage);
        } finally {
          dispatch(setLoading(false));
        }
      }
    });
  };

  const formatAmount = (amt) => {
    return amt
      ? Number(amt).toLocaleString("en-US", {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        })
      : "0.00";
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

  const filteredInvestments =
    data === "today"
      ? allInvestments.filter((item) =>
          isToday(new Date(item.investmentDate || item.createdAt))
        )
      : allInvestments;

  const columns = [
    {
      header: "S/N",
      accessor: "_id",
      cell: (row, rowIndex) => (
        <span className="font-medium text-white">{rowIndex + 1}</span>
      ),
    },
    {
      header: "Investment ID",
      accessor: "id",
      cell: (row) => (
        <span className="font-medium text-white font-mono text-xs">
          {row?.id}
        </span>
      ),
    },
    {
      header: "Investment Amount",
      accessor: "investment",
      cell: (row) => (
        <span className="font-medium text-white">
          $ {formatAmount(row?.investment)}
        </span>
      ),
    },
    {
      header: "Profit Rate",
      accessor: "profit",
      cell: (row) => {
        const profitPercent = row?.investment
          ? ((row.profit / row.investment) * 100).toFixed(1)
          : "15";
        return (
          <span className="font-medium text-yellow-400">{profitPercent}%</span>
        );
      },
    },
    {
      header: "Investment Date",
      accessor: "investmentDate",
      cell: (row) => (
        <span className="text-slate-300">
          {formatDate(row?.investmentDate || row?.createdAt)}
        </span>
      ),
    },
    {
      header: "Maturity Date",
      accessor: "maturityDate",
      cell: (row) => (
        <span className="text-slate-300">{formatDate(row?.maturityDate)}</span>
      ),
    },
    {
      header: "Status",
      accessor: "status",
      cell: (row) => (
        <span
          className={`px-3 py-1 text-xs font-semibold rounded-full ${
            row?.status === "Active"
              ? "bg-blue-500/20 text-blue-400 border border-blue-500/30"
              : row?.status === "Matured"
              ? "bg-yellow-500/20 text-yellow-400 border border-yellow-500/30"
              : row?.status === "Withdrawn"
              ? "bg-blue-500/20 text-blue-400 border border-blue-500/30"
              : "bg-slate-500/20 text-slate-400 border border-slate-500/30"
          }`}
        >
          {row?.status}
        </span>
      ),
      searchValue: (row) => row?.status,
    },
    {
      header: "Action",
      exportable: false,
      cell: (row) => {
        const canWithdraw =
          (isMaturityDateToday(row?.maturityDate) ||
            isMaturityDatePassed(row?.maturityDate)) &&
          row?.status !== "Withdrawn" &&
          row?.status !== "Processing";

        return canWithdraw ? (
          <button
            onClick={() => handleWithdrawalRequest(row)}
            className="px-4 py-1 text-xs font-semibold text-white bg-yellow-600 rounded-md hover:bg-yellow-500 transition-colors flex items-center gap-2"
          >
            <ArrowDownLeft className="w-3 h-3" />
            Request Withdrawal
          </button>
        ) : (
          <span className="text-slate-500 text-xs">Not Available</span>
        );
      },
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
          <h1 className="text-3xl font-bold text-white">My Dollar Bank Investments</h1>
          <p className="text-slate-400 mt-1">
            View and manage your Dollar Bank investments
          </p>
        </div>
      </div>

      <DataTable
        title="Dollar Bank Investments"
        columns={columns}
        data={filteredInvestments}
        pageSize={10}
      />
    </div>
  );
};

export default DollarBankInvestments;

