import { createSlice } from "@reduxjs/toolkit";
import {
  saveToken,
  getCurrentUser,
  removeToken,
} from "../../utils/authStorage";

const initialState = {
  token: null,
  userId: null,
  role: null,
  data: null,
  isLoggedIn: false,
  isAuthChecked: false,  // Added flag to indicate auth loading is done
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    loginUser(state, action) {
      const { token, userId, role, data } = action.payload;
      console.log(token, userId, role, data);
      state.token = token;
      state.role = role;
      state.userId = userId;
      state.data = data;
      state.isLoggedIn = true;
      saveToken(userId, token, role,data);
    },

    logoutUser(state) {
      if (state.userId) {
        removeToken(state.userId);
      }
      state.token = null;
      state.userId = null;
      state.role = null;
      state.data = null;
      state.isLoggedIn = false;
      state.isAuthChecked = true;
    },

    loadUserFromStorage(state) {
      const user = getCurrentUser();
      if (user && user?.token && user?.role && user?.data) {
        state.token = user?.token;
        state.userId = user?.userId;
        state.role = user?.role;
        state.data = user?.data;
        state.isLoggedIn = user?.isLoggedIn;
        const currentUserId = 
          sessionStorage.getItem("currentUser") ||
          localStorage.getItem("currentUser");
        state.userId = currentUserId ? JSON.parse(currentUserId) : null;
      }
      state.isAuthChecked = true; // Mark auth loading as done here
    },
  },
});

export const { loginUser, logoutUser, loadUserFromStorage } = authSlice.actions;
export default authSlice.reducer;
