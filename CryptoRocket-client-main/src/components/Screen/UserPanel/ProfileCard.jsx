import { useState } from "react";
import { useSelector } from "react-redux";
import {
  maskEmailAddress,
  maskWalletAddress,
  shareReferralCode,
} from "../../../utils/additionalFunc";
import { toast } from "react-toastify";
import { MdOutlineShare } from "react-icons/md";
import { TbCopyCheck, TbCopy } from "react-icons/tb";

const ProfileCard = () => {
  const user = useSelector((state) => state?.isLoggedUser?.data);
  console.log("=== USER DATA ===", user);
  console.log("User ID:", user?.id);
  console.log("User _id:", user?._id);
  console.log("All User Keys:", Object.keys(user || {}));
  const [copiedText1, setCopiedText1] = useState(false);
  const location = window.location.origin;
  const referCode = `${location}/register?referral=${user?.referralLink}`;
  const handleCopy = (text, setCopiedState) => {
    navigator.clipboard
      .writeText(text)
      .then(() => {
        setCopiedState(true);
        toast.success("Referral link copied!");
        setTimeout(() => setCopiedState(false), 2000);
      })
      .catch((err) => {
        console.error("Failed to copy text: ", err);
      });
  };

  return (
    <div className="card hero-glass mt-10 border border-glass-border rounded-2xl p-6 flex flex-col items-center h-full">
      <img
        src={
          user?.picture || "https://api.dicebear.com/8.x/lorelei/svg?seed=Lanre"
        }
        alt="User Avatar"
        className="w-24 h-24 rounded-full border-4 border-chamoisee/50 -mt-16 shadow-lg"
      />
      <h3 className="text-xl font-bold text-hero-primary mt-4">{user?.id || "N/A"}</h3>
      <h3 className="text-xl font-bold text-hero-primary mb-2 capitalize">
        {user?.username || "N/A"}
      </h3>
      <p className="text-sm text-hero-secondary">Your Personal Profile</p>

      <hr className="w-full border-delft-blue my-4" />

      <div className="w-full space-y-3 text-sm">
        <div className="flex justify-between">
          <span className="text-hero-secondary">Sponsored By:</span>
          <span className="font-semibold text-hero-primary capitalize">
            {user?.sponsor?.id || "N/A"}
          </span>
        </div>
        <div className="flex justify-between">
          <span className="text-hero-secondary">Email:</span>
          <span className="font-semibold text-hero-primary">
            {maskEmailAddress(user?.email) || "N/A"}
          </span>
        </div>
        <div className="flex justify-between">
          <span className="text-hero-secondary">Mobile:</span>
          <span className="font-semibold text-hero-primary">
            {maskWalletAddress(user?.mobile) || "N/A"}
          </span>
        </div>
        <div className="flex justify-between">
          <span className="text-hero-secondary">Wallet Address:</span>
          <span className="font-semibold text-hero-primary">
            {maskWalletAddress(user?.account) || "N/A"}
          </span>
        </div>
        <div className="flex justify-between">
          <span className="text-hero-secondary">Joined:</span>
          <span className="font-semibold text-hero-primary">
            {new Date(user?.createdAt)?.toLocaleDateString() || "N/A"}
          </span>
        </div>
      </div>

      <hr className="w-full border-delft-blue my-4" />

      <p className="text-xs text-hero-secondary mb-2 text-center">
        Your Referral Link:
      </p>
      <div className="relative w-full flex gap-2">
        <input
          type="text"
          readOnly
          value={referCode || "N/A"}
          disabled
          className="w-full bg-space-cadet/50 border border-delft-blue rounded-lg py-2 px-3 text-hero-secondary text-xs pointer-events-none"
        />
        <div className="flex gap-2">
          <button
            onClick={() => handleCopy(referCode, setCopiedText1)}
            className={`w-10 h-10 flex items-center justify-center rounded-full bg-space-cadet/50 text-hero-secondary 
                   hover:bg-chamoisee/20 hover:text-chamoisee transition-colors duration-200 
                   border border-delft-blue hover-gold-shadow`}
          >
            {copiedText1 ? <TbCopyCheck /> : <TbCopy />}
          </button>
          <button
            onClick={() => shareReferralCode(referCode)}
            className={`w-10 h-10 flex items-center justify-center rounded-full bg-space-cadet/50 text-hero-secondary 
                   hover:bg-chamoisee/20 hover:text-chamoisee transition-colors duration-200 
                   border border-delft-blue hover-gold-shadow`}
          >
            <MdOutlineShare />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProfileCard;