import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";

import DataTable from "../../components/Screen/UserPanel/DataTable";
import { setLoading } from "../../redux/slices/loadingSlice";
import { getAllUserIncomeHistory } from "../../api/user.api";
import { useLocation } from "react-router-dom";
import { isToday } from "../../utils/helper";
import { AuthenticatedUserRouters } from "../../constants/routes";
import StatCard from "../../components/Screen/UserPanel/StatCard";

const UserROIIncome = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const data = location.state;

  const [allIncomeHistory, setAllIncomeHistory] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalIncome, setTotalIncome] = useState({});
  const pageSize = 10;

  const cardData = [
    {
      title: "Total Trading Income",
      value: `$ ${Number(totalIncome?.totalROI ?? 0).toFixed(2)}`,
      icon: "https://img.icons8.com/3d-fluency/94/investment.png",
      path: AuthenticatedUserRouters.ROI_INCOME,
    },
    {
      title: "Today Trading Income",
      value: `$ ${Number(totalIncome?.todayROI ?? 0).toFixed(2)}`,
      icon: "https://img.icons8.com/3d-fluency/94/calendar.png",
    },
    {
      title: "Monthly Trading Income",
      value: `$ ${Number(totalIncome?.monthlyROI ?? 0).toFixed(2)}`,
      icon: "https://img.icons8.com/3d-fluency/94/bar-chart.png",
    },
  ];

  const fetchAllIncomeHistory = async (page = 1) => {
    try {
      dispatch(setLoading(true));
      const response = await getAllUserIncomeHistory();
      if (response?.success) {
        const roiData = response?.data?.filter(item => item?.type === "ROI") || [];
        setAllIncomeHistory(roiData);
        setTotalCount(roiData?.length || 0);
      } else {
        toast.error(response?.message || "Something went wrong");
        setAllIncomeHistory([]);
        setTotalCount(0);
      }
    } catch (err) {
      toast.error("Failed to fetch ROI income history");
      setAllIncomeHistory([]);
      setTotalCount(0);
    } finally {
      dispatch(setLoading(false));
    }
  };

  const fetchCardData = async () => {
    try {
      dispatch(setLoading(true));
      const response = await getAllUserIncomeHistory();
      if (response?.success) {
        const roiData = response?.data?.filter(item => item?.type === "ROI") || [];
        const totalROI = roiData.reduce((sum, item) => sum + (item?.income || 0), 0);
        setTotalIncome({ totalROI });
      } else {
        setTotalIncome({});
      }
    } catch (err) {
      toast.error("Failed to fetch ROI income data");
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
      header: "Investment Amount",
      accessor: "amount",
      cell: (row) => (
        <span className="font-medium text-white">
          $ {row?.amount.toFixed(2)}
        </span>
      ),
    },
    {
      header: "Trading Income",
      accessor: "income",
      cell: (row) => (
        <span className="font-medium text-white">
          $ {row?.income.toFixed(2)}
        </span>
      ),
    },
    {
      header: "Trading Percentage",
      accessor: "roiPercentage",
      cell: (row) => (
        <span className="font-medium text-white">{row?.roiPercentage || "0"}%</span>
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
      header: "Status",
      accessor: "status",
      cell: (row) => (
        <span
          className={`font-medium ${row?.status === "Completed" ? "text-blue-500" : "text-yellow-400"
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
        title="Trading Income History"
        columns={columns}
        data={filteredIncomeHistory}
        totalCount={totalCount}
        pageSize={pageSize}
      />
    </div>
  );
};

export default UserROIIncome;