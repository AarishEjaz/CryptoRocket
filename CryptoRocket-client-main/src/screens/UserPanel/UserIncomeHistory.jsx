import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";

import DataTable from "../../components/Screen/UserPanel/DataTable";
import { setLoading } from "../../redux/slices/loadingSlice";
import ServerSideTable from "../../components/Screen/UserPanel/ServerSideTable";
import { useLocation } from "react-router-dom";
import { isToday } from "../../utils/helper";
import { getAllUserIncomeHistory } from "../../api/user.api";
import { maskWalletAddress } from "../../utils/additionalFunc";
import { AuthenticatedUserRouters } from "../../constants/routes";
import { getIncomeTotal } from "../../api/auth.api";
import StatCard from "../../components/Screen/UserPanel/StatCard";

const UserIncomeHistory = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const data = location.state;

  const [allIncomeHistory, setAllIncomeHistory] = useState([]);
  const [totalCount, setTotalCount] = useState(0); // You can set totalCount if backend sends it, else use fixed value or calculate
  const [currentPage, setCurrentPage] = useState(1);
  const [totalIncome, setTotalIncome] = useState({});
  const pageSize = 10;

  const fetchAllIncomeHistory = async (page = 1) => {
    try {
      dispatch(setLoading(true));
      const response = await getAllUserIncomeHistory();
      if (response?.success) {
        setAllIncomeHistory(response?.data || []);

        // If your backend doesn't send totalCount, you can:
        // - Use a fixed totalCount if known
        // - Or disable pagination component by passing no totalCount or 1
        setTotalCount(response?.data?.totalCount || 0);
      } else {
        toast.error(response?.message || "Something went wrong");
        setAllIncomeHistory([]);
        setTotalCount(0);
      }
    } catch (err) {
      toast.error("Failed to fetch income history");
      setAllIncomeHistory([]);
      setTotalCount(0);
    } finally {
      dispatch(setLoading(false));
    }
  };

  useEffect(() => {
    fetchAllIncomeHistory(currentPage);
  }, [currentPage]);

  const filteredIncomeHistory =
    data === "today"
      ? allIncomeHistory.filter((item) => isToday(new Date(item.createdAt)))
      : allIncomeHistory;

  const columns = [
    {
      header: "S/N",
      accessor: "_id",
      cell: (_, rowIndex) => (
        <span className="font-medium text-white">
          {rowIndex + 1 + (currentPage - 1) * pageSize}
        </span>
      ),
    },
    {
      header: "Transaction ID",
      accessor: "id",
      cell: (row) => <span className="font-medium text-white">{row?.id}</span>,
    },
    {
      header: "Client Address",
      accessor: "clientAddress",
      cell: (row) => (
        <span className="font-medium text-white">
          {maskWalletAddress(row?.clientAddress) || "-"}
        </span>
      ),
    },
    {
      header: "Main Address",
      accessor: "mainAddress",
      cell: (row) => (
        <span className="font-medium text-white">
          {maskWalletAddress(row?.mainAddress) || "-"}
        </span>
      ),
    },
    {
      header: "Investment",
      accessor: "investment",
      cell: (row) => (
        <span className="font-medium text-white">
          ${row?.investment || "-"}
        </span>
      ),
    },
    {
      header: "Percentage",
      accessor: "percentage",
      cell: (row) => (
        <span className="font-medium text-white">
          {row?.percentage || "-"}%
        </span>
      ),
    },
    {
      header: "User Email",
      accessor: "user.email",
      cell: (row) => (
        <span className="font-medium text-white">
          {row?.user?.email || "-"}
        </span>
      ),
      searchValue: (row) => row?.user?.email,
    },
    {
      header: "Package",
      accessor: "package",
      cell: (row) => (
        <span className="font-medium text-white">
          {row?.package?._id || "-"}
        </span>
      ),
      searchValue: (row) => row?.package?._id,
    },

    {
      header: "Type",
      accessor: "type",
      cell: (row) => (
        <span className="font-medium text-white">{row?.type || "-"}</span>
      ),
    },
    {
      header: "Role",
      accessor: "role",
      cell: (row) => (
        <span className="font-medium text-white">{row?.role || "-"}</span>
      ),
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
    {
      header: "Updated At",
      accessor: "updatedAt",
      cell: (row) => (
        <span className="text-slate-300">
          {new Date(row?.updatedAt).toLocaleString()}
        </span>
      ),
    },
    {
      header: "Hash",
      accessor: "hash",
      cell: (row) => (
        <span className="font-medium text-white">{row?.hash || "-"}</span>
      ),
    },
  ];

  const cardData = [
      {
        title: "Total Income",
        value: `$ ${Number(totalIncome?.totalIncome ?? 0).toFixed(2)}`,
        icon: "https://img.icons8.com/3d-fluency/94/sales-performance.png",
        path: AuthenticatedUserRouters.INCOME_HISTORY,
      },

      {
        title: "Total Level Income",
        value: `$ ${Number(totalIncome?.totalLevel ?? 0).toFixed(2)}`,
        icon: "https://cdn-icons-png.flaticon.com/512/10102/10102408.png",
        path: AuthenticatedUserRouters.LEVEL_INCOME_HISTORY,
      },
      {
        title: "Total Referrals Income",
        value: `$ ${Number(totalIncome?.totalReferral ?? 0).toFixed(2)}`,
        icon: "https://img.icons8.com/3d-fluency/94/group.png",
        path: AuthenticatedUserRouters.REFERRAL_INCOME_HISTORY,
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
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {cardData.map((item) => (
          <StatCard
            key={item.title}
            title={item.title}
            value={item.value}
            iconImage={item.icon}
            change={item.change}
            changeType={item.changeType}
            path={item.path}
          />
        ))}
      </div>
      <DataTable
        title="Income History"
        columns={columns}
        data={filteredIncomeHistory}
        totalCount={totalCount}
        pageSize={pageSize}
      />
    </div>
  );
};

export default UserIncomeHistory;
