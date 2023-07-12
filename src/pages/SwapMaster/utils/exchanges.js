// Utils
import { parseTokenAddress, toParamContractAddress } from "../../../utils/format";
import { invokeContract } from "../../../models/ConcordiumContractClient";
import { PixpelSwapDeserializer } from "../../../models/PixpelSwapDeserializer";
import { isSameToken } from "./tokens";

// Actions
import {
  setExchanges,
  setIsNoFilledPools,
} from "../../../store/reducers/SwapMaster/swapMasterSlice";

// Constants
import {
  PIXPEL_CONTRACT_ADDRESS,
  PIXPEL_CONTRACT_METHODS,
  PIXPEL_SWAP_CONTRACT_INFO,
} from "../../../config";

export const getExchanges = () => async (dispatch, getState) => {
  const account = getState().connect.account;

  const holder = account
    ? { Account: [account] }
    : { Contract: [toParamContractAddress(PIXPEL_CONTRACT_ADDRESS)] };

  let exchanges;

  try {
    const returnedValue = await invokeContract(
      null,
      PIXPEL_SWAP_CONTRACT_INFO,
      PIXPEL_CONTRACT_ADDRESS,
      PIXPEL_CONTRACT_METHODS.getExchanges,
      {
        holder,
      },
    );

    exchanges = new PixpelSwapDeserializer(returnedValue).readExchanges();
  } catch {}

  if (exchanges) {
    dispatch(setExchanges(exchanges));
  }

  const isFilledPoolPresent =
    !!exchanges && exchanges.some(exchange => exchange.ccdBalance > 0 && exchange.tokenBalance > 0);

  dispatch(setIsNoFilledPools(!isFilledPoolPresent));
};

export const getCurrentExchange = (exchanges, tokenToData) =>
  exchanges.find(({ token }) => {
    const { index, subindex } = parseTokenAddress(token.address);

    return isSameToken(
      { index, subindex, tokenId: token.id },
      {
        index: tokenToData.address.index,
        subindex: tokenToData.address.subindex,
        tokenId: tokenToData.tokenId,
      },
    );
  });
