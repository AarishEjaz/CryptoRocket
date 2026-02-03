/* eslint-disable react/prop-types */
import { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { toast } from "react-toastify";
import { maskWalletAddress } from "../../../utils/additionalFunc";
import {
  AuthenticatedAdminRouters,
  AuthenticatedUserRouters,
  LandingRouters,
} from "../../../constants/routes";
import { loginUser, logoutUser } from "../../../redux/slices/authSlice";
import { getUserDashboardAccess } from "../../../api/admin.api";
import { setLoading } from "../../../redux/slices/loadingSlice";

const Header3 = ({ onMenuClick }) => {
  const access = localStorage.getItem("access");
  const adminId = localStorage.getItem("adminId");
  const userInfo = useSelector((state) => state?.userInfo?.userInfo);
  //   const [isDarkMode, setIsDarkMode] = useState(true);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  // 1. State aur refs mobile dropdown ke liye
  const [isProfileMenuOpen, setProfileMenuOpen] = useState(false);
  const profileMenuRef = useRef(null);
  const profileBtnRef = useRef(null);

  // 2. useEffect bahar click karne par dropdown ko band karne ke liye
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        profileMenuRef.current &&
        !profileMenuRef.current.contains(event.target) &&
        profileBtnRef.current &&
        !profileBtnRef.current.contains(event.target)
      ) {
        setProfileMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSubmit = async (id) => {
    dispatch(setLoading(true))
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
        localStorage.removeItem("access");
        navigate(AuthenticatedAdminRouters.ADMIN_DASHBOARD);
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
      dispatch(setLoading(false));
    }
  };

  const logoutHandler = () => {
    Swal.fire({
      title: "Are you sure?",
      text: "Do you want to logout?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, logout",
      cancelButtonText: "No, cancel",
    }).then((result) => {
      if (result.isConfirmed) {
        dispatch(logoutUser());
        toast.success("Logged out successfully");
        navigate(LandingRouters.USER_LOGIN);
      }
    });
  };

  return (
    <header className="flex mb-2 items-center justify-between gap-4 sm:gap-6 py-4 px-4 sm:px-6 border-b border-light bg-card">
      <div className="flex items-center gap-4">
        <button
          onClick={onMenuClick}
          className="lg:hidden text-muted hover:text-primary text-2xl"
        >
          <i className="fa-solid fa-bars"></i>
        </button>
        <div className="hidden lg:block relative w-full max-w-lg">
          <i className="fa-solid fa-search absolute left-4 top-1/2 -translate-y-1/2 text-muted"></i>
          <input
            type="text"
            placeholder="Search..."
            className="w-full bg-secondary border border-light rounded-full py-2.5 pl-12 pr-4 text-primary placeholder-muted focus:outline-none focus:ring-2 focus:ring-primary-green"
          />
        </div>
      </div>

      <div className="flex items-center gap-3 sm:gap-4">
        <button className="lg:hidden text-muted hover:text-primary text-xl">
          <i className="fa-solid fa-search"></i>
        </button>
        
        {/* Social Media Icons */}
        <div className="hidden md:flex items-center gap-2">
          <a href="" target="_blank" rel="noopener noreferrer" 
             className="w-10 h-10 flex items-center justify-center rounded-full bg-secondary text-muted hover:text-red-400 hover:bg-red-500/20 transition-colors duration-200 border border-light" 
             title="YouTube">
            <i className="fa-brands fa-youtube text-xl"></i>
          </a>
          <a href="/" target="_blank" rel="noopener noreferrer" 
             className="w-10 h-10 flex items-center justify-center rounded-full bg-secondary text-muted hover:text-blue-400 hover:bg-blue-500/20 transition-colors duration-200 border border-light" 
             title="Telegram">
            <i className="fa-brands fa-telegram text-xl"></i>
          </a>
        </div>
        {/* <button className="relative text-slate-400 hover:text-white text-xl">
          <i className="fa-solid fa-bell"></i>
          <span className="absolute top-0 right-0 block h-2 w-2 rounded-full bg-red-500 ring-2 ring-slate-900"></span>
        </button> */}

        {/* Dollar Bank Icon */}
        {/* <button
          onClick={() => navigate(AuthenticatedUserRouters.DOLLAR_BANK)}
          className="w-10 h-10 flex items-center justify-center rounded-full bg-yellow-500/20 text-yellow-400 hover:bg-yellow-500/30 transition-colors duration-200 border border-yellow-500/30 cursor-pointer"
          title="Dollar Bank"
        >
          <i className="fa-solid fa-building-columns text-lg"></i>
        </button> */}

        {/* 3. User Profile section ko relative banaya gaya hai */}
        <div className="relative">
          {/* User Profile ko ek button banaya gaya hai */}
          <button
            ref={profileBtnRef}
            onClick={() => setProfileMenuOpen(!isProfileMenuOpen)}
            className="flex items-center gap-3"
          >
            <img
              src={
                userInfo?.picture ||
                "https://api.dicebear.com/8.x/lorelei/svg?seed=Lanre"
              }
              alt="User Avatar"
              className="w-10 h-10 rounded-full border-2 border-slate-600 cursor-pointer"
            />
          </button>

          <div
            ref={profileMenuRef}
            className={`absolute z-50 right-0 mt-2 w-64 origin-top-right bg-card backdrop-blur-lg border border-light rounded-xl shadow-large ${isProfileMenuOpen
                ? "opacity-100 scale-100"
                : "opacity-0 scale-95 pointer-events-none"
              } transition-all duration-200`}
          >
            <div className="p-4 border-b border-light">
              <p className="font-semibold text-primary uppercase">
                {userInfo?.username}
              </p>
              <p className="text-sm text-muted">
                {maskWalletAddress(userInfo?.account)}
              </p>
            </div>
            <div className="p-2">
              <Link
                to={AuthenticatedUserRouters.PROFILE}
                className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-secondary text-primary"
              >
                <i className="fa-solid fa-user w-5 text-center text-muted"></i>
                <span>My Profile</span>
              </Link>
              {/* <div className="flex items-center justify-between gap-3 px-3 py-2.5 rounded-lg">
                                <div className="flex items-center gap-3">
                                    <i className="fa-solid fa-moon w-5 text-center text-slate-400"></i>
                                    <span>Dark Mode</span>
                                </div>
                                <button 
                                    onClick={() => setIsDarkMode(!isDarkMode)}
                                    className={`relative w-10 h-5 flex items-center rounded-full p-0.5 transition-colors duration-300 ${isDarkMode ? 'bg-blue-600' : 'bg-slate-700'}`}
                                >
                                    <div className={`w-4 h-4 bg-white rounded-full shadow-md transform transition-transform duration-300 ${isDarkMode ? 'translate-x-5' : 'translate-x-0'}`}></div>
                                </button>
                            </div> */}
            </div>
            <div className="p-2 border-t border-light">
              <button
                onClick={access ? () => handleSubmit(adminId) : logoutHandler}
                className="flex items-center gap-3 px-3 py-2.5 w-full rounded-lg hover:bg-secondary cursor-pointer text-primary"
              >
                <i className="fa-solid fa-arrow-right-from-bracket w-5 text-center text-muted"></i>
                <span>Logout</span>
              </button>
            </div>
          </div>
        </div>

        <div className="hidden md:flex items-center gap-2 bg-secondary rounded-full px-3 py-1.5 border border-light">
          <div className="w-2.5 h-2.5 rounded-full bg-accent-green animate-pulse"></div>
          <span className="text-xs font-semibold text-secondary">Online</span>
        </div>

        {/* Logout Icon Button */}
        <button
          className="w-10 h-10 flex items-center justify-center rounded-full bg-secondary text-muted 
                   hover:bg-red-500/20 hover:text-red-400 transition-colors duration-200 
                   border border-light cursor-pointer"
          title="Logout"
          onClick={access ? () => handleSubmit(adminId) : logoutHandler}
        >
          <i className="fa-solid fa-arrow-right-from-bracket"></i>
        </button>
      </div>
    </header>
  );
};

export default Header3;
