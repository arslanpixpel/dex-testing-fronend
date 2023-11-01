import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  provider: null,
  account: "",
};

const connectSlice = createSlice({
  name: "connect",
  initialState,
  reducers: {
    setProvider: (state, action) => {
      state.provider = action.payload;
    },
    setAccount: (state, action) => {
      state.account = action.payload;
    },
    clearConnectState: () => initialState,
  },
});

export const { setProvider, setAccount, clearConnectState } = connectSlice.actions;

export default connectSlice.reducer;
