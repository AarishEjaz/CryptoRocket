import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { setLoading } from "../../redux/slices/loadingSlice";
import StatCard from "../../components/Screen/UserPanel/StatCard";
import {
  closeTicket,
  getAllGlobalAchieversClub,
  getAllTickets,
  globalachieverStatus,
  updateGlobalAchieversClub,
} from "../../api/admin.api";
import { useLocation } from "react-router-dom";
import DataTable from "../../components/Screen/UserPanel/DataTable";
import Swal from "sweetalert2";
import { toast } from "react-toastify";

const PendingTickets = () => {
  const location = useLocation();
  const data = location.state;
  const dispatch = useDispatch();
  const [allTickets, setAllTickets] = useState([]);

  const fetchAllTickets = async () => {
    dispatch(setLoading(true));
    try {
      const response = await getAllTickets();
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

  const handleCloseTicket = async (id) => {
    // Step 1: Ask the user for a reason using Swal
    const { value: reason } = await Swal.fire({
      title: "Why are you closing this ticket?",
      input: "textarea",
      inputLabel: "Reason for closing",
      inputPlaceholder: "Enter the reason...",
      showCancelButton: true,
      confirmButtonText: "Close Ticket",
      cancelButtonText: "Cancel",
      inputValidator: (value) => {
        if (!value) {
          return "Please provide a reason for closing the ticket.";
        }
      },
    });

    // Step 2: If the reason is not provided, do not call the API
    if (!reason) {
      return;
    }

    // Step 3: Make the API call to close the ticket
    try {
      dispatch(setLoading(true));
      const response = await closeTicket(id, {
        response: reason,
        status: "Accepted",
      }); // Assuming the API accepts the reason in the body

      // Step 4: Handle success response
      if (response?.success) {
        Swal.fire({
          icon: "success",
          text: response?.message || "Ticket closed successfully",
          toast: true,
          position: "top-end",
          showConfirmButton: false,
          timer: 3000,
          timerProgressBar: true,
        });

        // Step 5: Remove the closed ticket from the state
        setAllTickets((prevUsers) =>
          prevUsers.filter((user) => user._id !== id)
        );
      } else {
        // Step 6: Handle failure response
        Swal.fire({
          icon: "error",
          text: response?.message || "Failed to close the ticket",
        });
      }
    } catch (error) {
      // Step 7: Handle errors (e.g., network or server issues)
      console.error("Error closing ticket:", error);
      Swal.fire({
        icon: "error",
        text: "Something went wrong! Please try again.",
        toast: true,
        position: "top-end",
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
      });
    } finally {
      dispatch(setLoading(false));
    }
  };

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
      header: "Created At",
      accessor: "createdAt",
      cell: (row) => (
        <span className="text-slate-300">
          {new Date(row?.createdAt)?.toLocaleDateString()}
        </span>
      ),
      searchValue: (row) => {
        return new Date(row?.createdAt)?.toLocaleDateString();
      },
    },
    {
      header: "Updated At",
      accessor: "updatedAt",
      cell: (row) => (
        <span className="text-slate-300">
          {new Date(row?.updatedAt)?.toLocaleDateString()}
        </span>
      ),
      searchValue: (row) => {
        return new Date(row?.updatedAt)?.toLocaleDateString();
      },
    },
    {
      header: "Action",
      exportable: false,
      cell: (row) => (
        <div className="flex items-center gap-2">
          <button
            className="px-4 py-1 text-xs font-semibold text-white bg-blue-500 rounded-md hover:bg-blue-600"
            onClick={() => handleCloseTicket(row?._id)}
          >
            Close Ticket
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-5 mt-5">
      <DataTable
        title={"Pending Tickets List"}
        columns={columns}
        data={filteredUsers}
        pageSize={10}
      />
    </div>
  );
};

export default PendingTickets;
