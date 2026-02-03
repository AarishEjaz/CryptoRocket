import React, { useEffect, useState } from "react";
import { setLoading } from "../../redux/slices/loadingSlice";
import DataTable from "../../components/Screen/UserPanel/DataTable";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import { NumberFormatCommas } from "../../utils/FormatText";
import { useLocation } from "react-router-dom";
import { isToday } from "../../utils/helper";
import { getAllInvestmentHistory } from "../../api/user.api";

const InvestmentHistoryPage = () => {
  const [allTransactions, setAllTransactions] = useState([]);
  const dispatch = useDispatch();
  const location = useLocation();
  const data = location?.state;
  const fetchAllTransactions = async () => {
    try {
      dispatch(setLoading(true));
      const response = await getAllInvestmentHistory();
      if(response?.success){
        setAllTransactions(response?.data?.history);
      } else {
        toast.error(response?.message || "Something went wrong");
      }
    } catch (err) {
      console.log(err);
    } finally {
      dispatch(setLoading(false));
    }
  };
  useEffect(() => {
    fetchAllTransactions();
  }, []);

  const filteredIncomeHistory =
  data === "today"
    ? allTransactions.filter((item) => isToday(new Date(item.createdAt)))
    : allTransactions;

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
      title="Investment History"
      columns={columns}
      data={filteredIncomeHistory}
      pageSize={10}
    />
  );
};

export default InvestmentHistoryPage;
