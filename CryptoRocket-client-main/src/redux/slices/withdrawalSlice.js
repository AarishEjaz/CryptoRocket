// in your redux slice (e.g., userSlice.js or withdrawalSlice.js)
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  withdrawalAmount: 0, // initial state for withdrawalAmount
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setWithdrawalAmount: (state, action) => {
      state.withdrawalAmount = action.payload;
    },
    // other actions
  },
});

export const { setWithdrawalAmount } = userSlice.actions;
export default userSlice.reducer;
