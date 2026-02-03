import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { getMoneySymbol } from "../../utils/additionalFunc";
import { NumberFormatCommas } from "../../utils/FormatText";
import { setLoading } from "../../redux/slices/loadingSlice";
import Tabs from "../../components/Screen/UserPanel/Tabs";
import StatCard from "../../components/Screen/UserPanel/StatCard";
import DataTable from "../../components/Screen/UserPanel/DataTable";
import { getIncomeTotal } from "../../api/auth.api";
import { getEarningHistory } from "../../api/user.api";

const MyEarningsPage = () => {
  const [activeTab, setActiveTab] = useState("my-earnings");
  const [totalIncome, setTotalIncome] = useState(null);
  const [earningsReportData, setEarningsReportData] = useState(null);
  const dispatch = useDispatch();

  const reportColumns = [
    {
      header: "Event ID",
      accessor: "id",
      cell: (row) => <span className="font-medium text-white">{row.id}</span>,
    },
    {
      header: "Type",
      accessor: "type",
      cell: (row) => <span className="text-slate-300">{row.type}</span>,
    },
    {
      header: "detail",
      accessor: "type",
      cell: (row) => (
        <span className="text-slate-300">
          {row.type === "Trading" ? (
            <span className="text-slate-300 capitalize">{`${
              row?.user?.username
            } invested $${row?.amount?.toFixed(2)} in ${
              row?.package?.title
            } package and earned ${row?.percentage?.toFixed(
              2
            )}% ($${row?.income?.toFixed(2)}) income.`}</span>
          ) : row.type === "Direct" ? (
            <span className="text-slate-300 capitalize">{`${
              row?.user?.username
            } earned ${row?.percentage?.toFixed(
              2
            )}% from ${
              row?.fromUser?.username
            } ${row?.package?.title} ($${row?.income?.toFixed(2)})  package as a ${
              row?.type
            } referral reward.`}</span>
          ) : (
            "N/A"
          )}
        </span>
      ),
    },
    {
      header: "Earning",
      accessor: "income",
      cell: (row) => (
        <span className="font-semibold text-blue-400">
          {getMoneySymbol()}
          <NumberFormatCommas value={row.income} />
        </span>
      ),
    },
    {
      header: "Date",
      accessor: "date",
      cell: (row) => (
        <span className="text-slate-300">{new Date(row.createdAt).toLocaleDateString}</span>
      ),
    },
  ];

  useEffect(() => {
    const fetchIncomeTotal = async () => {
      try {
        dispatch(setLoading(true));
        const response = await getIncomeTotal();
        setTotalIncome(response?.data);
      } catch (err) {
        console.log(err);
      } finally {
        dispatch(setLoading(false));
      }
    };
    fetchIncomeTotal();
  }, []);

  useEffect(() => {
    const fetchEarningHistory = async () => {
      try {
        dispatch(setLoading(true));
        const response = await getEarningHistory();
        setEarningsReportData(response?.data);
      } catch (err) {
        console.log(err);
      } finally {
        dispatch(setLoading(false));
      }
    };
    // fetchEarningHistory();
  }, []);

  const tabs = [
    { id: "my-earnings", label: "My Earnings", icon: "fa-wallet" },
    // { id: "earnings-report", label: "Earnings Report", icon: "fa-file-alt" },
  ];

  const revenueOverview = [
    { title: 'Total Partners', value: `${Number(totalIncome?.partners ?? 0)}`, icon: 'https://img.icons8.com/3d-fluency/94/conference-call.png' },
    { title: 'Active Partners', value: `${Number(totalIncome?.partnerActive ?? 0)}`, icon: 'https://img.icons8.com/3d-fluency/94/ok.png' },
    { title: 'Inactive Partners', value: `${Number(totalIncome?.partnerInactive ?? 0)}`, icon: 'https://img.icons8.com/3d-fluency/94/group--v3.png' },
    { title: 'Total Downline Users', value: `${Number(totalIncome?.totalDownlineUsers ?? 0)}`, icon: 'https://img.icons8.com/3d-fluency/94/user-group-woman-woman--v3.png' },
    { title: 'Total Trading Income', value: `$ ${Number(totalIncome?.currentIncome ?? 0).toFixed(2)}`, icon: 'https://img.icons8.com/3d-fluency/94/receive-cash.png' },
    { title: 'Today Trading Income', value: `$ ${Number(totalIncome?.todayTrading ?? 0).toFixed(2)}`, icon: 'https://img.icons8.com/3d-fluency/94/money.png' },
    { title: 'Total Level Income', value: `$ ${Number(totalIncome?.totalLevel ?? 0).toFixed(2)}`, icon: 'https://cdn-icons-png.flaticon.com/512/10102/10102408.png' },
    { title: 'Today Level Income', value: `$ ${Number(totalIncome?.todayLevel ?? 0).toFixed(2)}`, icon: 'https://img.icons8.com/isometric/50/economic-improvement--v1.png' },
    { title: 'Total Global Achievers', value: `${Number(totalIncome?.totalGlobalAchiever ?? 0).toFixed(2)}`, icon: 'https://img.icons8.com/3d-fluency/94/medal.png' },
    { title: 'Today Global Achievers', value: `${Number(totalIncome?.todayGlobalAchiever ?? 0).toFixed(2)}`, icon: 'https://img.icons8.com/3d-fluency/94/prize.png' },
    { title: 'Total Matching Income', value: `$ ${Number(totalIncome?.totalMatching ?? 0).toFixed(2)}`, icon: 'https://img.icons8.com/3d-fluency/94/combo-chart.png' },
    { title: 'Today Matching Income', value: `$ ${Number(totalIncome?.todayMatching ?? 0).toFixed(2)}`, icon: 'https://img.icons8.com/3d-fluency/94/increase.png' },
    { title: 'Total Referrals Income', value: `$ ${Number(totalIncome?.totalReferral ?? 0).toFixed(2)}`, icon: 'https://img.icons8.com/3d-fluency/94/group.png' },
    { title: 'Today Referrals Income', value: `$ ${Number(totalIncome?.todayReferral ?? 0).toFixed(2)}`, icon: 'https://img.icons8.com/3d-plastilina/69/share--v1.png' },
    { title: 'Total Investement', value: `$ ${Number(totalIncome?.totalTransaction ?? 0).toFixed(2)}`, icon: 'https://img.icons8.com/3d-fluency/94/transaction.png' },
    { title: 'Today Investement', value: `$ ${Number(totalIncome?.todayTransaction ?? 0).toFixed(2)}`, icon: 'https://img.icons8.com/3d-fluency/94/exchange.png' },
    { title: 'Total Team Transaction', value: `$ ${Number(totalIncome?.totalTeamTransaction ?? 0).toFixed(2)}`, icon: 'https://img.icons8.com/color/48/transaction.png' },
    { title: 'Today Team Transaction', value: `$ ${Number(totalIncome?.todayTeamTransaction ?? 0).toFixed(2)}`, icon: 'https://img.icons8.com/pulsar-gradient/48/refund-2.png' },
    { title: 'Total Withdrawals', value: `$ ${Number(totalIncome?.totalWithdraw ?? 0).toFixed(2)}`, icon: 'https://img.icons8.com/3d-fluency/94/money-bag.png' },
    { title: 'Today Withdrawals', value: `$ ${Number(totalIncome?.todayWithdraw ?? 0).toFixed(2)}`, icon: 'https://img.icons8.com/isometric/50/card-in-use.png' },
    { title: 'Total Income', value: `$ ${Number(totalIncome?.totalIncome ?? 0).toFixed(2)}`, icon: 'https://img.icons8.com/3d-fluency/94/sales-performance.png' },
    { title: 'Today Income', value: `$ ${Number(totalIncome?.todayIncome ?? 0).toFixed(2)}`, icon: 'https://img.icons8.com/3d-fluency/94/money-transfer.png' },
    { title: 'Today Live A/C Income', value: `$ ${Number(totalIncome?.todayLiveTrading ?? 0).toFixed(2)}`, icon: 'https://img.icons8.com/3d-fluency/94/account-1.png' },
    { title: 'Total Live A/C Income', value: `$ ${Number(totalIncome?.totalLiveTrading ?? 0).toFixed(2)}`, icon: 'https://img.icons8.com/3d-fluency/94/change-user.png' },
  ];

  return (
    <div className="space-y-8 mt-6">
      <div>
        <h1 className="text-3xl font-bold text-white">My Earnings</h1>
        <p className="text-slate-400 mt-1">
          Track your earnings and view detailed transaction reports.
        </p>
      </div>

      <Tabs tabs={tabs} activeTab={activeTab} onTabClick={setActiveTab} />

      <div>
        {activeTab === "my-earnings" && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 animate-fade-in">
            {revenueOverview?.map((item, index) => (
              <StatCard
                key={index}
                title={item.title}
                value={item.value}
                icon={item.icon}
                isMoney={item.isMoney}
              />
            ))}
          </div>
        )}

        {/* {activeTab === "earnings-report" && (
          <div className="animate-fade-in">
            <DataTable
              title="Detailed Earnings Report"
              columns={reportColumns}
              data={earningsReportData}
              pageSize={10}
            />
          </div>
        )} */}
      </div>
    </div>
  );
};

export default MyEarningsPage;
