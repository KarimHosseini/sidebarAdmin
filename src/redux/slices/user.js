import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";
const initialState = {
  token: localStorage.getItem("token")
    ? JSON.parse(localStorage.getItem("token"))
    : null,
  userId: localStorage.getItem("userId")
    ? JSON.parse(localStorage.getItem("userId"))
    : null,
};
export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    login: (state, payload) => {
      const { token, userId, role } = payload.payload;

      state.token = token;
      state.userId = userId;
      state.auth = payload.payload;
      localStorage.setItem("auth", JSON.stringify(payload.payload));
      localStorage.setItem("token", JSON.stringify(token));
      localStorage.setItem("userId", JSON.stringify(userId));
      localStorage.setItem("loginTime", JSON.stringify(new Date()));
    },
    logout: (state) => {
      localStorage.removeItem("userInfo");
      localStorage.removeItem("loginTime");
      localStorage.removeItem("s");
      localStorage.removeItem("userId");
      localStorage.removeItem("auth");
      localStorage.removeItem("token");

      state.token = null;
      state.userId = null;
    },
  },
});

export default userSlice.reducer;
export const { login, logout } = userSlice.actions;
