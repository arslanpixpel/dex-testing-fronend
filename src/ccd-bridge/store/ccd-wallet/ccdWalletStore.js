import create from "zustand";

const useCCDWalletStore = create(set => ({
  account: undefined,
  isActive: false,
  setWallet: address => {
    set({ account: address, isActive: true });
    localStorage["CCP_CCD_connected"] = true;
  },
  deleteWallet: () => {
    set({
      account: undefined,
      isActive: false,
    });
    delete localStorage["CCP_CCD_connected"];
  },
}));

export default useCCDWalletStore;
