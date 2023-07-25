import create from "zustand";

/**
 * Value store to be used for deposit/withdraw flows.
 */
export const useTransactionFlowStore = create(set => ({
  setAmount: amount => set({ amount, transactionHash: undefined }),
  setToken: token => set({ token, transactionHash: undefined }),
  setTransactionHash: transactionHash => set({ transactionHash }),
  clear: () => set({ amount: undefined, token: undefined, transactionHash: undefined }),
}));
