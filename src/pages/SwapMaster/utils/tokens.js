// Utils
import { pixpelRequest } from "../../../utils/axios";

// Actions
import { setTokenList } from "../../../store/reducers/SwapMaster/swapMasterSlice";
import { setSwapTokens } from "../../../store/reducers/SwapMaster/swapSlice";
import { setLiquidityTokenTo } from "../../../store/reducers/SwapMaster/liquiditySlice";

// Constants
import { CCD_DATA } from "../../../config";

export const getTokenList = () => async dispatch => {
  let responseList;

  try {
    const { data } = await pixpelRequest("/tokens/list");
    responseList = data.response;
  } catch {
    return;
  }

  const tokenList = [CCD_DATA, ...responseList];

  dispatch(setSwapTokens({ tokenFrom: tokenList[0], tokenTo: tokenList[1] }));
  dispatch(setLiquidityTokenTo(tokenList[1]));

  dispatch(setTokenList(tokenList));
};

export const isSameToken = (token1, token2) =>
  token1.index === token2.index &&
  token1.subindex === token2.subindex &&
  token1.tokenId?.toLowerCase() === token2.tokenId?.toLowerCase();
