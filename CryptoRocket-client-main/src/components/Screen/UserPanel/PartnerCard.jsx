import React from "react";
import { maskWalletAddress } from "../../../utils/additionalFunc";
import { NumberFormatCommas } from "../../../utils/FormatText";
import moment from "moment";

const StatItem = ({ icon, label, value }) => (
  <div className="flex flex-col">
    <p className="text-xs text-slate-400 mb-1">{label}</p>
    <div className="flex items-center gap-2">
      <div className="w-8 h-8 flex items-center justify-center rounded-lg bg-blue-500/10 text-blue-400">
        <i className={`fa-solid ${icon}`} />
      </div>
      <p className="text-white font-semibold">{value}</p>
    </div>
  </div>
);

const PartnerCard = ({ partner, index }) => {
  const {
    _id,
    id,
    username,
    email,
    account,
    investment,
    createdAt,
    active,
  } = partner || {};

  return (
    <div
      className="bg-slate-900/40 backdrop-blur-md border border-slate-700/60 
        rounded-2xl p-6 transform transition-all duration-300 
        hover:-translate-y-2 hover:shadow-xl hover:shadow-blue-600/30"
    >
      {/* === Header: Avatar + Username === */}
      <div className="flex items-center gap-4 mb-5">
        <div className="relative">
          <img
            src={`https://api.dicebear.com/8.x/bottts/svg?seed=${index}`}
            alt={`Avatar for ${username}`}
            className="w-12 h-12 rounded-full border-2 border-slate-600"
          />
          <span
            className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full ${
              active?.isActive ? "bg-green-500" : "bg-red-500"
            } border-2 border-slate-900`}
          ></span>
        </div>
        <div>
          <p className="font-bold text-white text-lg">
            {username || "Unnamed"}
          </p>
          <p className="text-slate-400 text-sm truncate max-w-[160px]">
            {maskWalletAddress(account) || "N/A"}
          </p>
        </div>
      </div>

      {/* === Divider === */}
      <hr className="border-slate-700/50 my-4" />

      {/* === Main Info Grid === */}
      <div className="grid grid-cols-2 gap-4">
        <StatItem
          icon="fa-sack-dollar"
          label="Investment"
          value={
            <NumberFormatCommas value={investment || 0} decimalScale={2} />
          }
        />
        <StatItem
          icon="fa-user-shield"
          label="Is Verified"
          value={active?.isVerified ? "Yes" : "No"}
        />
        <StatItem
          icon="fa-ban"
          label="Is Blocked"
          value={active?.isBlocked ? "Yes" : "No"}
        />
        <StatItem
          icon="fa-calendar-plus"
          label="Joined On"
          value={createdAt ? moment(createdAt).format("YYYY-MM-DD") : "Unknown"}
        />
        <StatItem
          icon="fa-id-card"
          label="User ID"
          value={id || "N/A"}
        />
      </div>
      <StatItem
        icon="fa-envelope"
        label="Email"
        value={
          <span
            style={{
              display: "inline-block",
              maxWidth: "200px",
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
              verticalAlign: "bottom",
            }}
          >
            {email || "Not provided"}
          </span>
        }
      />
    </div>
  );
};

export default PartnerCard;
