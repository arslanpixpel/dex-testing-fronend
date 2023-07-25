export const JS_NODE_URL = "https://concordium-servernode.dev-site.space";
export const JSON_RPC_URL = "https://json-rpc-proxy-0.dev-site.space";
export const NETWORK = "testnet";

export const PIXPEL_CONTRACT_METHODS = {
  // swap
  tokenToCcdAmount: "getTokenToCcdSwapAmount",
  ccdToTokenAmount: "getCcdToTokenSwapAmount",
  tokenToTokenAmount: "getTokenToTokenSwapAmount",
  tokenToCcdSwap: "tokenToCcdSwap",
  ccdToTokenSwap: "ccdToTokenSwap",
  tokenToTokenSwap: "tokenToTokenSwap",
  // liquidity
  addLiquidity: "addLiquidity",
  removeLiquidity: "removeLiquidity",
  // exchanges
  getExchanges: "getExchanges",
  // operator
  operatorOf: "operatorOf",
};
export const CIS2_CONTRACT_METHODS = {
  updateOperator: "updateOperator",
  balanceOf: "balanceOf",
};
