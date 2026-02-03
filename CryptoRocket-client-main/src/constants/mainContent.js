import axios from "axios";
import store, { persistor } from "../redux/store";
import { logoutUser } from "../redux/slices/authSlice";
// import appLogo from "../assets/CryptoRocket_logo.png";
// import appFavicon from "../assets/zeptodefi-sort-logo.png";
import CRLLogo from "../assets/CRL.png";


const fullLogo = "./assets/CRL.png";
const shortLogo = "./assets/CRL.png";

// const fullLogo = "/zeptodefilogo.png";
// const shortLogo = "/zeplogo.png";

// export const MainContent = {
//   name: "CryptoRocket",
//   appLogo: shortLogo,
//   fullLogo: fullLogo,
//   shortLogo: shortLogo,
//   favIcon: shortLogo,
//   appName: "CryptoRocket"
// };

export const MainContent = {
  name: "CryptoRocket",
  appLogo: CRLLogo,
  fullLogo: CRLLogo,
  shortLogo: CRLLogo,
  favIcon: CRLLogo,
  appName: "CryptoRocket",
};

export const backendConfig = {
  // base: import.meta.env.VITE_API_BASE_URL || "https://api.zeptodefi.io/api",
  // origin: import.meta.env.VITE_API_ORIGIN || "https://api.zeptodefi.io",
  // base: import.meta.env.VITE_API_BASE_URL || "http://localhost:8329/api",
  base: import.meta.env.VITE_API_BASE_URL || "https://api.zeptdefi.io/api",
  origin: import.meta.env.VITE_API_ORIGIN || "https://api.zeptdefi.io",
};

export const Axios = axios.create({
  baseURL: backendConfig.base,
  withCredentials: true,
});
Axios.interceptors.request.use(
  (config) => {
    const state = store.getState();
    const token = state?.isLoggedUser?.token;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor to handle authentication errors only
Axios.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      const status = error.response.status;
      const message = error.response?.data?.message || error.response?.data?.error || "";
      const messageLower = message.toLowerCase();

      // Only logout on authentication errors (401, 403) or specific auth-related messages
      // Don't logout on 404 (resource not found) or other client errors
      const isAuthError = status === 401 || status === 403;
      const isAuthMessage =
        (messageLower === "user not found" && status === 401) || // Only if 401 with exact message
        messageLower.includes("unauthorized") ||
        (messageLower.includes("token") && (messageLower.includes("invalid") || messageLower.includes("expired"))) ||
        messageLower.includes("authentication failed") ||
        messageLower.includes("please login") ||
        messageLower.includes("session expired");

      if (isAuthError || isAuthMessage) {
        // Clear user data from Redux
        store.dispatch(logoutUser());

        // Purge redux-persist storage
        persistor.purge();

        // Clear localStorage and sessionStorage
        localStorage.clear();
        sessionStorage.clear();

        // Redirect to landing page
        const currentPath = window.location.pathname;
        if (currentPath !== "/" && currentPath !== "/login" && currentPath !== "/admin/login" && currentPath !== "/register") {
          window.location.href = "/";
        }
      }
    }
    return Promise.reject(error);
  }
);

