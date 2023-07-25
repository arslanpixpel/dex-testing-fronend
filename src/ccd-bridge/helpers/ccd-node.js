import { createConcordiumClient } from "@concordium/web-sdk";
import ccdNode from "../config/ccd-node";
import contractNames from "../config/contractNames";
import {
  serializeMetadataParameter,
  getTokenMetadata,
  deserializeTokenMetadataReturnValue,
} from "./token-helpers";

let client;
const getClient = () => {
  if (!client) {
    client = createConcordiumClient(ccdNode.url, Number(ccdNode.port));
  }
  return client;
};

/**
 * Collapses the `Ratio` into a single number.
 * If the denominator does not divide the numerator, the function rounds up;
 */
export function collapseRatio({ numerator, denominator }) {
  const quotient = numerator / denominator;
  if (numerator % denominator === BigInt(0)) {
    return quotient;
  }
  return BigInt(1) + quotient;
}

/**
 * Gets energy to microCCD rate from the concordium node through the grpc v2 interface configured through environment variables
 */
export const getEnergyToMicroCcdRate = async () => {
  const client = getClient();
  const { euroPerEnergy, microGTUPerEuro } = await client.getBlockChainParameters();

  const denominator = euroPerEnergy.denominator * microGTUPerEuro.denominator;
  const numerator = euroPerEnergy.numerator * microGTUPerEuro.numerator;

  return collapseRatio({ numerator, denominator });
};

const getTokenUrl = async (index, subindex) => {
  const client = getClient();

  const returnValue = await client.invokeContract({
    contract: { index, subindex },
    method: `${contractNames.cis2Bridgeable}.tokenMetadata`,
    parameter: serializeMetadataParameter([""]),
  });

  if (returnValue && returnValue.tag === "success" && returnValue.returnValue) {
    return deserializeTokenMetadataReturnValue(returnValue.returnValue)[0];
  } else {
    throw new Error(`Token does not exist in contract at <${index}, ${subindex}>`);
  }
};

export const tokenMetadataFor = async (index, subindex) => {
  const metadataUrl = await getTokenUrl(index, subindex);
  try {
    return getTokenMetadata(metadataUrl);
  } catch (e) {
    throw new Error(`Failed to get metadata for contract at <${index}, ${subindex}>`);
  }
};

export const waitForTransactionFinalization = (hash, timeout) =>
  getClient().waitForTransactionFinalization(hash, timeout);
