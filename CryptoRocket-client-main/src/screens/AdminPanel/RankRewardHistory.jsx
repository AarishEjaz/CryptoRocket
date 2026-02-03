import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";

import DataTable from "../../components/Screen/UserPanel/DataTable";
import { setLoading } from "../../redux/slices/loadingSlice";
import { getAllIncomeHistory, getAllLevelIncomeHistory, getAllMatchingIncomeHistory, getAllRankRewardHistory, getAllReferralIncomeHistory } from "../../api/admin.api";
import ServerSideTable from "../../components/Screen/UserPanel/ServerSideTable";

const RankRewardHistory = () => {
  const dispatch = useDispatch();

  const [allRankRewardHistory, setAllRankRewardHistory] = useState([]);

  const fetchAllRankRewardHistory = async () => {
    try {
      dispatch(setLoading(true));
      const response = await getAllRankRewardHistory();
      if (response?.success) {
        setAllRankRewardHistory(response?.data?.history || []);
      } else {
        toast.error(response?.message || "Something went wrong");
        setAllRankRewardHistory([]);
      }
    } catch (err) {
      toast.error("Failed to fetch Rank Reward history");
      setAllRankRewardHistory([]);
    } finally {
      dispatch(setLoading(false));
    }
  };

  useEffect(() => {
    fetchAllRankRewardHistory();
  }, []);

  const columns = [
    {
      header: "S/N",
      accessor: "_id",
      cell: (_, rowIndex) => (
        <span className="font-medium text-white">
          {rowIndex + 1}
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
      cell: (row) => <span className="font-medium text-white text-nowrap">$ {row?.amount}</span>,
    },
    {
      header: "ReferralIncome",
      accessor: "income",
      cell: (row) => <span className="font-medium text-white text-nowrap">$ {row?.income}</span>,
    },
    {
      header: "Level",
      accessor: "level",
      cell: (row) => <span className="font-medium text-white">{row?.level}</span>,
    },
    {
      header: "Days",
      accessor: "days",
      cell: (row) => <span className="font-medium text-white">{row?.days}</span>,
    },
    {
      header: "Type",
      accessor: "type",
      cell: (row) => <span className="font-medium text-white">{row?.type}</span>,
    },
    {
      header: "Reward Paid",
      accessor: "rewardPaid",
      cell: (row) => <span className="font-medium text-white">{row?.rewardPaid}</span>,
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
      searchValue: (row) => {
        return new Date(row?.createdAt)?.toLocaleDateString();
      },
    },
  ];

  return (
    <DataTable
      title="Rank Reward History"
      columns={columns}
      data={allRankRewardHistory}
      pageSize={10}
    />
  );
};

export default RankRewardHistory;
