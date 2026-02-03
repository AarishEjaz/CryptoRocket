import React, { useEffect, useState } from "react";
import {
  BlockUser,
  getAllUsers,
  getIncomeTotalForAdmin,
  getUserDashboardAccess,
  HoldCapitalIncome,
  RoiGenerate,
  updateUserDetails,
  lockUnlockCapitalInvestment,
} from "../../api/admin.api";
import { setLoading } from "../../redux/slices/loadingSlice";
import DataTable from "../../components/Screen/UserPanel/DataTable";
import Swal from "sweetalert2";
import { loginUser } from "../../redux/slices/authSlice";
import { AuthenticatedUserRouters } from "../../constants/routes";
import { useDispatch } from "react-redux";
import { maskWalletAddress } from "../../utils/additionalFunc";
import { useLocation, useNavigate } from "react-router-dom";
import StatCard from "../../components/Screen/UserPanel/StatCard";

const AllUsers = () => {
  const location = useLocation();
  const data = location.state;
  const [allUsers, setAllUsers] = useState([]);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [editFormData, setEditFormData] = useState({
    username: "",
    account: "",
    email: "",
    countryCode: "",
    mobile: "",
    country: "",
    password: ""
  });
  const [totalIncome, setTotalIncome] = useState({});
  const fetchAllUsers = async () => {
    try {
      dispatch(setLoading(true));
      const response = await getAllUsers();
      setAllUsers(response?.data);
      const response2 = await getIncomeTotalForAdmin();
      setTotalIncome(response2);
    } catch (err) {
      console.log(err);
    } finally {
      dispatch(setLoading(false));
    }
  };
  useEffect(() => {
    fetchAllUsers();
  }, []);

  const handleOpenEditModal = (user) => {
    setSelectedUser(user);
    setEditFormData({
      username: user?.username || "",
      account: user?.account || "",
      email: user?.email || "",
      mobile: user?.mobile || "",
      country: user?.country || "",
      countryCode: user?.countryCode || "",
    });
    setIsEditModalOpen(true);
  };

  const handleEditInputChange = (e) => {
    const { name, value } = e.target;
    setEditFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    if (!selectedUser) return;

    try {
      dispatch(setLoading(true));
      const response = await updateUserDetails(selectedUser._id, editFormData);

      if (response?.success) {
        Swal.fire({
          icon: "success",
          text: response?.message || "User updated successfully",
          toast: true,
          position: "top-end",
          showConfirmButton: false,
          timer: 3000,
          timerProgressBar: true,
        });

        // Update UI
        setAllUsers((prevUsers) =>
          prevUsers.map((user) =>
            user._id === selectedUser._id ? { ...user, ...editFormData } : user
          )
        );

        setIsEditModalOpen(false);
        setSelectedUser(null);
      } else {
        Swal.fire({
          icon: "error",
          text: response?.message || "Failed to update user",
          toast: true,
          position: "top-end",
          showConfirmButton: false,
          timer: 3000,
          timerProgressBar: true,
        });
      }
    } catch (err) {
      console.error("Failed to update user:", err);
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

  const filteredUsers = allUsers?.filter((user) => {
    if (data === "active") {
      return user.active?.isActive === true;
    } else if (data === "inactive") {
      return user.active?.isActive === false;
    }
    return true; // If no filter, return all users
  });

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
  const handleBlockIncome = async (id) => {
    try {
      dispatch(setLoading(true));
      const response = await HoldCapitalIncome(id);
      if (response?.success) {
        Swal.fire({
          icon: "success",
          text: response?.message || "User income hold/unhold successful",
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
                  isCurrentIncomeHold: !user.active?.isCurrentIncomeHold,
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
                  isRoiBlocked: !user.active?.isRoiBlocked,
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

  const handleCapitalLock = async (id) => {
    try {
      dispatch(setLoading(true));
      const response = await lockUnlockCapitalInvestment(id);
      if (response?.success) {
        Swal.fire({
          icon: "success",
          text: response?.message || "Capital investment lock/unlock successful",
          toast: true,
          position: "top-end",
          showConfirmButton: false,
          timer: 3000,
          timerProgressBar: true,
        });

        // Refresh the users list to get updated data
        fetchAllUsers();
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
      console.error("Error locking/unlocking capital:", error);
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
        localStorage.setItem("access", response.admin);
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
      accessor: "id",
      cell: (row, rowIndex) => (
        <span className="font-medium text-white">{rowIndex + 1}</span> // 1-based index
      ),
    },
    {
      header: "Name",
      accessor: "username",
      cell: (row) => (
        <span className="font-medium text-white">{row?.username}</span>
      ),
      searchValue: (row) => row?.username || "",
    },
    {
      header: "User ID",
      accessor: "id",
      cell: (row) => <span className="font-medium text-white">{row?.id}</span>,
      searchValue: (row) => row?.id || "",
    },
    {
      header: "Referral Link",
      accessor: "referralLink",
      cell: (row) => (
        <span className="font-medium text-white">{row?.referralLink}</span>
      ),
      searchValue: (row) => row?.referralLink || "",
    },
    {
      header: "Investment",
      accessor: "investment",
      cell: (row) => (
        <span className="font-medium text-white">$ {row?.investment}</span>
      ),
      searchValue: (row) => row?.investment?.toString() || "0",
    },
    {
      header: "Wallet Address",
      accessor: "account",
      cell: (row) => (
        <span className="font-medium text-white">
          {maskWalletAddress(row?.account)}
        </span>
      ),
      searchValue: (row) => row?.account || "",
    },
    {
      header: "Status",
      accessor: "active.isActive",
      cell: (row) => {
        return row?.active?.isActive === true ? (
          <span className="font-semibold text-blue-400">Active</span>
        ) : (
          <span className="font-semibold text-red-400">Inactive</span>
        );
      },
      searchValue: (row) => (row?.active?.isActive ? "active" : "inactive"),
    },
    {
      header: "Block/Unblock",
      accessor: "isBlocked",
      exportable: false,
      cell: (row) => {
        return row?.active?.isBlocked === true ? (
          <div
            className="font-semibold text-blue-400 text-xl flex items-center justify-center w-full"
            onClick={() => handleBlock(row?._id)}
          >
            <i class="fa-solid fa-toggle-on"></i>
          </div>
        ) : (
          <div
            className="font-semibold text-white text-xl flex items-center justify-center w-full"
            onClick={() => handleBlock(row?._id)}
          >
            <i class="fa-solid fa-toggle-off"></i>
          </div>
        );
      },
    },
    {
      header: "Hold Current Income",
      accessor: "isCurrentIncomeHold",
      exportable: false,
      cell: (row) => {
        return row?.active?.isCurrentIncomeHold === true ? (
          <div
            className="font-semibold text-blue-400 text-xl flex items-center justify-center w-full cursor-pointer"
            onClick={() => handleBlockIncome(row?._id)}
          >
            <i class="fa-solid fa-toggle-on"></i>
          </div>
        ) : (
          <div
            className="font-semibold text-white text-xl flex items-center justify-center w-full cursor-pointer"
            onClick={() => handleBlockIncome(row?._id)}
          >
            <i class="fa-solid fa-toggle-off"></i>
          </div>
        );
      },
    },
    // {
    //   header: "Lock/Unlock Capital Investment",
    //   accessor: "isCapitalLocked",
    //   exportable: false,
    //   cell: (row) => {
    //     // Check if capital is locked - adjust field name based on backend response
    //     const isLocked = row?.active?.isCapitalLocked === true || row?.isCapitalLocked === true;
    //     return isLocked ? (
    //       <div
    //         className="font-semibold text-blue-400 text-xl flex items-center justify-center w-full cursor-pointer"
    //         onClick={() => handleCapitalLock(row?._id)}
    //         title="Capital Investment Locked - Click to unlock"
    //       >
    //         <i class="fa-solid fa-lock"></i>
    //       </div>
    //     ) : (
    //       <div
    //         className="font-semibold text-yellow-400 text-xl flex items-center justify-center w-full cursor-pointer"
    //         onClick={() => handleCapitalLock(row?._id)}
    //         title="Capital Investment Unlocked - Click to lock"
    //       >
    //         <i class="fa-solid fa-lock-open"></i>
    //       </div>
    //     );
    //   },
    // },
    {
      header: "User ROI Status",
      accessor: "active.isRoiBlocked",
      exportable: false,
      cell: (row) => {
        return row?.active?.isRoiBlocked === true ? (
          <span
            className="font-semibold text-blue-400 text-xl flex items-center justify-center w-full"
            onClick={() => handleRoiGenerate(row?._id)}
          >
            <i class="fa-solid fa-toggle-on"></i>
          </span>
        ) : (
          <span
            className="font-semibold text-white text-xl flex items-center justify-center w-full"
            onClick={() => handleRoiGenerate(row?._id)}
          >
            <i class="fa-solid fa-toggle-off"></i>
          </span>
        );
      },
      searchValue: (row) =>
        row?.active?.isRoiBlocked === true ? "true" : "false",
    },

    {
      header: "Date",
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
      header: "Action",
      exportable: false,
      cell: (row) => (
        <div className="flex items-center gap-2">
          <button
            className="px-4 py-1 text-xs font-semibold text-white bg-blue-500 rounded-md hover:bg-blue-600"
            onClick={() => handleAccess(row?._id)}
          >
            Access User
          </button>
          <button
            className="px-4 py-1 text-xs font-semibold text-white bg-blue-500 rounded-md hover:bg-blue-600"
            onClick={() => handleOpenEditModal(row)}
          >
            Edit
          </button>
        </div>
      ),
    },
  ];

  const cardData = [
    {
      title: "All Users",
      value: `${Number(totalIncome?.users ?? 0)}`,
      icon: "https://img.icons8.com/3d-fluency/94/group--v2.png",
    },
    {
      title: "Active Users",
      value: ` ${Number(totalIncome?.userActive ?? 0)}`,
      icon: "https://img.icons8.com/3d-fluency/94/group.png",
    },
    {
      title: "Inactive Users",
      value: ` ${Number(totalIncome?.userInactive ?? 0)}`,
      icon: "https://img.icons8.com/3d-fluency/94/group--v4.png",
    },
  ];

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
          />
        ))}
      </div>
      <DataTable
        title={
          data === "active"
            ? "Active Users"
            : data === "inactive"
              ? "Inactive Users"
              : "All Users"
        }
        columns={columns}
        data={filteredUsers}
        pageSize={10}
        dropdownFilters={[
          {
            accessor: "active.isActive",
            label: "Status",
            options: [
              { value: "active", label: "Active" },
              { value: "inactive", label: "Inactive" },
            ],
          },
          {
            accessor: "active.isRoiBlocked",
            label: "ROI Status",
            options: [
              { value: true, label: "Blocked" },
              { value: false, label: "Unblocked" },
            ],
          },
        ]}
      />
      {isEditModalOpen && (
        <div className="fixed inset-0 z-50 py-5 bg-black/70 flex justify-center">
          <div className="bg-slate-900 p-6 rounded-lg shadow-xl w-full max-w-md overflow-y-auto">
            <h2 className="text-xl font-bold text-white mb-4">Edit User</h2>
            <form onSubmit={handleEditSubmit} className="space-y-4">
              <div className="space-y-2">
                <span className="text-slate-400 text-sm">Name</span>
                <input
                  type="text"
                  name="username"
                  value={editFormData.username}
                  onChange={handleEditInputChange}
                  placeholder="Username"
                  className="w-full p-2 rounded border bg-slate-800 text-white text-sm"
                />
              </div>
              <div className="space-y-2">
                <span className="text-slate-400 text-sm">Wallet Address</span>
                <input
                  type="text"
                  name="account"
                  value={editFormData.account}
                  onChange={handleEditInputChange}
                  placeholder="Wallet Address"
                  className="w-full p-2 rounded border bg-slate-800 text-white text-sm"
                />
              </div>
              <div className="space-y-2">
                <span className="text-slate-400 text-sm">Email</span>
                <input
                  type="email"
                  name="email"
                  value={editFormData.email}
                  onChange={handleEditInputChange}
                  placeholder="Email"
                  className="w-full p-2 rounded border bg-slate-800 text-white text-sm"
                />
              </div>
              <div className="space-y-2">
                <span className="text-slate-400 text-sm">Country Code</span>
                <input
                  type="text"
                  name="countryCode"
                  value={editFormData.countryCode}
                  onChange={handleEditInputChange}
                  placeholder="Country Code"
                  className="w-full p-2 rounded border bg-slate-800 text-white text-sm"
                />
              </div>
              <div className="space-y-2">
                <span className="text-slate-400 text-sm">Mobile Number</span>
                <input
                  type="tel"
                  name="mobile"
                  value={editFormData.mobile}
                  onChange={handleEditInputChange}
                  placeholder="Mobile Number"
                  className="w-full p-2 rounded border bg-slate-800 text-white text-sm"
                />
              </div>
              <div className="space-y-2">
                <span className="text-slate-400 text-sm">Country Name</span>
                <input
                  type="text"
                  name="country"
                  value={editFormData.country}
                  onChange={handleEditInputChange}
                  placeholder="Country Name"
                  className="w-full p-2 rounded border bg-slate-800 text-white text-sm"
                />
              </div>
              <div className="space-y-2">
                <span className="text-slate-400 text-sm">Password</span>
                <input
                  type="text"
                  name="password"
                  value={editFormData.password}
                  onChange={handleEditInputChange}
                  placeholder="Password"
                  className="w-full p-2 rounded border bg-slate-800 text-white text-sm"
                />
              </div>

              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setIsEditModalOpen(false);
                    setSelectedUser(null);
                  }}
                  className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-500 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-500 cursor-pointer"
                >
                  Update
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AllUsers;
