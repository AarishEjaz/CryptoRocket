import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";

import DataTable from "../../components/Screen/UserPanel/DataTable";
import { setLoading } from "../../redux/slices/loadingSlice";
import { isToday } from "../../utils/helper";
import { useLocation } from "react-router-dom";
import { getAllUserUserRoiHistory } from "../../api/user.api";

const UserRoiHistory = () => {
    const location = useLocation();
  const dispatch = useDispatch();
  const data = location?.state;

  const [allUserRoiHistory, setAllUserRoiHistory] = useState([]);

  const fetchAllUserRoiHistory = async () => {
    try {
      dispatch(setLoading(true));
      const response = await getAllUserUserRoiHistory();
      if (response?.success) {
        setAllUserRoiHistory(response?.data?.history || []);
      } else {
        toast.error(response?.message || "Something went wrong");
        setAllUserRoiHistory([]);
      }
    } catch (err) {
      toast.error("Failed to fetch UserRoi history");
      setAllUserRoiHistory([]);
    } finally {
      dispatch(setLoading(false));
    }
  };

  useEffect(() => {
    fetchAllUserRoiHistory();
  }, []);

  const filteredIncomeHistory =
  data === "today"
    ? allUserRoiHistory.filter((item) => isToday(new Date(item.createdAt)))
    : allUserRoiHistory;

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
    {
      header: "From User",
      accessor: "fromUser.username",
      cell: (row) => (
        <span className="font-medium text-white">{row?.fromUser?.username || "-"}</span>
      ),
    },
    {
      header: "Amount",
      accessor: "amount",
      cell: (row) => <span className="font-medium text-white">$ {row?.amount}</span>,
    },
    {
      header: "ReferralIncome",
      accessor: "income",
      cell: (row) => <span className="font-medium text-white">$ {row?.income}</span>,
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
    },
  ];

  return (
    <DataTable
      title="ROI History"
      columns={columns}
      data={filteredIncomeHistory}
      pageSize={10}
    />
  );
};

export default UserRoiHistory;
