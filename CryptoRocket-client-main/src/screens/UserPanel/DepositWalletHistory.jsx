import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";

import DataTable from "../../components/Screen/UserPanel/DataTable";
import { setLoading } from "../../redux/slices/loadingSlice";
import { isToday } from "../../utils/helper";
import { useLocation } from "react-router-dom";
import {
  getAllDepositWalletHistory,
  getAllGenerationRoiHistory,
  getAllUserUserRoiHistory,
} from "../../api/user.api";

const DepositWalletHistory = () => {
  const location = useLocation();
  const dispatch = useDispatch();
  const data = location?.state;

  const [allDepositWalletHistory, setAllDepositWalletHistory] = useState([]);

  const fetchAllDepositWalletHistory = async () => {
    try {
      dispatch(setLoading(true));
      const response = await getAllDepositWalletHistory();
      if (response?.success) {
        setAllDepositWalletHistory(response?.data || []);
      } else {
        toast.error(response?.message || "Something went wrong");
        setAllDepositWalletHistory([]);
      }
    } catch (err) {
      toast.error("Failed to fetch DepositWallet history");
      setAllDepositWalletHistory([]);
    } finally {
      dispatch(setLoading(false));
    }
  };

  useEffect(() => {
    fetchAllDepositWalletHistory();
  }, []);

  const filteredIncomeHistory =
    data === "today"
      ? allDepositWalletHistory.filter((item) =>
          isToday(new Date(item.createdAt))
        )
      : allDepositWalletHistory;

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
      header: "Amount",
      accessor: "investment",
      cell: (row) => (
        <span className="font-medium text-white">$ {row?.investment}</span>
      ),
    },
    {
      header: "Status",
      accessor: "status",
      cell: (row) => (
        <span
          className={`font-medium ${
            row?.status === "Completed"
              ? "text-blue-500"
              : row?.status === "Cancelled"
              ? "text-red-500"
              : "text-yellow-400"
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
      title="Wallet Deposit History"
      columns={columns}
      data={filteredIncomeHistory}
      pageSize={10}
    />
  );
};

export default DepositWalletHistory;
