import { Buffer } from "buffer/";
import {
  AccountTransactionType,
  serializeUpdateContractParameters,
  TransactionStatusEnum,
  CcdAmount,
  SchemaVersion,
  deserializeReceiveError,
  JsonRpcClient,
  HttpProvider,
  signTransaction,
  buildBasicAccountSigner,
  createConcordiumClient,
  AccountAddress,
  TransactionExpiry,
  ConcordiumClient,
  ConcordiumGRPCClient,
} from "@concordium/web-sdk";
import { JSON_RPC_URL } from "../config";
import axios from "axios";
import { detectConcordiumProvider } from "@concordium/browser-wallet-api-helpers";

export const customRpcClient = new JsonRpcClient(new HttpProvider(JSON_RPC_URL));

/**
 * Invokes a Smart Contract.
 * @param [provider] Wallet Provider.
 * @param contractInfo Contract Constant Info.
 * @param contract Contract Address.
 * @param methodName Contract Method name to Call.
 * @param [params] Parameters to call the Contract Method with.
 * @param [invoker] Invoker Account.
 * @param [customParameter] Custom parameter
 * @returns Buffer of the return value.
 */
export async function invokeContract(
  provider,
  contractInfo,
  contract,
  methodName,
  params,
  invoker,
  customParameter,
) {
  const { contractName, schemaBuffer, serializationContractName } = contractInfo;

  const parameter =
    customParameter ||
    (params
      ? await serializeParamsWithReattempt({
          params: [serializationContractName || contractName, schemaBuffer, methodName, params],
        })
      : undefined);
  // const client = provider?.getJsonRpcClient() || customRpcClient;
  // const client = provider?.getGrpcClient() || customRpcClient;

  if (!provider) {
    provider = await detectConcordiumProvider();
  }

  const client = new ConcordiumGRPCClient(provider.grpcTransport);
  // const client = provider?.getGrpcClient() || customRpcClient;

  const contractContext = {
    parameter,
    contract,
    invoker,
    method: `${contractName}.${methodName}`,
  };

  // console.log(contractContext, " contract Context");

  const res = await client.invokeContract(contractContext);

  if (!res || res.tag === "failure") {
    try {
      const errorData =
        res.returnValue &&
        deserializeReceiveError(
          Buffer.from(res.returnValue, "hex"),
          schemaBuffer,
          contractName,
          methodName,
        );

      console.error(
        `%c::${"Deserialized error"}`,
        "background: #5ebaf2; color: #fff; border-radius: 5px; padding: 2px 5px;",
        errorData,
      );
    } catch (error) {
      console.error(
        `%c::${"Deserialization error"}`,
        "background: #5ebaf2; color: #fff; border-radius: 5px; padding: 2px 5px;",
        error,
      );
      console.error(
        `%c::${"Failure result"}`,
        "background: #5ebaf2; color: #fff; border-radius: 5px; padding: 2px 5px;",
        res,
      );
    }

    const msg =
      `failed invoking contract ` +
      `method:${methodName}, ` +
      `contract:(index: ${contract.index.toString()}, subindex: ${contract.subindex.toString()})`;

    return Promise.reject(new Error(msg, { cause: res }));
  }

  if (!res.returnValue) {
    const msg =
      `failed invoking contract, null return value` +
      `method:${methodName}, ` +
      `contract:(index: ${contract.index.toString()}, subindex: ${contract.subindex.toString()})`;

    return Promise.reject(new Error(msg, { cause: res }));
  }

  return Buffer.from(res.returnValue, "hex");
}

export async function invokeContract2(
  provider,
  contractInfo,
  contract,
  methodName,
  params,
  invoker,
  customParameter,
) {
  const { contractName, schemaBuffer, serializationContractName } = contractInfo;

  const parameter =
    customParameter ||
    (params
      ? await serializeParamsWithReattempt({
          params: [serializationContractName || contractName, schemaBuffer, methodName, params],
        })
      : undefined);
  // const client = provider?.getJsonRpcClient() || customRpcClient;
  // const client = provider?.getGrpcClient() || customRpcClient;

  if (!provider) {
    provider = await detectConcordiumProvider();
  }

  const client = new ConcordiumGRPCClient(provider.grpcTransport);
  // const client = provider?.getGrpcClient() || customRpcClient;

  const contractContext = {
    parameter,
    contract,
    invoker,
    method: `${contractName}.${methodName}`,
  };

  // console.log(contractContext, " contract Context");

  const res = await client.invokeContract(contractContext);

  if (!res || res.tag === "failure") {
    try {
      const errorData =
        res.returnValue &&
        deserializeReceiveError(
          Buffer.from(res.returnValue, "hex"),
          schemaBuffer,
          contractName,
          methodName,
        );

      console.error(
        `%c::${"Deserialized error"}`,
        "background: #5ebaf2; color: #fff; border-radius: 5px; padding: 2px 5px;",
        errorData,
      );
    } catch (error) {
      console.error(
        `%c::${"Deserialization error"}`,
        "background: #5ebaf2; color: #fff; border-radius: 5px; padding: 2px 5px;",
        error,
      );
      console.error(
        `%c::${"Failure result"}`,
        "background: #5ebaf2; color: #fff; border-radius: 5px; padding: 2px 5px;",
        res,
      );
    }

    const msg =
      `failed invoking contract ` +
      `method:${methodName}, ` +
      `contract:(index: ${contract.index.toString()}, subindex: ${contract.subindex.toString()})`;

    return Promise.reject(new Error(msg, { cause: res }));
  }

  if (!res.returnValue) {
    const msg =
      `failed invoking contract, null return value` +
      `method:${methodName}, ` +
      `contract:(index: ${contract.index.toString()}, subindex: ${contract.subindex.toString()})`;

    return Promise.reject(new Error(msg, { cause: res }));
  }

  return Buffer.from(res.returnValue, "hex");
}

/**
 * Updates a Smart Contract.
 * @param provider Wallet Provider.
 * @param contractInfo Main contract info (schemaBuffer, contractName)
 * @param paramJson Parameters to call the Contract Method with.
 * @param {string} account  Account to Update the contract with.
 * @param {Object} contractAddress Contract Address.
 * @param  {bigint}  contractAddress.index    Contract Address index
 * @param  {bigint}  contractAddress.subindex    Contract Address subindex
 * @param {string} methodName Contract Method name to Call.
 * @param {bigint} maxContractExecutionEnergy Maximum energy allowed to execute.
 * @param {number} ccdUiAmount CCD Amount to update the contract with.
 * @returns Update contract Outcomes.
 */
export async function updateContract(
  provider,
  contractInfo,
  paramJson,
  account,
  contractAddress,
  methodName,
  maxContractExecutionEnergy = BigInt(9999),
  ccdUiAmount = 0,
) {
  const { schemaBuffer, contractName, serializationContractName, schemaWithContext } = contractInfo;
  const parameter = serializeParams(
    serializationContractName || contractName,
    schemaBuffer,
    methodName,
    paramJson,
  );
  let txnHash = await provider.sendTransaction(
    account,
    AccountTransactionType.Update,
    {
      maxContractExecutionEnergy,
      address: contractAddress,
      message: parameter,
      amount: toCcd(ccdUiAmount),
      receiveName: `${contractName}.${methodName}`,
    },
    paramJson,
    schemaWithContext || schemaBuffer.toString("base64"),
    SchemaVersion.V2,
  );
  //const outcomes = await waitForTransaction(provider, txnHash);
  const client = new ConcordiumGRPCClient(provider.grpcTransport);
  const outcomes = await client.waitForTransactionFinalization(txnHash);
  // console.log(outcomes, "waitForTransaction final Liquidity");
  // const outcomes = await provider.getGrpcClient().waitForTransactionFinalization(txnHash);
  // return ensureValidOutcome(outcomes);

  return outcomes;
  // return txnHash;
}

// /**
//  * Waits for the input transaction to Finalize.
//  * @param provider Wallet Provider.
//  * @param txnHash Hash of Transaction.
//  * @returns Transaction outcomes.
//  */
// function waitForTransaction(provider, txnHash) {
//   return new Promise((res, rej) => {
//     _wait(provider, txnHash, res, rej);
//   });
// }

// function ensureValidOutcome(outcomes) {
//   if (!outcomes) {
//     throw Error("Null Outcome");
//   }

//   let successTxnSummary = Object.keys(outcomes)
//     .map(k => outcomes[k])
//     .find(s => s.result.outcome === "success");

//   if (!successTxnSummary) {
//     console.log(
//       `%c::${"outcomes"}`,
//       "background: #5ebaf2; color: #fff; border-radius: 5px; padding: 2px 5px;",
//       outcomes,
//     );
//     let failures = Object.keys(outcomes)
//       .map(k => outcomes[k])
//       .filter(s => s.result.outcome === "reject")
//       .map(s => s.result.rejectReason.tag)
//       .join(",");
//     throw Error(`Transaction failed, reasons: ${failures}`);
//   }

//   return outcomes;
// }

/**
 * Uses Contract Schema to serialize the contract parameters with reattempts on error.
 * Created because of concordium_rust_binding bug (wbindgen_add_to_stack_pointer)
 * @param {Array} params Contract Method params in JSON.
 * @param {Object} options Reattempt options
 * @param  {number}  options.maxTimeout Max waiting time
 * @param  {number}  options.step Step between reattempts
 * @param {number} [currentTimeout]
 * @returns Serialize buffer of the input params.
 */
function serializeParamsWithReattempt({
  params,
  options = { maxTimeout: 2000, step: 200 },
  currentTimeout = 0,
}) {
  const { maxTimeout, step } = options;

  return new Promise((resolve, reject) => {
    try {
      const serializedParams = serializeParams(...params);

      resolve(serializedParams);
    } catch (error) {
      if (currentTimeout >= maxTimeout) {
        return reject(error);
      }

      setTimeout(() => {
        resolve(
          serializeParamsWithReattempt({ params, options, currentTimeout: currentTimeout + step }),
        );
      }, step);
    }
  });
}

/**
 * Uses Contract Schema to serialize the contract parameters.
 * @param contractName Name of the Contract.
 * @param schema  Buffer of Contract Schema.
 * @param methodName Contract method name.
 * @param params Contract Method params in JSON.
 * @returns Serialize buffer of the input params.
 */
export function serializeParams(contractName, schema, methodName, params) {
  return serializeUpdateContractParameters(contractName, methodName, params, schema);
}

// function _wait(provider, txnHash, res, rej) {
//   // eslint-disable-next-line no-undef
//   console.log(provider, txnHash, "params fro wait");
//   setTimeout(() => {
//     provider
//       // .getJsonRpcClient()
//       .getGrpcClient()
//       .getTransactionStatus(txnHash)
//       .then(txnStatus => {
//         if (!txnStatus) {
//           return rej("Transaction Status is null");
//         }

//         console.info(`txn : ${txnHash}, status: ${txnStatus?.status}`);

//         if (txnStatus?.status === TransactionStatusEnum.Finalized) {
//           return res(txnStatus.outcomes);
//         }

//         _wait(provider, txnHash, res, rej);
//       })
//       .catch(err => rej(err));
//   }, 1000);
// }

function _wait(provider, txnHash, res, rej) {
  console.log(provider, txnHash, "params fro wait");
  setTimeout(() => {
    provider
      .getGrpcClient()
      .waitForTransactionFinalization(txnHash)
      .then(txnStatus => {
        if (!txnStatus) {
          return rej("Transaction Status is null");
        }

        console.info(`txn : ${txnHash}, status:`, txnStatus?.status);

        console.log(txnStatus?.status, "txnStatus?.status ");
        if (txnStatus === TransactionStatusEnum.Finalized) {
          return res(txnStatus.outcomes);
        }

        if (txnHash) {
          return res(txnHash);
        }

        _wait(provider, txnHash, res, rej);
      })
      .catch(err => rej(err));
  }, 1000);
}

const MICRO_CCD_IN_CCD = 1000000;

/**
 *
 * @param {number} ccdAmount
 * @returns {CcdAmount}
 */
function toCcd(ccdAmount) {
  return new CcdAmount(BigInt(ccdAmount * MICRO_CCD_IN_CCD));
}
