import React, { useEffect, useState } from "react";
import {
  BlockUser,
  getAllUsers,
  getUserDashboardAccess,
  RoiGenerate,
} from "../../api/admin.api";
import { setLoading } from "../../redux/slices/loadingSlice";
import DataTable from "../../components/Screen/UserPanel/DataTable";
import Swal from "sweetalert2";
import { loginUser } from "../../redux/slices/authSlice";
import { AuthenticatedUserRouters } from "../../constants/routes";
import { useDispatch } from "react-redux";

const InactiveUsers = () => {
  const [allUsers, setAllUsers] = useState([]);
  const dispatch = useDispatch();
  const fetchAllUsers = async () => {
    try {
      dispatch(setLoading(true));
      const response = await getAllUsers();
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
  const handleBlock = async (id) => {
    try {
      dispatch(setLoading(true));
      const response = await BlockUser(id);
      if (response?.success) {
        Swal.fire({
          icon: "success",
          text: response?.message || "User block/unblock successful",
          toast: true,
          position: "top-end",
          showConfirmButton: false,
          timer: 3000,
          timerProgressBar: true,
        });

        setAllUsers((prevUsers) =>
          prevUsers.map((user) =>
            user._id === id
              ? {
                  ...user,
                  active: {
                    ...user.active,
                    isBlocked: !user.active?.isBlocked,
                  },
                }
              : user
          )
        );
      }
    } catch (error) {
      console.error("Error blocking user:", error);
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
  };
  const handleRoiGenerate = async (id) => {
    try {
      dispatch(setLoading(true));
      const response = await RoiGenerate(id);
      if (response?.success) {
        Swal.fire({
          icon: "success",
          text: response?.message || "User ROI status changes successfully",
          toast: true,
          position: "top-end",
          showConfirmButton: false,
          timer: 3000,
          timerProgressBar: true,
        });

        setAllUsers((prevUsers) =>
          prevUsers.map((user) =>
            user._id === id
              ? {
                  ...user,
                  active: {
                    ...user.active,
                    isBlocked: !user.active?.isBlocked,
                  },
                }
              : user
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
      console.error("Error changing ROI status of user:", error);
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
  };

  const handleAccess = async (id) => {
    setLoading(true);
    try {
      const response = await getUserDashboardAccess({ id });
      if (response?.success) {
        await dispatch(
          loginUser({
            token: response?.token,
            userId: response?.data?._id,
            role: response?.data?.role,
            data: response?.data,
          })
        );
        navigate(AuthenticatedUserRouters.DASHBOARD);
        Swal.fire({
          icon: "success",
          text: response?.message || "Access granted successfully",
          toast: true,
          position: "top-end",
          showConfirmButton: false,
          timer: 3000,
          timerProgressBar: true,
        });
      } else {
        Swal.fire({
          icon: "error",
          text: response?.message || "Failed to grant access",
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
        text: "Something went wrong while granting access!",
        toast: true,
        position: "top-end",
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
      });
    } finally {
      setLoading(false);
    }
  };

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
      header: "Status",
      accessor: "status",
      cell: (row) => {
        return row?.status === true ? (
          <span className="font-semibold text-blue-400">Active</span>
        ) : (
          <span className="font-semibold text-red-400">Inactive</span>
        );
      },
    },
    {
      header: "Block/Unblock",
      accessor: "isBlock",
      cell: (row) => {
        return row?.isBlock === true ? (
          <span
            className="font-semibold text-blue-400"
            onClick={() => handleBlock(row?._id)}
          >
            <i class="fa-solid fa-toggle-on"></i>
          </span>
        ) : (
          <span
            className="font-semibold text-red-400"
            onClick={() => handleBlock(row?._id)}
          >
            <i class="fa-solid fa-toggle-off"></i>
          </span>
        );
      },
    },
    {
      header: "User ROI Status",
      accessor: "roi",
      cell: (row) => {
        return row?.roiGenerate === true ? (
          <span
            className="font-semibold text-blue-400"
            onClick={() => handleRoiGenerate(row?._id)}
          >
            <i class="fa-solid fa-toggle-on"></i>
          </span>
        ) : (
          <span
            className="font-semibold text-red-400"
            onClick={() => handleRoiGenerate(row?._id)}
          >
            <i class="fa-solid fa-toggle-off"></i>
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
      header: "Action",
      cell: (row) => (
        <button className="px-4 py-1 text-xs font-semibold text-white bg-blue-500 rounded-md hover:bg-blue-600" onClick={() => handleAccess(row?._id)}>
          Access User
        </button>
      ),
    },
  ];
  return (
    <DataTable
      title="All Users"
      columns={columns}
      data={allUsers}
      pageSize={10}
    />
  );
};

export default InactiveUsers;
