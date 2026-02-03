import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import Swal from "sweetalert2";
import { useState } from "react";
import { MainContent } from "../../constants/mainContent";
import {
  AuthenticatedUserRouters,
  LandingRouters,
} from "../../constants/routes";
import { loginUser } from "../../redux/slices/authSlice";
import { setLoading } from "../../redux/slices/loadingSlice";
import { toast } from "react-toastify";
import { adminLogin } from "../../api/admin.api";
import { Shield, Mail, Lock, ArrowRight } from "lucide-react";

const AdminLogin = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [payload, setPayload] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    dispatch(setLoading(true));
    try {
      const response = await adminLogin(payload);
      if (response?.success) {
        await dispatch(
          loginUser({
            token: response?.token,
            userId: response?.data?._id,
            role: response?.data?.role,
            data: response?.data,
          })
        );
        localStorage.setItem("adminId", response?.data?._id);
        Swal.fire({
          icon: "success",
          title: "Login Successful",
          text: "Welcome to Admin Dashboard",
          timer: 2500,
          showConfirmButton: false,
        }).then(() => navigate(AuthenticatedUserRouters.DASHBOARD));
      } else {
        toast.error(response?.message || "Something went wrong");
      }
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Login Failed",
        text:
          error?.response?.data?.message ||
          error.message ||
          "Something went wrong",
      });
    } finally {
      dispatch(setLoading(false));
    }
  };

  const handleChange = (e, field) => {
    setPayload({ ...payload, [field]: e.target.value });
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center bg-slate-950 text-white relative overflow-hidden"
      style={{ "--bg-image-url": `url(/bg.webp)` }}
    >
      {/* Background Glows */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/3 left-1/4 w-96 h-96 bg-emerald-500/10 blur-3xl rounded-full animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-lime-500/10 blur-3xl rounded-full animate-pulse delay-1000"></div>
      </div>

      <div className="relative z-10 w-full max-w-6xl flex items-center justify-between gap-14 px-6">
        {/* Left Login Card */}
        <div className="w-full max-w-md mx-auto">
          <div className="bg-slate-900/70 backdrop-blur-2xl border border-emerald-500/20 rounded-3xl p-10 shadow-[0_0_60px_rgba(16,185,129,0.15)]">
            {/* Logo */}
            {/* <div className="flex justify-center mb-6">
              <img
                src={MainContent.fullLogo}
                alt="Logo"
                className="h-30 w-70 cursor-pointer hover:scale-105 transition"
                onClick={() => navigate(LandingRouters.DASHBOARD)}
              />
            </div> */}

            {/* Header */}
            <div className="text-center mb-8">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-400/30 text-sm text-emerald-300 mb-4">
                <Shield size={16} />
                Secure Admin Access
              </div>

              <h1 className="text-4xl font-bold bg-gradient-to-r from-emerald-300 via-blue-400 to-lime-300 bg-clip-text text-transparent">
                Admin Portal
              </h1>
              <p className="text-gray-400 text-sm mt-2">
                Sign in to manage the platform
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Email */}
              <div>
                <label className="text-sm text-slate-300 mb-2 block">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="email"
                    placeholder="admin@example.com"
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl py-3.5 pl-12 pr-4 placeholder:text-slate-500 focus:ring-2 focus:ring-emerald-400 focus:border-transparent transition"
                    value={payload.email}
                    onChange={(e) => handleChange(e, "email")}
                    required
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <label className="text-sm text-slate-300 mb-2 block">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter password"
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl py-3.5 pl-12 pr-14 placeholder:text-slate-500 focus:ring-2 focus:ring-emerald-400 focus:border-transparent transition"
                    value={payload.password}
                    onChange={(e) => handleChange(e, "password")}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-emerald-300 transition"
                  >
                    {showPassword ? "Hide" : "Show"}
                  </button>
                </div>
              </div>

              {/* Submit */}
              <button
                type="submit"
                className="
                  group w-full flex items-center justify-center gap-2 py-4 rounded-xl font-bold text-lg
                  bg-gradient-to-r from-emerald-500 via-blue-500 to-lime-500
                  text-slate-900
                  hover:shadow-[0_0_40px_rgba(16,185,129,0.6)]
                  hover:brightness-110
                  transition-all duration-300
                  active:scale-95
                "
              >
                Sign In
                <ArrowRight
                  size={20}
                  className="group-hover:translate-x-1 transition-transform"
                />
              </button>
            </form>

            {/* Footer */}
            <div className="mt-8 pt-6 border-t border-slate-800 text-center">
              <p className="text-sm text-slate-400">
                Enterprise-grade security enabled
              </p>
            </div>
          </div>
        </div>

        {/* Right Side Illustration */}
        <div className="hidden lg:flex flex-col items-center w-1/2 space-y-8">
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-emerald-500 to-lime-500 blur-3xl opacity-20 rounded-full animate-pulse"></div>
            <img
              src={MainContent.appLogo}
              alt="Illustration"
              className="relative z-10 w-full max-w-md drop-shadow-2xl"
            />
          </div>
          <div className="text-center max-w-md">
            <h2 className="text-3xl font-bold">
              Control & Monitor
            </h2>
            <p className="text-slate-400 text-lg mt-2">
              Powerful admin tools to manage and scale your platform securely.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
