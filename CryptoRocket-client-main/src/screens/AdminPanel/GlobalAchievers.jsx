import React, { useEffect, useState } from "react";
import {
  getAllApprovedWithdrawalRequests,
  getAllGlobalAchievers,
} from "../../api/admin.api";
import { setLoading } from "../../redux/slices/loadingSlice";
import DataTable from "../../components/Screen/UserPanel/DataTable";
import { useDispatch } from "react-redux";
import { all } from "axios";
import { useLocation } from "react-router-dom";
import { isToday } from "../../utils/helper";

const GlobalAchievers = () => {
  const [allGlobalAchievers, setAllGlobalAchievers] = useState([]);
  const dispatch = useDispatch();
  const location = useLocation();
  const data = location?.state;
  const fetchAllGlobalAchievers = async () => {
    try {
      dispatch(setLoading(true));
      const response = await getAllGlobalAchievers();
      setAllGlobalAchievers(response?.data?.history);
    } catch (err) {
      console.log(err);
    } finally {
      dispatch(setLoading(false));
    }
  };
  useEffect(() => {
    fetchAllGlobalAchievers();
  }, []);

  const filteredIncomeHistory =
  data === "today"
    ? allGlobalAchievers.filter((item) => isToday(new Date(item.createdAt)))
    : allGlobalAchievers;

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
      accessor: "user.username",
      cell: (row) => (
        <span className="font-medium text-white">{row?.user?.username}</span>
      ),
    },
    {
      header: "Reward Title",
      accessor: "reward.title",
      cell: (row) => (
        <span className="font-medium text-white">{row?.reward?.title}</span>
      ),
    },
    {
      header: "Amount",
      accessor: "amount",
      cell: (row) => (
        <span className="font-medium text-white text-nowrap">$ {row?.amount}</span>
      ),
    },
    {
      header: "Income",
      accessor: "income",
      cell: (row) => (
        <span className="font-medium text-blue-400">$ {row?.income}</span>
      ),
    },
    {
      header: "Percentage",
      accessor: "percentage",
      cell: (row) => (
        <span className="font-medium text-white">{row?.percentage}%</span>
      ),
    },
    {
      header: "Status",
      accessor: "status",
      cell: (row) => (
        <span
          className={`font-medium ${
            row?.status === "Completed" ? "text-blue-400" : "text-yellow-400"
          }`}
        >
          {row?.status}
        </span>
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
    <DataTable
      title="Global Achievers List"
      columns={columns}
      data={filteredIncomeHistory}
      pageSize={10}
    />
  );
};

export default GlobalAchievers;
