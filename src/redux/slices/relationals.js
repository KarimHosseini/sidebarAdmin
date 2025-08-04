import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  attrGroups: [],
  brands: [],
  categories: [],
  userPermissions: {},
  companyInfo: {},
  infinteLoop: {},
};
export const relationalsSlice = createSlice({
  name: "relationals",
  initialState,
  reducers: {
    setAttrGroups: (state, payload) => {
      state.attrGroups = payload.payload;
    },
    setBrands: (state, payload) => {
      state.brands = payload.payload;
    },
    setCategories: (state, payload) => {
      state.categories = payload.payload;
    },
    setPermissoins: (state, payload) => {
      state.userPermissions = payload.payload;
    },
    setCompanyInfo: (state, payload) => {
      state.companyInfo = payload.payload;
    },
    setInfinteLoop: (state, payload) => {
      state.infinteLoop = payload.payload;
    },
  },
});

export default relationalsSlice.reducer;
export const {
  setAttrGroups,
  setBrands,
  setCategories,
  setPermissoins,
  setCompanyInfo,
  setInfinteLoop,
} = relationalsSlice.actions;
