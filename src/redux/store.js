import { configureStore } from "@reduxjs/toolkit";
import { user, snacks, relationals, themeColor, openDrawer } from "./slices";

export default configureStore({
  reducer: { user, snacks, relationals, themeColor, openDrawer },
});
