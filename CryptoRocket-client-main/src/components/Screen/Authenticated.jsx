import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import {
  AuthenticatedAdminRouters,
  AuthenticatedUserRouters,
} from "../../constants/routes";
import DashboardLayout2 from "../../screens/UserPanel/DashboardLayout2";
import Dashboard1 from "../../screens/UserPanel/Dashboard1";
import InvestmentPage from "../../screens/UserPanel/InvestmentPage";
import ReinvestmentPage from "../../screens/UserPanel/ReinvestmentPage";
import Teams from "../../screens/UserPanel/Teams";
import MyTeamPage from "../../screens/UserPanel/MyTeamPage";
import Referrals from "../../screens/UserPanel/Referrals";
import ProfilePage from "../../screens/UserPanel/ProfilePage";
import { useSelector } from "react-redux";
import MyEarningsPage from "../../screens/UserPanel/MyEarningsPage";
import RequestWithdrawal from "../../screens/UserPanel/RequestWithdrawal";
import AllUsers from "../../screens/AdminPanel/AllUsers";
import ActiveUsers from "../../screens/AdminPanel/ActiveUsers";
import InactiveUsers from "../../screens/AdminPanel/InactiveUsers";
import WithdrawalRequest from "../../screens/AdminPanel/WithdrawalRequest";
import ApprovedWithdrawal from "../../screens/AdminPanel/ApprovedWithdrawal";
import RejectedWithdrawal from "../../screens/AdminPanel/RejectedWithdrawal";
import GlobalAchievers from "../../screens/AdminPanel/GlobalAchievers";
import TotalTransactions from "../../screens/AdminPanel/TotalTransactions";
import TradingList from "../../screens/AdminPanel/TradingList";
import IncomeHistory from "../../screens/AdminPanel/IncomeHistory";
import ReferralIncomeHistory from "../../screens/AdminPanel/ReferralIncomeHistory";
import LevelIncomeHistory from "../../screens/AdminPanel/LevelIncomeHistory";
import MatchingIncomeHistory from "../../screens/AdminPanel/MatchingIncomeHistory";
import ROIIncome from "../../screens/AdminPanel/ROIIncome";
import SingleLegIncome from "../../screens/AdminPanel/SingleLegIncome";
import RankRewardHistory from "../../screens/AdminPanel/RankRewardHistory";
import InvestmentHistoryPage from "../../screens/UserPanel/InvestmentHistoryPage";
import TradingIncomeHistory from "../../screens/UserPanel/TradingIncomeHistory";
import LevelIncomeHistoryPage from "../../screens/UserPanel/LevelIncomeHistoryPage";
import UserGlobalAchievers from "../../screens/UserPanel/UserGlobalAchievers";
import UserMatchingIncomeHistory from "../../screens/UserPanel/UserMatchingIncomeHistory";
import UserReferralIncomeHistory from "../../screens/UserPanel/UserReferralIncomeHistory";
import Transactions from "../../screens/UserPanel/Transactions";
import WithdrawalHistory from "../../screens/UserPanel/WithdrawalHistory";
import UserIncomeHistory from "../../screens/UserPanel/UserIncomeHistory";
import UserTransactions from "../../screens/UserPanel/UserTransactions";
import UserRoiHistory from "../../screens/UserPanel/UserRoiHistory";
import GenerationRoiHistory from "../../screens/UserPanel/GenerationRoiHistory";
import WalletDepositPage from "../../screens/UserPanel/WalletDepositPage";
import DepositWalletHistory from "../../screens/UserPanel/DepositWalletHistory";
import DepositCardPage from "../../screens/UserPanel/DepositCardPage";
import ManagePackage from "../../screens/AdminPanel/ManagePackages";
import AddFund from "../../screens/AdminPanel/AddFund";
import AddFundHistory from "../../screens/AdminPanel/AddFundHistory";
import UserFundRequest from "../../screens/AdminPanel/UserFundRequest";
import UserFundAccepted from "../../screens/AdminPanel/UserFundAccepted";
import UserFundRejected from "../../screens/AdminPanel/UserFundRejected";
import ManageRankAndReward from "../../screens/AdminPanel/ManageRankAndReward";
import GlobalAchieversClub from "../../screens/AdminPanel/GlobalAchieversClub";
import PendingTickets from "../../screens/AdminPanel/PendingTickets";
import ClosedTickets from "../../screens/AdminPanel/ClosedTickets";
import AiTrade from "./UserPanel/AiTrade";
import InvestmentReport from "../../screens/UserPanel/InvestmentReport";
import RaiseTicket from "../../screens/UserPanel/RaiseTicket";
import RaiseTicketHistory from "../../screens/UserPanel/RaiseTicketHistory";
import UserFundTransfer from "../../screens/UserPanel/UserFundTransfer";
import UserFundTransferHistory from "../../screens/UserPanel/UserFundTransferHistory";
import DollarBankPage from "../../screens/UserPanel/DollarBankPage";
import ChangePassword from "../../screens/AdminPanel/ChangePassword";
import UserRankRewardHistory from "../../screens/UserPanel/UserRankRewardHistory";
import DollarBank from "../../screens/AdminPanel/DollarBank";
import DollarBankInvestments from "../../screens/UserPanel/DollarBankInvestments";
import DollarBankWithdrawalRequests from "../../screens/AdminPanel/DollarBankWithdrawalRequests";
import ManagePlans from "../../screens/AdminPanel/ManagePlans";
import InvestmentPlans from "../../screens/UserPanel/InvestmentPlans";
import PlanHistory from "../../screens/UserPanel/PlanHistory";
import PlanReinvestment from "../../screens/UserPanel/PlanReinvestment";
import UserSingleLegIncome from "../../screens/UserPanel/UserSingleLegIncome";
import UserROIIncome from "../../screens/UserPanel/UserROIIncome";

const Authenticated = () => {
  const role = useSelector((state) => state?.isLoggedUser?.role);
  // const role = "ADMIN";
  return (
    <>
      {role === "USER" ? (
        <Routes>
          <Route
            path={AuthenticatedUserRouters.DASHBOARD}
            element={<DashboardLayout2 />}
          >
            <Route index element={<Dashboard1 />} />
            <Route
              path={AuthenticatedUserRouters.MY_TEAM}
              element={<Teams />}
            />
            <Route
              path={AuthenticatedUserRouters.MY_TEAM_DIVISION}
              element={<MyTeamPage />}
            />
            <Route
              path={AuthenticatedUserRouters.MY_REFERRALS}
              element={<Referrals />}
            />
            <Route
              path={AuthenticatedUserRouters.PROFILE}
              element={<ProfilePage />}
            />
            <Route
              path={AuthenticatedUserRouters.WITHDRAW}
              element={<RequestWithdrawal />}
            />
            {/* <Route path={AuthenticatedRoutes.RANK} element={<RankRewardPage />} /> */}
            <Route
              path={AuthenticatedUserRouters.INVEST}
              element={<InvestmentPage />}
            />
            <Route
              path={AuthenticatedUserRouters.INVESTMENT_PLANS}
              element={<InvestmentPlans />}
            />
            <Route
              path={AuthenticatedUserRouters.PLAN_HISTORY}
              element={<PlanHistory />}
            />
            <Route
              path={AuthenticatedUserRouters.PLAN_REINVEST}
              element={<PlanReinvestment />}
            />
            <Route
              path={AuthenticatedUserRouters.REINVEST}
              element={<ReinvestmentPage />}
            />
            <Route
              path={AuthenticatedUserRouters.MY_EARNING}
              element={<MyEarningsPage />}
            />
            <Route
              path={AuthenticatedUserRouters.INVESTMENT_HISTORY}
              element={<InvestmentHistoryPage />}
            />
            <Route
              path={AuthenticatedUserRouters.TRADING_INCOME_HISTORY}
              element={<TradingIncomeHistory />}
            />
            <Route
              path={AuthenticatedUserRouters.RANK_REWARD_HISTORY}
              element={<UserRankRewardHistory />}
            />
            <Route
              path={AuthenticatedUserRouters.LEVEL_INCOME_HISTORY}
              element={<LevelIncomeHistoryPage />}
            />
            <Route
              path={AuthenticatedUserRouters.GLOBAL_ACHIEVERS}
              element={<UserGlobalAchievers />}
            />
            <Route
              path={AuthenticatedUserRouters.MATCHING_INCOME_HISTORY}
              element={<UserMatchingIncomeHistory />}
            />
            <Route
              path={AuthenticatedUserRouters.REFERRAL_INCOME_HISTORY}
              element={<UserReferralIncomeHistory />}
            />
            <Route
              path={AuthenticatedUserRouters.TRANSACTIONS}
              element={<UserTransactions />}
            />
            <Route
              path={AuthenticatedUserRouters.WITHDRAWAL_HISTORY}
              element={<WithdrawalHistory />}
            />
            <Route
              path={AuthenticatedUserRouters.INCOME_HISTORY}
              element={<UserIncomeHistory />}
            />
            <Route
              path={AuthenticatedUserRouters.ROI_HISTORY}
              element={<UserRoiHistory />}
            />
            <Route
              path={AuthenticatedUserRouters.GENERATION_ROI_HISTORY}
              element={<GenerationRoiHistory />}
            />
            <Route
              path={AuthenticatedUserRouters.REQUEST_DEPOSIT}
              element={<WalletDepositPage />}
            />
            <Route
              path={AuthenticatedUserRouters.DEPOSIT_WALLET_HISTORY}
              element={<DepositWalletHistory />}
            />
            <Route
              path={AuthenticatedUserRouters.DEPOSIT_CARD}
              element={<DepositCardPage />}
            />
            <Route
              path={AuthenticatedUserRouters.AI_TRADE}
              element={<AiTrade />}
            />
            <Route
              path={AuthenticatedUserRouters.INVESTMENT_REPORT}
              element={<InvestmentReport />}
            />
            <Route
              path={AuthenticatedUserRouters.RAISE_TICKET}
              element={<RaiseTicket />}
            />
            <Route
              path={AuthenticatedUserRouters.RAISE_TICKET_HISTORY}
              element={<RaiseTicketHistory />}
            />
            <Route
              path={AuthenticatedUserRouters.USER_FUND_TRANSFER}
              element={<UserFundTransfer />}
            />
            <Route
              path={AuthenticatedUserRouters.USER_FUND_TRANSFER_HISTORY}
              element={<UserFundTransferHistory />}
            />
            <Route
              path={AuthenticatedUserRouters.DOLLAR_BANK}
              element={<DollarBankPage />}
            />
            <Route
              path={AuthenticatedUserRouters.DOLLAR_BANK_INVESTMENTS}
              element={<DollarBankInvestments />}
            />
            <Route
              path={AuthenticatedUserRouters.ROI_INCOME}
              element={<UserROIIncome />}
            />
            <Route
              path={AuthenticatedUserRouters.SINGLE_LEG_INCOME}
              element={<UserSingleLegIncome />}
            />
          </Route>

          <Route
            path="*"
            element={
              <Navigate replace to={AuthenticatedUserRouters.DASHBOARD} />
            }
          />
          {/* <Route path={AuthRoutes.HOME} element={<LandingPage />} /> */}
        </Routes>
      ) : (
        <Routes>
          <Route
            path={AuthenticatedAdminRouters.ADMIN_DASHBOARD}
            element={<DashboardLayout2 />}
          >
            <Route index element={<Dashboard1 />} />
            <Route
              path={AuthenticatedAdminRouters.ALL_USERS}
              element={<AllUsers />}
            />
            <Route
              path={AuthenticatedAdminRouters.ACTIVE_USERS}
              element={<ActiveUsers />}
            />
            <Route
              path={AuthenticatedAdminRouters.INACTIVE_USERS}
              element={<InactiveUsers />}
            />
            <Route
              path={AuthenticatedAdminRouters.WITHDRAWAL_REQUEST}
              element={<WithdrawalRequest />}
            />
            <Route
              path={AuthenticatedAdminRouters.APPROVED_WITHDRAWAL_REQUEST}
              element={<ApprovedWithdrawal />}
            />
            <Route
              path={AuthenticatedAdminRouters.REJECTED_WITHDRAWAL_REQUEST}
              element={<RejectedWithdrawal />}
            />
            <Route
              path={AuthenticatedAdminRouters.GLOBAL_ACHIEVERS}
              element={<GlobalAchievers />}
            />
            <Route
              path={AuthenticatedAdminRouters.TOTAL_TRANSACTIONS}
              element={<TotalTransactions />}
            />
            <Route
              path={AuthenticatedAdminRouters.TRADING_LIST}
              element={<TradingList />}
            />
            <Route
              path={AuthenticatedAdminRouters.INCOME_HISTORY}
              element={<IncomeHistory />}
            />
            <Route
              path={AuthenticatedAdminRouters.REFERRAL_INCOME_HISTORY}
              element={<ReferralIncomeHistory />}
            />
            <Route
              path={AuthenticatedAdminRouters.LEVEL_INCOME_HISTORY}
              element={<LevelIncomeHistory />}
            />
            <Route
              path={AuthenticatedAdminRouters.MATCHING_INCOME_HISTORY}
              element={<MatchingIncomeHistory />}
            />
            <Route
              path={AuthenticatedAdminRouters.ROI_INCOME}
              element={<ROIIncome />}
            />
            <Route
              path={AuthenticatedAdminRouters.SINGLE_LEG_INCOME}
              element={<SingleLegIncome />}
            />
            <Route
              path={AuthenticatedAdminRouters.RANK_REWARD_HISTORY}
              element={<RankRewardHistory />}
            />

            <Route
              path={AuthenticatedAdminRouters.MANAGE_PACKAGES}
              element={<ManagePackage />}
            />
            <Route
              path={AuthenticatedAdminRouters.MANAGE_PLANS}
              element={<ManagePlans />}
            />
            <Route
              path={AuthenticatedAdminRouters.ADD_FUND}
              element={<AddFund />}
            />
            <Route
              path={AuthenticatedAdminRouters.ADD_FUND_HISTORY}
              element={<AddFundHistory />}
            />
            <Route
              path={AuthenticatedAdminRouters.USER_ADD_FUND_REQUEST}
              element={<UserFundRequest />}
            />
            <Route
              path={AuthenticatedAdminRouters.USER_FUND_ACCEPTED}
              element={<UserFundAccepted />}
            />
            <Route
              path={AuthenticatedAdminRouters.USER_FUND_REJECTED}
              element={<UserFundRejected />}
            />
            <Route
              path={AuthenticatedAdminRouters.MANAGE_RANK_AND_REWARD}
              element={<ManageRankAndReward />}
            />
            <Route
              path={AuthenticatedAdminRouters.MANAGE_GLOBAL_ACHIEVERS_CLUB}
              element={<GlobalAchieversClub />}
            />
            <Route
              path={AuthenticatedAdminRouters.PENDING_TICKETS}
              element={<PendingTickets />}
            />
            <Route
              path={AuthenticatedAdminRouters.CLOSED_TICKETS}
              element={<ClosedTickets />}
            />
            <Route
              path={AuthenticatedAdminRouters.CHANGE_PASSWORD}
              element={<ChangePassword />}
            />
            <Route
              path={AuthenticatedAdminRouters.DOLLAR_BANK}
              element={<DollarBank />}
            />
            <Route
              path={AuthenticatedAdminRouters.DOLLAR_BANK_WITHDRAWAL_REQUESTS}
              element={<DollarBankWithdrawalRequests />}
            />
          </Route>

          <Route
            path="*"
            element={
              <Navigate replace to={AuthenticatedUserRouters.DASHBOARD} />
            }
          />
          {/* <Route path={AuthRoutes.HOME} element={<LandingPage />} /> */}
        </Routes>
      )}
    </>
  );
};

export default Authenticated;
