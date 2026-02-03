import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { setLoading } from "../../redux/slices/loadingSlice";
import { useLocation } from "react-router-dom";
import DataTable from "../../components/Screen/UserPanel/DataTable";
import { toast } from "react-toastify";
import { getAllRaisedTickets } from "../../api/user.api";

const RaiseTicketHistory = () => {
  const location = useLocation();
  const data = location.state;
  const dispatch = useDispatch();
  const [allTickets, setAllTickets] = useState([]);

  const fetchAllTickets = async () => {
    dispatch(setLoading(true));
    try {
      const response = await getAllRaisedTickets();
      if (response?.success) {
        setAllTickets(response?.data || []);
      } else {
        toast.error(response?.message, "Something went wrong");
      }
    } catch (err) {
      console.log(err);
    } finally {
      dispatch(setLoading(false));
    }
  };

  useEffect(() => {
    fetchAllTickets();
  }, []);

  const filteredUsers = allTickets?.filter((user) => {
    if (data === "active") {
      return user.active?.isActive === true;
    } else if (data === "inactive") {
      return user.active?.isActive === false;
    }
    return true; // If no filter, return all users
  });

  const columns = [
    {
      header: "ID",
      accessor: "id",
      cell: (row, rowIndex) => (
        <span className="font-medium text-white">{rowIndex + 1}</span> // 1-based index
      ),
    },
    {
      header: "Ticket ID",
      accessor: "id",
      cell: (row) => <span className="font-medium text-white">{row?.id}</span>,
    },
    {
      header: "Message",
      accessor: "message",
      cell: (row) => (
        <span className="font-medium text-white max-w-[300px] min-w-[300px] overflow-hidden">
          {row?.message}
        </span>
      ),
    },
    {
      header: "Nature of Complaint",
      accessor: "natureOfComplain",
      cell: (row) => (
        <span className="font-medium text-white">{row?.natureOfComplain}</span>
      ),
    },
    {
      header: "Status",
      accessor: "status",
      cell: (row) => {
        return row?.status === "Pending" ? (
          <span className="font-semibold text-yellow-400">Pending</span>
        ) : (
          <span className="font-semibold text-blue-400">Resolved</span>
        );
      },
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
        header: "Admin Reply",
        accessor: "response",
        cell: (row) => (
          <span className="font-medium text-white max-w-[300px] min-w-[300px] overflow-hidden">
            {row?.response || "N/A"}
          </span>
        ),
    },
    {
      header: "Created At",
      accessor: "createdAt",
      cell: (row) => (
        <span className="text-slate-300">
          {new Date(row?.createdAt)?.toLocaleDateString()}
        </span>
      ),
    },
    {
      header: "Updated At",
      accessor: "updatedAt",
      cell: (row) => (
        <span className="text-slate-300">
          {new Date(row?.updatedAt)?.toLocaleDateString()}
        </span>
      ),
    },
  ];

  return (
    <div className="space-y-5 mt-5">
      <DataTable
        title={"Raised Ticket History"}
        columns={columns}
        data={filteredUsers}
        pageSize={10}
      />
    </div>
  );
};

export default RaiseTicketHistory;
