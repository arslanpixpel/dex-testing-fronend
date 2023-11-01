import BigNumber from "bignumber.js";

// Utils
import {
  checkIfValidBigNumber,
  getTokenRawAmount,
  getTokenUiAmount,
} from "../../../../utils/format";

// Constants
import { CCD_DECIMALS } from "../../../../config";

export const getFromPerToAmount = ({ values, exchangeData, tokenFrom, tokenTo }) => {
  const fromAmount = BigNumber(
    exchangeData
      ? getTokenUiAmount(BigNumber(exchangeData.ccdBalance), tokenFrom.decimals || 6)
      : values.from,
  );
  const toAmount = BigNumber(
    exchangeData
      ? getTokenUiAmount(BigNumber(exchangeData.tokenBalance), tokenTo.decimals || 6)
      : values.to,
  );
  const result = fromAmount.dividedBy(toAmount).decimalPlaces(CCD_DECIMALS);

  return checkIfValidBigNumber(result) ? result.toFixed() : "0";
};

export const getToPerFromAmount = ({ values, exchangeData, tokenFrom, tokenTo }) => {
  const fromAmount = BigNumber(
    exchangeData
      ? getTokenUiAmount(BigNumber(exchangeData.ccdBalance), tokenFrom.decimals || 6)
      : values.from,
  );
  const toAmount = BigNumber(
    exchangeData
      ? getTokenUiAmount(BigNumber(exchangeData.tokenBalance), tokenTo.decimals || 6)
      : values.to,
  );
  const result = toAmount.dividedBy(fromAmount).decimalPlaces(tokenTo.decimals || 6);

  return checkIfValidBigNumber(result) ? result.toFixed() : "0";
};

export const getPoolShare = (values, exchangeData) => {
  // first liquidity provider
  if (!exchangeData) return "100";

  const rawInputCcd = getTokenRawAmount(values.from, CCD_DECIMALS);
  const exchangeCcdBalance = BigNumber(exchangeData.ccdBalance);

  return BigNumber(100)
    .multipliedBy(rawInputCcd)
    .dividedBy(rawInputCcd.plus(exchangeCcdBalance))
    .decimalPlaces(6)
    .toString();
};
