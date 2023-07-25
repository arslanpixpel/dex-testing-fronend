import create, { StateCreator } from "zustand";
import { persist } from "zustand/middleware";
import { useChainId } from "./definedChainId";

const storeCreator: StateCreator = (set, get) => ({
  transactions: {},
  get: ethAccount => get().transactions[ethAccount] ?? [],
  add: (ethAccount, hash, amount, token) =>
    set({
      transactions: {
        ...get().transactions,
        [ethAccount]: [
          ...get().get(ethAccount),
          {
            chainId: useChainId.getState().chainId,
            hash,
            amount: amount.toString(),
            token,
            timestamp: Math.floor(Date.now() / 1000),
          },
        ],
      },
    }),
  remove: hash => {
    const [account, transactions] =
      Object.entries(get().transactions).find(([, txs]) => txs.some(tx => tx.hash === hash)) ?? [];

    if (!account || !transactions?.length) {
      return;
    }

    set({
      transactions: {
        ...get().transactions,
        [account]: transactions.filter(tx => tx.hash !== hash),
      },
    });
  },
});

export const useSubmittedDepositsStore = create(
  persist(storeCreator, {
    name: "eth-ccd-bridge.submitted-deposits",
  }),
);

export const useSubmittedWithdrawalsStore = create(
  persist(storeCreator, {
    name: "eth-ccd-bridge.submitted-withdrawals",
  }),
);
