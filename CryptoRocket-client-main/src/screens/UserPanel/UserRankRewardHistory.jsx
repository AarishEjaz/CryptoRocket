import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";

import DataTable from "../../components/Screen/UserPanel/DataTable";
import { setLoading } from "../../redux/slices/loadingSlice";
import { useLocation } from "react-router-dom";
import { isToday } from "../../utils/helper";
import { getAllUserRankRewardHistory } from "../../api/user.api";
import StatCard from "../../components/Screen/UserPanel/StatCard";
import { getIncomeTotal } from "../../api/auth.api";

const UserRankRewardHistory = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const data = location?.state;

  const [allMatchingIncomeHistory, setAllMatchingIncomeHistory] = useState([]);
  const [totalIncome, setTotalIncome] = useState({});
  const userInfo = useSelector((state) => state?.isLoggedUser?.data);
  const [currentRank, setCurrentRank] = useState('No Rank');
  const [nextRank, setNextRank] = useState(null);

  const fetchAllMatchingIncomeHistory = async () => {
    try {
      dispatch(setLoading(true));
      const response = await getAllUserRankRewardHistory();
      if (response?.success) {
        setAllMatchingIncomeHistory(response?.data?.history || []);
        setCurrentRank(response?.data?.currentRank || 'No Rank');
        setNextRank(response?.data?.nextRank);
      } else {
        toast.error(response?.message || "Something went wrong");
        setAllMatchingIncomeHistory([]);
      }
    } catch (err) {
      toast.error("Failed to fetch Rank Reward history");
      setAllMatchingIncomeHistory([]);
    } finally {
      dispatch(setLoading(false));
    }
  };

  useEffect(() => {
    fetchAllMatchingIncomeHistory();
  }, []);

  const totalReward = allMatchingIncomeHistory.reduce((sum, item) => sum + (item.amount || 0), 0);

  const columns = [
    {
      header: "S/N",
      accessor: "_id",
      cell: (_, rowIndex) => (
        <span className="font-medium text-cyan-300">{rowIndex + 1}</span>
      ),
    },
    {
      header: "Rank Achieved",
      accessor: "level",
      cell: (row) => (
        <span className="font-medium text-blue-400 font-bold">
          {row?.level || "N/A"}
        </span>
      ),
    },
    {
      header: "Reward Amount",
      accessor: "amount",
      cell: (row) => (
        <span className="font-medium text-cyan-400 text-nowrap">
          $ {row?.amount?.toFixed(2) || 0}
        </span>
      ),
    },
    {
      header: "Date Achieved",
      accessor: "createdAt",
      cell: (row) => (
        <span className="text-cyan-200">
          {row?.createdAt ? new Date(row?.createdAt).toLocaleString() : "N/A"}
        </span>
      ),
    },
    {
      header: "Status",
      accessor: "status",
      cell: (row) => (
        <span
          className={`font-medium ${row?.status === "Completed" ? "text-blue-500" : "text-cyan-400"
            }`}
        >
          {row?.status || "N/A"}
        </span>
      ),
    },
  ];

  const matchingCards = [
    {
      title: "Current Rank",
      value: currentRank,
      subtitle: "Your achieved status",
      icon: "🏆",
      gradient: "from-cyan-400 via-blue-500 to-indigo-500",
      iconBg: "bg-cyan-500/20",
      iconColor: "text-cyan-400",
    },
    {
      title: "Total Rewards",
      value: `$ ${totalReward.toFixed(2)}`,
      subtitle: "Total Rank Rewards Earned",
      icon: "💰",
      gradient: "from-blue-400 via-cyan-500 to-teal-500",
      iconBg: "bg-blue-500/20",
      iconColor: "text-blue-400",
    },
  ];

  if (nextRank) {
    let subtitle = '';
    if (nextRank.rank === 'Z-1') {
      subtitle = `10 Qualified Directs + 30 Team Members (from Level 2 downwards, max 15 counted per leg)`;
    } else {
      subtitle = `${nextRank.direct} Qualified Directs + ${nextRank.reqCount} legs having at least one ${nextRank.reqRank} (found in Level 2 downwards)`;
    }

    matchingCards.push({
      title: "Next Goal",
      value: nextRank.rank,
      subtitle: subtitle,
      icon: "🎯",
      gradient: "from-cyan-400 via-blue-500 to-indigo-500",
      iconBg: "bg-cyan-500/20",
      iconColor: "text-cyan-400",
    });
  }

  return (
    <div className="space-y-5 mt-5">
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
              <h3 className="text-cyan-300 text-sm font-medium mb-2">
                {card.title}
              </h3>

              {/* Value */}
              <div
                className={`text-3xl font-bold bg-gradient-to-r ${card.gradient} bg-clip-text text-transparent mb-2`}
              >
                {card.value}
              </div>

              {/* Subtitle */}
              <p className="text-cyan-200 text-xs">{card.subtitle}</p>

              {/* Bottom Border Accent */}
              <div
                className={`absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r ${card.gradient} transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300`}
              />
            </div>
          </div>
        ))}
      </div>
      <DataTable
        title="Rank Reward History"
        columns={columns}
        data={allMatchingIncomeHistory}
        pageSize={10}
      />
    </div>
  );
};

export default UserRankRewardHistory;
