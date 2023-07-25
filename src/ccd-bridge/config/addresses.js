import { ensureDefined } from "../helpers/basic";
import { addressesConfig } from "../../utils/config";
import { useChainId } from "../store/definedChainId";

const eth = ensureDefined(
  process.env.REACT_APP_ETH_TOKEN_ADDRESS,
  "Expected NEXT_PUBLIC_ETH_TOKEN_ADDRESS to be provided as an environment variable",
);
const useRoot = () => {
  const chainId = useChainId.getState().chainId;
  return addressesConfig[chainId].ROOT_MANAGER_ADDRESS;
};
const useErc20Vault = () => {
  const chainId = useChainId.getState().chainId;
  return addressesConfig[chainId].ERC20_VAULT_TYPE;
};

const useBridgeManagerIndex = () => {
  const chainId = useChainId.getState().chainId;
  return addressesConfig[chainId].BRIDGE_MANAGER_INDEX;
};

const addresses = {
  /**
   * ETH Address (Ethereum)
   */
  eth,
  /**
   * Root Manager Address (Ethereum)
   */
  useRoot,
  /**
   * ERC20 vault ID, used to get the address of the ERC20 vault (Ethereum)
   */
  useErc20Vault,
  /**
   * Bridge Manager Address (Concordium)
   */
  bridgeManager: {
    index: useBridgeManagerIndex,
    subindex: process.env.REACT_APP_BRIDGE_MANAGER_SUBINDEX ?? "0",
  },
};

export default addresses;
