import liquiditySlice from "./liquiditySlice";
import swapMasterSlice from "./swapMasterSlice";
import swapSlice from "./swapSlice";

const swapMasterReducers = {
  swapMaster: swapMasterSlice,
  swap: swapSlice,
  liquidity: liquiditySlice,
};

export default swapMasterReducers;
