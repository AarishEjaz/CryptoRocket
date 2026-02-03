import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";

import DataTable from "../../components/Screen/UserPanel/DataTable";
import { setLoading } from "../../redux/slices/loadingSlice";
import {
  getAllIncomeHistory,
  getAllReferralIncomeHistory,
} from "../../api/admin.api";
import ServerSideTable from "../../components/Screen/UserPanel/ServerSideTable";
import { isToday } from "../../utils/helper";
import { useLocation } from "react-router-dom";
import { getAllUserReferralIncomeHistory } from "../../api/user.api";
import StatCard from "../../components/Screen/UserPanel/StatCard";
import { getIncomeTotal } from "../../api/auth.api";
import { AuthenticatedUserRouters } from "../../constants/routes";
import ReferralBonusTable from "../../components/Screen/UserPanel/ReferralBonusTable";

const UserReferralIncomeHistory = () => {
  const location = useLocation();
  const dispatch = useDispatch();
  const data = location?.state;

  const [allReferralIncomeHistory, setAllReferralIncomeHistory] = useState([]);
  const [totalIncome, setTotalIncome] = useState({});

  const fetchAllReferralIncomeHistory = async () => {
    try {
      dispatch(setLoading(true));
      const response = await getAllUserReferralIncomeHistory();
      if (response?.success) {
        setAllReferralIncomeHistory(response?.data?.history || []);
      } else {
        toast.error(response?.message || "Something went wrong");
        setAllReferralIncomeHistory([]);
      }
    } catch (err) {
      toast.error("Failed to fetch ReferralIncome history");
      setAllReferralIncomeHistory([]);
    } finally {
      dispatch(setLoading(false));
    }
  };

  useEffect(() => {
    fetchAllReferralIncomeHistory();
  }, []);

  const filteredIncomeHistory =
    data === "today"
      ? allReferralIncomeHistory.filter((item) =>
        isToday(new Date(item.createdAt))
      )
      : allReferralIncomeHistory;

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
      header: "Username",
      accessor: "user.username",
      cell: (row) => (
        <span className="font-medium text-white">{row?.user?.username}</span>
      ),
      searchValue: (row) => row?.user?.username,
    },
    {
      header: "From User",
      accessor: "fromUser.username",
      cell: (row) => (
        <span className="font-medium text-white">
          {row?.fromUser?.username || "-"}
        </span>
      ),
      searchValue: (row) => row?.fromUser?.username,
    },
    {
      header: "Amount",
      accessor: "amount",
      cell: (row) => (
        <span className="font-medium text-white">$ {row?.amount}</span>
      ),
    },
    {
      header: "ReferralIncome",
      accessor: "income",
      cell: (row) => (
        <span className="font-medium text-white">$ {row?.income}</span>
      ),
    },
    {
      header: "Level",
      accessor: "level",
      cell: (row) => (
        <span className="font-medium text-white">{row?.level}</span>
      ),
    },
    // {
    //   header: "Days",
    //   accessor: "days",
    //   cell: (row) => (
    //     <span className="font-medium text-white">{row?.days}</span>
    //   ),
    // },
    {
      header: "Type",
      accessor: "type",
      cell: (row) => (
        <span className="font-medium text-white">{row?.type}</span>
      ),
    },
    // {
    //   header: "Reward Paid",
    //   accessor: "rewardPaid",
    //   cell: (row) => (
    //     <span className="font-medium text-white">{row?.rewardPaid}</span>
    //   ),
    // },
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
    },
    {
      header: "Date",
      accessor: "createdAt",
      cell: (row) => (
        <span className="text-slate-300">
          {new Date(row?.createdAt).toLocaleString()}
        </span>
      ),
    },
  ];

  const cardData = [
    {
      title: "Total Referral Income",
      value: `$ ${Number(totalIncome?.totalReferral ?? 0).toFixed(2)}`,
      icon: "https://img.icons8.com/3d-fluency/94/group.png",
    },
    {
      title: "Today Referral Income",
      value: `$ ${Number(totalIncome?.todayReferral ?? 0).toFixed(2)}`,
      icon: "https://img.icons8.com/3d-plastilina/69/share--v1.png",
    },
  ];

  const fetchCardData = async (page = 1) => {
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

  useEffect(() => {
    fetchCardData();
  }, []);

  return (
    <div className="space-y-5 mt-5">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {cardData.map((item) => (
          <StatCard
            key={item.title}
            title={item.title}
            value={item.value}
            iconImage={item.icon}
          />
        ))}
      </div>

      <DataTable
        title="Referral Income History"
        columns={columns}
        data={filteredIncomeHistory}
        pageSize={10}
      />
    </div>
  );
};

export default UserReferralIncomeHistory;
