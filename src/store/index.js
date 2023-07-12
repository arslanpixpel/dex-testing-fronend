import { configureStore } from "@reduxjs/toolkit";
import cartReducer from "./reducers/cartReducer";
import withdrawReducer from "./reducers/withdrawReducer";
import connectSlice from "./reducers/connectSlice";
import swapMasterReducers from "./reducers/SwapMaster";

export const store = configureStore({
  reducer: {
    cart: cartReducer,
    withdraw: withdrawReducer,
    connect: connectSlice,
    ...swapMasterReducers,
  },
  devTools: process.env.NODE_ENV !== "production",
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ["connect/setProvider"],
        ignoredPaths: ["connect.provider"],
      },
    }),
});
