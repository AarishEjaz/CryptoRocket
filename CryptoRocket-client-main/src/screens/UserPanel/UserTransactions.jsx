import React, { useEffect, useState } from "react";
import { setLoading } from "../../redux/slices/loadingSlice";
import DataTable from "../../components/Screen/UserPanel/DataTable";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import { NumberFormatCommas } from "../../utils/FormatText";
import { useLocation } from "react-router-dom";
import { isToday } from "../../utils/helper";
import { getAllUserTransactions } from "../../api/user.api";

const UserTransactions = () => {
  const [allTransactions, setAllTransactions] = useState([]);
  const dispatch = useDispatch();
  const location = useLocation();
  const data = location?.state;
  const fetchAllTransactions = async () => {
    try {
      dispatch(setLoading(true));
      const response = await getAllUserTransactions();
      if(response?.success){
        // Ensure data is always an array
        const transactionsData = Array.isArray(response?.data) 
          ? response?.data 
          : Array.isArray(response?.data?.transactions) 
          ? response?.data?.transactions 
          : Array.isArray(response?.data?.history)
          ? response?.data?.history
          : [];
        setAllTransactions(transactionsData);
      } else {
        toast.error(response?.message || "Something went wrong");
        setAllTransactions([]);
      }
    } catch (err) {
      console.log(err);
      setAllTransactions([]);
    } finally {
      dispatch(setLoading(false));
    }
  };
  useEffect(() => {
    fetchAllTransactions();
  }, []);

  const filteredIncomeHistory =
  data === "today" && Array.isArray(allTransactions)
    ? allTransactions.filter((item) => isToday(new Date(item.createdAt)))
    : Array.isArray(allTransactions) ? allTransactions : [];

  const columns = [
    {
      header: "Transaction ID",
      accessor: "id",
      cell: (row) => <span className="font-medium text-white">{row?._id}</span>,
    },
    {
      header: "Type",
      accessor: "type",
      cell: (row) => <span className="text-slate-300">{row?.type}</span>,
    },
    {
      header: "Amount",
      accessor: "amount",
      cell: (row) => {
        return row?.type === "investment" ? (
          <span className="font-semibold text-blue-400">
            <NumberFormatCommas value={row?.amount} />
          </span>
        ) : (
          <span className="font-semibold text-red-400">
            <NumberFormatCommas value={row?.investment} />
          </span>
        );
      },
    },

    {
      header: "Date",
      accessor: "date",
      cell: (row) => (
        <span className="text-slate-300">
          {new Date(row?.createdAt)?.toLocaleDateString()}
        </span>
      ),
    },
    {
      header: "Status",
      accessor: "status",
      className: "text-center",
      cell: (row) => {
        return row.status === "Processing" ? (
          <span className="px-2 py-1 text-xs font-semibold text-yellow-200 bg-yellow-500/20 rounded-full">
            {row.status}
          </span>
        ) : row.status === "Cancelled" ? (
          <span className="px-2 py-1 text-xs font-semibold text-red-200 bg-red-500/20 rounded-full">
            {row.status}
          </span>
        ) : (
          <span className="px-2 py-1 text-xs font-semibold text-blue-200 bg-blue-500/20 rounded-full">
            {row.status}
          </span>
        );
      },
    },
  ];
  return (
    <DataTable
      title="All Transactions"
      columns={columns}
      data={filteredIncomeHistory}
      pageSize={10}
    />
  );
};

export default UserTransactions;
