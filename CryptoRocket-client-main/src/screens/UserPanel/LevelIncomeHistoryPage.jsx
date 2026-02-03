import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";

import DataTable from "../../components/Screen/UserPanel/DataTable";
import { setLoading } from "../../redux/slices/loadingSlice";
import {
  getAllUserLevelIncomeHistory,
} from "../../api/user.api";
import { isToday } from "../../utils/helper";
import { useLocation } from "react-router-dom";
import StatCard from "../../components/Screen/UserPanel/StatCard";
import { getIncomeTotal } from "../../api/auth.api";

const LevelIncomeHistoryPage = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const data = location?.state;

  const [allLevelIncomeHistory, setAllLevelIncomeHistory] = useState([]);
  const [totalIncome, setTotalIncome] = useState({});

  const fetchAllLevelIncomeHistory = async () => {
    try {
      dispatch(setLoading(true));
      const response = await getAllUserLevelIncomeHistory();
      if (response?.success) {
        setAllLevelIncomeHistory(response?.data?.history || []);
      } else {
        toast.error(response?.message || "Something went wrong");
        setAllLevelIncomeHistory([]);
      }
    } catch (err) {
      toast.error("Failed to fetch ROI Dividend history");
      setAllLevelIncomeHistory([]);
    } finally {
      dispatch(setLoading(false));
    }
  };

  useEffect(() => {
    fetchAllLevelIncomeHistory();
  }, []);

  const filteredIncomeHistory =
    data === "today"
      ? allLevelIncomeHistory.filter((item) =>
        isToday(new Date(item.createdAt))
      )
      : allLevelIncomeHistory;

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
      header: "Depth Level",
      accessor: "level",
      cell: (row) => (
        <span className="font-medium text-white">{row?.level || "-"}</span>
      ),
    },
    {
      header: "Total ROI (Depth)",
      accessor: "amount",
      cell: (row) => (
        <span className="font-medium text-white text-nowrap">
          $ {row?.amount?.toFixed(2) || "0.00"}
        </span>
      ),
    },
    {
      header: "Percentage (%)",
      accessor: "percentage",
      cell: (row) => (
        <span className="font-medium text-white">
          {row?.percentage ? `${row.percentage}%` : "-"}
        </span>
      ),
    },
    {
      header: "ROI Dividend",
      accessor: "income",
      cell: (row) => (
        <span className="font-medium text-blue-400 text-nowrap">
          $ {row?.income?.toFixed(2) || "0.00"}
        </span>
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
      header: "Date",
      accessor: "createdAt",
      cell: (row) => (
        <span className="text-slate-300">
          {new Date(row?.createdAt).toLocaleDateString()}
        </span>
      ),
    },
  ];

  const cardData = [
    {
      title: "Total Level Income",
      value: `$ ${Number(totalIncome?.totalLevel ?? 0).toFixed(2)}`,
      icon: "https://cdn-icons-png.flaticon.com/512/10102/10102408.png",
    },
    {
      title: "Today Level Income",
      value: `$ ${Number(totalIncome?.todayLevel ?? 0).toFixed(2)}`,
      icon: "https://img.icons8.com/isometric/50/economic-improvement--v1.png",
    },
  ];

  const fetchCardData = async () => {
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
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
        title="ROI Dividend History"
        columns={columns}
        data={filteredIncomeHistory}
        pageSize={10}
      />
    </div >
  );
};

export default LevelIncomeHistoryPage;
