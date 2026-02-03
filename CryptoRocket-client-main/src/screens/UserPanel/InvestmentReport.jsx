import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { AuthenticatedUserRouters } from "../../constants/routes";
import StatCard from "../../components/Screen/UserPanel/StatCard";
import DataTable from "../../components/Screen/UserPanel/DataTable";
import { getIncomeTotal } from "../../api/auth.api";
import { getAllInvestmentHistory } from "../../api/user.api";
import { useDispatch } from "react-redux";
import { setLoading } from "../../redux/slices/loadingSlice";
import { NumberFormatCommas } from "../../utils/FormatText";

const InvestmentReport = () => {
  const dispatch = useDispatch();
  const [totalIncome, setTotalIncome] = useState({});
  const [investments, setInvestments] = useState([]);
  
  const fetchCardData = async () => {
    try {
      dispatch(setLoading(true));
      const response = await getIncomeTotal();
      if (response?.success) {
        setTotalIncome(response?.data || {});
      } else {
        toast.error(response?.message || "Something went wrong");
        setTotalIncome({});
      }
    } catch (err) {
      toast.error("Failed to fetch income history");
    } finally {
      dispatch(setLoading(false));
    }
  };

  const fetchInvestments = async () => {
    try {
      const response = await getAllInvestmentHistory();
      if (response?.success) {
        setInvestments(response?.data?.history || []);
      }
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchCardData();
    fetchInvestments();
  }, []);
  const investmentData = [
    {
      title: "Total Investment",
      value: `$ ${Number(totalIncome?.totalTransaction ?? 0).toFixed(2)}`,
      icon: "https://img.icons8.com/3d-fluency/94/transaction.png",
    },
    {
      title: "Today Investment",
      value: `$ ${Number(totalIncome?.todayTransaction ?? 0).toFixed(2)}`,
      icon: "https://img.icons8.com/3d-fluency/94/exchange.png",
    },
  ];

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
      cell: (row) => (
        <span className="font-semibold text-blue-400">
          <NumberFormatCommas value={row?.amount || row?.investment} />
        </span>
      ),
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
      cell: (row) => {
        const statusColors = {
          Processing: "text-yellow-200 bg-yellow-500/20",
          Cancelled: "text-red-200 bg-red-500/20",
          default: "text-blue-200 bg-blue-500/20"
        };
        const colorClass = statusColors[row.status] || statusColors.default;
        return (
          <span className={`px-2 py-1 text-xs font-semibold rounded-full ${colorClass}`}>
            {row.status}
          </span>
        );
      },
    },
  ];

  return (
    <div className="space-y-10 mt-5">
      <div>
        <h1 className="text-3xl font-bold text-white">My Investments</h1>
        <p className="text-slate-400 mt-1">
          Track your investment reports.
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-5">
        {investmentData.map((item) => (
          <StatCard
            key={item.title}
            title={item.title}
            value={item.value}
            iconImage={item.icon}
          />
        ))}
      </div>
      <div className="mt-10">
        <DataTable
          title="Investment History"
          columns={columns}
          data={investments}
          pageSize={10}
        />
      </div>
    </div>
  );
};

export default InvestmentReport;
