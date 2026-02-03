import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { setLoading } from "../../redux/slices/loadingSlice";
import PlanCard from "../../components/Screen/UserPanel/PlanCard";
import {
  getAllPackageBuyers,
  getPackageInfoAdmin,
  updatePackageAdmin,
  createPackageAdmin,
  deletePackageAdmin,
} from "../../api/admin.api";
import { getMoneySymbol } from "../../utils/additionalFunc";
import { toast } from "react-toastify";
import DataTable from "../../components/Screen/UserPanel/DataTable";
import { useLocation } from "react-router-dom";
import { isToday } from "../../utils/helper";
import Swal from "sweetalert2";

const ManagePackage = () => {
  const dispatch = useDispatch();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [plans, setPlans] = useState([]);
  const location = useLocation();
  const data = location?.state;

  const [allPackageBuyers, setAllPackageBuyers] = useState([]);

  const [formData, setFormData] = useState({
    title: "",
    min: "",
    max: "",
    profitPercentage: "",
    profitLimit: "",
    tags: "",
    status: true,
    perDayRoi: "",
  });
  const [isCreateMode, setIsCreateMode] = useState(false);

  const staticPlans = [
    {
      id: 1,
      title: "BASIC Plan",
      min: 50,
      max: 1000,
      profitPercentage: 8,
      limit: "Up to 3X",
      recommended: false,
      features: [
        "8% return on investment",
        "Investment range: $50 – $1000",
        "Profit limit: Up to 3X",
        "Limited support",
        "Basic access to features",
      ],
    },
    {
      id: 2,
      title: "STANDARD Plan",
      min: 1010,
      max: 5000,
      profitPercentage: 10,
      limit: "Up to 3X",
      recommended: true,
      features: [
        "10% return on investment",
        "Investment range: $1010 – $5,000",
        "Profit limit: Up to 3X",
        "Priority support",
        "Access to premium features",
      ],
    },
    {
      id: 3,
      title: "PREMIUM Plan",
      min: 5100,
      max: Infinity,
      profitPercentage: 12,
      limit: "Up to 3X",
      recommended: false,
      features: [
        "12% return on investment",
        "Investment range: $5,100 & Above",
        "Profit limit: Up to 3X",
        "24/7 support",
        "Full access to all features",
      ],
    },
  ];

  const handleSelectPlan = (plan) => {
    // Ensure we preserve the _id or id from the plan object
    const planWithId = {
      ...plan,
      _id: plan._id || plan.id, // Ensure _id is always set
    };
    
    setSelectedPlan(planWithId);
    setIsModalOpen(true);
    setIsCreateMode(false);

    setFormData({
      title: plan.title || "",
      min: plan.min || "",
      max: plan.max === Infinity ? "" : plan.max || "",
      profitPercentage: plan.profitPercentage || "",
      profitLimit: plan.profitLimit || plan.limit || "",
      tags: extractTags(plan.features) || "",
      status: extractStatus(plan.features, plan.status),
      perDayRoi: plan.perDayRoi || "",
    });
  };

  const handleCreateNew = () => {
    setSelectedPlan(null);
    setIsModalOpen(true);
    setIsCreateMode(true);
    setFormData({
      title: "",
      min: "",
      max: "",
      profitPercentage: "",
      profitLimit: "",
      tags: "",
      status: true,
      perDayRoi: "",
    });
  };

  const extractTags = (features) => {
    const tagLine = features.find((f) => f.startsWith("Tags:"));
    return tagLine ? tagLine.replace("Tags: ", "") : "";
  };

  const extractStatus = (features, planStatus) => {
    // First check if plan has direct status property
    if (planStatus !== undefined) {
      return planStatus;
    }
    // Fallback to extracting from features array
    if (features && Array.isArray(features)) {
      const statusLine = features.find((f) => f && f.startsWith("Status:"));
      return statusLine?.includes("Active") ?? true;
    }
    return true; // Default to active
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedPlan(null);
    setIsCreateMode(false);
    setFormData({
      title: "",
      min: "",
      max: "",
      profitPercentage: "",
      profitLimit: "",
      tags: "",
      status: true,
      perDayRoi: "",
    });
  };

  const handleFormChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const fetchPackageInfo = async () => {
    try {
      dispatch(setLoading(true));
      const response = await getPackageInfoAdmin();
      console.log("Admin Package API Response:", response);
      
      const rawPlans = response?.data || response?.packages || response;
      
      if (!rawPlans || !Array.isArray(rawPlans)) {
        console.warn("Invalid API response format, using static plans");
        setPlans(staticPlans);
        return;
      }

      const transformedPlans = rawPlans.map((plan) => ({
        _id: plan._id,
        id: plan.id || plan._id,
        title: plan.title,
        min: plan.minAmount,
        max: plan.maxAmount,
        profitPercentage: plan.percentage,
        profitLimit: plan.profitLimit || plan.limit || "Up to 3X",
        recommended: plan.title.toLowerCase() === "standard",
        perDayRoi: plan.perDayRoi ?? 0,
        status: plan.status,
        features: [
          `${plan.percentage}% return on investment`,
          `Investment range: ${getMoneySymbol()}${plan.minAmount} – ${
            plan.maxAmount === Infinity
              ? "∞"
              : getMoneySymbol() + plan.maxAmount
          }`,
          `Profit limit: ${plan.profitLimit || plan.limit || "Up to 3X"}`,
          plan.tags && plan.tags.length > 0 ? `Tags: ${plan.tags.join(", ")}` : "",
          plan.perDayRoi ? `Per day ROI: $ ${plan.perDayRoi}` : "",
          `Status: ${plan.status ? "Active" : "Inactive"}`,
        ].filter(Boolean), // Remove empty strings
      }));

      setPlans(transformedPlans);
    } catch (error) {
      console.error("Error fetching package info:", error);
      // Don't show toast for initial load errors, just use static plans
      setPlans(staticPlans);
    } finally {
      dispatch(setLoading(false));
    }
  };

  useEffect(() => {
    fetchPackageInfo();
  }, []);

  const handleFormSubmit = async (e) => {
    e.preventDefault();

    // Validation
    if (!formData.title || !formData.min || !formData.profitPercentage) {
      toast.error("Please fill all required fields");
      return;
    }

    const payload = {
      title: formData.title,
      minAmount: parseFloat(formData.min),
      maxAmount: formData.max === "" ? Infinity : parseFloat(formData.max),
      percentage: parseFloat(formData.profitPercentage),
      profitLimit: formData.profitLimit || "Up to 3X", // Default profit limit
      tags: formData.tags ? formData.tags.split(",").map((t) => t.trim()).filter(Boolean) : [],
      status: formData.status,
      perDayRoi: parseFloat(formData.perDayRoi) || 0,
    };

    try {
      dispatch(setLoading(true));
      let res;
      
      if (isCreateMode) {
        // Create new package
        res = await createPackageAdmin(payload);
        if (res?.success) {
          toast.success(res?.message || "Package created successfully!");
          handleCloseModal();
          fetchPackageInfo();
        } else {
          toast.error(res?.message || "Failed to create package!");
        }
      } else {
        // Update existing package
        const packageId = selectedPlan?._id || selectedPlan?.id;
        if (!packageId) {
          toast.error("Package ID is missing. Cannot update package.");
          console.error("Selected plan:", selectedPlan);
          return;
        }
        res = await updatePackageAdmin(packageId, payload);
        if (res?.success) {
          toast.success(res?.message || "Plan updated successfully!");
          handleCloseModal();
          fetchPackageInfo();
        } else {
          toast.error(res?.message || "Something went wrong!");
        }
      }
    } catch (error) {
      console.error(`Failed to ${isCreateMode ? 'create' : 'update'} plan:`, error);
      toast.error(`Failed to ${isCreateMode ? 'create' : 'update'} plan. Please try again.`);
    } finally {
      dispatch(setLoading(false));
    }
  };

  const handleDeletePackage = async (planId) => {
    if (!planId) {
      toast.error("Package ID is missing. Cannot delete package.");
      return;
    }

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
        const res = await deletePackageAdmin(planId);
        if (res?.success) {
          toast.success(res?.message || "Package deleted successfully!");
          fetchPackageInfo();
        } else {
          toast.error(res?.message || res?.error || "Failed to delete package!");
        }
      } catch (error) {
        console.error("Failed to delete package:", error);
        toast.error(error?.response?.data?.message || "Failed to delete package. Please try again.");
      } finally {
        dispatch(setLoading(false));
      }
    }
  };

  const fetchAllPackageBuyersHistory = async () => {
    try {
      dispatch(setLoading(true));
      const response = await getAllPackageBuyers();
      if (response?.success) {
        setAllPackageBuyers(response?.data?.history || response?.data || []);
      } else {
        // Don't show error toast if API fails, just set empty array
        console.warn("Failed to fetch package buyers:", response?.message);
        setAllPackageBuyers([]);
      }
    } catch (err) {
      console.error("Error fetching package buyers: ", err);
      // Don't show toast for initial load errors
      setAllPackageBuyers([]);
    } finally {
      dispatch(setLoading(false));
    }
  };

  useEffect(() => {
    fetchAllPackageBuyersHistory();
  }, []);

  const filteredIncomeHistory =
    data === "today"
      ? allPackageBuyers.filter((item) => isToday(new Date(item.createdAt)))
      : allPackageBuyers;

  const columns = [
    {
      header: "S/N",
      accessor: "_id",
      cell: (_, rowIndex) => (
        <span className="font-medium text-white">{rowIndex + 1}</span>
      ),
    },
    {
      header: "Transaction ID",
      accessor: "id",
      cell: (row) => <span className="font-medium text-white">{row?.id}</span>,
    },
    {
      header: "User ID",
      accessor: "user.username",
      cell: (row) => (
        <span className="font-medium text-white">{row?.user?.username}</span>
      ),
    },
    // {
    //   header: "From User",
    //   accessor: "fromUser.username",
    //   cell: (row) => (
    //     <span className="font-medium text-white">{row?.fromUser?.username || "-"}</span>
    //   ),
    // },
    {
      header: "Amount",
      accessor: "amount",
      cell: (row) => (
        <span className="font-medium text-white text-nowrap">
          $ {row?.amount}
        </span>
      ),
    },
    {
      header: "ReferralIncome",
      accessor: "income",
      cell: (row) => (
        <span className="font-medium text-white text-nowrap">
          $ {row?.income}
        </span>
      ),
    },
    {
      header: "Level",
      accessor: "level",
      cell: (row) => (
        <span className="font-medium text-white">{row?.level}</span>
      ),
    },
    {
      header: "Days",
      accessor: "days",
      cell: (row) => (
        <span className="font-medium text-white">{row?.days}</span>
      ),
    },
    {
      header: "Type",
      accessor: "type",
      cell: (row) => (
        <span className="font-medium text-white">{row?.type}</span>
      ),
    },
    {
      header: "Reward Paid",
      accessor: "rewardPaid",
      cell: (row) => (
        <span className="font-medium text-white">{row?.rewardPaid}</span>
      ),
    },
    {
      header: "Status",
      accessor: "status",
      cell: (row) => (
        <span
          className={`font-medium ${
            row?.status === "Completed" ? "text-blue-500" : "text-yellow-400"
          }`}
        >
          {row?.status}
        </span>
      ),
    },
    {
      header: "Created At",
      accessor: "createdAt",
      cell: (row) => (
        <span className="text-slate-300">
          {new Date(row?.createdAt).toLocaleString()}
        </span>
      ),
    },
  ];

  return (
    <div className="space-y-8 pt-4">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-white">Manage Packages</h1>
          <p className="text-slate-400 mt-1">
            Create, update, and delete investment packages.
          </p>
        </div>
        <button
          onClick={handleCreateNew}
          className="bg-blue-600 hover:bg-blue-500 text-white px-6 py-3 rounded-lg font-semibold transition-colors flex items-center gap-2"
        >
          <i className="fa-solid fa-plus"></i>
          Create New Package
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {plans.map((plan) => (
          <div key={plan.id} className="relative">
            <PlanCard
              plan={plan}
              onSelect={handleSelectPlan}
              isAdmin={true}
            />
            <button
              onClick={() => {
                const packageId = plan._id || plan.id;
                if (!packageId) {
                  toast.error("Package ID is missing");
                  return;
                }
                handleDeletePackage(packageId);
              }}
              className="absolute top-2 right-2 bg-red-600 hover:bg-red-500 text-white p-2 rounded-lg transition-colors"
              title="Delete Package"
            >
              <i className="fa-solid fa-trash"></i>
            </button>
          </div>
        ))}
      </div>

      <DataTable
        title="Recent Package Investors"
        columns={columns}
        data={filteredIncomeHistory}
        pageSize={10}
      />

      {/* Create/Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 p-6 rounded-lg shadow-lg w-full max-w-md max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-semibold text-white mb-4">
              {isCreateMode ? "Create New Package" : "Edit Package"}
            </h2>
            <form onSubmit={handleFormSubmit} className="space-y-4 text-sm">
              <div className="space-y-2">
                <span className="text-sm text-slate-400">Title</span>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleFormChange}
                  placeholder="Plan Title"
                  className="w-full p-2 rounded border bg-slate-800 text-white"
                />
              </div>
              <div className="space-y-2">
                <span className="text-sm text-slate-400">
                  Minimum Investment
                </span>
                <input
                  type="number"
                  name="min"
                  value={formData.min}
                  onChange={handleFormChange}
                  placeholder="Minimum Amount"
                  className="w-full p-2 rounded border bg-slate-800 text-white"
                  onKeyDown={(e) => ['ArrowUp', 'ArrowDown', 'e', 'E', '+', '-'].includes(e.key) && e.preventDefault()}
                  onWheel={(e) => e.target.blur()}
                  min="0"
                />
              </div>
              <div className="space-y-2">
                <span className="text-sm text-slate-400">
                  Maximum Investment
                </span>
                <input
                  type="number"
                  name="max"
                  value={formData.max}
                  onChange={handleFormChange}
                  placeholder="Maximum Amount"
                  className="w-full p-2 rounded border bg-slate-800 text-white"
                  onKeyDown={(e) => ['ArrowUp', 'ArrowDown', 'e', 'E', '+', '-'].includes(e.key) && e.preventDefault()}
                  onWheel={(e) => e.target.blur()}
                  min="0"
                />
              </div>
              <div className="space-y-2">
                <span className="text-sm text-slate-400">
                  Profit Percentage
                </span>
                <input
                  type="number"
                  name="profitPercentage"
                  value={formData.profitPercentage}
                  onChange={handleFormChange}
                  placeholder="Profit Percentage (e.g., 8)"
                  className="w-full p-2 rounded border bg-slate-800 text-white"
                  onKeyDown={(e) => ['ArrowUp', 'ArrowDown', 'e', 'E', '+', '-'].includes(e.key) && e.preventDefault()}
                  onWheel={(e) => e.target.blur()}
                  min="0"
                />
              </div>
              <div className="space-y-2">
                <span className="text-sm text-slate-400">
                  Profit Limit
                </span>
                <input
                  type="text"
                  name="profitLimit"
                  value={formData.profitLimit}
                  onChange={handleFormChange}
                  placeholder="Profit Limit (e.g., Up to 3X)"
                  className="w-full p-2 rounded border bg-slate-800 text-white"
                />
              </div>
              <div className="space-y-2">
                <span className="text-sm text-slate-400">
                  Package Tags/Features (separated by comma)
                </span>
                <input
                  type="text"
                  name="tags"
                  value={formData.tags}
                  onChange={handleFormChange}
                  placeholder="Tags (comma separated)"
                  className="w-full p-2 rounded border bg-slate-800 text-white"
                />
              </div>
              <div className="space-y-2">
                <span className="text-sm text-slate-400">ROI per day</span>
                <input
                  type="number"
                  name="perDayRoi"
                  value={formData.perDayRoi}
                  onChange={handleFormChange}
                  placeholder="Per Day ROI"
                  className="w-full p-2 rounded border bg-slate-800 text-white"
                  onKeyDown={(e) => ['ArrowUp', 'ArrowDown', 'e', 'E', '+', '-'].includes(e.key) && e.preventDefault()}
                  onWheel={(e) => e.target.blur()}
                  min="0"
                />
              </div>
              <label className="flex items-center text-white gap-2">
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
                  className="bg-slate-500 hover:bg-slate-400 text-white px-4 py-2 rounded cursor-pointer transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded cursor-pointer transition-colors"
                >
                  {isCreateMode ? "Create Package" : "Save Changes"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManagePackage;
