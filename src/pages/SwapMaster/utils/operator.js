// Utils
import { invokeContract, updateContract } from "../../../models/ConcordiumContractClient";
import { toBigIntContractAddress, toParamContractAddress } from "../../../utils/format";
import { PixpelSwapDeserializer } from "../../../models/PixpelSwapDeserializer";

// Constants
import {
  CIS2_CONTRACT_METHODS,
  PIXPEL_CONTRACT_ADDRESS,
  PIXPEL_CONTRACT_METHODS,
  PIXPEL_SWAP_CONTRACT_INFO,
} from "../../../config";
import { SchemaType } from "@concordium/browser-wallet-api-helpers";
import PixpelSwapJsonSchema from "../../../config/pixpel_swap_schema.json";

/**
 *
 * @param provider Provider
 * @param {string} account
 * @param {Object} tokenAddress Token Address.
 * @param  {number}  tokenAddress.index    Token Address index
 * @param  {number}  tokenAddress.subindex    Token Address subindex
 * @param {Object} contractAddress Contract Address.
 * @param  {bigint}  contractAddress.index    Contract Address index
 * @param  {bigint}  contractAddress.subindex    Contract Address subindex
 * @param [contractName] Name of the Contract.
 */
export const updateOperator = async ({
  provider,
  account,
  tokenAddress,
  contractAddress = PIXPEL_CONTRACT_ADDRESS,
  contractName,
}) => {
  const contractInfo = {
    ...PIXPEL_SWAP_CONTRACT_INFO,
    ...(contractName && { contractName }),
    serializationContractName: PIXPEL_SWAP_CONTRACT_INFO.contractName,
    schemaWithContext: {
      type: SchemaType.Parameter,
      value: PixpelSwapJsonSchema.entrypoints.updateOperator.parameter,
    },
  };

  const returnedValue = await invokeContract(
    provider,
    contractInfo,
    toBigIntContractAddress(tokenAddress),
    PIXPEL_CONTRACT_METHODS.operatorOf,
    [
      {
        owner: {
          Account: [account],
        },
        address: {
          Contract: [toParamContractAddress(contractAddress)],
        },
      },
    ],
  );

  const isOperator = new PixpelSwapDeserializer(returnedValue).readOperatorOf();

  if (isOperator) return;

  await updateContract(
    provider,
    contractInfo,
    [
      {
        operator: {
          Contract: [toParamContractAddress(contractAddress)],
        },
        update: { Add: [] },
      },
    ],
    account,
    toBigIntContractAddress(tokenAddress),
    CIS2_CONTRACT_METHODS.updateOperator,
  );
};
