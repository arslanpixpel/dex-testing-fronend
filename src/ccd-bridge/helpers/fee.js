import { ethers } from "ethers";

const CCD_DECIMALS = 6;

const microCcdToCcd = number => ethers.utils.formatUnits(number, CCD_DECIMALS);

export const renderGasFeeEstimate = (fee, ethPrice) =>
  `~${fee.toFixed(8)} ETH (~${(fee * ethPrice).toFixed(4)} USD)`;

export const renderEnergyFeeEstimate = (microCcdFee, ccdPrice) => {
  const ccdFee = Number(microCcdToCcd(microCcdFee));
  return `~${ccdFee.toFixed(4)} CCD (~${(ccdFee * ccdPrice).toFixed(4)} USD)`;
};
