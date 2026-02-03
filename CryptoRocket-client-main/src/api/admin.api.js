import { Axios } from "../constants/mainContent";

const adminApi = "/admin";

export const adminLogin = async (payload) => {
  try {
    const response = await Axios.post(`${adminApi}/login`, payload);
    return response?.data;
  } catch (error) {
    return error;
  }
};

export const getAllUsers = async () => {
  try {
    const response = await Axios.get(`${adminApi}/all-users`);
    return response?.data;
  } catch (error) {
    return error;
  }
};

export const getIncomeTotalForAdmin = async () => {
  try {
    const response = await Axios.get(`${adminApi}/dashboard-stats`);
    return response?.data;
  } catch (error) {
    return error;
  }
};

export async function BlockUser(id) {
  try {
    const response = await Axios.get(`${adminApi}/user-block/${id}`);
    return response?.data;
  } catch (error) {
    return error?.response?.data;
  }
}
export async function HoldCapitalIncome(id) {
  try {
    const response = await Axios.get(`${adminApi}/user-currentIncome-hold/${id}`);
    return response?.data;
  } catch (error) {
    return error?.response?.data;
  }
}

export async function lockUnlockCapitalInvestment(id) {
  try {
    const response = await Axios.get(`${adminApi}/user-capital-lock/${id}`);
    return response?.data;
  } catch (error) {
    return error?.response?.data;
  }
}

export async function RoiGenerate(id) {
  try {
    const response = await Axios.get(`${adminApi}/user-roi-block/${id}`);
    return response?.data;
  } catch (error) {
    return error?.response?.data;
  }
}

export async function updateUserDetails(id, payload) {
  try {
    const response = await Axios.post(
      `${adminApi}/update-user-info/${id}`,
      payload
    );
    return response?.data;
  } catch (error) {
    return error?.response?.data;
  }
}

export async function getUserDashboardAccess(id) {
  try {
    const response = await Axios.post(`${adminApi}/get-dashboard-access`, id);
    return response?.data;
  } catch (error) {
    return error?.response?.data;
  }
}

export async function getTransactionHistoryForAdmin() {
  try {
    const response = await Axios.get(`${adminApi}/recent-transactions`);
    return response?.data;
  } catch (error) {
    return error;
  }
}

export const getAllTransactions = async () => {
  try {
    const response = await Axios.get(`${adminApi}/all-transactions`);
    return response?.data;
  } catch (error) {
    return error;
  }
};

export async function withdrawalRequestApproveReject(id, status) {
  try {
    const response = await Axios.post(
      `${adminApi}/get-dashboard-access/${id}`,
      status
    );
    return response?.data;
  } catch (error) {
    return error?.response?.data;
  }
}

export const getAllWithdrawalRequests = async () => {
  try {
    const response = await Axios.get(`${adminApi}/get-withdrawal-history`);
    return response?.data;
  } catch (error) {
    return error;
  }
};
export const getAllApprovedWithdrawalRequests = async () => {
  try {
    const response = await Axios.get(
      `${adminApi}/get-approved-withdrawal-request`
    );
    return response?.data;
  } catch (error) {
    return error;
  }
};
export const getAllRejectedWithdrawalRequests = async () => {
  try {
    const response = await Axios.get(
      `${adminApi}/get-rejected-withdrawal-request`
    );
    return response?.data;
  } catch (error) {
    return error;
  }
};

export const getAllGlobalAchievers = async () => {
  try {
    const response = await Axios.get(`${adminApi}/get-globalachiever-history`);
    return response?.data;
  } catch (error) {
    return error;
  }
};

export const getAllTradingList = async () => {
  try {
    const response = await Axios.get(`${adminApi}/get-tradingprofit-history`);
    return response?.data;
  } catch (error) {
    return error;
  }
};

export const getAllIncomeHistory = async ({ page = 1 }) => {
  try {
    const response = await Axios.get(`${adminApi}/income-history`, {
      params: { page },
    });
    return response?.data;
  } catch (error) {
    return { success: false, message: error.message || "API error" };
  }
};

export const getAllReferralIncomeHistory = async () => {
  try {
    const response = await Axios.get(`${adminApi}/get-referralincome-history`);
    return response?.data;
  } catch (error) {
    return { success: false, message: error.message || "API error" };
  }
};

export const getAllLevelIncomeHistory = async () => {
  try {
    const response = await Axios.get(`${adminApi}/get-levelincome-history`);
    return response?.data;
  } catch (error) {
    return { success: false, message: error.message || "API error" };
  }
};

export const getAllMatchingIncomeHistory = async () => {
  try {
    const response = await Axios.get(`${adminApi}/get-matching-history`);
    return response?.data;
  } catch (error) {
    return { success: false, message: error.message || "API error" };
  }
};

export const getAllRankRewardHistory = async () => {
  try {
    const response = await Axios.get(`${adminApi}/get-rankreward-history`);
    return response?.data;
  } catch (error) {
    return { success: false, message: error.message || "API error" };
  }
};

export async function getPackageInfoAdmin() {
  try {
    const response = await Axios.get(`${adminApi}/package/get-all-packages`);
    return response?.data;
  } catch (error) {
    return error?.response?.data || error;
  }
}

export const createPackageAdmin = async (payload) => {
  try {
    const response = await Axios.post(`${adminApi}/package/create`, payload);
    return response?.data;
  } catch (error) {
    return error?.response?.data || error;
  }
};

export const updatePackageAdmin = async (id, payload) => {
  try {
    if (!id) {
      return { success: false, message: "Package ID is required" };
    }
    const response = await Axios.put(
      `${adminApi}/package/update/${id}`,
      payload
    );
    return response?.data;
  } catch (error) {
    return error?.response?.data || error;
  }
};

export const deletePackageAdmin = async (id) => {
  try {
    if (!id) {
      return { success: false, message: "Package ID is required" };
    }
    const response = await Axios.delete(`${adminApi}/package/delete/${id}`);
    return response?.data;
  } catch (error) {
    return error?.response?.data || error;
  }
};

// PLAN APIS
export async function getPlanInfoAdmin() {
  try {
    const response = await Axios.get(`${adminApi}/plan/get-admin-reports`);
    return response?.data;
  } catch (error) {
    return error?.response?.data || error;
  }
}

export const createPlanAdmin = async (payload) => {
  try {
    const response = await Axios.post(`${adminApi}/plan/create`, payload);
    return response?.data;
  } catch (error) {
    return error?.response?.data || error;
  }
};

export const updatePlanAdmin = async (id, payload) => {
  try {
    if (!id) {
      return { success: false, message: "Plan ID is required" };
    }
    const response = await Axios.put(
      `${adminApi}/plan/update/${id}`,
      payload
    );
    return response?.data;
  } catch (error) {
    return error?.response?.data || error;
  }
};

export const deletePlanAdmin = async (id) => {
  try {
    if (!id) {
      return { success: false, message: "Plan ID is required" };
    }
    const response = await Axios.delete(`${adminApi}/plan/delete/${id}`);
    return response?.data;
  } catch (error) {
    return error?.response?.data || error;
  }
};

export const AddUserFund = async (payload) => {
  try {
    const response = await Axios.post(`${adminApi}/fund/add`, payload);
    return response?.data;
  } catch (error) {
    return { success: false, message: error.message || "API error" };
  }
};

export const getAllAddFundHistory = async () => {
  try {
    const response = await Axios.get(`${adminApi}/fund/get-fund-history`);
    return response?.data;
  } catch (error) {
    return error;
  }
};

export const getAddFundRequests = async () => {
  try {
    const response = await Axios.get(`${adminApi}/tx/get-deposit-history`);
    return response?.data;
  } catch (error) {
    return error;
  }
};

export const addFundAcceptReject = async (id, payload) => {
  try {
    const response = await Axios.put(
      `${adminApi}/tx/deposit-amount-admin/${id}`,
      payload
    );
    return response?.data;
  } catch (error) {
    return error;
  }
};

export const getUserFundAccepted = async () => {
  try {
    const response = await Axios.get(
      `${adminApi}/tx/get-completed-deposit-history-manually`
    );
    return response?.data;
  } catch (error) {
    return error;
  }
};

export const getUserFundRejected = async () => {
  try {
    const response = await Axios.get(
      `${adminApi}/tx/get-rejected-deposit-history-manually`
    );
    return response?.data;
  } catch (error) {
    return error;
  }
};

export async function createRankAndReward(payload) {
  try {
    const response = await Axios.post(`${adminApi}/reward/create`, payload);
    return response?.data;
  } catch (error) {
    return error?.response?.data;
  }
}

export async function getRankAndReward() {
  try {
    const response = await Axios.get(`${adminApi}/reward/get-admin-reports`);
    return response?.data;
  } catch (error) {
    return error?.response?.data;
  }
}

export async function updateRewardAndRank(id, payload) {
  try {
    const response = await Axios.put(
      `${adminApi}/reward/update/${id}`,
      payload
    );
    return response?.data;
  } catch (error) {
    return error?.response?.data;
  }
}

export async function rankAndRewardStatus(id) {
  try {
    const response = await Axios.put(`${adminApi}/reward/status/${id}`);
    return response?.data;
  } catch (error) {
    return error?.response?.data;
  }
}

export async function getAllGlobalAchieversClub() {
  try {
    const response = await Axios.get(`${adminApi}/reward/get-global-acheivers`);
    return response?.data;
  } catch (error) {
    return error?.response?.data;
  }
}
export async function updateGlobalAchieversClub(id, payload) {
  try {
    const response = await Axios.put(
      `${adminApi}/reward/update/${id}`,
      payload
    );
    return response?.data;
  } catch (error) {
    return error?.response?.data;
  }
}

export async function globalachieverStatus(id) {
  try {
    const response = await Axios.put(`${adminApi}/reward/status/${id}`);
    return response?.data;
  } catch (error) {
    return error?.response?.data;
  }
}

export async function getAllTickets() {
  try {
    const response = await Axios.get(`${adminApi}/support/get-all-reports`);
    return response?.data;
  } catch (error) {
    return error?.response?.data;
  }
}

export async function getAllClosedTickets() {
  try {
    const response = await Axios.get(`${adminApi}/support/get-approved-support`);
    return response?.data;
  } catch (error) {
    return error?.response?.data;
  }
}

export async function closeTicket(id, payload) {
  try {
    const response = await Axios.put(`${adminApi}/support/ticket-response/${id}`, payload);
    return response?.data;
  } catch (error) {
    return error?.response?.data;
  }
}


export async function requestWithdrawalStatus(payload) {
  try {
    const response = await Axios.post(`${adminApi}/tx/withdrawal-accepted`, payload
    );
    return response?.data;
  } catch (error) {
    return error?.response.data;
  }
}

export async function getAllPackageBuyers() {
  try {
    const response = await Axios.get(`${adminApi}/package/get-package-buyers`);
    return response?.data;
  } catch (error) {
    return error?.response?.data || error;
  }
}

export async function getIncomeTotalForAdminIncome() {
  try {
    const response = await Axios.get(`${adminApi}/get-income-summary`);
    return response?.data;
  } catch (error) {
    return error;
  }
}

export async function changeAdminPassword(payload) {
  try {
    const response = await Axios.put(`${adminApi}/password-change`, payload);
    return response?.data;
  } catch (error) {
    return error?.response?.data;
  }
}

export const getDollarBankSummary = async () => {
  try {
    const response = await Axios.get(`${adminApi}/dollar-bank/summary`);
    return response?.data;
  } catch (error) {
    return error?.response?.data || error;
  }
};

export const getAllDollarBankUsers = async () => {
  try {
    const response = await Axios.get(`${adminApi}/dollar-bank/all-users`);
    return response?.data;
  } catch (error) {
    return error?.response?.data || error;
  }
};

export const getAllDollarBankWithdrawalRequests = async () => {
  try {
    const response = await Axios.get(`${adminApi}/dollar-bank/withdrawal-requests`);
    return response?.data;
  } catch (error) {
    return error?.response?.data || error;
  }
};

export const updateDollarBankWithdrawalStatus = async (payload) => {
  try {
    const response = await Axios.post(
      `/dollar-bank/withdrawal-approve-reject`,
      payload,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    return response?.data;
  } catch (error) {
    return error?.response?.data || error;
  }
};