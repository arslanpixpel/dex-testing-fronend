import { Buffer } from "buffer/";
import Base58 from "base-58";

// Utils
import { invokeContract } from "../../../models/ConcordiumContractClient";

// Constants
import { CIS2_CONTRACT_METHODS, PIXPEL_SWAP_CONTRACT_INFO } from "../../../config";
import { PixpelSwapDeserializer } from "../../../models/PixpelSwapDeserializer";

const getBalanceParameter = ({ tokenId, account }) => {
  const numberOfQueriesBuffer = Buffer.from("0100", "hex");
  const contractIdBuffer = Buffer.from(tokenId, "hex");
  const accountBuffer = Base58.decode(account).slice(1, -4);
  const contractIdLengthBuffer = Buffer.from(`0${String(contractIdBuffer.length)}`, "hex");
  const totalBufferLength =
    numberOfQueriesBuffer.length +
    contractIdBuffer.length +
    contractIdLengthBuffer.length +
    1 +
    accountBuffer.length;

  return Buffer.concat(
    [
      numberOfQueriesBuffer,
      contractIdLengthBuffer,
      contractIdBuffer,
      new Uint8Array([0]),
      accountBuffer,
    ],
    totalBufferLength,
  );
};

/**
 * Gets token balance of an account.
 *
 * @param tokenAddress - index, subindex as bigint
 * @param {string} tokenId Hex encoded Token Id.
 * @param {string} [contractName] Contract name
 * @returns Balance of the {@link tokenId} Token in CIS2 contract {@link tokenAddress}
 */
export const getBalance =
  ({ tokenAddress, tokenId, contractName }) =>
  async (dispatch, getState) => {
    const { account, provider } = getState().connect;

    if (!account || !provider) return;

    const returnedValue = await invokeContract(
      provider,
      { ...PIXPEL_SWAP_CONTRACT_INFO, ...(contractName && { contractName }) },
      tokenAddress,
      CIS2_CONTRACT_METHODS.balanceOf,
      null,
      null,
      getBalanceParameter({ tokenId, account }),
    );

    return new PixpelSwapDeserializer(returnedValue).readBalanceOf();
  };

export const getCCDBalance = () => async (_, getState) => {
  const { account, provider } = getState().connect;

  if (!account || !provider) return;

  const client = provider.getJsonRpcClient();
  const blockHash = (await client.getConsensusStatus()).bestBlock;

  const accountInfo = await client.getAccountInfo(account, blockHash);

  return accountInfo.accountAmount;
};
