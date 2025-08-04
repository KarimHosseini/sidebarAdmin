import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  snacks: [],
};
export const snacksSlice = createSlice({
  name: "snacks",
  initialState,
  reducers: {
    addSnack: (state, payload) => {
      state.snacks.push(payload.payload);
    },
    removeSnack: (state) => {
      state.snacks.shift();
    },
  },
});

export default snacksSlice.reducer;
export const { addSnack, removeSnack } = snacksSlice.actions;
