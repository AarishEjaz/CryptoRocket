import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import DataTable from "../../components/Screen/UserPanel/DataTable";
import { setLoading } from "../../redux/slices/loadingSlice";
import { getAllTradingList } from "../../api/admin.api";
import { useLocation } from "react-router-dom";
import { isToday } from "../../utils/helper";
import StatCard from "../../components/Screen/UserPanel/StatCard";

const ROIIncome = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const data = location.state;

  const [allIncomeHistory, setAllIncomeHistory] = useState([]);
  const [totalIncome, setTotalIncome] = useState(0);
  const [todayTotal, setTodayTotal] = useState(0);

  const fetchAllIncomeHistory = async () => {
    try {
      dispatch(setLoading(true));
      const response = await getAllTradingList();
      if (response?.success) {
        setAllIncomeHistory(response?.data?.history || []);
        setTotalIncome(response?.data?.totalIncome || 0);
        setTodayTotal(response?.data?.todayTotal || 0);
      } else {
        toast.error(response?.message || "Something went wrong");
        setAllIncomeHistory([]);
      }
    } catch (err) {
      toast.error("Failed to fetch Trading Profit Income history");
      setAllIncomeHistory([]);
    } finally {
      dispatch(setLoading(false));
    }
  };

  useEffect(() => {
    fetchAllIncomeHistory();
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
        <span className="font-medium text-white">{row?.user?.username}</span>
      ),
      searchValue: (row) => row?.user?.username,
    },
    {
      header: "Investment Amount",
      accessor: "amount",
      cell: (row) => (
        <span className="font-medium text-white text-nowrap">
          $ {row?.amount?.toFixed(2) || "0.00"}
        </span>
      ),
    },
    {
      header: "Daily ROI (%)",
      accessor: "percentage",
      cell: (row) => (
        <span className="font-medium text-white">
          {row?.percentage?.toFixed(2) || "0"}%
        </span>
      ),
    },
    {
      header: "Trading Profit Income",
      accessor: "income",
      cell: (row) => (
        <span className="font-medium text-blue-400 text-nowrap">
          $ {row?.income?.toFixed(2) || "0.00"}
        </span>
      ),
    },
    {
      header: "Day",
      accessor: "days",
      cell: (row) => (
        <span className="font-medium text-white">{row?.days || "-"}</span>
      ),
    },
    {
      header: "Plan",
      accessor: "level",
      cell: (row) => (
        <span className="font-medium text-white">{row?.level || "-"}</span>
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
      header: "Date",
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

  const cardData = [
    {
      title: "Total Trading Profit Income (All Users)",
      value: `$ ${Number(totalIncome ?? 0).toFixed(2)}`,
      icon: "https://img.icons8.com/3d-fluency/94/receive-cash.png",
    },
    {
      title: "Today Trading Profit Income (All Users)",
      value: `$ ${Number(todayTotal ?? 0).toFixed(2)}`,
      icon: "https://img.icons8.com/3d-fluency/94/sales-performance.png",
    },
  ];

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
        title="Trading Profit Income History (All Users)"
        columns={columns}
        data={filteredIncomeHistory}
        pageSize={10}
      />
    </div>
  );
};

export default ROIIncome;