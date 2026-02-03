import React, { useEffect, useState } from "react";
import {
  getAllWithdrawalRequests,
  withdrawalRequestApproveReject,
} from "../../api/admin.api";
import { setLoading } from "../../redux/slices/loadingSlice";
import DataTable from "../../components/Screen/UserPanel/DataTable";
import Swal from "sweetalert2";
import { useDispatch } from "react-redux";

const WithdrawalRequest = () => {
  const [allWithdrawalRequests, setAllWithdrawalRequests] = useState([]);
  const dispatch = useDispatch();

  const fetchAllWithdrawalRequests = async () => {
    try {
      dispatch(setLoading(true));
      const response = await getAllWithdrawalRequests();
      setAllWithdrawalRequests(response?.data?.history);
    } catch (err) {
      console.log(err);
    } finally {
      dispatch(setLoading(false));
    }
  };

  useEffect(() => {
    // fetchAllWithdrawalRequests();
  }, []);

  const handleApproveReject = async (id, status) => {
    const currentStatus = status === "approved" ? "rejected" : "approved";

    Swal.fire({
      title: "Are you sure?",
      text: `You want to ${currentStatus} this user?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#06b6d4", // cyan
      cancelButtonColor: "#475569",
      confirmButtonText: "Yes, do it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          dispatch(setLoading(true));
          const response = await withdrawalRequestApproveReject(id, { status });

          if (response?.success) {
            Swal.fire({
              icon: "success",
              text:
                response?.message ||
                `Withdrawal ${currentStatus} successfully`,
              toast: true,
              position: "top-end",
              showConfirmButton: false,
              timer: 3000,
              timerProgressBar: true,
            });

            setAllWithdrawalRequests((prev) =>
              prev.filter(
                (user) => user._id !== id && user.status === "pending"
              )
            );
          } else {
            Swal.fire({
              icon: "error",
              text: response?.message || "Something went wrong!",
              toast: true,
              position: "top-end",
              showConfirmButton: false,
              timer: 3000,
              timerProgressBar: true,
            });
          }
        } catch (error) {
          Swal.fire({
            icon: "error",
            text: "Something went wrong!",
            toast: true,
            position: "top-end",
            showConfirmButton: false,
            timer: 3000,
            timerProgressBar: true,
          });
        } finally {
          dispatch(setLoading(false));
        }
      }
    });
  };

  const columns = [
    {
      header: "ID",
      accessor: "_id",
      cell: (_, rowIndex) => (
        <span className="font-bold text-cyan-400">{rowIndex + 1}</span>
      ),
    },
    {
      header: "Name",
      accessor: "name",
      cell: (row) => (
        <span className="font-semibold text-cyan-200">{row?.name}</span>
      ),
    },
    {
      header: "User ID",
      accessor: "username",
      cell: (row) => (
        <span className="font-medium text-cyan-300">{row?.username}</span>
      ),
      searchValue: (row) => row?.username,
    },
    {
      header: "Email",
      accessor: "email",
      cell: (row) => (
        <span className="font-medium text-cyan-300">{row?.email}</span>
      ),
    },
    {
      header: "Amount",
      accessor: "amount",
      cell: (row) => (
        <span className="font-bold text-cyan-400">$ {row?.amount}</span>
      ),
    },
    {
      header: "Date",
      accessor: "date",
      cell: (row) => (
        <span className="text-slate-400">
          {new Date(row?.createdAt)?.toLocaleDateString()}
        </span>
      ),
    },
    {
      header: "Action",
      exportable: false,
      cell: (row) => (
        <div className="flex items-center gap-2">
          <button
            className="px-4 py-1 text-xs font-black uppercase tracking-widest text-white bg-cyan-600 rounded-lg hover:bg-cyan-500 transition-all shadow-md hover:shadow-cyan-600/30"
            onClick={() => handleApproveReject(row?._id, "approve")}
          >
            Approve
          </button>
          <button
            className="px-4 py-1 text-xs font-black uppercase tracking-widest text-white bg-red-500 rounded-lg hover:bg-red-600 transition-all shadow-md hover:shadow-red-500/30"
            onClick={() => handleApproveReject(row?._id, "reject")}
          >
            Reject
          </button>
        </div>
      ),
    },
  ];

  return (
    <DataTable
      title="Pending Withdrawal Request"
      columns={columns}
      data={allWithdrawalRequests}
      pageSize={10}
    />
  );
};

export default WithdrawalRequest;

