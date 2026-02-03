import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  open: true,
};
const sideMenuSlice = createSlice({
  initialState,
  name: "sidemenu",
  reducers: {
    toggleSideMenu: (state) => {
      state.open = !state.open;
    },
    openSideMenu: (state) => {
      state.open = true;
    },
    closeSideMenu: (state) => {
      state.open = false;
    },
  },
});

export const { openSideMenu, closeSideMenu, toggleSideMenu } =
  sideMenuSlice.actions;
export default sideMenuSlice.reducer;
