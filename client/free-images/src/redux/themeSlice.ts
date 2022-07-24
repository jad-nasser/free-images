import { createSlice } from "@reduxjs/toolkit";

const themeSlice = createSlice({
  name: "theme",
  initialState: {
    mode: "dark",
    color: "success",
  },
  reducers: {
    changeMode: (state, action) => {
      state.mode = action.payload;
    },
    changeColor: (state, action) => {
      state.color = action.payload;
    },
  },
});

export const { changeColor, changeMode } = themeSlice.actions;
export default themeSlice.reducer;
