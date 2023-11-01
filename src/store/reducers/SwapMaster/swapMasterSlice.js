import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isTokenListLoaded: false,
  isExchangesListLoaded: false,
  tokenList: [],
  exchanges: [],
  isNoFilledPools: false,
};

const liquiditySlice = createSlice({
  name: "swapMaster",
  initialState,
  reducers: {
    setExchanges: (state, action) => {
      state.exchanges = action.payload;
      state.isExchangesListLoaded = true;
    },
    setIsNoFilledPools: (state, action) => {
      state.isNoFilledPools = action.payload;
    },
    setTokenList: (state, action) => {
      state.tokenList = action.payload;
      state.isTokenListLoaded = true;
    },
  },
});

export const { setExchanges, setIsNoFilledPools, setTokenList } = liquiditySlice.actions;

export default liquiditySlice.reducer;
