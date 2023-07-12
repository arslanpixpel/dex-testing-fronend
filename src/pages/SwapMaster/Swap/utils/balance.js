import BigNumber from "bignumber.js";

// Utils
import { getBalance, getCCDBalance } from "../../utils";
import { getTokenUiAmount, toBigIntContractAddress } from "../../../../utils/format";

// Actions
import { setSwapBalances } from "../../../../store/reducers/SwapMaster/swapSlice";

const getBalanceHelper = ({ tokenAddress, tokenId, contractName }) => {
  const isCCD = !tokenAddress;

  return isCCD ? getCCDBalance() : getBalance({ tokenAddress, tokenId, contractName });
};

export const getSwapBalances = () => async (dispatch, getState) => {
  const tokenFrom = getState().swap.tokenFrom;
  const tokenTo = getState().swap.tokenTo;

  const tokenFromBalance = await dispatch(
    getBalanceHelper({
      tokenAddress: tokenFrom.address && toBigIntContractAddress(tokenFrom.address),
      tokenId: tokenFrom.tokenId,
      contractName: tokenFrom.contractName,
    }),
  );

  const tokenToBalance = await dispatch(
    getBalanceHelper({
      tokenAddress: tokenTo.address && toBigIntContractAddress(tokenTo.address),
      tokenId: tokenTo.tokenId,
      contractName: tokenTo.contractName,
    }),
  );

  dispatch(
    setSwapBalances({
      balanceFrom: getTokenUiAmount(BigNumber(tokenFromBalance?.toString()), tokenFrom.decimals),
      balanceTo: getTokenUiAmount(BigNumber(tokenToBalance?.toString()), tokenTo.decimals),
    }),
  );
};
