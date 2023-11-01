import BigNumber from "bignumber.js";

// Utils
import { getTokenRawAmount, getTokenUiAmount } from "../../../../utils/format";
import { invokeContract } from "../../../../models/ConcordiumContractClient";
import { PixpelSwapDeserializer } from "../../../../models/PixpelSwapDeserializer";

// constants
import {
  CCD_DECIMALS,
  PIXPEL_CONTRACT_ADDRESS,
  PIXPEL_SWAP_CONTRACT_INFO,
  PIXPEL_CONTRACT_METHODS,
  MAX_CCD_DELTA,
} from "../../../../config";

export const getTokenToCcdSwapAmount = async ({ tokenData, amount }) => {
  const { address, decimals, tokenId } = tokenData;

  const returnedValue = await invokeContract(
    null,
    PIXPEL_SWAP_CONTRACT_INFO,
    PIXPEL_CONTRACT_ADDRESS,
    PIXPEL_CONTRACT_METHODS.tokenToCcdAmount,
    {
      token: { address, id: tokenId },
      token_sold: getTokenRawAmount(amount, decimals).toString(),
    },
  );

  const parsedRawAmount = new PixpelSwapDeserializer(returnedValue).readTokenToCcdAmount();

  return getTokenUiAmount(BigNumber(parsedRawAmount), CCD_DECIMALS);
};

export const getCcdToTokenSwapAmount = async ({ tokenData, amount }) => {
  const { address, tokenId, decimals } = tokenData;

  const returnedValue = await invokeContract(
    null,
    PIXPEL_SWAP_CONTRACT_INFO,
    PIXPEL_CONTRACT_ADDRESS,
    PIXPEL_CONTRACT_METHODS.ccdToTokenAmount,
    {
      token: { address, id: tokenId },
      ccd_sold: getTokenRawAmount(amount, CCD_DECIMALS).toString(),
    },
  );
  const parsedRawAmount = new PixpelSwapDeserializer(returnedValue).readCcdToTokenAmount();

  return getTokenUiAmount(BigNumber(parsedRawAmount), decimals);
};

export const getTokenToTokenSwapAmount = async ({ tokenFrom, tokenTo, amount }) => {
  const returnedValue = await invokeContract(
    null,
    PIXPEL_SWAP_CONTRACT_INFO,
    PIXPEL_CONTRACT_ADDRESS,
    PIXPEL_CONTRACT_METHODS.tokenToTokenAmount,
    {
      token: { address: tokenFrom.address, id: tokenFrom.tokenId },
      purchased_token: { address: tokenTo.address, id: tokenTo.tokenId },
      token_sold: getTokenRawAmount(amount, tokenFrom.decimals).toString(),
    },
  );
  const parsedRawAmount = new PixpelSwapDeserializer(returnedValue).readTokenToTokenAmount();

  return getTokenUiAmount(BigNumber(parsedRawAmount), tokenTo.decimals);
};

export const getAmount = amount => (dispatch, getState) => {
  const { tokenFrom, tokenTo } = getState().swap;

  switch (true) {
    case Boolean(tokenFrom.address && !tokenTo.address): {
      return getTokenToCcdSwapAmount({
        tokenData: tokenFrom,
        amount,
      });
    }

    case Boolean(!tokenFrom.address && tokenTo.address): {
      return getCcdToTokenSwapAmount({
        tokenData: tokenTo,
        amount,
      });
    }

    case Boolean(tokenFrom.address && tokenTo.address): {
      return getTokenToTokenSwapAmount({
        tokenFrom,
        tokenTo,
        amount,
      });
    }

    default:
      return 0;
  }
};

// max value for amount inputs, considering fee etc.
export const getMaxCcdAmount = ccdUiBalance => {
  const ccdUiBalanceBn = BigNumber(ccdUiBalance);
  const maxCcdAmountBn = BigNumber(MAX_CCD_DELTA);

  return ccdUiBalanceBn.isGreaterThanOrEqualTo(maxCcdAmountBn)
    ? ccdUiBalanceBn.minus(maxCcdAmountBn).decimalPlaces(CCD_DECIMALS).toString()
    : "0";
};
