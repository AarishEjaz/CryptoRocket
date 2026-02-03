import React, { useEffect, useState } from "react";
import { setLoading } from "../../redux/slices/loadingSlice";
import DataTable from "../../components/Screen/UserPanel/DataTable";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import { NumberFormatCommas } from "../../utils/FormatText";
import { useLocation } from "react-router-dom";
import { isToday } from "../../utils/helper";
import { getPlanInvestmentHistory } from "../../api/user.api";
import { getMoneySymbol } from "../../utils/additionalFunc";

const PlanHistory = () => {
    const [allTransactions, setAllTransactions] = useState([]);
    const [summary, setSummary] = useState({ total: 0, count: 0 });
    const dispatch = useDispatch();
    const location = useLocation();
    const data = location?.state;

    const fetchHistory = async () => {
        try {
            dispatch(setLoading(true));
            const response = await getPlanInvestmentHistory();
            if (response?.success) {
                const history = response?.data?.history || [];
                setAllTransactions(history);
                const total = history.reduce((acc, curr) => acc + (curr.investment || 0), 0);
                setSummary({ total, count: history.length });
            } else {
                toast.error(response?.message || "Something went wrong");
            }
        } catch (err) {
            console.error(err);
            toast.error("Failed to fetch history");
        } finally {
            dispatch(setLoading(false));
        }
    };

    useEffect(() => {
        fetchHistory();
    }, []);

    const filteredHistory =
        data === "today"
            ? allTransactions.filter((item) => isToday(new Date(item.createdAt)))
            : allTransactions;

    const columns = [
        {
            header: "Transaction ID",
            accessor: "id",
            cell: (row) => <span className="font-mono text-[10px] text-slate-500">{row?.id || row?._id}</span>,
        },
        {
            header: "Plan",
            accessor: "plan.title",
            cell: (row) => (
                <div className="flex flex-col">
                    <span className="text-white font-bold">{row?.plan?.title || "Growth Plan"}</span>
                    <span className={`text-[10px] font-bold uppercase tracking-wider ${row?.plan?.planType === 'DIAMOND' ? 'text-purple-400' :
                        row?.plan?.planType === 'ECONOMIC' ? 'text-emerald-400' : 'text-blue-400'
                        }`}>
                        {row?.plan?.planType || 'BASIC'}
                    </span>
                </div>
            ),
        },
        {
            header: "Type",
            accessor: "type",
            cell: (row) => (
                <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-widest ${row.type === "Deposit" ? "bg-blue-500/10 text-blue-400 border border-blue-500/20" : "bg-purple-500/10 text-purple-400 border border-purple-500/20"
                    }`}>
                    {row?.type === "Deposit" ? "INITIAL" : "REINVEST"}
                </span>
            ),
        },
        {
            header: "Amount",
            accessor: "investment",
            cell: (row) => (
                <span className="font-black text-white text-base">
                    {getMoneySymbol()}
                    <NumberFormatCommas value={row?.investment || 0} />
                </span>
            ),
        },
        {
            header: "Date",
            accessor: "createdAt",
            cell: (row) => (
                <span className="text-slate-500 text-xs text-nowrap">
                    {new Date(row?.createdAt)?.toLocaleDateString('en-US', { day: '2-digit', month: 'short', year: 'numeric' })}
                </span>
            ),
        },
        {
            header: "ROI Status",
            accessor: "status",
            className: "text-right",
            cell: (row) => (
                <span className="px-3 py-1 bg-blue-500/10 text-blue-400 border border-blue-500/20 rounded-full text-[10px] font-bold">
                    EARNING
                </span>
            ),
        },
    ];

    return (
        <div className="space-y-8 animate-in fade-in duration-700">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-black text-white tracking-tight leading-none">PLAN <span className="text-blue-500">HISTORY</span></h1>
                    <p className="text-slate-500 mt-2 text-sm">Detailed log of your specialized investment operations.</p>
                </div>

                <div className="flex gap-4">
                    <div className="bg-slate-900/60 border border-slate-800 p-4 rounded-2xl min-w-[150px] backdrop-blur-sm shadow-lg">
                        <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">Total Assets</p>
                        <p className="text-xl font-black text-white">{getMoneySymbol()}<NumberFormatCommas value={summary.total} /></p>
                    </div>
                    <div className="bg-slate-900/60 border border-slate-800 p-4 rounded-2xl min-w-[100px] backdrop-blur-sm shadow-lg">
                        <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">Cycles</p>
                        <p className="text-xl font-black text-blue-500">{summary.count}</p>
                    </div>
                </div>
            </div>

            <div className="bg-slate-900/40 backdrop-blur-md border border-slate-800 rounded-[2rem] overflow-hidden shadow-2xl">
                <DataTable
                    title="Plan Operation Ledger"
                    columns={columns}
                    data={filteredHistory}
                    pageSize={10}
                />
            </div>
        </div>
    );
};

export default PlanHistory;
