/* eslint-disable react/prop-types */
import { NavLink as RouterNavLink, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  AuthenticatedAdminRouters,
  AuthenticatedUserRouters,
  LandingRouters,
} from "../../../constants/routes";
import { MainContent } from "../../../constants/mainContent";
import { Sparkles } from "lucide-react";

const NavLink = ({ to, icon, text, hasNotification = false, onClose }) => {
  return (
    <RouterNavLink
      to={to}
      end={to === AuthenticatedUserRouters.DASHBOARD}
      onClick={onClose}
      className={({ isActive }) => `
        flex items-center gap-4 px-4 py-3 rounded-lg relative
        transition-all duration-200 ease-in-out pointer text-sm
        ${isActive
          ? "text-cyan-100 font-semibold bg-cyan-500/20 border border-cyan-400"
          : "text-cyan-300 hover:text-cyan-100 hover:bg-cyan-500/10"
        }
      `}
    >
      {({ isActive }) => (
        <>
          {isActive && (
            <span className="absolute left-0 top-2 bottom-2 w-1 bg-cyan-400 rounded-r-full shadow shadow-cyan-500/50"></span>
          )}

          <i className={`${icon} w-5 text-center transition-colors`}></i>
          <span>{text}</span>

          {hasNotification && (
            <span className="ml-auto bg-red-500 text-xs w-5 h-5 flex items-center justify-center rounded-full font-bold">
              1
            </span>
          )}
        </>
      )}
    </RouterNavLink>
  );
};

const SidebarDropdown = ({
  icon,
  text,
  children,
  id,
  openDropdown,
  setOpenDropdown,
}) => {
  const isOpen = openDropdown === id;
  const toggleDropdown = () => setOpenDropdown(isOpen ? null : id);

  return (
    <div className="w-full">
      <button
        onClick={toggleDropdown}
        className={`
          flex items-center justify-between w-full px-4 py-3 rounded-lg text-sm text-nowrap
          text-left text-cyan-300 hover:text-cyan-100 hover:bg-cyan-500/10
          transition-all cursor-pointer border border-transparent hover:border-cyan-400/30
        `}
      >
        <span className="flex items-center gap-4">
          <i className={`${icon} w-5 text-center`}></i>
          {text}
        </span>
        <i className={`fa-solid fa-chevron-${isOpen ? "up" : "down"} text-xs`}></i>
      </button>
      <div
        className={`pl-4 mt-2 space-y-1 transition-all duration-300 ease-in-out ${
          isOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0 overflow-hidden"
        }`}
      >
        {children}
      </div>
    </div>
  );
};

const Sidebar = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [openDropdown, setOpenDropdown] = useState(null);

  const role = useSelector((state) => state?.isLoggedUser?.role);

  const handleNavigate = () => {
    if (role === "ADMIN") navigate(AuthenticatedAdminRouters.ADMIN_DASHBOARD);
    else if (role === "USER") navigate(AuthenticatedUserRouters.DASHBOARD);
  };

  return (
    <aside
      className={`
        fixed inset-y-0 left-0 z-30 w-64 p-6 flex flex-col
        transform transition-transform duration-300 ease-in-out 
        bg-[#0f172a] border-r border-cyan-700
        ${isOpen ? "translate-x-0" : "-translate-x-full"}
        lg:relative lg:translate-x-0
      `}
    >
      {/* Decorative Top Line */}
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-cyan-400 via-cyan-500 to-cyan-600"></div>

      {/* Header */}
      <div className="flex items-center justify-between pb-6 mb-6 border-b border-cyan-700 relative">
        <div
          onClick={() => {
            handleNavigate();
            onClose();
          }}
          className="flex flex-col items-center gap-3 p-3 rounded-2xl bg-[#112240] border border-cyan-600 cursor-pointer group hover:shadow-lg hover:shadow-cyan-500/50 transition-all duration-300"
        >
          <div className="relative">
            <img src={MainContent.shortLogo} alt="CryptoRocket" className="h-16 w-40" />
          </div>
          <div className="text-center">
            <span className="text-lg font-bold text-cyan-400">{MainContent.appName}</span>
            <p className="text-cyan-200 text-xs">Premium Trading</p>
          </div>
        </div>
        <button
          onClick={onClose}
          className="lg:hidden text-cyan-200 hover:text-cyan-400 text-2xl transition-colors duration-200 p-2 hover:bg-cyan-500/10 rounded-lg"
        >
          ×
        </button>
      </div>

      <nav className="flex-grow space-y-2 overflow-y-auto">
        {/* USER ROUTES */}
        {role === "USER" && (
          <>
            <NavLink
              to={AuthenticatedUserRouters.DASHBOARD}
              icon="fa-solid fa-table-columns"
              text="Dashboard"
              onClose={() => {
                onClose();
                setOpenDropdown(null);
              }}
            />
            <SidebarDropdown
              id="my-team"
              icon="fa-solid fa-users"
              text="My Teams"
              openDropdown={openDropdown}
              setOpenDropdown={setOpenDropdown}
            >
              <NavLink to={AuthenticatedUserRouters.MY_REFERRALS} icon="fa-solid fa-people-group" text="My Direct" onClose={() => { onClose(); setOpenDropdown(null); }} />
              <NavLink to={AuthenticatedUserRouters.MY_TEAM} icon="fa-solid fa-users" text="My Downline" onClose={() => { onClose(); setOpenDropdown(null); }} />
              <NavLink to={AuthenticatedUserRouters.MY_TEAM_DIVISION} icon="fa-solid fa-sitemap" text="My Team" onClose={() => { onClose(); setOpenDropdown(null); }} />
            </SidebarDropdown>
            <NavLink to={AuthenticatedUserRouters.AI_TRADE} icon="fa-solid fa-robot" text="AI Trade" onClose={() => { onClose(); setOpenDropdown(null); }} />

            <SidebarDropdown id="manage-plans" icon="fa-solid fa-layer-group" text="Investment Plans" openDropdown={openDropdown} setOpenDropdown={setOpenDropdown}>
              <NavLink to={AuthenticatedUserRouters.INVESTMENT_PLANS} icon="fa-solid fa-chart-line" text="All Plans" onClose={() => { onClose(); setOpenDropdown(null); }} />
              <NavLink to={AuthenticatedUserRouters.PLAN_REINVEST} icon="fa-solid fa-rotate" text="Plan Reinvestment" onClose={() => { onClose(); setOpenDropdown(null); }} />
              <NavLink to={AuthenticatedUserRouters.PLAN_HISTORY} icon="fa-solid fa-history" text="Plan History" onClose={() => { onClose(); setOpenDropdown(null); }} />
            </SidebarDropdown>

            <SidebarDropdown id="manage-withdrawal" icon="fa-solid fa-money-bill-transfer" text="Manage Withdraw" openDropdown={openDropdown} setOpenDropdown={setOpenDropdown}>
              <NavLink to={AuthenticatedUserRouters.WITHDRAW} icon="fa-solid fa-arrow-right-from-bracket" text="Withdraw" onClose={() => { onClose(); setOpenDropdown(null); }} />
              <NavLink to={AuthenticatedUserRouters.WITHDRAWAL_HISTORY} icon="fa-solid fa-money-bill-transfer" text="Withdrawal History" onClose={() => { onClose(); setOpenDropdown(null); }} />
            </SidebarDropdown>

            <NavLink to={AuthenticatedUserRouters.RANK_REWARD_HISTORY} icon="fa-solid fa-dollar-sign" text="Rank Reward History" onClose={() => { onClose(); setOpenDropdown(null); }} />

            <SidebarDropdown id="income-history" icon="fa-solid fa-hand-holding-dollar" text="Income History" openDropdown={openDropdown} setOpenDropdown={setOpenDropdown}>
              <NavLink to={AuthenticatedUserRouters.INCOME_HISTORY} icon="fa-solid fa-dollar-sign" text="Income History" onClose={() => { onClose(); setOpenDropdown(null); }} />
              <NavLink to={AuthenticatedUserRouters.REFERRAL_INCOME_HISTORY} icon="fa-solid fa-dollar-sign" text="Referral Income" onClose={() => { onClose(); setOpenDropdown(null); }} />
              <NavLink to={AuthenticatedUserRouters.LEVEL_INCOME_HISTORY} icon="fa-solid fa-dollar-sign" text="Level Income" onClose={() => { onClose(); setOpenDropdown(null); }} />
              <NavLink to={AuthenticatedUserRouters.TRADING_INCOME_HISTORY} icon="fa-solid fa-dollar-sign" text="Trading Income" onClose={() => { onClose(); setOpenDropdown(null); }} />
              <NavLink to={AuthenticatedUserRouters.SINGLE_LEG_INCOME} icon="fa-solid fa-dollar-sign" text="Single Leg Income" onClose={() => { onClose(); setOpenDropdown(null); }} />
            </SidebarDropdown>

            <SidebarDropdown id="manage-support" icon="fa-solid fa-headset" text="Manage Support" openDropdown={openDropdown} setOpenDropdown={setOpenDropdown}>
              <NavLink to={AuthenticatedUserRouters.RAISE_TICKET} icon="fa-solid fa-circle-plus" text="Raise Ticket" onClose={() => { onClose(); setOpenDropdown(null); }} />
              <NavLink to={AuthenticatedUserRouters.RAISE_TICKET_HISTORY} icon="fa-solid fa-circle-info" text="Raise Ticket History" onClose={() => { onClose(); setOpenDropdown(null); }} />
            </SidebarDropdown>

            <NavLink to={AuthenticatedUserRouters.PROFILE} icon="fa-solid fa-user" text="Profile" onClose={() => { onClose(); setOpenDropdown(null); }} />
          </>
        )}

        {/* ADMIN ROUTES */}
        {role === "ADMIN" && (
          <>
            <NavLink to={AuthenticatedAdminRouters.ADMIN_DASHBOARD} icon="fa-solid fa-table-columns" text="Dashboard" onClose={() => { onClose(); setOpenDropdown(null); }} />
            <NavLink to={AuthenticatedAdminRouters.ALL_USERS} icon="fa-solid fa-users" text="User Management" onClose={() => { onClose(); setOpenDropdown(null); }} />
            <NavLink to={AuthenticatedAdminRouters.MANAGE_PLANS} icon="fa-solid fa-layer-group" text="Manage Plans" onClose={() => { onClose(); setOpenDropdown(null); }} />
            <NavLink to={AuthenticatedAdminRouters.TOTAL_TRANSACTIONS} icon="fa-solid fa-money-bill-transfer" text="Transactions" onClose={() => { onClose(); setOpenDropdown(null); }} />

            <SidebarDropdown id="manage-withdrawal" icon="fa-solid fa-money-bill-transfer" text="Manage Withdraw" openDropdown={openDropdown} setOpenDropdown={setOpenDropdown}>
              <NavLink to={AuthenticatedAdminRouters.APPROVED_WITHDRAWAL_REQUEST} icon="fa-solid fa-money-bill-transfer" text="Withdrawal History" onClose={() => { onClose(); setOpenDropdown(null); }} />
            </SidebarDropdown>

            <SidebarDropdown id="manage-fund" icon="fa-solid fa-money-bill-transfer" text="Manage Fund" openDropdown={openDropdown} setOpenDropdown={setOpenDropdown}>
              <NavLink to={AuthenticatedAdminRouters.ADD_FUND} icon="fa-solid fa-money-bill-transfer" text="Add Fund" onClose={() => { onClose(); setOpenDropdown(null); }} />
              <NavLink to={AuthenticatedAdminRouters.ADD_FUND_HISTORY} icon="fa-solid fa-money-bill-transfer" text="Fund History" onClose={() => { onClose(); setOpenDropdown(null); }} />
              <NavLink to={AuthenticatedAdminRouters.USER_ADD_FUND_REQUEST} icon="fa-solid fa-money-bill-transfer" text="User Fund Request" onClose={() => { onClose(); setOpenDropdown(null); }} />
              <NavLink to={AuthenticatedAdminRouters.USER_FUND_ACCEPTED} icon="fa-solid fa-money-bill-transfer" text="Accepted User Fund" onClose={() => { onClose(); setOpenDropdown(null); }} />
              <NavLink to={AuthenticatedAdminRouters.USER_FUND_REJECTED} icon="fa-solid fa-money-bill-transfer" text="Rejected User Fund" onClose={() => { onClose(); setOpenDropdown(null); }} />
            </SidebarDropdown>

            <SidebarDropdown id="income-history" icon="fa-solid fa-hand-holding-dollar" text="Income History" openDropdown={openDropdown} setOpenDropdown={setOpenDropdown}>
              <NavLink to={AuthenticatedAdminRouters.INCOME_HISTORY} icon="fa-solid fa-dollar-sign" text="Income History" onClose={() => { onClose(); setOpenDropdown(null); }} />
              <NavLink to={AuthenticatedAdminRouters.REFERRAL_INCOME_HISTORY} icon="fa-solid fa-dollar-sign" text="Referral Income" onClose={() => { onClose(); setOpenDropdown(null); }} />
              <NavLink to={AuthenticatedAdminRouters.LEVEL_INCOME_HISTORY} icon="fa-solid fa-dollar-sign" text="Level Income" onClose={() => { onClose(); setOpenDropdown(null); }} />
              <NavLink to={AuthenticatedAdminRouters.ROI_INCOME} icon="fa-solid fa-dollar-sign" text="Trading Income" onClose={() => { onClose(); setOpenDropdown(null); }} />
              <NavLink to={AuthenticatedAdminRouters.SINGLE_LEG_INCOME} icon="fa-solid fa-dollar-sign" text="Single Leg Income" onClose={() => { onClose(); setOpenDropdown(null); }} />
            </SidebarDropdown>

            <SidebarDropdown id="manage-rankandreward" icon="fa-solid fa-sack-dollar" text="Rank & Reward" openDropdown={openDropdown} setOpenDropdown={setOpenDropdown}>
              <NavLink to={AuthenticatedAdminRouters.RANK_REWARD_HISTORY} icon="fa-solid fa-sack-dollar" text="Rank Reward History" onClose={() => { onClose(); setOpenDropdown(null); }} />
            </SidebarDropdown>

            <SidebarDropdown id="manage-support" icon="fa-solid fa-headset" text="Support" openDropdown={openDropdown} setOpenDropdown={setOpenDropdown}>
              <NavLink to={AuthenticatedAdminRouters.PENDING_TICKETS} icon="fa-solid fa-circle-info" text="Pending Tickets" onClose={() => { onClose(); setOpenDropdown(null); }} />
              <NavLink to={AuthenticatedAdminRouters.CLOSED_TICKETS} icon="fa-solid fa-circle-info" text="Closed Tickets" onClose={() => { onClose(); setOpenDropdown(null); }} />
            </SidebarDropdown>

            <NavLink to={AuthenticatedAdminRouters.CHANGE_PASSWORD} icon="fa-solid fa-lock" text="Change Password" onClose={() => { onClose(); setOpenDropdown(null); }} />
          </>
        )}
      </nav>

      {/* Footer */}
      {/* <div className="pt-2 mt-2 border-t border-cyan-700">
        <div className="">
          <a href="#" className="flex items-center gap-4 px-4 py-2.5 rounded-lg text-cyan-300 hover:bg-cyan-500/10 hover:text-cyan-100 transition-all">
            <i className="fa-solid fa-dollar-sign w-5 text-center"></i> USD
          </a>
          <a href="#" className="flex items-center gap-4 px-4 py-2.5 rounded-lg text-cyan-300 hover:bg-cyan-500/10 hover:text-cyan-100 transition-all">
            <i className="fa-solid fa-flag-usa w-5 text-center"></i> English
          </a>
        </div>
        <div className="flex justify-center gap-6 text-cyan-300">
          <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" className="hover:text-cyan-400 transition-colors text-lg">
            <i className="fa-brands fa-youtube"></i>
          </a>
          <a href="https://t.me" target="_blank" rel="noopener noreferrer" className="hover:text-cyan-400 transition-colors text-lg">
            <i className="fa-brands fa-telegram"></i>
          </a>
          <a href="#" className="hover:text-cyan-400 transition-colors text-lg">
            <i className="fa-brands fa-facebook-f"></i>
          </a>
          <a href="#" className="hover:text-cyan-400 transition-colors text-lg">
            <i className="fa-brands fa-twitter"></i>
          </a>
        </div>
      </div> */}
    </aside>
  );
};

export default Sidebar;
