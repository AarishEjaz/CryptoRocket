import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import Transactions from "./Transactions";
import StatCard from "../../components/Screen/UserPanel/StatCard";
import EarningsChart from "../../components/Screen/UserPanel/EarningsChart";
import ProfileCard from "../../components/Screen/UserPanel/ProfileCard";
import { getIncomeTotal, getTransactionHistory } from "../../api/auth.api";
import { setLoading } from "../../redux/slices/loadingSlice";
import { toast } from "react-toastify";

import {
  getIncomeTotalForAdmin,
  getIncomeTotalForAdminIncome,
  getTransactionHistoryForAdmin,
} from "../../api/admin.api";

import {
  AuthenticatedAdminRouters,
  AuthenticatedUserRouters,
} from "../../constants/routes";
import aiTradeBg from "../../assets/Landing/ai-trade.jpg";
import { Bot, TrendingUp } from "lucide-react";

const Dashboard1 = () => {
  const [transactionHistory, setTransactionHistory] = useState(null);
  const role = useSelector((state) => state?.isLoggedUser?.role);
  const access = localStorage.getItem("access");

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const fetchTransactionHistory = async () => {
    try {
      dispatch(setLoading(true));
      if (role === "USER") {
        const response = await getTransactionHistory();
        setTransactionHistory(response?.data);
      } else if (role === "ADMIN") {
        const response = await getTransactionHistoryForAdmin();
        setTransactionHistory(response?.data);
      }
    } catch (err) {
      console.log(err);
      toast.error("Failed to fetch transactions.");
    } finally {
      dispatch(setLoading(false));
    }
  };

  useEffect(() => {
    fetchTransactionHistory();
  }, [role]);

  const [totalIncome, setTotalIncome] = useState(null);

  useEffect(() => {
    const fetchIncomeTotal = async () => {
      try {
        dispatch(setLoading(true));
        if (role === "USER") {
          const userResponse = await getIncomeTotal();
          setTotalIncome(userResponse);
        } else {
          const adminIncomeResponse = await getIncomeTotalForAdminIncome();
          const adminTotalResponse = await getIncomeTotalForAdmin();
          setTotalIncome({ ...adminTotalResponse, ...adminIncomeResponse?.data });
        }
      } catch (err) {
        console.log("Error fetching income:", err);
        toast.error("Failed to fetch income data.");
      } finally {
        dispatch(setLoading(false));
      }
    };

    fetchIncomeTotal();
  }, [dispatch, access, role]);

  const revenueOverview = [
    {
      title: "Total Investment",
      value: `$ ${Number(totalIncome?.user?.investment ?? 0).toFixed(2)}`,
      icon: "https://img.icons8.com/3d-fluency/94/exchange.png",
      path: AuthenticatedUserRouters.INVESTMENT_HISTORY,
    },
    {
      title: "Today Deposits",
      value: `$ ${Number(totalIncome?.deposits?.today ?? 0).toFixed(2)}`,
      icon: "https://img.icons8.com/3d-fluency/94/money-transfer.png",
      path: AuthenticatedUserRouters.INVESTMENT_HISTORY,
      data: "today",
    },
    {
      title: "Total Downline Users",
      value: `${Number(totalIncome?.data?.totalDownlineUsers ?? 0)}`,
      icon: "https://img.icons8.com/3d-fluency/94/user-group-woman-woman--v3.png",
      path: AuthenticatedUserRouters.MY_TEAM,
    },
    {
      title: "Direct Partners",
      value: `${Number(totalIncome?.user?.directs ?? 0)}`,
      icon: "https://img.icons8.com/3d-fluency/94/group.png",
      path: AuthenticatedUserRouters.MY_REFERRALS,
    },
    {
      title: "Current Level",
      value: `Level ${Number(totalIncome?.user?.currentLevel ?? 0)}`,
      icon: "https://img.icons8.com/3d-fluency/94/trophy.png",
      path: AuthenticatedUserRouters.MY_TEAM,
    },
    {
      title: "Current Rank",
      value: `${totalIncome?.rank?.current ?? 'No Rank'}`,
      icon: "https://img.icons8.com/3d-fluency/94/medal.png",
      path: AuthenticatedUserRouters.RANK_REWARD_HISTORY,
    },
    {
      title: "Total Income",
      value: `$ ${Number(totalIncome?.incomes?.total ?? 0).toFixed(2)}`,
      icon: "https://img.icons8.com/3d-fluency/94/stack-of-coins.png",
      path: AuthenticatedUserRouters.INCOME_HISTORY,
    },
    {
      title: "Today Income",
      value: `$ ${Number(totalIncome?.incomes?.today ?? 0).toFixed(2)}`,
      icon: "https://img.icons8.com/3d-fluency/94/money-transfer.png",
      path: AuthenticatedUserRouters.INCOME_HISTORY,
      data: "today",
    },
    {
      title: "Total Level Income",
      value: `$ ${Number(totalIncome?.incomes?.level?.total ?? 0).toFixed(2)}`,
      icon: "https://img.icons8.com/3d-fluency/94/bar-chart.png",
      path: AuthenticatedUserRouters.LEVEL_INCOME_HISTORY,
    },
    {
      title: "Total Referral Income",
      value: `$ ${Number(totalIncome?.incomes?.referral?.total ?? 0).toFixed(2)}`,
      icon: "https://img.icons8.com/3d-plastilina/69/share--v1.png",
      path: AuthenticatedUserRouters.REFERRAL_INCOME_HISTORY,
    },
  ];

  const cardData = [
    {
      title: "All Users",
      value: `${Number(totalIncome?.users ?? 0)}`,
      icon: "https://img.icons8.com/3d-fluency/94/group--v2.png",
      path: AuthenticatedAdminRouters.ALL_USERS,
    },
    {
      title: "Active Users",
      value: `${Number(totalIncome?.userActive ?? 0)}`,
      icon: "https://img.icons8.com/3d-fluency/94/group.png",
      path: AuthenticatedAdminRouters.ALL_USERS,
      data: "active",
    },
    {
      title: "Inactive Users",
      value: `${Number(totalIncome?.userInactive ?? 0)}`,
      icon: "https://img.icons8.com/3d-fluency/94/group--v4.png",
      path: AuthenticatedAdminRouters.ALL_USERS,
      data: "inactive",
    },
    {
      title: "Today Income",
      value: `$ ${Number(totalIncome?.todayIncome ?? 0).toFixed(2)}`,
      icon: "https://img.icons8.com/3d-fluency/94/cash-in-hand.png",
      path: AuthenticatedAdminRouters.INCOME_HISTORY,
      data: "today",
    },
    {
      title: "Total Income",
      value: `$ ${Number(totalIncome?.totalIncome ?? 0).toFixed(2)}`,
      icon: "https://img.icons8.com/3d-fluency/94/stack-of-coins.png",
      path: AuthenticatedAdminRouters.INCOME_HISTORY,
    },
  ];

  return (
    <div className="space-y-8 min-h-screen p-6 bg-[#0f172a] text-cyan-100">
      {role === "USER" && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {revenueOverview.map((item) => (
            <StatCard
              key={item.title}
              title={item.title}
              value={item.value}
              iconImage={item.icon}
              path={item.path}
              data={item.data}
            />
          ))}
        </div>
      )}

      {role === "USER" && (
        <div
          className="w-full relative h-64 rounded-2xl overflow-hidden flex items-center justify-between px-8 bg-cyan-900/30 backdrop-blur-md shadow-lg"
          style={{
            backgroundImage: `url(${aiTradeBg})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          <div className="absolute inset-0 bg-cyan-900/70"></div>
          <div className="relative z-10 w-full lg:w-2/3 text-left">
            <h3 className="text-3xl font-bold text-cyan-400 mb-3 drop-shadow-lg">
              AI Trading Platform
            </h3>
            <p className="text-cyan-200 text-lg mb-6 max-w-2xl">
              Advanced AI algorithms for automated trading and maximum returns.
            </p>
            <button
              onClick={() => navigate(AuthenticatedUserRouters.AI_TRADE)}
              className="bg-cyan-500 hover:bg-cyan-400 text-[#0f172a] font-semibold px-6 py-3 rounded-lg flex items-center gap-3 shadow-md hover:shadow-cyan-400/50 transition-all"
            >
              <Bot className="w-6 h-6" />
              Launch AI Trade Bot
              <TrendingUp className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}

      {role === "ADMIN" && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {cardData.map((item) => (
            <StatCard
              key={item.title}
              title={item.title}
              value={item.value}
              iconImage={item.icon}
              path={item.path}
              data={item.data}
            />
          ))}
        </div>
      )}

      {role === "USER" && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          <div className="lg:col-span-2 bg-cyan-900/20 rounded-2xl p-6 shadow-lg">
            <EarningsChart />
          </div>
          <div className="lg:col-span-1 bg-cyan-900/20 rounded-2xl p-6 shadow-lg">
            <ProfileCard />
          </div>
        </div>
      )}

      <div className="bg-cyan-900/20 rounded-2xl p-6 shadow-lg">
        <Transactions history={transactionHistory} />
      </div>
    </div>
  );
};

export default Dashboard1;
