import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    themeColor: localStorage.getItem("themeColor")
    ? JSON.parse(localStorage.getItem("themeColor"))
    : null,
};
export const userSlice = createSlice({
  name: "themes",
  initialState,
  reducers: {
    themeColor: (state, payload) => {
      state.themeColor = payload.payload;
      localStorage.setItem("themeColor", JSON.stringify(payload.payload));
    },
  },
});

export default userSlice.reducer;
export const { themeColor } = userSlice.actions;
