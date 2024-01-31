import { Buffer } from "buffer/";
import Base58 from "base-58";

// Utils
import {
  customRpcClient,
  invokeContract,
  invokeContract2,
} from "../../../models/ConcordiumContractClient";

// Constants
import { CIS2_CONTRACT_METHODS, PIXPEL_SWAP_CONTRACT_INFO } from "../../../config";
import { PixpelSwapDeserializer } from "../../../models/PixpelSwapDeserializer";
import { AccountAddress, ConcordiumGRPCClient } from "@concordium/web-sdk";
// import { ConcordiumGRPCClient } from "@concordium/web-sdk/grpc";

export const nodeAddress = "https://grpc.testnet.concordium.com";
export const nodePort = 20000;

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

    // console.log({ tokenAddress, tokenId, contractName }, "Token Information");

    const returnedValue = await invokeContract2(
      provider,
      { ...PIXPEL_SWAP_CONTRACT_INFO, ...(contractName && { contractName }) },
      tokenAddress,
      CIS2_CONTRACT_METHODS.balanceOf,
      null,
      null,
      getBalanceParameter({ tokenId, account }),
    );
    // console.log(returnedValue, " returned Value");

    return new PixpelSwapDeserializer(returnedValue).readBalanceOf();
  };

// export const getCCDBalance = () => async (_, getState) => {
//   const { account, provider } = getState().connect;

//   if (!account || !provider) return;

//   const client = provider.getGrpcClient();
//   console.log(client, "client");
//   const blockHash = (await client.getConsensusStatus()).bestBlock;
//   console.log(blockHash, "blockHash");
//   const accountInfo = await client.getAccountInfo(account.fromBase58(account), blockHash);

//   console.log(accountInfo, "accountInfo");

//   return accountInfo.accountAmount;
// };

export const getCCDBalance = () => async (_, getState) => {
  const { account, provider } = getState().connect;

  if (!account || !provider) return;

  // const client = provider.getGrpcClient();
  // const client = customRpcClient;
  // console.log("getting Balance Fucntion");
  const client = new ConcordiumGRPCClient(provider.grpcTransport);
  // console.log(client, "Provider");
  const accountAddress = new AccountAddress(account);
  // console.log(accountAddress, "Account Address");
  // const blockHash = (await client.getConsensusStatus()).bestBlock;
  // console.log(blockHash, "Block hash");

  const accountInfo = await client.getAccountInfo(accountAddress);
  // console.log(accountInfo, "Account info");
  // console.log(accountInfo.accountAmount, "accountInfo.accountAmount");

  return accountInfo.accountAmount;
};
