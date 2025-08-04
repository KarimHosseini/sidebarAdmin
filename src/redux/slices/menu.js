import { createSlice } from "@reduxjs/toolkit";

const initialState = {};
export const userSlice = createSlice({
  name: "darwer",
  initialState,
  reducers: {
    openDrawer: (state, payload) => {
      state.openDrawer = payload.payload;
    },
  },
});

export default userSlice.reducer;
export const { openDrawer } = userSlice.actions;
