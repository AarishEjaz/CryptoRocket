import React, { useEffect, useState } from "react";
import {
    getAllRejectedWithdrawalRequests,
} from "../../api/admin.api";
import { setLoading } from "../../redux/slices/loadingSlice";
import DataTable from "../../components/Screen/UserPanel/DataTable";
import { useDispatch } from "react-redux";

const RejectedWithdrawal = () => {
  const [allUsers, setAllUsers] = useState([]);
  const dispatch = useDispatch();
  const fetchAllUsers = async () => {
    try {
      dispatch(setLoading(true));
      const response = await getAllRejectedWithdrawalRequests();
      setAllUsers(response?.data?.history);
    } catch (err) {
      console.log(err);
    } finally {
      dispatch(setLoading(false));
    }
  };
  useEffect(() => {
    fetchAllUsers();
  }, []);

  const columns = [
    {
      header: "ID",
      accessor: "_id",
      cell: (row, rowIndex) => (
        <span className="font-medium text-white">{rowIndex + 1}</span>
      ),
    },
    {
      header: "Name",
      accessor: "name",
      cell: (row) => (
        <span className="font-medium text-white">{row?.name}</span>
      ),
    },
    {
      header: "User ID",
      accessor: "username",
      cell: (row) => (
        <span className="font-medium text-white">{row?.username}</span>
      ),
    },
    {
      header: "Email",
      accessor: "email",
      cell: (row) => (
        <span className="font-medium text-white">{row?.email}</span>
      ),
    },
    {
      header: "Amount",
      accessor: "amount",
      cell: (row) => (
        <span className="font-medium text-white">$ {row?.amount}</span>
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
  ];
  return (
    <DataTable
      title="Approved Withdrawal Request"
      columns={columns}
      data={allUsers}
      pageSize={10}
    />
  );
};

export default RejectedWithdrawal;
