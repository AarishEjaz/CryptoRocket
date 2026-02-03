import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import Swal from "sweetalert2";
import { useState } from "react";
import { MainContent } from "../../constants/mainContent";
import {
  AuthenticatedUserRouters,
  LandingRouters,
} from "../../constants/routes";
import { loginUser } from "../../redux/slices/authSlice";
import { getWalletAddress } from "../../utils/additionalFunc";
import { setLoading } from "../../redux/slices/loadingSlice";
import { loginUserApi } from "../../api/auth.api";
import WalletOptionModal from "../../components/Screen/Landing/WalletOptionModal";
import { toast } from "react-toastify";
import { Wallet, Mail, Lock, Sparkles } from "lucide-react";

const LoginPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [showWalletModal, setShowWalletModal] = useState(false);

  const getWalletAddressConnect = async (type) => {
    try {
      dispatch(setLoading(true));
      const response = await getWalletAddress(type);
      handleLogin(response);
    } catch (error) {
      console.log(error);
      Swal.fire({
        icon: "error",
        title: "Wallet Connect Failed",
        text:
          error?.response?.data?.message ||
          error.message ||
          "Something went wrong",
      });
      dispatch(setLoading(false));
    }
  };

  const handleLogin = async (walletAddress) => {
    try {
      dispatch(setLoading(true));
      const response = await loginUserApi({ walletAddress });
      if (response?.success) {
        await dispatch(
          loginUser({
            token: response?.token,
            userId: response?.data?._id,
            role: response?.data?.role,
            data: response?.data,
          })
        );
        Swal.fire({
          icon: "success",
          title: "Login Success",
          text: "You have logged in successfully",
          timer: 3000,
        }).then(() => {
          navigate(AuthenticatedUserRouters.DASHBOARD);
        });
      } else {
        toast.error(response?.message || "Something went wrong");
      }
    } catch (error) {
      console.log(error);
      Swal.fire({
        icon: "error",
        title: "Login Failed",
        text:
          error?.response?.data?.message ||
          error.message ||
          "Something went wrong",
        timer: 3000,
      });
    } finally {
      dispatch(setLoading(false));
    }
  };

  return (
    <>
      <WalletOptionModal
        hide={() => setShowWalletModal(false)}
        connectWallet={(wallet) => getWalletAddressConnect(wallet)}
        show={showWalletModal}
      />
      <div
        className="bg-rich-black rounded-md text-ecru pt-24 min-h-screen flex items-center justify-center p-4 main-bg-image"
        style={{ "--bg-image-url": `url(/bg.webp)` }}
      >
        <div className="w-full max-w-md hero-glass rounded-2xl p-8 shadow-2xl text-center space-y-6">
          {/* Logo */}
          <div className="flex justify-center mb-6">
            <div className="relative">
              <img src={MainContent.fullLogo} alt="App Logo" className="h-30 w-50" />
            </div>
          </div>

          {/* Title */}
          <div className="space-y-2">
            <h1 className="text-3xl font-bold text-ecru">Welcome Back</h1>
            <p className="text-beaver text-sm">
              Connect your wallet to access your Zepto defi account
            </p>
          </div>

          {/* Wallet Connect */}
          <div className="space-y-4 pt-6">
            <button
              onClick={() => setShowWalletModal(true)}
              className="w-full cursor-pointer rounded-lg bg-blue-400 flex items-center justify-center gap-3 py-4"
            >
              <Wallet className="w-5 h-5" />
              Connect Wallet
            </button>
          </div>

          {/* Sign Up Link */}
          <div className="text-sm pt-4 border-t border-delft-blue">
            <p className="text-beaver">
              New to Zepto defi?{" "}
              <Link
                to={LandingRouters.USER_REGISTER}
                className="font-semibold text-blue-500"
              >
                Create an account
              </Link>
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default LoginPage;