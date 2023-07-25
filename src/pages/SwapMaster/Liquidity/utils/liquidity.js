import BigNumber from "bignumber.js";

// Utils
import { updateContract } from "../../../../models/ConcordiumContractClient";
import {
  getTokenRawAmount,
  getTokenUiAmount,
  toBigIntContractAddress,
} from "../../../../utils/format";
import {
  getBalance,
  getCCDBalance,
  updateOperator,
  getCurrentExchange,
  getExchanges,
} from "../../utils";

// Actions
import { setLiquidityBalances } from "../../../../store/reducers/SwapMaster/liquiditySlice";

// Constants
import {
  MAX_ENERGY,
  PIXPEL_CONTRACT_ADDRESS,
  PIXPEL_CONTRACT_METHODS,
  PIXPEL_SWAP_CONTRACT_INFO,
} from "../../../../config";
import { CCD_DECIMALS } from "../../../../config";

export const addLiquidity =
  ({ values }) =>
  async (dispatch, getState) => {
    const account = getState().connect.account;
    const provider = getState().connect.provider;
    const tokenTo = getState().liquidity.tokenTo;

    await updateOperator({
      provider,
      account,
      tokenAddress: tokenTo.address,
      contractName: tokenTo.contractName,
    });

    await updateContract(
      provider,
      PIXPEL_SWAP_CONTRACT_INFO,
      {
        token: { address: tokenTo.address, id: tokenTo.tokenId },
        token_amount: getTokenRawAmount(values.to, tokenTo.decimals).toString(),
      },
      account,
      PIXPEL_CONTRACT_ADDRESS,
      PIXPEL_CONTRACT_METHODS.addLiquidity,
      MAX_ENERGY,
      values.from,
    );

    await dispatch(getExchanges());
    await dispatch(getLiquidityBalances());

    const exchanges = getState().swapMaster.exchanges;
    const currentExchange = getCurrentExchange(exchanges, tokenTo);
    const lpBalance = currentExchange?.lpTokensHolderBalance;

    return lpBalance ? getTokenUiAmount(BigNumber(lpBalance), CCD_DECIMALS) : "0";
  };

export const removeLiquidity =
  ({ values }) =>
  async (dispatch, getState) => {
    const account = getState().connect.account;
    const provider = getState().connect.provider;
    const tokenTo = getState().liquidity.tokenTo;

    await updateContract(
      provider,
      PIXPEL_SWAP_CONTRACT_INFO,
      {
        token: { address: tokenTo.address, id: tokenTo.tokenId },
        lp_token_amount: getTokenRawAmount(values.lp, CCD_DECIMALS).toString(),
      },
      account,
      PIXPEL_CONTRACT_ADDRESS,
      PIXPEL_CONTRACT_METHODS.removeLiquidity,
      MAX_ENERGY,
    );

    await dispatch(getExchanges());
    await dispatch(getLiquidityBalances());

    const exchanges = getState().swapMaster.exchanges;
    const currentExchange = getCurrentExchange(exchanges, tokenTo);
    const lpBalance = currentExchange?.lpTokensHolderBalance;

    return lpBalance ? getTokenUiAmount(BigNumber(lpBalance), CCD_DECIMALS) : "0";
  };

export const getLiquidityBalances = () => async (dispatch, getState) => {
  const tokenList = getState().swapMaster.tokenList;
  const tokenFrom = tokenList[0];
  const tokenTo = getState().liquidity.tokenTo;

  const tokenFromBalance = await dispatch(getCCDBalance());

  const tokenToBalance = tokenTo.address
    ? await dispatch(
        getBalance({
          tokenAddress: toBigIntContractAddress(tokenTo.address),
          tokenId: tokenTo.tokenId,
          contractName: tokenTo.contractName,
        }),
      )
    : BigInt(0);

  dispatch(
    setLiquidityBalances({
      balanceFrom: getTokenUiAmount(BigNumber(tokenFromBalance?.toString()), tokenFrom.decimals),
      balanceTo: getTokenUiAmount(BigNumber(tokenToBalance?.toString()), tokenTo.decimals),
    }),
  );
};
