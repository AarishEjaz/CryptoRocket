import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";

import DataTable from "../../components/Screen/UserPanel/DataTable";
import { setLoading } from "../../redux/slices/loadingSlice";
import ServerSideTable from "../../components/Screen/UserPanel/ServerSideTable";
import { useLocation } from "react-router-dom";
import { isToday } from "../../utils/helper";
import { getAllUserMatchingIncomeHistory } from "../../api/user.api";
import StatCard from "../../components/Screen/UserPanel/StatCard";
import { getIncomeTotal } from "../../api/auth.api";
import { AuthenticatedUserRouters } from "../../constants/routes";

const UserMatchingIncomeHistory = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const data = location?.state;

  const [allMatchingIncomeHistory, setAllMatchingIncomeHistory] = useState([]);
  const [totalIncome, setTotalIncome] = useState({});
  const userInfo = useSelector((state) => state?.isLoggedUser?.data);

  const fetchAllMatchingIncomeHistory = async () => {
    try {
      dispatch(setLoading(true));
      const response = await getAllUserMatchingIncomeHistory();
      if (response?.success) {
        setAllMatchingIncomeHistory(response?.data?.history || []);
      } else {
        toast.error(response?.message || "Something went wrong");
        setAllMatchingIncomeHistory([]);
      }
    } catch (err) {
      toast.error("Failed to fetch Matching Income history");
      setAllMatchingIncomeHistory([]);
    } finally {
      dispatch(setLoading(false));
    }
  };

  useEffect(() => {
    fetchAllMatchingIncomeHistory();
  }, []);

  const filteredIncomeHistory =
    data === "today"
      ? allMatchingIncomeHistory.filter((item) =>
          isToday(new Date(item.createdAt))
        )
      : allMatchingIncomeHistory;

  const columns = [
    {
      header: "S/N",
      accessor: "_id",
      cell: (_, rowIndex) => (
        <span className="font-medium text-white">{rowIndex + 1}</span>
      ),
    },
    {
      header: "Transaction ID",
      accessor: "id",
      cell: (row) => <span className="font-medium text-white">{row?.id}</span>,
    },
    {
      header: "User ID",
      accessor: "user.username",
      cell: (row) => (
        <span className="font-medium text-white">
          {row?.user?.username || "N/A"}
        </span>
      ),
      searchValue: (row) => row?.user?.username,
    },
    // {
    //   header: "From User",
    //   accessor: "fromUser.username",
    //   cell: (row) => (
    //     <span className="font-medium text-white">{row?.fromUser?.username || "-"}</span>
    //   ),
    // },
    {
      header: "Amount",
      accessor: "amount",
      cell: (row) => (
        <span className="font-medium text-white text-nowrap">
          $ {row?.amount}
        </span>
      ),
    },
    {
      header: "ReferralIncome",
      accessor: "income",
      cell: (row) => (
        <span className="font-medium text-white text-nowrap">
          $ {row?.income}
        </span>
      ),
    },
    {
      header: "Level",
      accessor: "level",
      cell: (row) => (
        <span className="font-medium text-white">{row?.level}</span>
      ),
    },
    {
      header: "Days",
      accessor: "days",
      cell: (row) => (
        <span className="font-medium text-white">{row?.days}</span>
      ),
    },
    {
      header: "Type",
      accessor: "type",
      cell: (row) => (
        <span className="font-medium text-white">{row?.type}</span>
      ),
    },
    {
      header: "Reward Paid",
      accessor: "rewardPaid",
      cell: (row) => (
        <span className="font-medium text-white">{row?.rewardPaid}</span>
      ),
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
    },
    {
      header: "Created At",
      accessor: "createdAt",
      cell: (row) => (
        <span className="text-slate-300">
          {new Date(row?.createdAt).toLocaleString()}
        </span>
      ),
    },
  ];

  const cardData = [
      {
        title: "Total Income",
        value: `$ ${Number(totalIncome?.totalIncome ?? 0).toFixed(2)}`,
        icon: "https://img.icons8.com/3d-fluency/94/sales-performance.png",
        path: AuthenticatedUserRouters.INCOME_HISTORY,
      },
      {
        title: "Total Trading Income",
        value: `$ ${Number(totalIncome?.totalTrading ?? 0).toFixed(2)}`,
        icon: "https://img.icons8.com/3d-fluency/94/receive-cash.png",
        path: AuthenticatedUserRouters.TRADING_INCOME_HISTORY,
      },
      {
        title: "Total Level Income",
        value: `$ ${Number(totalIncome?.totalLevel ?? 0).toFixed(2)}`,
        icon: "https://cdn-icons-png.flaticon.com/512/10102/10102408.png",
        path: AuthenticatedUserRouters.LEVEL_INCOME_HISTORY,
      },
      {
        title: "Total Global Achievers",
        value: `${Number(totalIncome?.totalGlobalAchiever ?? 0).toFixed(2)}`,
        icon: "https://img.icons8.com/3d-fluency/94/medal.png",
        path: AuthenticatedUserRouters.GLOBAL_ACHIEVERS,
      },
      {
        title: "Total Matching Income",
        value: `$ ${Number(totalIncome?.totalMatching ?? 0).toFixed(2)}`,
        icon: "https://img.icons8.com/3d-fluency/94/combo-chart.png",
        path: AuthenticatedUserRouters.MATCHING_INCOME_HISTORY,
      },
      {
        title: "Total Referrals Income",
        value: `$ ${Number(totalIncome?.totalReferral ?? 0).toFixed(2)}`,
        icon: "https://img.icons8.com/3d-fluency/94/group.png",
        path: AuthenticatedUserRouters.REFERRAL_INCOME_HISTORY,
      },
    ];

  const matchingCards = [
    {
      title: "Total Investment",
      value: `$ ${userInfo?.investment?.toFixed(2)}`,
      subtitle: "Your accumulated investment",
      icon: "💰",
      gradient: "from-blue-500 via-blue-600 to-cyan-600",
      iconBg: "bg-blue-500/20",
      iconColor: "text-blue-400",
    },
    {
      title: "Matching Income Limit",
      value: "$ 3,000",
      subtitle: "Investment threshold for eligibility",
      icon: "🎯",
      gradient: "from-cyan-500 via-teal-600 to-blue-600",
      iconBg: "bg-cyan-500/20",
      iconColor: "text-cyan-400",
    },
    {
      title: "Team Status",
      value: `${allMatchingIncomeHistory.length} Active`,
      subtitle: "Total matching transactions",
      icon: "👥",
      gradient: "from-indigo-500 via-purple-600 to-blue-600",
      iconBg: "bg-indigo-500/20",
      iconColor: "text-indigo-400",
    },
  ];

  const fetchCardData = async (page = 1) => {
    try {
      dispatch(setLoading(true));
      const response = await getIncomeTotal();
      if (response?.success) {
        setTotalIncome(response?.data || {});
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
            path={item.path}
          />
        ))}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {matchingCards.map((card, index) => (
          <div
            key={index}
            className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-800 to-slate-900 p-6 shadow-xl border border-slate-700/50 hover:border-blue-500/50 transition-all duration-300 hover:shadow-2xl hover:shadow-blue-500/20 group"
          >
            {/* Gradient Overlay */}
            <div
              className={`absolute inset-0 bg-gradient-to-br ${card.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-300`}
            />

            {/* Decorative Circle */}
            <div className="absolute -right-8 -top-8 w-32 h-32 bg-blue-500/10 rounded-full blur-2xl" />

            <div className="relative z-10">
              {/* Icon and Title */}
              <div className="flex items-start justify-between mb-4">
                <div
                  className={`${card.iconBg} w-14 h-14 rounded-xl flex items-center justify-center text-3xl transform group-hover:scale-110 transition-transform duration-300`}
                >
                  {card.icon}
                </div>
                <div className="w-2 h-2 rounded-full bg-blue-400 animate-pulse" />
              </div>

              {/* Title */}
              <h3 className="text-slate-400 text-sm font-medium mb-2">
                {card.title}
              </h3>

              {/* Value */}
              <div
                className={`text-3xl font-bold bg-gradient-to-r ${card.gradient} bg-clip-text text-transparent mb-2`}
              >
                {card.value}
              </div>

              {/* Subtitle */}
              <p className="text-slate-500 text-xs">{card.subtitle}</p>

              {/* Bottom Border Accent */}
              <div
                className={`absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r ${card.gradient} transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300`}
              />
            </div>
          </div>
        ))}
      </div>
      <DataTable
        title="Matching Income History"
        columns={columns}
        data={filteredIncomeHistory}
        pageSize={10}
      />
    </div>
  );
};

export default UserMatchingIncomeHistory;
