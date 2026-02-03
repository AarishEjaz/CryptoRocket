import { createSlice } from "@reduxjs/toolkit";

const toggleThemeSlice = createSlice({
  name: "theme",
  initialState: {
    theme: "dark", // Default theme
  },
  reducers: {
    showDark: (state) => {
      state.theme = "dark";
    },
    showLight: (state) => {
      state.theme = "light"; // Correct the typo here
    },
  },
});

export const { showDark, showLight } = toggleThemeSlice.actions;
export default toggleThemeSlice.reducer;
