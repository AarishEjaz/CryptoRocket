import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { setLoading } from "../../redux/slices/loadingSlice";
import PlanCard from "../../components/Screen/UserPanel/PlanCard";
import {
    getPlanInfoAdmin,
    updatePlanAdmin,
    createPlanAdmin,
    deletePlanAdmin,
} from "../../api/admin.api";
import { getMoneySymbol } from "../../utils/additionalFunc";
import { toast } from "react-toastify";
import Swal from "sweetalert2";
import DataTable from "../../components/Screen/UserPanel/DataTable";

const ManagePlans = () => {
    const dispatch = useDispatch();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedPlan, setSelectedPlan] = useState(null);
    const [plans, setPlans] = useState([]);
    const [isCreateMode, setIsCreateMode] = useState(false);
    const [viewType, setViewType] = useState("grid"); // 'grid' or 'table'

    const [formData, setFormData] = useState({
        planType: "BASIC",
        title: "",
        duration: 30,
        minAmount: "",
        maxAmount: "",
        dailyRoi: "",
        status: true,
    });

    const fetchPlans = async () => {
        try {
            dispatch(setLoading(true));
            const response = await getPlanInfoAdmin();
            const rawPlans = response?.data || [];

            const transformedPlans = rawPlans.map((plan) => ({
                _id: plan._id,
                id: plan.id,
                planType: plan.planType,
                title: plan.title,
                min: plan.minAmount,
                max: plan.maxAmount,
                duration: plan.duration,
                dailyRoi: plan.dailyRoi,
                totalRoi: plan.totalRoi,
                status: plan.status,
                recommended: plan.planType === "ECONOMIC",
                features: [
                    `${plan.dailyRoi}% Daily ROI`,
                    `${plan.duration} Days Duration`,
                    `Total Return: ${plan.totalRoi}%`,
                    `Investment: ${getMoneySymbol()}${plan.minAmount} - ${plan.maxAmount || "Above"}`,
                    `Type: ${plan.planType}`,
                ],
            }));

            setPlans(transformedPlans);
        } catch (error) {
            console.error("Error fetching plans:", error);
            toast.error("Failed to fetch plans");
        } finally {
            dispatch(setLoading(false));
        }
    };

    useEffect(() => {
        fetchPlans();
    }, []);

    const handleSelectPlan = (plan) => {
        setSelectedPlan(plan);
        setIsModalOpen(true);
        setIsCreateMode(false);
        setFormData({
            planType: plan.planType,
            title: plan.title,
            duration: plan.duration,
            minAmount: plan.min,
            maxAmount: plan.max || "",
            dailyRoi: plan.dailyRoi,
            status: plan.status,
        });
    };

    const handleCreateNew = () => {
        setSelectedPlan(null);
        setIsModalOpen(true);
        setIsCreateMode(true);
        setFormData({
            planType: "BASIC",
            title: "",
            duration: 30,
            minAmount: "",
            maxAmount: "",
            dailyRoi: "",
            status: true,
        });
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setSelectedPlan(null);
    };

    const handleFormChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value,
        }));
    };

    const handleFormSubmit = async (e) => {
        e.preventDefault();

        if (!formData.title || !formData.minAmount || formData.dailyRoi === "") {
            toast.error("Please fill all required fields");
            return;
        }

        const payload = {
            ...formData,
            minAmount: parseFloat(formData.minAmount),
            maxAmount: formData.maxAmount ? parseFloat(formData.maxAmount) : null,
            duration: parseInt(formData.duration),
            dailyRoi: parseFloat(formData.dailyRoi),
        };

        try {
            dispatch(setLoading(true));
            let res;
            if (isCreateMode) {
                res = await createPlanAdmin(payload);
            } else {
                res = await updatePlanAdmin(selectedPlan._id, payload);
            }

            if (res?.success) {
                toast.success(res.message);
                handleCloseModal();
                fetchPlans();
            } else {
                toast.error(res?.message || "Something went wrong");
            }
        } catch (error) {
            toast.error("Operation failed");
        } finally {
            dispatch(setLoading(false));
        }
    };

    const handleDeletePlan = async (id) => {
        const result = await Swal.fire({
            title: "Are you sure?",
            text: "You won't be able to revert this!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#d33",
            cancelButtonColor: "#3085d6",
            confirmButtonText: "Yes, delete it!",
        });

        if (result.isConfirmed) {
            try {
                dispatch(setLoading(true));
                const res = await deletePlanAdmin(id);
                if (res?.success) {
                    toast.success(res.message);
                    fetchPlans();
                } else {
                    toast.error(res?.message || "Deletion failed");
                }
            } catch (error) {
                toast.error("Deletion failed");
            } finally {
                dispatch(setLoading(false));
            }
        }
    };

    const columns = [
        {
            header: "S/N",
            accessor: "_id",
            cell: (_, rowIndex) => (
                <span className="font-medium text-white">{rowIndex + 1}</span>
            ),
        },
        {
            header: "Title",
            accessor: "title",
            cell: (row) => <span className="font-medium text-white">{row.title}</span>,
        },
        {
            header: "Plan Type",
            accessor: "planType",
            cell: (row) => (
                <span className="px-2 py-1 rounded-full text-xs font-semibold bg-blue-500/20 text-blue-400 border border-blue-500/30">
                    {row.planType}
                </span>
            ),
        },
        {
            header: "Min ($)",
            accessor: "min",
            cell: (row) => <span className="text-white">{row.min}</span>,
        },
        {
            header: "Max ($)",
            accessor: "max",
            cell: (row) => <span className="text-white">{row.max || "∞"}</span>,
        },
        {
            header: "Daily (%)",
            accessor: "dailyRoi",
            cell: (row) => <span className="text-white font-semibold text-blue-400">{row.dailyRoi}%</span>,
        },
        {
            header: "Duration",
            accessor: "duration",
            cell: (row) => <span className="text-white">{row.duration} Days</span>,
        },
        {
            header: "Status",
            accessor: "status",
            cell: (row) => (
                <span className={`px-2 py-1 rounded-full text-xs font-semibold ${row.status ? "bg-blue-500/20 text-blue-400 border border-blue-500/30" : "bg-red-500/20 text-red-400 border border-red-500/30"}`}>
                    {row.status ? "Active" : "Inactive"}
                </span>
            ),
        },
        {
            header: "Actions",
            accessor: "actions",
            cell: (row) => (
                <div className="flex gap-2">
                    <button
                        onClick={() => handleSelectPlan(row)}
                        className="p-2 rounded bg-blue-600 hover:bg-blue-500 text-white transition-colors"
                        title="Edit Plan"
                    >
                        <i className="fa-solid fa-pen-to-square"></i>
                    </button>
                    <button
                        onClick={() => handleDeletePlan(row._id)}
                        className="p-2 rounded bg-red-600 hover:bg-red-500 text-white transition-colors"
                        title="Delete Plan"
                    >
                        <i className="fa-solid fa-trash"></i>
                    </button>
                </div>
            ),
        },
    ];

    return (
        <div className="space-y-8 pt-4">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-white">Manage Investment Plans</h1>
                    <p className="text-slate-400 mt-1">
                        Configure Basic, Economic, and Diamond Growth Plans.
                    </p>
                </div>
                <div className="flex items-center gap-4">
                    <div className="bg-slate-800 p-1 rounded-lg border border-slate-700 flex">
                        <button
                            onClick={() => setViewType("grid")}
                            className={`px-4 py-2 rounded-md transition-all flex items-center gap-2 ${viewType === "grid" ? "bg-blue-600 text-white shadow-lg shadow-blue-600/20" : "text-slate-400 hover:text-white"}`}
                        >
                            <i className="fa-solid fa-grip"></i>
                            <span className="text-sm font-medium">Cards</span>
                        </button>
                        <button
                            onClick={() => setViewType("table")}
                            className={`px-4 py-2 rounded-md transition-all flex items-center gap-2 ${viewType === "table" ? "bg-blue-600 text-white shadow-lg shadow-blue-600/20" : "text-slate-400 hover:text-white"}`}
                        >
                            <i className="fa-solid fa-table-list"></i>
                            <span className="text-sm font-medium">Table</span>
                        </button>
                    </div>
                    <button
                        onClick={handleCreateNew}
                        className="bg-blue-600 hover:bg-blue-500 text-white px-6 py-2.5 rounded-lg font-semibold transition-all shadow-lg shadow-blue-600/20 flex items-center gap-2 active:scale-95"
                    >
                        <i className="fa-solid fa-plus"></i>
                        New Plan
                    </button>
                </div>
            </div>

            {viewType === "grid" ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {plans.map((plan) => (
                        <div key={plan._id} className="relative group">
                            <PlanCard
                                plan={plan}
                                onSelect={() => handleSelectPlan(plan)}
                                isAdmin={true}
                            />
                            <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                <button
                                    onClick={() => handleSelectPlan(plan)}
                                    className="bg-blue-600 hover:bg-blue-500 text-white p-2 rounded-lg transition-colors shadow-lg"
                                    title="Edit Plan"
                                >
                                    <i className="fa-solid fa-pen"></i>
                                </button>
                                <button
                                    onClick={() => handleDeletePlan(plan._id)}
                                    className="bg-red-600 hover:bg-red-500 text-white p-2 rounded-lg transition-colors shadow-lg"
                                    title="Delete Plan"
                                >
                                    <i className="fa-solid fa-trash"></i>
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="bg-slate-900/50 rounded-2xl border border-slate-800 p-4">
                    <DataTable
                        data={plans}
                        columns={columns}
                    />
                </div>
            )}

            {isModalOpen && (
                <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4">
                    <div className="bg-slate-900 p-6 rounded-lg shadow-lg w-full max-w-md max-h-[90vh] overflow-y-auto">
                        <h2 className="text-xl font-semibold text-white mb-4">
                            {isCreateMode ? "Create New Plan" : "Edit Plan"}
                        </h2>
                        <form onSubmit={handleFormSubmit} className="space-y-4">
                            <div className="space-y-1">
                                <label className="text-sm text-slate-400">Plan Type</label>
                                <select
                                    name="planType"
                                    value={formData.planType}
                                    onChange={handleFormChange}
                                    className="w-full p-2 rounded bg-slate-800 text-white border border-slate-700"
                                >
                                    <option value="BASIC">Basic Growth Plan (30 Days)</option>
                                    <option value="ECONOMIC">Economic Growth Plan (45 Days)</option>
                                    <option value="DIAMOND">Diamond Growth Plan (60 Days)</option>
                                </select>
                            </div>

                            <div className="space-y-1">
                                <label className="text-sm text-slate-400">Title</label>
                                <input
                                    type="text"
                                    name="title"
                                    value={formData.title}
                                    onChange={handleFormChange}
                                    placeholder="e.g. Tier 1"
                                    className="w-full p-2 rounded bg-slate-800 text-white border border-slate-700"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1">
                                    <label className="text-sm text-slate-400">Duration (Days)</label>
                                    <input
                                        type="number"
                                        name="duration"
                                        value={formData.duration}
                                        onChange={handleFormChange}
                                        className="w-full p-2 rounded bg-slate-800 text-white border border-slate-700"
                                        onKeyDown={(e) => ['ArrowUp', 'ArrowDown', 'e', 'E', '+', '-'].includes(e.key) && e.preventDefault()}
                                        onWheel={(e) => e.target.blur()}
                                        min="0"
                                    />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-sm text-slate-400">Daily ROI (%)</label>
                                    <input
                                        type="number"
                                        step="0.1"
                                        name="dailyRoi"
                                        value={formData.dailyRoi}
                                        onChange={handleFormChange}
                                        placeholder="e.g. 5.5"
                                        className="w-full p-2 rounded bg-slate-800 text-white border border-slate-700"
                                        onKeyDown={(e) => ['ArrowUp', 'ArrowDown', 'e', 'E', '+', '-'].includes(e.key) && e.preventDefault()}
                                        onWheel={(e) => e.target.blur()}
                                        min="0"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1">
                                    <label className="text-sm text-slate-400">Min Amount ($)</label>
                                    <input
                                        type="number"
                                        name="minAmount"
                                        value={formData.minAmount}
                                        onChange={handleFormChange}
                                        className="w-full p-2 rounded bg-slate-800 text-white border border-slate-700"
                                        onKeyDown={(e) => ['ArrowUp', 'ArrowDown', 'e', 'E', '+', '-'].includes(e.key) && e.preventDefault()}
                                        onWheel={(e) => e.target.blur()}
                                        min="0"
                                    />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-sm text-slate-400">Max Amount ($)</label>
                                    <input
                                        type="number"
                                        name="maxAmount"
                                        value={formData.maxAmount}
                                        onChange={handleFormChange}
                                        placeholder="Leave empty for no limit"
                                        className="w-full p-2 rounded bg-slate-800 text-white border border-slate-700"
                                        onKeyDown={(e) => ['ArrowUp', 'ArrowDown', 'e', 'E', '+', '-'].includes(e.key) && e.preventDefault()}
                                        onWheel={(e) => e.target.blur()}
                                        min="0"
                                    />
                                </div>
                            </div>

                            <label className="flex items-center text-white gap-2 cursor-pointer">
                                <input
                                    type="checkbox"
                                    name="status"
                                    checked={formData.status}
                                    onChange={handleFormChange}
                                />
                                Active
                            </label>

                            <div className="flex justify-end gap-2 pt-4">
                                <button
                                    type="button"
                                    onClick={handleCloseModal}
                                    className="bg-slate-600 hover:bg-slate-500 text-white px-4 py-2 rounded transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded transition-colors"
                                >
                                    {isCreateMode ? "Create Plan" : "Update Plan"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ManagePlans;
