import React, { useEffect, useState } from "react";
import {
  getDollarBankSummary,
  getAllDollarBankUsers,
} from "../../api/admin.api";
import { setLoading } from "../../redux/slices/loadingSlice";
import DataTable from "../../components/Screen/UserPanel/DataTable";
import { useDispatch } from "react-redux";
import StatCard from "../../components/Screen/UserPanel/StatCard";
import { Building2, TrendingUp, Users, DollarSign, Calendar, CheckCircle } from "lucide-react";

const DollarBank = () => {
  const [summary, setSummary] = useState(null);
  const [usersInvestments, setUsersInvestments] = useState([]);
  const dispatch = useDispatch();

  const fetchSummary = async () => {
    try {
      dispatch(setLoading(true));
      const response = await getDollarBankSummary();
      if (response?.success) {
        setSummary(response?.data?.summary);
      }
    } catch (err) {
      console.log(err);
    } finally {
      dispatch(setLoading(false));
    }
  };

  const fetchAllUsers = async () => {
    try {
      dispatch(setLoading(true));
      const response = await getAllDollarBankUsers();
      if (response?.success) {
        setUsersInvestments(response?.data?.usersInvestments || []);
      }
    } catch (err) {
      console.log(err);
    } finally {
      dispatch(setLoading(false));
    }
  };

  useEffect(() => {
    fetchSummary();
    fetchAllUsers();
  }, []);

  const formatAmount = (amt) => {
    return amt ? Number(amt).toLocaleString("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }) : "0.00";
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const cardData = [
    {
      title: "Total Investments",
      value: `${Number(summary?.totalInvestments ?? 0)}`,
      icon: "https://img.icons8.com/3d-fluency/94/money-bag.png",
    },
    {
      title: "Total Users",
      value: `${Number(summary?.totalUsers ?? 0)}`,
      icon: "https://img.icons8.com/3d-fluency/94/group--v2.png",
    },
    {
      title: "Total Investment Amount",
      value: `$ ${formatAmount(summary?.totalInvestment)}`,
      icon: "https://img.icons8.com/3d-fluency/94/dollar-coin.png",
    },
    {
      title: "Total Profit",
      value: `$ ${formatAmount(summary?.totalProfit)}`,
      icon: "https://img.icons8.com/3d-fluency/94/growth.png",
    },
    {
      title: "Active Investments",
      value: `${Number(summary?.activeInvestments ?? 0)}`,
      icon: "https://img.icons8.com/3d-fluency/94/checkmark.png",
    },
    {
      title: "Active Investment Amount",
      value: `$ ${formatAmount(summary?.activeInvestment)}`,
      icon: "https://img.icons8.com/3d-fluency/94/wallet.png",
    },
    {
      title: "Today Investments",
      value: `${Number(summary?.todayInvestments ?? 0)}`,
      icon: "https://img.icons8.com/3d-fluency/94/calendar.png",
    },
    {
      title: "Today Total",
      value: `$ ${formatAmount(summary?.todayTotal)}`,
      icon: "https://img.icons8.com/3d-fluency/94/money.png",
    },
    {
      title: "Month Investments",
      value: `${Number(summary?.monthInvestments ?? 0)}`,
      icon: "https://img.icons8.com/3d-fluency/94/calendar-month.png",
    },
    {
      title: "Month Total",
      value: `$ ${formatAmount(summary?.monthTotal)}`,
      icon: "https://img.icons8.com/3d-fluency/94/money-bag.png",
    },
  ];

  // Flatten users investments for table display
  const tableData = usersInvestments.flatMap((userData) =>
    userData.investments.map((investment) => ({
      ...investment,
      userId: userData.user?.id,
      username: userData.user?.username,
      email: userData.user?.email,
      userInvestment: userData.user?.investment,
      userTotalInvestment: userData.totalInvestment,
      userTotalProfit: userData.totalProfit,
      userTotalAmount: userData.totalAmount,
      activeCount: userData.activeCount,
      withdrawnCount: userData.withdrawnCount,
    }))
  );

  const columns = [
    {
      header: "S/N",
      accessor: "_id",
      cell: (row, rowIndex) => (
        <span className="font-medium text-white">{rowIndex + 1}</span>
      ),
    },
    {
      header: "User ID",
      accessor: "userId",
      cell: (row) => (
        <span className="font-medium text-white">{row?.userId}</span>
      ),
      searchValue: (row) => row?.userId,
    },
    {
      header: "Username",
      accessor: "username",
      cell: (row) => (
        <span className="font-medium text-white">{row?.username}</span>
      ),
      searchValue: (row) => row?.username,
    },
    {
      header: "Email",
      accessor: "email",
      cell: (row) => (
        <span className="font-medium text-white">{row?.email}</span>
      ),
      searchValue: (row) => row?.email,
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
        // Calculate profit percentage (25% based on the response structure)
        const profitPercent = row?.investment
          ? ((row.profit / row.investment) * 100).toFixed(1)
          : "0";
        return (
          <span className="font-medium text-yellow-400">{profitPercent}%</span>
        );
      },
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
              : "bg-slate-500/20 text-slate-400 border border-slate-500/30"
          }`}
        >
          {row?.status}
        </span>
      ),
      searchValue: (row) => row?.status,
    },
    {
      header: "Maturity Date",
      accessor: "maturityDate",
      cell: (row) => (
        <span className="text-slate-300">{formatDate(row?.maturityDate)}</span>
      ),
    },
    {
      header: "User Total Investment",
      accessor: "userTotalInvestment",
      cell: (row) => (
        <span className="font-medium text-cyan-400">
          $ {formatAmount(row?.userTotalInvestment)}
        </span>
      ),
    },
    {
      header: "User Active Count",
      accessor: "activeCount",
      cell: (row) => (
        <span className="font-medium text-blue-400">{row?.activeCount}</span>
      ),
    },
    {
      header: "User Withdrawn Count",
      accessor: "withdrawnCount",
      cell: (row) => (
        <span className="font-medium text-slate-400">{row?.withdrawnCount}</span>
      ),
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
          <h1 className="text-3xl font-bold text-white">Dollar Bank Management</h1>
          <p className="text-slate-400 mt-1">
            View summary and manage all Dollar Bank investments
          </p>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
        {cardData.map((item, index) => (
          <StatCard
            key={index}
            title={item.title}
            value={item.value}
            iconImage={item.icon}
          />
        ))}
      </div>

      {/* Additional Summary Info */}
      {summary && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
          <div className="p-4 bg-gradient-to-r from-blue-500/10 to-cyan-500/10 border border-blue-500/20 rounded-xl">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="w-5 h-5 text-blue-400" />
              <span className="text-sm text-slate-400">Matured Investments</span>
            </div>
            <p className="text-2xl font-bold text-white">
              {Number(summary?.maturedInvestments ?? 0)}
            </p>
          </div>
          <div className="p-4 bg-gradient-to-r from-blue-500/10 to-emerald-500/10 border border-blue-500/20 rounded-xl">
            <div className="flex items-center gap-2 mb-2">
              <CheckCircle className="w-5 h-5 text-blue-400" />
              <span className="text-sm text-slate-400">Withdrawn Investments</span>
            </div>
            <p className="text-2xl font-bold text-white">
              {Number(summary?.withdrawnInvestments ?? 0)}
            </p>
          </div>
          <div className="p-4 bg-gradient-to-r from-yellow-500/10 to-amber-500/10 border border-yellow-500/20 rounded-xl">
            <div className="flex items-center gap-2 mb-2">
              <Calendar className="w-5 h-5 text-yellow-400" />
              <span className="text-sm text-slate-400">Matured But Not Withdrawn</span>
            </div>
            <p className="text-2xl font-bold text-white">
              {Number(summary?.maturedButNotWithdrawn ?? 0)}
            </p>
          </div>
          <div className="p-4 bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-500/20 rounded-xl">
            <div className="flex items-center gap-2 mb-2">
              <DollarSign className="w-5 h-5 text-purple-400" />
              <span className="text-sm text-slate-400">Matured Not Withdrawn Total</span>
            </div>
            <p className="text-2xl font-bold text-white">
              $ {formatAmount(summary?.maturedButNotWithdrawnTotal)}
            </p>
          </div>
        </div>
      )}

      {/* Users Investments Table */}
      <DataTable
        title="All Users Dollar Bank Investments"
        columns={columns}
        data={tableData}
        pageSize={10}
      />
    </div>
  );
};

export default DollarBank;

