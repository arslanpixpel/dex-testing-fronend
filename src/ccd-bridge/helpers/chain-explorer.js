import urls from "../config/urls";
import { formatString } from "./string";
import { addressesConfig } from "../../utils/config";
import { useChainId } from "../store/definedChainId";

export const ccdTransactionUrl = transactionHash => formatString(urls.ccdExplorer, transactionHash);
export const UseEthTransactionUrl = transactionHash => {
  const chainId = useChainId.getState().chainId;
  return `${addressesConfig[chainId]?.EXPLORER_URL}0x${transactionHash}`;
};
