import { detectConcordiumProvider } from "@concordium/browser-wallet-api-helpers";

// Utils
import { getExchanges } from "../pages/SwapMaster/utils";

// Actions
import { clearConnectState, setAccount, setProvider } from "../store/reducers/connectSlice";
import { clearSwapState } from "../store/reducers/SwapMaster/swapSlice";
import { clearLiquidityState } from "../store/reducers/SwapMaster/liquiditySlice";

export const handleDisconnect = () => dispatch => {
  dispatch(clearConnectState());
  dispatch(clearSwapState());
  dispatch(clearLiquidityState());
  dispatch(getExchanges());
};

export const handleConnect = () => dispatch => {
  detectConcordiumProvider()
    .then(provider => {
      provider
        .getMostRecentlySelectedAccount()
        .then(account => (account ? Promise.resolve(account) : provider.connect()))
        .then(account => {
          dispatch(setProvider(provider));
          dispatch(setAccount(account));
        })
        .catch(error => {
          console.error(error);
          alert("Please allow wallet connection");
        })
        .finally(() => {
          dispatch(getExchanges());
        });

      provider.removeAllListeners();

      provider.on("accountDisconnected", () => {
        dispatch(handleDisconnect());
      });

      provider.on("accountChanged", account => {
        dispatch(setAccount(account));
      });

      provider.on("chainChanged", () => {
        dispatch(handleDisconnect());
      });
    })
    .catch(() => {
      console.error(`could not find provider`);
      alert("Please download Concordium Wallet");
      dispatch(getExchanges());
    });
};
