import create from "zustand";
import { persist } from "zustand/middleware";

export const useApprovedWithdrawalsStore = create(
  persist(
    (set, get) => ({
      transactions: {},
      addApproved: (ccdTx, ethTx) =>
        set({ transactions: { ...get().transactions, [ccdTx]: ethTx } }),
      remove: ccdTx => {
        if (get().transactions[ccdTx] === undefined) {
          return;
        }

        const ts = { ...get().transactions };
        delete ts[ccdTx];
        set({ transactions: ts });
      },
    }),
    { name: "eth-ccd-bridge.approved-withdrawals" },
  ),
);
