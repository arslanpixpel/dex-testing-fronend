import { create } from "zustand";

export const useChainId = create(set => ({
  chainId: null,
  setChainId: chainId => set({ chainId }),
}));
