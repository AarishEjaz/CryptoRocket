import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";

import DataTable from "../../components/Screen/UserPanel/DataTable";
import { setLoading } from "../../redux/slices/loadingSlice";
import {
  getAllIncomeHistory,
  getIncomeTotalForAdmin,
} from "../../api/admin.api";
import { maskWalletAddress } from "../../utils/additionalFunc";
import ServerSideTable from "../../components/Screen/UserPanel/ServerSideTable";
import { useLocation } from "react-router-dom";
import { isToday } from "../../utils/helper";
import { AuthenticatedAdminRouters } from "../../constants/routes";
import StatCard from "../../components/Screen/UserPanel/StatCard";

const IncomeHistory = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const data = location.state;

  const [allIncomeHistory, setAllIncomeHistory] = useState([]);
  const [totalCount, setTotalCount] = useState(0); // You can set totalCount if backend sends it, else use fixed value or calculate
  const [currentPage, setCurrentPage] = useState(1);
  const [totalIncome, setTotalIncome] = useState({});
  const pageSize = 10;

  const cardData = [
    {
      title: "Total Income",
      value: `$ ${Number(totalIncome?.totalIncome ?? 0).toFixed(2)}`,
      icon: "https://img.icons8.com/3d-fluency/94/stack-of-coins.png",
      path: AuthenticatedAdminRouters.INCOME_HISTORY,
    },
    {
      title: "Total Referral Income",
      value: `$ ${Number(totalIncome?.totalReferral ?? 0).toFixed(2)}`,
      icon: "https://img.icons8.com/3d-plastilina/69/share--v1.png",
      path: AuthenticatedAdminRouters.REFERRAL_INCOME_HISTORY,
    },
    {
      title: "Total Level Income",
      value: `$ ${Number(totalIncome?.totalLevel ?? 0).toFixed(2)}`,
      icon: "https://img.icons8.com/3d-fluency/94/bar-chart.png",
      path: AuthenticatedAdminRouters.LEVEL_INCOME_HISTORY,
    },
    // {
    //   title: "Total Matching Income",
    //   value: `$ ${Number(totalIncome?.totalMatching ?? 0).toFixed(2)}`,
    //   icon: "https://img.icons8.com/3d-fluency/94/handshake.png",
    //   path: AuthenticatedAdminRouters.MATCHING_INCOME_HISTORY,
    // },
    // {
    //   title: "Total Trading",
    //   value: `$ ${Number(totalIncome?.totalTrading ?? 0).toFixed(2)}`,
    //   icon: "https://img.icons8.com/3d-fluency/94/candle-sticks.png",
    //   path: AuthenticatedAdminRouters.TRADING_LIST,
    // },
  ];

  const fetchAllIncomeHistory = async (page = 1) => {
    try {
      dispatch(setLoading(true));
      const response = await getAllIncomeHistory({ page });
      if (response?.success) {
        setAllIncomeHistory(response?.data || []);
        setTotalCount(response?.data?.totalCount || 0);
      } else {
        toast.error(response?.message || "Something went wrong");
        setAllIncomeHistory([]);
        setTotalCount(0);
      }
    } catch (err) {
      toast.error("Failed to fetch income history");
      setAllIncomeHistory([]);
      setTotalCount(0);
    } finally {
      dispatch(setLoading(false));
    }
  };

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
    fetchAllIncomeHistory();
    fetchCardData();
  }, []);

  const filteredIncomeHistory =
    data === "today"
      ? allIncomeHistory.filter((item) => isToday(new Date(item.createdAt)))
      : allIncomeHistory;

  const columns = [
    {
      header: "S/N",
      accessor: "_id",
      cell: (_, rowIndex) => (
        <span className="font-medium text-white">
          {rowIndex + 1 + (currentPage - 1) * pageSize}
        </span>
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
        <span className="font-medium text-white">{row?.user?.username}</span>
      ),
      searchValue: (row) => row?.user?.username,
    },
    {
      header: "From User",
      accessor: "fromUser.username",
      cell: (row) => (
        <span className="font-medium text-white">
          {row?.fromUser?.username || "-"}
        </span>
      ),
      searchValue: (row) => row?.fromUser?.username,
    },
    {
      header: "Amount",
      accessor: "amount",
      cell: (row) => (
        <span className="font-medium text-white">
          $ {row?.amount.toFixed(2)}
        </span>
      ),
    },
    {
      header: "Income",
      accessor: "income",
      cell: (row) => (
        <span className="font-medium text-white">
          $ {row?.income.toFixed(2)}
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
  ];

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
      <DataTable
        title="Income History"
        columns={columns}
        data={filteredIncomeHistory}
        totalCount={totalCount}
        pageSize={pageSize}
      />
    </div>
  );
};

export default IncomeHistory;
