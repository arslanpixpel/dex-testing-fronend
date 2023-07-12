import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  tokenFrom: {},
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
    success: {
      isOpen: false,
      modalData: {},
    },
  },
};

const swapSlice = createSlice({
  name: "swapMaster",
  initialState,
  reducers: {
    setSwapTokenFrom: (state, action) => {
      state.tokenFrom = action.payload;
    },
    setSwapTokenTo: (state, action) => {
      state.tokenTo = action.payload;
    },
    setSwapTokens: (state, action) => {
      const { tokenFrom, tokenTo } = action.payload;

      state.tokenFrom = tokenFrom || {};
      state.tokenTo = tokenTo || {};
    },
    setSwapBalances: (state, action) => {
      const { balanceFrom, balanceTo } = action.payload;

      state.balance.from = balanceFrom;
      state.balance.to = balanceTo;
    },
    setIsSwapModalOpen: (state, action) => {
      const { modal, isOpen, modalData } = action.payload;
      const targetModal = state.modals[modal];
      targetModal.isOpen = isOpen;
      targetModal.modalData = modalData || {};

      if (!isOpen) return;

      Object.keys(state.modals).forEach(stateModal => {
        if (stateModal !== modal) state.modals[stateModal].isOpen = false;
      });
    },
    clearSwapState: () => initialState,
  },
});

export const {
  setSwapTokenFrom,
  setSwapTokenTo,
  setSwapTokens,
  setSwapBalances,
  setIsSwapModalOpen,
  clearSwapState,
} = swapSlice.actions;

export default swapSlice.reducer;
