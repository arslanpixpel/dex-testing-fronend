import BigNumber from "bignumber.js";

// parse from string like '<3677,0>'
export const parseTokenAddress = addressString => {
  const [, index, subindex] = addressString.match(/<(\d+),(\d+)>/);

  return {
    index: Number(index),
    subindex: Number(subindex),
  };
};

export const checkIfValidBigNumber = bigNumber => {
  const isBigNumber = bigNumber instanceof BigNumber;

  if (!isBigNumber) return false;

  return !bigNumber.isNaN() && bigNumber.isFinite();
};

export const getTokenRawAmount = (uiAmount, decimals = 6) =>
  BigNumber(uiAmount).multipliedBy(BigNumber(10).exponentiatedBy(decimals));

export const getTokenUiAmount = (rawAmount, decimals = 6) => {
  const uiAmount = rawAmount
    .dividedBy(BigNumber(10).exponentiatedBy(decimals))
    .decimalPlaces(decimals);

  return checkIfValidBigNumber(uiAmount) ? uiAmount.toFixed() : "0";
};

// from BigInt to params format (string)
export const toParamContractAddress = contractAddress => ({
  index: parseInt(contractAddress.index.toString()),
  subindex: parseInt(contractAddress.subindex.toString()),
});

// from params string to BigInt
export const toBigIntContractAddress = contractAddress => ({
  index: BigInt(contractAddress.index),
  subindex: BigInt(contractAddress.subindex),
});

export const getShortTokenName = symbol => {
  if (typeof symbol !== "string") return "";

  if (symbol.length <= 6) return symbol;

  return `${symbol.slice(0, 2)}..${symbol.slice(-2)}`;
};

export const isHEX = string => /^[0-9A-F]+$/i.test(string);
