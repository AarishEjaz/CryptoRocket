import React, { useEffect, useState } from "react";
import { setLoading } from "../../redux/slices/loadingSlice";
import DataTable from "../../components/Screen/UserPanel/DataTable";
import { useDispatch } from "react-redux";
import { maskWalletAddress } from "../../utils/additionalFunc";
import { useLocation } from "react-router-dom";
import { isToday } from "../../utils/helper";
import { getAllUserWithdrawalHistory } from "../../api/user.api";

const WithdrawalHistory = () => {
  const [allWithdrawalHistory, setAllWithdrawalHistory] = useState([]);
  const dispatch = useDispatch();
  const location = useLocation();
  const data = location?.state;

  const fetchAllWithdrawalHistory = async () => {
    try {
      dispatch(setLoading(true));
      const response = await getAllUserWithdrawalHistory();
      setAllWithdrawalHistory(response?.data?.history);
    } catch (err) {
      console.log(err);
    } finally {
      dispatch(setLoading(false));
    }
  };

  useEffect(() => {
    fetchAllWithdrawalHistory();
  }, []);

  const filteredIncomeHistory =
    data === "today"
      ? allWithdrawalHistory.filter((item) =>
          isToday(new Date(item.createdAt))
        )
      : allWithdrawalHistory;

  const columns = [
    {
      header: "S/N",
      accessor: "_id",
      cell: (_, rowIndex) => (
        <span className="font-bold text-cyan-400">{rowIndex + 1}</span>
      ),
    },
    {
      header: "Transaction ID",
      accessor: "id",
      cell: (row) => (
        <span className="font-medium text-cyan-200">{row?.id}</span>
      ),
    },
    {
      header: "User ID",
      accessor: "user.username",
      cell: (row) => (
        <span className="font-medium text-cyan-300">
          {row?.user?.username}
        </span>
      ),
      searchValue: (row) => row?.user?.username,
    },
    {
      header: "Client Address",
      accessor: "clientAddress",
      cell: (row) => (
        <span className="font-medium text-cyan-200">
          {maskWalletAddress(row?.clientAddress)}
        </span>
      ),
    },
    {
      header: "Main Address",
      accessor: "mainAddress",
      cell: (row) => (
        <span className="font-medium text-cyan-200">
          {maskWalletAddress(row?.mainAddress)}
        </span>
      ),
    },
    {
      header: "Withdrawal",
      accessor: "investment",
      cell: (row) => (
        <span className="font-bold text-cyan-400">
          $ {row?.investment}
        </span>
      ),
    },
    {
      header: "Gas Fees",
      accessor: "gasFee",
      cell: (row) => {
        const gasFee = row?.gasFee ?? 0;
        return (
          <span className="font-medium text-cyan-300">
            $ {Number(gasFee).toFixed(2)}
          </span>
        );
      },
    },
    {
      header: "Status",
      accessor: "status",
      cell: (row) => (
        <span
          className={`font-bold ${
            row?.status === "Completed"
              ? "text-emerald-400"
              : "text-amber-400"
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
        <span className="text-slate-400">
          {new Date(row?.createdAt).toLocaleString()}
        </span>
      ),
    },
  ];

  return (
    <DataTable
      title="Withdrawal History"
      columns={columns}
      data={filteredIncomeHistory}
      pageSize={10}
    />
  );
};

export default WithdrawalHistory;
