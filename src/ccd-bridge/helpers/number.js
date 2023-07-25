import { ethers } from "ethers";

export const toWei = amount => ethers.utils.parseEther(amount).toString();

export const formatAmount = decimalNumber => Math.round(+decimalNumber * 1e4) / 1e4;

export const toFractionalAmount = (integerAmount, decimals) => {
  const formatted = ethers.utils.formatUnits(integerAmount, decimals);
  const [whole, fractions] = formatted.split(".");

  if (fractions === "0") {
    return whole;
  }

  return formatted;
};
