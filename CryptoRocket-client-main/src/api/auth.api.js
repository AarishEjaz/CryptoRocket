import { Axios } from "../constants/mainContent";

const userApi = "/user";
const adminApi = "/admin";
export async function createUserApi(payload) {
  try {
    const response = await Axios.post(`${userApi}/register`, payload);
    return response?.data;
  } catch (error) {
    return error;
  }
}

export async function loginUserApi(payload) {
  try {
    const response = await Axios.post(`${userApi}/login`, payload);
    return response?.data;
  } catch (error) {
    return error;
  }
}

export async function getIncomeTotal() {
  try {
    const response = await Axios.get(`${userApi}/dashboard-stats`);
    return response?.data;
  } catch (error) {
    return error;
  }
}

export async function getTransactionHistory() {
  try {
    const response = await Axios.get(`${userApi}/get-transaction-history`);
    return response?.data;
  } catch (error) {
    return error;
  }
}

export async function getIncomeHistory() {
  try {
    const response = await Axios.get(`${userApi}/get-income-history`);
    return response?.data;
  } catch (error) {
    return error;
  }
}
export async function getSponsorByReferralApi(referralCode) {
  try {
    const response = await Axios.post(`${userApi}/get-sponsor-by-referral`, { referralCode });
    return response?.data;
  } catch (error) {
    return error;
  }
}
