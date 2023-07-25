export const BridgeDirection = {
  Deposit: "deposit",
  Withdraw: "withdraw",
};

export const routes = {
  deposit: {
    path: "/swap-master/bridge/",
    overview: "/swap-master/bridge/deposit/overview",
    tx: ethTxHash => `/swap-master/bridge/deposit/${ethTxHash}`,
  },
  withdraw: {
    path: "/swap-master/bridge/withdraw",
    overview: "/swap-master/bridge/withdraw/overview",
    tx: ccdTxHash => `/swap-master/bridge/withdraw/${ccdTxHash}`,
  },
  history: (direction = BridgeDirection.Deposit) => `/swap-master/bridge/history/${direction}`,
};
