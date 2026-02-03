import { Link, useLocation, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import Swal from "sweetalert2";
import { getWalletAddress } from "../../utils/additionalFunc";
import {
  emailValidator,
  nameValidator,
  phoneValidator,
  validateWalletAddress,
} from "../../utils/inputValidator";
import WalletOptionModal from "../../components/Screen/Landing/WalletOptionModal";
import { createUserApi, getSponsorByReferralApi } from "../../api/auth.api";
import { loginUser } from "../../redux/slices/authSlice";
import { setLoading } from "../../redux/slices/loadingSlice";
import {
  AuthenticatedUserRouters,
  LandingRouters,
} from "../../constants/routes";
import { MainContent } from "../../constants/mainContent";
import { User, Mail, Phone, MapPin, Key, Wallet, UserPlus } from "lucide-react";

const RegisterPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { search } = useLocation();
  const [showWalletModal, setShowWalletModal] = useState(false);
  const [sponsorName, setSponsorName] = useState("");

  const [formData, setFormData] = useState({
    referral: "",
    walletAddress: "",
  });

  useEffect(() => {
    if (search) {
      const urlParams = new URLSearchParams(search);
      const referralCode = urlParams.get('referral') || "";
      setFormData({
        ...formData,
        referral: referralCode,
      });
    }
  }, [search]);

  useEffect(() => {
    const fetchSponsor = async () => {
      if (formData.referral && formData.referral.length >= 7) {
        try {
          const res = await getSponsorByReferralApi(formData.referral);
          if (res?.success) {
            setSponsorName(res?.data?.username);
          } else {
            setSponsorName("Invalid referral code");
          }
        } catch (error) {
          setSponsorName("Error fetching sponsor");
        }
      } else {
        setSponsorName("");
      }
    };
    fetchSponsor();
  }, [formData.referral]);

  const [errors, setErrors] = useState({});

  const handleChange = (e, field) => {
    const { value } = e.target;
    setFormData({
      ...formData,
      [field]: value,
    });
  };

  const handleNavigate = () => {
    navigate(AuthenticatedUserRouters.DASHBOARD);
  };

  const validate = () => {
    const validationErrors = {};
    let isValid = true;

    const walletAddressError =
      validateWalletAddress(formData.walletAddress) || "";

    if (walletAddressError) {
      validationErrors.walletAddress = walletAddressError;
      isValid = false;
    }
    setErrors(validationErrors);

    return isValid;
  };

  const handleRegisterClick = async (walletAddress) => {
    try {
      dispatch(setLoading(true));
      const response = await createUserApi({
        ...formData,
        walletAddress: walletAddress || formData.walletAddress,
      });

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
          title: "Registration Success",
          text: "You have registered successfully",
          timer: 3000,
        }).then(() => {
          handleNavigate();
        });
      } else {
        toast.error(
          response?.response?.data?.message || "Something went wrong"
        );
      }
    } catch (error) {
      console.log(error);
      Swal.fire({
        icon: "error",
        title: "Registration Failed",
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
  const handleSubmit = () => {
    if (validate()) {
      handleRegisterClick();
    } else {
      toast.error("Please fill the required fields.");
    }
  };
  const getWalletAddressConnect = async (type) => {
    try {
      dispatch(setLoading(true));
      const response = await getWalletAddress(type);
      setFormData({ ...formData, walletAddress: response });
      sessionStorage.setItem("walletType", response);
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
        className="bg-rich-black text-ecru pt-24 min-h-screen flex items-center justify-center p-4 main-bg-image"
        style={{ "--bg-image-url": `url(/bg.webp)` }}
      >
        <div className="w-full max-w-2xl hero-glass rounded-2xl p-8 shadow-2xl">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="flex justify-center mb-6 h-40">
              <div className="">
                <img
                  src={MainContent.fullLogo}
                  className="h-full w-70 cursor-pointer z-10"
                  alt="App Logo"
                />
              </div>
            </div>

            <h1 className="text-3xl font-bold text-ecru mb-2">
              Create Your Account
            </h1>
            <p className="text-beaver">
              Join the CryptoRocket community and start your investment journey
            </p>
          </div>

          {/* Registration Form */}
          <div className="space-y-6">
            {/* Referral Code */}
            <div className="space-y-2">
              <label className="text-sm text-beaver mb-2 block flex items-center gap-2">
                <UserPlus className="w-4 h-4" />
                Referral Code
              </label>
              <input
                type="text"
                placeholder="Enter referral code"
                className="w-full input-field focus:border-chamoisee focus:ring-2 focus:ring-chamoisee/20"
                value={formData.referral}
                onChange={(e) => handleChange(e, "referral")}
              />
              {errors.referral && (
                <p className="text-red-400 text-xs mt-1">{errors.referral}</p>
              )}
            </div>

            {/* Sponsor Name (Read Only) */}
            <div className="space-y-2">
              <label className="text-sm text-beaver mb-2 block flex items-center gap-2">
                <User className="w-4 h-4" />
                Sponsor Name
              </label>
              <input
                type="text"
                placeholder="Sponsor name will appear here"
                readOnly
                className="w-full input-field bg-space-cadet/80 cursor-not-allowed text-ecru"
                value={sponsorName}
              />
            </div>

            {/* Wallet Address */}
            <div className="space-y-2">
              <label className="text-sm text-beaver mb-2 block flex items-center gap-2">
                <Wallet className="w-4 h-4" />
                Your Wallet Address
              </label>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Connect your wallet to fill this"
                  readOnly
                  className="w-full input-field bg-space-cadet/80 cursor-not-allowed text-beaver pr-32"
                  value={formData.walletAddress}
                />
                <button
                  type="button"
                  onClick={() => setShowWalletModal(true)}
                  className="absolute right-2 top-1/2 -translate-y-1/2 bg-blue-400 rounded-lg py-2 px-4 text-sm"
                >
                  Connect Wallet
                </button>
              </div>
              {errors.walletAddress && (
                <p className="text-red-400 text-xs mt-1">
                  {errors.walletAddress}
                </p>
              )}
            </div>

            {/* Create Account Button */}
            <div>
              <button
                className="w-full btn-primary flex items-center justify-center gap-3 py-4 mt-4"
                onClick={handleSubmit}
              >
                <UserPlus className="w-5 h-5" />
                Create Account 
              </button>
            </div>
          </div>


          {/* Login Link */}
          <div className="mt-8 pt-6 border-t border-delft-blue text-center">
            <p className="text-beaver">
              Already have an account?{" "}
              <Link
                to={LandingRouters.USER_LOGIN}
                className="font-semibold text-blue-500 duration-200"
              >
                Log In
              </Link>
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default RegisterPage;