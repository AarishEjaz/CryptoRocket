import React, { useEffect, useState } from "react";
import { getUserFundAccepted } from "../../api/admin.api";
import { setLoading } from "../../redux/slices/loadingSlice";
import DataTable from "../../components/Screen/UserPanel/DataTable";
import { useDispatch } from "react-redux";
import { maskWalletAddress } from "../../utils/additionalFunc";
import { useLocation, useNavigate } from "react-router-dom";

const UserFundAccepted = () => {
  const location = useLocation();
  const data = location.state;
  const [userFundAccepted, setUserFundAccepted] = useState([]);
  const dispatch = useDispatch();
  const fetchUserFundAccepted = async () => {
    try {
      dispatch(setLoading(true));
      const response = await getUserFundAccepted();
      setUserFundAccepted(response?.data);
    } catch (err) {
      console.log(err);
    } finally {
      dispatch(setLoading(false));
    }
  };
  useEffect(() => {
    fetchUserFundAccepted();
  }, []);

  const filteredUsers = userFundAccepted?.filter((user) => {
    if (data === "active") {
      return user.active?.isActive === true;
    } else if (data === "inactive") {
      return user.active?.isActive === false;
    }
    return true; // If no filter, return all users
  });

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
      cell: (row) => <span className="font-medium text-white">{row?.id}</span>,
    },
    {
      header: "User ID",
      accessor: "user.username",
      cell: (row) => (
        <span className="font-medium text-white">
          {row?.user?.username || "N/A"}
        </span>
      ),
      searchValue: (row) => row?.user?.username,
    },
    {
      header: "Client Address",
      accessor: "clientAddress",
      cell: (row) => (
        <span className="font-medium text-white">
          {maskWalletAddress(row?.clientAddress || "N/A")}
        </span>
      ),
    },
    {
      header: "Main Address",
      accessor: "mainAddress",
      cell: (row) => (
        <span className="font-medium text-white">
          {maskWalletAddress(row?.mainAddress || "N/A")}
        </span>
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
      header: "Type",
      accessor: "type",
      cell: (row) => (
        <span className="font-medium text-white">{row?.type}</span>
      ),
    },
    {
      header: "Role",
      accessor: "role",
      cell: (row) => (
        <span className="font-medium text-white">{row?.role}</span>
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
              : row?.status === "Rejected"
              ? "text-red-500"
              : "text-yellow-400"
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
      searchValue: (row) => {
        return new Date(row?.createdAt)?.toLocaleDateString();
      },
    },
  ];
  return (
    <>
      <DataTable
        title={"User Fund Accepted List"}
        columns={columns}
        data={filteredUsers}
        pageSize={10}
      />
    </>
  );
};

export default UserFundAccepted;
