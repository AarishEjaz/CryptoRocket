import React, { useEffect, useState } from "react";
import { setLoading } from "../../redux/slices/loadingSlice";
import DataTable from "../../components/Screen/UserPanel/DataTable";
import { useDispatch } from "react-redux";
import { maskWalletAddress } from "../../utils/additionalFunc";
import { useLocation } from "react-router-dom";
import { isToday } from "../../utils/helper";
import { getAllUserFundTransferHistory, getAllUserWithdrawalHistory } from "../../api/user.api";

const UserFundTransferHistory = () => {
  const [allUserFundTransferHistory, setAllUserFundTransferHistory] = useState([]);
  const dispatch = useDispatch();
  const location = useLocation();
  const data = location?.state;
  const fetchAllUserFundTransferHistory = async () => {
    try {
      dispatch(setLoading(true));
      const response = await getAllUserFundTransferHistory();
      setAllUserFundTransferHistory(response?.data?.history);
    } catch (err) {
      console.log(err);
    } finally {
      dispatch(setLoading(false));
    }
  };
  useEffect(() => {
    fetchAllUserFundTransferHistory();
  }, []);

  const filteredIncomeHistory =
    data === "today"
      ? allUserFundTransferHistory.filter((item) => isToday(new Date(item.createdAt)))
      : allUserFundTransferHistory;

  const columns = [
    {
      header: "S/N",
      accessor: "_id",
      cell: (row, rowIndex) => (
        <span className="font-medium text-white">{rowIndex + 1}</span>
      ),
    },
    {
      header: "Transaction ID",
      accessor: "id",
      cell: (row) => (
        <span className="font-medium text-white">{row?.id}</span>
      ),
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
      header: "Client Address",
      accessor: "clientAddress",
      cell: (row) => (
        <span className="font-medium text-white">{maskWalletAddress(row?.clientAddress)}</span>
      ),
    },
    {
      header: "Main Address",
      accessor: "mainAddress",
      cell: (row) => (
        <span className="font-medium text-white">{maskWalletAddress(row?.mainAddress)}</span>
      ),
    },
    {
      header: "Investment",
      accessor: "investment",
      cell: (row) => (
        <span className="font-medium text-white">$ {row?.investment}</span>
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
        <span className={`font-medium ${row?.status === "Completed" ? "text-blue-500" : "text-yellow-400"}`}>
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
      title="User Fund Transfer History"
      columns={columns}
      data={filteredIncomeHistory}
      pageSize={10}
    />
  );
};

export default UserFundTransferHistory;
