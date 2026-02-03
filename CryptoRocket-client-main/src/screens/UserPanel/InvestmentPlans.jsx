import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { setLoading } from "../../redux/slices/loadingSlice";
import InvestmentModal from "../../components/Screen/UserPanel/InvestmentModal";
import PlanCard from "../../components/Screen/UserPanel/PlanCard";
import { getPlanInfo } from "../../api/user.api";
import { getMoneySymbol } from "../../utils/additionalFunc";
import DataTable from "../../components/Screen/UserPanel/DataTable";

const InvestmentPlans = () => {
    const dispatch = useDispatch();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedPlan, setSelectedPlan] = useState(null);
    const [plans, setPlans] = useState([]);
    const [viewType, setViewType] = useState("grid"); // 'grid' or 'table'
    const [activeTab, setActiveTab] = useState("ALL"); // 'ALL', 'BASIC', 'ECONOMIC', 'DIAMOND'

    const fetchPlanInfo = async () => {
        try {
            dispatch(setLoading(true));
            const response = await getPlanInfo();
            const rawPlans = response?.data || [];

            const transformedPlans = rawPlans
                .filter((plan) => plan.status !== false)
                .map((plan) => ({
                    _id: plan._id,
                    id: plan.id,
                    title: plan.title,
                    min: plan.minAmount,
                    max: plan.maxAmount || Infinity,
                    dailyRoi: plan.dailyRoi,
                    duration: plan.duration,
                    planType: plan.planType || "BASIC",
                    recommended: plan.planType === "ECONOMIC",
                    features: [
                        `${plan.dailyRoi}% Daily ROI`,
                        `${plan.duration} Days Duration`,
                        `Total Return: ${plan.totalRoi}%`,
                        `Investment: ${getMoneySymbol()}${plan.minAmount} - ${plan.maxAmount ? getMoneySymbol() + plan.maxAmount : "Above"}`,
                        `Category: ${plan.planType || 'BASIC'}`,
                    ],
                    isPlan: true,
                }));

            setPlans(transformedPlans);
        } catch (error) {
            console.error("Error fetching plan info:", error);
            setPlans([]);
        } finally {
            dispatch(setLoading(false));
        }
    };

    useEffect(() => {
        fetchPlanInfo();
    }, []);

    const handleSelectPlan = (plan) => {
        setSelectedPlan(plan);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setSelectedPlan(null);
    };

    const columns = [
        {
            header: "Plan Name",
            accessor: "title",
            cell: (row) => (
                <div className="flex flex-col">
                    <span className="font-bold text-cyan-300 leading-tight">{row.title}</span>
                    <span className="text-[10px] text-cyan-500 font-mono">{row.id || "ID-PLAN"}</span>
                </div>
            ),
        },
        {
            header: "Category",
            accessor: "planType",
            cell: (row) => (
                <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-widest ${row.planType === 'DIAMOND' ? 'bg-blue-700/10 text-blue-400 border border-blue-500/20' :
                    row.planType === 'ECONOMIC' ? 'bg-cyan-700/10 text-cyan-400 border border-cyan-500/20' : 'bg-blue-500/10 text-blue-400 border border-blue-500/20'
                    }`}>
                    {row.planType || 'BASIC'}
                </span>
            ),
        },
        {
            header: "Yield",
            accessor: "dailyRoi",
            cell: (row) => <span className="text-cyan-400 font-black">{row.dailyRoi}%<span className="text-[10px] text-cyan-200 block">DAILY</span></span>,
        },
        {
            header: "Term",
            accessor: "duration",
            cell: (row) => <span className="text-cyan-200 font-bold">{row.duration} <span className="text-[10px] text-cyan-400">DAYS</span></span>,
        },
        {
            header: "Investment (Min/Max)",
            accessor: "min",
            cell: (row) => (
                <div className="flex flex-col">
                    <span className="text-cyan-300 font-bold">{getMoneySymbol()}{row.min}</span>
                    <span className="text-[10px] text-cyan-400 font-medium">To {row.max === Infinity ? "Unlimited" : getMoneySymbol() + row.max}</span>
                </div>
            ),
        },
        {
            header: "Action",
            accessor: "action",
            className: "text-right",
            cell: (row) => (
                <button
                    onClick={() => handleSelectPlan(row)}
                    className="bg-cyan-600 hover:bg-cyan-500 text-white px-6 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all shadow-lg hover:shadow-cyan-600/20"
                >
                    Invest
                </button>
            ),
        },
    ];

    const planTypeDetails = {
        BASIC: {
            title: "Growth Plans",
            description: "Entry-level plans for consistent compounding.",
            color: "text-blue-400",
            bg: "bg-blue-500/5",
            border: "border-blue-500/20",
            icon: "fa-rocket"
        },
        ECONOMIC: {
            title: "Economic Plans",
            description: "Optimized performance with higher yields.",
            color: "text-cyan-400",
            bg: "bg-cyan-500/5",
            border: "border-cyan-500/20",
            icon: "fa-chart-pie"
        },
        DIAMOND: {
            title: "Diamond Plans",
            description: "Premium yield acceleration for high-value assets.",
            color: "text-blue-400",
            bg: "bg-blue-700/5",
            border: "border-blue-500/20",
            icon: "fa-gem"
        }
    };

    const filteredPlans = activeTab === "ALL" ? plans : plans.filter(p => p.planType === activeTab);

    const groupedPlans = filteredPlans.reduce((acc, plan) => {
        const type = plan.planType || "BASIC";
        if (!acc[type]) acc[type] = [];
        acc[type].push(plan);
        return acc;
    }, {});

    const tabs = [
        { id: "ALL", label: "All Plans", icon: "fa-layer-group" },
        { id: "BASIC", label: "Growth", icon: "fa-rocket" },
        { id: "ECONOMIC", label: "Economic", icon: "fa-chart-pie" },
        { id: "DIAMOND", label: "Diamond", icon: "fa-gem" }
    ];

    return (
        <div className="space-y-6 pt-2 pb-8 animate-in fade-in duration-1000">
            <div className="flex flex-col md:flex-row md:justify-between md:items-end gap-4">
                <div>
                    <div className="flex items-center gap-2 mb-2">
                        <span className="px-3 py-1 bg-cyan-500/10 text-cyan-500 rounded-full text-[9px] font-black uppercase tracking-widest border border-cyan-500/20">Active Modules</span>
                        <div className="h-[1px] w-10 bg-slate-800"></div>
                    </div>
                    <h1 className="text-3xl md:text-4xl font-black text-white tracking-tighter leading-none">
                        INVESTMENT <span className="text-cyan-400">PLANS</span>
                    </h1>
                </div>

                <div className="flex items-center gap-4">
                    <div className="bg-slate-900/60 p-1.5 rounded-2xl border border-slate-800 flex backdrop-blur-sm shadow-xl shrink-0">
                        <button
                            onClick={() => setViewType("grid")}
                            className={`px-3 py-1.5 rounded-xl transition-all flex items-center gap-2 ${viewType === "grid" ? "bg-slate-800 text-white border border-slate-700 shadow-lg" : "text-slate-500 hover:text-white"}`}
                        >
                            <i className="fa-solid fa-shapes text-xs"></i>
                            <span className="text-[9px] font-black uppercase tracking-widest">Grid</span>
                        </button>
                        <button
                            onClick={() => setViewType("table")}
                            className={`px-3 py-1.5 rounded-xl transition-all flex items-center gap-2 ${viewType === "table" ? "bg-slate-800 text-white border border-slate-700 shadow-lg" : "text-slate-500 hover:text-white"}`}
                        >
                            <i className="fa-solid fa-list-ul text-xs"></i>
                            <span className="text-[9px] font-black uppercase tracking-widest">Table</span>
                        </button>
                    </div>
                </div>
            </div>

            {/* Premium Category Filter Tabs */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-hide no-scrollbar">
                {tabs.map((tab) => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`px-5 py-2.5 rounded-xl flex items-center gap-2.5 transition-all duration-300 border-2 whitespace-nowrap ${activeTab === tab.id
                            ? "bg-cyan-600/10 border-cyan-600 text-cyan-400 font-black shadow-[0_0_20px_rgba(6,182,212,0.1)]"
                            : "bg-slate-900/40 border-slate-800/40 text-slate-500 hover:text-slate-300 hover:border-slate-700 font-bold"
                            }`}
                    >
                        <i className={`fa-solid ${tab.icon} text-xs`}></i>
                        <span className="text-[10px] uppercase tracking-widest">{tab.label}</span>
                    </button>
                ))}
            </div>

            {viewType === "grid" ? (
                <div className="space-y-10">
                    {Object.keys(groupedPlans).length > 0 ? (
                        ['BASIC', 'ECONOMIC', 'DIAMOND'].map((type) => {
                            const typePlans = groupedPlans[type] || [];
                            if (typePlans.length === 0) return null;

                            return (
                                <div key={type} className="space-y-6 animate-in fade-in slide-in-from-bottom-5 duration-700">
                                    <div className="flex items-center gap-3 relative">
                                        <div className={`w-11 h-11 rounded-xl flex items-center justify-center bg-slate-900 border-2 shadow-inner ${planTypeDetails[type]?.border || "border-slate-800"} ${planTypeDetails[type]?.color || "text-cyan-400"}`}>
                                            <i className={`fa-solid ${planTypeDetails[type]?.icon || 'fa-folder'} text-lg`}></i>
                                        </div>
                                        <div>
                                            <h2 className="text-xl font-black text-white uppercase tracking-tighter">
                                                {planTypeDetails[type]?.title || type}
                                            </h2>
                                        </div>
                                        <div className="hidden md:block flex-1 h-[1px] bg-gradient-to-r from-slate-800 to-transparent ml-4"></div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                        {typePlans.map((plan) => (
                                            <div key={plan._id} className="transform hover:scale-[1.02] transition-all duration-300">
                                                <PlanCard plan={plan} onSelect={handleSelectPlan} />
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            );
                        })
                    ) : (
                        <div className="text-center py-16 bg-slate-900/20 rounded-[2.5rem] border-2 border-dashed border-slate-800/40 backdrop-blur-sm">
                            <div className="w-16 h-16 bg-slate-800/50 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-inner">
                                <i className="fa-solid fa-box-open text-3xl text-slate-600"></i>
                            </div>
                            <p className="text-cyan-300 text-lg font-black uppercase tracking-widest">No Active Plans</p>
                            <p className="text-cyan-400 mt-1 text-sm font-medium">No cycles found in this category.</p>
                        </div>
                    )}
                </div>
            ) : (
                <div className="bg-slate-900/40 backdrop-blur-md rounded-[2rem] border border-slate-800 overflow-hidden shadow-2xl">
                    <DataTable
                        title={`${activeTab === "ALL" ? "Global Market Index" : activeTab + " Tier Ledger"}`}
                        data={filteredPlans}
                        columns={columns}
                        pageSize={15}
                    />
                </div>
            )}

            {isModalOpen && (
                <InvestmentModal
                    plan={selectedPlan}
                    onClose={handleCloseModal}
                    isPlan={true}
                />
            )}
        </div>
    );
};

export default InvestmentPlans;
