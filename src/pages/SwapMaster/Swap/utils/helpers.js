import BigNumber from "bignumber.js";

// Utils
import { checkIfValidBigNumber } from "../../../../utils/format";

export const getFromPerToAmount = (values, decimals) => {
  const fromAmount = BigNumber(values.from);
  const toAmount = BigNumber(values.to);
  const result = fromAmount.dividedBy(toAmount).decimalPlaces(decimals);

  return checkIfValidBigNumber(result) ? result.toFixed() : "0";
};

export const getToPerFromAmount = (values, decimals) => {
  const fromAmount = BigNumber(values.from);
  const toAmount = BigNumber(values.to);
  const result = toAmount.dividedBy(fromAmount).decimalPlaces(decimals);

  return checkIfValidBigNumber(result) ? result.toFixed() : "0";
};
