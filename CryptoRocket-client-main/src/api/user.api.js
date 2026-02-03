import { Axios } from "../constants/mainContent";

const userApi = "/user";

export const loginUser = async (payload) => {
  try {
    const response = await Axios.post("/api/auth/login", payload);
    return response.data;
  } catch (error) {
    // Optional: handle Axios error shape
    if (error.response && error.response.data) {
      return { error: true, message: error.response.data.message };
    }
    return { error: true, message: "Something went wrong." };
  }
};

export async function getIncomeWeakData() {
  try {
    const response = await Axios.get(`${userApi}/7-days-history`);
    return response?.data;
  } catch (error) {
    return error;
  }
}

export async function sendPaymentDetail(payload) {
  try {
    const response = await Axios.post(`${userApi}/investment`, payload);
    return response?.data;
  } catch (error) {
    return { 
      success: false, 
      message: error?.response?.data?.message || error.message || "Investment failed" 
    };
  }
}

export async function getPackageInfo() {
  try {
    const response = await Axios.get(`${userApi}/get-all-packages`);
    return response?.data;
  } catch (error) {
    return error;
  }
}

export async function getPlanInfo() {
  try {
    const response = await Axios.get(`${userApi}/get-all-plans`);
    return response?.data;
  } catch (error) {
    return error;
  }
}

export async function getPlanInvestmentHistory() {
  try {
    const response = await Axios.get(`${userApi}/get-plan-investment-history`);
    return response?.data;
  } catch (error) {
    return error;
  }
}

export async function getPlanReinvestmentHistory() {
  try {
    const response = await Axios.get(`${userApi}/get-plan-reinvestment-history`);
    return response?.data;
  } catch (error) {
    return error;
  }
}

export async function reinvestFromIncomeForPlan(payload) {
  try {
    const response = await Axios.post(`${userApi}/reinvest-plan`, payload, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    return response?.data;
  } catch (error) {
    return error;
  }
}

export async function getDirectUsers() {
  try {
    const response = await Axios.get(`${userApi}/get-myteams`);
    return response?.data;
  } catch (error) {
    return error;
  }
}

export async function getTeamDivision() {
  try {
    const response = await Axios.get(`${userApi}/get-team-division`);
    return response?.data;
  } catch (error) {
    return { success: false, message: error.message || "API error" };
  }
}

export async function getAllTeamMembers() {
  try {
    const response = await Axios.get(`${userApi}/get-all-team-members`);
    return response?.data;
  } catch (error) {
    return { success: false, message: error.message || "API error" };
  }
}

export async function getReferralPartners() {
  try {
    const response = await Axios.get(`${userApi}/get-partners`);
    return response?.data;
  } catch (error) {
    return error;
  }
}

export async function tradeInAi() {
  try {
    const response = await Axios.post(`${userApi}/activate-ai-trade`);
    return response?.data;
  } catch (error) {
    return error?.response?.data || { success: false, message: error.message || "API error" };
  }
}

export async function getAiTradeStatus() {
  try {
    const response = await Axios.get(`${userApi}/ai-trade-status`);
    return response?.data;
  } catch (error) {
    return error?.response?.data || { success: false, message: error.message || "API error" };
  }
}

export async function getEarningHistory() {
  try {
    const response = await Axios.get(`${userApi}/get-earning-history`);
    return response?.data;
  } catch (error) {
    return error;
  }
}

export const getAllInvestmentHistory = async () => {
  try {
    const response = await Axios.get(`${userApi}/get-investment-reports`);
    return response?.data;
  } catch (error) {
    return error;
  }
};

export const getAllTradingIncomeHistory = async () => {
  try {
    const response = await Axios.get(`${userApi}/get-tradingprofit-history`);
    return response?.data;
  } catch (error) {
    return error;
  }
};

export const getAllUserLevelIncomeHistory = async () => {
  try {
    const response = await Axios.get(`${userApi}/get-levelincome-history`);
    return response?.data;
  } catch (error) {
    return { success: false, message: error.message || "API error" };
  }
};

export const getAllUserGlobalAchievers = async () => {
  try {
    const response = await Axios.get(`${userApi}/get-globalachiever-history`);
    return response?.data;
  } catch (error) {
    return error;
  }
};

export const getAllUserMatchingIncomeHistory = async () => {
  try {
    const response = await Axios.get(`${userApi}/get-matching-history`);
    return response?.data;
  } catch (error) {
    return { success: false, message: error.message || "API error" };
  }
};

export const getAllUserRankRewardHistory = async () => {
  try {
    const response = await Axios.get(`${userApi}/get-rankreward-history`);
    return response?.data;
  } catch (error) {
    return { success: false, message: error.message || "API error" };
  }
};

export const getAllUserReferralIncomeHistory = async () => {
  try {
    const response = await Axios.get(`${userApi}/get-referralincome-history`);
    return response?.data;
  } catch (error) {
    return { success: false, message: error.message || "API error" };
  }
};

export const getAllUserTransactions = async () => {
  try {
    const response = await Axios.get(`${userApi}/all-transactions`);
    return response?.data;
  } catch (error) {
    return error;
  }
};

export const getAllUserWithdrawalHistory = async () => {
  try {
    const response = await Axios.get(`${userApi}/get-withdrawal-history`);
    return response?.data;
  } catch (error) {
    return error;
  }
};

export const getAllUserIncomeHistory = async () => {
  try {
    const response = await Axios.get(`${userApi}/get-income-history`);
    return response?.data;
  } catch (error) {
    return { success: false, message: error.message || "API error" };
  }
};

export const getAllUserUserRoiHistory = async () => {
  try {
    const response = await Axios.get(`${userApi}/get-referralincome-history`);
    return response?.data;
  } catch (error) {
    return { success: false, message: error.message || "API error" };
  }
};

export const getAllGenerationRoiHistory = async () => {
  try {
    const response = await Axios.get(`${userApi}/generation-roi-history`);
    return response?.data;
  } catch (error) {
    return { success: false, message: error.message || "API error" };
  }
};

export const getAllDepositWalletHistory = async () => {
  try {
    const response = await Axios.get(
      `${userApi}/tx//get-deposit-history-manually`
    );
    return response?.data;
  } catch (error) {
    return { success: false, message: error.message || "API error" };
  }
};

export const updateProfile = async (payload) => {
  try {
    const response = await Axios.post(`${userApi}/update-profile`, payload);
    return response?.data;
  } catch (error) {
    return { success: false, message: error.message || "API error" };
  }
};

export const walletDepositRequest = async (payload) => {
  try {
    const response = await Axios.post(
      `${userApi}/tx/deposit-amount-wallet`,
      payload
    );
    return response?.data;
  } catch (error) {
    return { success: false, message: error.message || "API error" };
  }
};

// Deposit Card APIs
export const getROIWalletBalance = async () => {
  try {
    const response = await Axios.get(`${userApi}/tx/get-roi-wallet-balance`);
    return response?.data;
  } catch (error) {
    return { success: false, message: error.message || "API error" };
  }
};

export const depositFromROIWallet = async (payload) => {
  try {
    const response = await Axios.post(
      `${userApi}/tx/deposit-from-roi-wallet`,
      payload
    );
    return response?.data;
  } catch (error) {
    return { success: false, message: error.message || "API error" };
  }
};

export const depositForOtherUser = async (payload) => {
  try {
    const response = await Axios.post(
      `${userApi}/tx/deposit-for-other-user`,
      payload
    );
    return response?.data;
  } catch (error) {
    return { success: false, message: error.message || "API error" };
  }
};

export const transferROIWallet = async (payload) => {
  try {
    const response = await Axios.post(
      `${userApi}/tx/transfer-roi-wallet`,
      payload
    );
    return response?.data;
  } catch (error) {
    return { success: false, message: error.message || "API error" };
  }
};

export const generateWithdrawalRequest = async (payload) => {
  try {
    const response = await Axios.post(
      `${userApi}/tx/withdrawal-request`,
      payload
    );
    return response?.data;
  } catch (error) {
    return { success: false, message: error.message || "API error" };
  }
};

export const createTicket = async (payload) => {
  try {
    const response = await Axios.post(
      `${userApi}/support/ticket-raise`,
      payload
    );
    return response?.data;
  } catch (error) {
    return { success: false, message: error.message || "API error" };
  }
};

export const getAllRaisedTickets = async () => {
  try {
    const response = await Axios.get(`${userApi}/support/get-history`);
    return response?.data;
  } catch (error) {
    return { success: false, message: error.message || "API error" };
  }
};

export const transferFunds = async (payload) => {
  try {
    const response = await Axios.post(`${userApi}/verify-transfer`, payload);
    return response?.data;
  } catch (error) {
    return { success: false, message: error.message || "API error" };
  }
};

export const verifyPayment = async (payload) => {
  try {
    const response = await Axios.post(`${userApi}/add-fund`, payload);
    return response?.data;
  } catch (error) {
    return { success: false, message: error.message || "API error" };
  }
};

export const sendOtp = async (payload) => {
  try {
    const response = await Axios.post(`${userApi}/add-fund`, payload);
    return response?.data;
  } catch (error) {
    return { success: false, message: error.message || "API error" };
  }
};

export const verifyOtp = async (payload) => {
  try {
    const response = await Axios.post(`${userApi}/verify-otp`, payload);
    return response?.data;
  } catch (error) {
    return { success: false, message: error.message || "API error" };
  }
};

export const verifyUser = async (payload) => {
  try {
    const response = await Axios.post(
      `${userApi}/get-name-by-username`,
      payload
    );
    return response?.data;
  } catch (error) {
    return { success: false, message: error.message || "API error" };
  }
};

export const getAllUserFundTransferHistory = async () => {
  try {
    const response = await Axios.get(`${userApi}/addfund-history`);
    return response?.data;
  } catch (error) {
    return error;
  }
};

export const getOptForWithdrawal = async () => {
  try {
    const response = await Axios.get(`${userApi}/tx/get-otp-for-withdrawal`);
    return response?.data;
  } catch (error) {
    return error;
  }
};

export const verifyWithdrawalDetails = async (payload) => {
  try {
    const response = await Axios.post(
      `${userApi}/tx/withdrawal-request`,
      payload
    );
    return response?.data;
  } catch (error) {
    return error;
  }
};

export const investInDollarBank = async (payload) => {
  try {
    const response = await Axios.post(
      `${userApi}/dollar-bank/invest`,
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

export const getUserDollarBankInvestments = async () => {
  try {
    const response = await Axios.get(`${userApi}/dollar-bank/my-investments`);
    return response?.data;
  } catch (error) {
    return error?.response?.data || error;
  }
};

export const requestDollarBankWithdrawal = async (payload) => {
  try {
    const response = await Axios.post(
      `${userApi}/dollar-bank/withdraw`,
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

export const investInDollarBankFromWithdrawalWallet = async (payload) => {
  try {
    const response = await Axios.post(
      `${userApi}/dollar-bank/invest-from-withdrawal-wallet`,
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

// Reinvestment APIs
export const getAvailableIncomeBalance = async () => {
  try {
    const response = await Axios.get(`${userApi}/get-income-balance`);
    return response?.data;
  } catch (error) {
    return { success: false, message: error.message || "API error" };
  }
};

export const reinvestFromIncome = async (payload) => {
  try {
    const response = await Axios.post(`${userApi}/reinvest`, payload, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    return response?.data;
  } catch (error) {
    return error?.response?.data || { success: false, message: error.message || "API error" };
  }
};

export const getReinvestmentHistory = async () => {
  try {
    const response = await Axios.get(`${userApi}/get-reinvestment-history`);
    return response?.data;
  } catch (error) {
    return { success: false, message: error.message || "API error" };
  }
};

export const activateUserAccount = async () => {
  try {
    const response = await Axios.post(`${userApi}/activate-account`);
    return response?.data;
  } catch (error) {
    return { success: false, message: error.message || "API error" };
  }
};