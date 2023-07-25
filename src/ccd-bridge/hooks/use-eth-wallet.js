import { useCallback, useEffect } from "react";
import {
  useAccount,
  useBalance,
  useConnect,
  useDisconnect,
  useNetwork,
  useSigner,
  useSwitchNetwork,
} from "wagmi";
import { InjectedConnector } from "wagmi/connectors/injected";
import { useTransactionFlowStore } from "../store/transaction-flow";

// let hasInitialised = false;
const useEthWallet = () => {
  const { connect } = useConnect({ connector: new InjectedConnector() });
  const { token } = useTransactionFlowStore();
  const { disconnect: _disconnect } = useDisconnect();
  const { address, connector } = useAccount();
  const { chain } = useNetwork();

  const { error, switchNetwork } = useSwitchNetwork({
    onError: async error => {
      try {
        await window.ethereum.request({
          method: "wallet_addEthereumChain",
          params: [
            {
              chainId: "0x8ad",
              chainName: "Kava Testnet",
              nativeCurrency: {
                name: "Kava",
                symbol: "Kava",
                decimals: 18,
              },
              rpcUrls: ["https://evm.testnet.kava.io"],
            },
          ],
        });
      } catch (addError) {
        console.error("addError", addError);
      }
    },
  });
  const nativeAddress = "0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee";

  const { data: balance } = useBalance({
    address: address,
    chain: chain?.id,
    token: token?.eth_address === nativeAddress ? undefined : token?.eth_address,
  });

  const { data: signer } = useSigner();

  const context = {
    account: address,
    connector,
    connectorName: connector?.name,
    networkId: chain?.id,
    library: {
      getSigner() {
        return signer;
      },
    },
  };
  // const connect = useCallback(async () => {
  //   _connect();
  //   // if (context.networkId !== CHAIN_ID) {
  //   //   await changeChain(`0x${CHAIN_ID.toString(16)}`);
  //   // }
  //   // if (!context.active) {
  //   //   try {
  //   //     console.log("setConnector", context);
  //   //     await context.setConnector("MetaMask", { suppressAndThrowErrors: true });
  //   //   } catch (e) {
  //   //     context.unsetConnector();
  //   //   }
  //   // }
  // }, [context]);
  const disconnect = useCallback(async () => {
    _disconnect();
    delete localStorage["CCP_ETH_connected"];
  }, [context]);

  const changeChain = async (chainId: string) => {
    await window?.ethereum?.request?.({
      method: "wallet_switchEthereumChain",
      params: [{ chainId: chainId }], // chainId must be in hexadecimal numbers
    });
  };
  useEffect(() => {
    if (context.active) {
      localStorage["CCP_ETH_connected"] = true;
    }
  }, [context]);
  return {
    context,
    connect,
    disconnect,
    balance,
    switchNetwork,
    chain,
    error,
  };
};
export default useEthWallet;
