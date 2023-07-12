import { createSlice } from "@reduxjs/toolkit";

// Constants
import { LIQUIDITY_WINDOWS } from "../../../pages/SwapMaster/Liquidity/constants";

const initialState = {
  tokenTo: {},
  balance: {
    from: 0,
    to: 0,
  },
  modals: {
    confirm: {
      isOpen: false,
      modalData: {},
    },
    create: {
      isOpen: false,
      modalData: {},
    },
    createToken: {
      isOpen: false,
      modalData: {},
    },
  },
  activeWindow: LIQUIDITY_WINDOWS.pools,
};

const liquiditySlice = createSlice({
  name: "liquidity",
  initialState,
  reducers: {
    setLiquidityTokenTo: (state, action) => {
      state.tokenTo = action.payload || {};
    },
    setLiquidityBalances: (state, action) => {
      const { balanceFrom, balanceTo } = action.payload;

      state.balance.from = balanceFrom;
      state.balance.to = balanceTo;
    },
    setIsLiquidityModalOpen: (state, action) => {
      const { modal, isOpen, modalData } = action.payload;
      const targetModal = state.modals[modal];
      targetModal.isOpen = isOpen;
      targetModal.modalData = modalData || {};

      if (!isOpen) return;

      Object.keys(state.modals).forEach(stateModal => {
        if (stateModal !== modal) state.modals[stateModal].isOpen = false;
      });
    },
    setLiquidityActiveWindow: (state, action) => {
      state.activeWindow = action.payload;
    },
    clearLiquidityState: () => initialState,
  },
});

export const {
  setLiquidityTokenTo,
  setLiquidityBalances,
  setIsLiquidityModalOpen,
  setLiquidityActiveWindow,
  clearLiquidityState,
} = liquiditySlice.actions;

export default liquiditySlice.reducer;
