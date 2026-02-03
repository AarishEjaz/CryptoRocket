import React, { useEffect, useState } from "react";
import { addFundAcceptReject, getAddFundRequests } from "../../api/admin.api";
import { setLoading } from "../../redux/slices/loadingSlice";
import DataTable from "../../components/Screen/UserPanel/DataTable";
import Swal from "sweetalert2";
import { useDispatch } from "react-redux";
import { maskWalletAddress } from "../../utils/additionalFunc";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const UserFundRequest = () => {
  const location = useLocation();
  const data = location.state;
  const [addFundRequests, setAddFundRequests] = useState([]);
  const dispatch = useDispatch();
  const fetchAddFundRequests = async () => {
    try {
      dispatch(setLoading(true));
      const response = await getAddFundRequests();
      setAddFundRequests(response?.data);
    } catch (err) {
      console.log(err);
    } finally {
      dispatch(setLoading(false));
    }
  };
  useEffect(() => {
    fetchAddFundRequests();
  }, []);

  const handleAcceptReject = async (id, status) => {
    const acceptStatus = status === "Completed" ? "Accept" : "Reject";

    const result = await Swal.fire({
      title: `${acceptStatus} Fund Request`,
      text: `Are you sure you want to ${acceptStatus.toLowerCase()} this fund request?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: `Yes, ${acceptStatus.toLowerCase()} it!`,
    });

    if (result.isConfirmed) {
      dispatch(setLoading(true));

      try {
        const res = await addFundAcceptReject(id, { status });
        if (res?.success) {
          setAddFundRequests((prev) => prev.filter((item) => item._id !== id));
          toast.success(res?.message || "Request Updated Successfully");
        } else {
          toast.error(res?.message || "Something went wrong!");
        }
      } catch (error) {
        toast.error("Something went wrong!");
        console.error("Error in updating fund request", error?.message);
      } finally {
        dispatch(setLoading(false));
      }
    }
  };

  const filteredUsers = addFundRequests?.filter((user) => {
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
    {
      header: "Action",
      exportable: false,
      cell: (row) => (
        <div className="flex items-center gap-2">
          <button
            className="px-4 py-1 text-xs font-semibold text-white cursor-pointer bg-blue-500 rounded-md hover:bg-blue-600"
            onClick={() => handleAcceptReject(row?._id, "Completed")}
          >
            Accept
          </button>
          <button
            className="px-4 py-1 text-xs font-semibold text-white cursor-pointer bg-red-500 rounded-md hover:bg-red-600"
            onClick={() => handleAcceptReject(row?._id, "Cancelled")}
          >
            Reject
          </button>
        </div>
      ),
    },
  ];
  return (
    <>
      <DataTable
        title={"User Fund Request"}
        columns={columns}
        data={filteredUsers}
        pageSize={10}
      />
    </>
  );
};

export default UserFundRequest;
