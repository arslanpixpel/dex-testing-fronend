import { useQuery } from "react-query";
import { CacheKeys } from "../constants/CacheKeys";
import { isDefined } from "../helpers/basic";
import { tokenMetadataFor } from "../helpers/ccd-node";
import isDeposit from "../helpers/checkTransaction";
import useEthWallet from "../hooks/use-eth-wallet";
import { useApprovedWithdrawalsStore } from "../store/approved-withdraws";
import useAxiosClient from "../store/axios-client";
import { useSubmittedDepositsStore } from "../store/submitted-transactions";

/**
 * Interval in ms for querying in general
 */
const QUERY_UPDATE_INTERVAL = 60000;
/**
 * Interval in ms for querying in individual transaction status
 */
const WATCH_TRANSACTION_INTERVAL = 15000;

export const useWatchWithdraw = (params, options) => {
  const { getClient } = useAxiosClient();

  return useQuery(
    [CacheKeys.Withdraw, params],
    async () => {
      const client = await getClient();
      if (!client) throw new Error("Client not initialized.");
      const { data } = await client.watch_withdraw_tx(params);
      return JSON.parse(data);
    },
    {
      ...options,
      refetchInterval: (data, query) => {
        if (data?.concordium_event_id !== null && data?.concordium_event_id !== undefined) {
          return false;
        }

        if (options?.refetchInterval === undefined) {
          return WATCH_TRANSACTION_INTERVAL;
        }

        return typeof options?.refetchInterval === "function"
          ? options?.refetchInterval(data, query)
          : options?.refetchInterval ?? false;
      },
    },
  );
};

export const useWatchDeposit = (params, options) => {
  const { getClient } = useAxiosClient();

  return useQuery(
    [CacheKeys.Deposit, params],
    async () => {
      const client = await getClient();
      if (!client) throw new Error("Client not initialized.");
      const { data } = await client.watch_deposit_tx(params);
      return JSON.parse(data);
    },
    {
      ...options,
      refetchInterval: (data, query) => {
        if (data?.concordium_tx_hash) {
          return false;
        }

        if (options?.refetchInterval === undefined) {
          return WATCH_TRANSACTION_INTERVAL;
        }

        return typeof options?.refetchInterval === "function"
          ? options?.refetchInterval(data, query)
          : options?.refetchInterval ?? false;
      },
    },
  );
};

export const useWalletTransactions = (refetch = false) => {
  const { context } = useEthWallet();
  const { getClient } = useAxiosClient();
  const { remove: removeSubmittedDeposit } = useSubmittedDepositsStore();
  const { remove: removeSubmittedWithdrawal } = useSubmittedDepositsStore();
  const { remove: removeApprovedWithdrawal } = useApprovedWithdrawalsStore();

  /**
   * Cleans up local storage for transaction
   */
  const cleanupForTransaction = tx => {
    if (isDeposit(tx) && tx.Deposit.origin_tx_hash) {
      removeSubmittedDeposit(tx?.Deposit.origin_tx_hash);
    } else if (!isDeposit(tx) && tx.Withdraw.origin_tx_hash) {
      removeSubmittedWithdrawal(tx.Withdraw.origin_tx_hash);

      if (tx.Withdraw.status === "processed") {
        removeApprovedWithdrawal(tx.Withdraw.origin_tx_hash);
      }
    }
  };
  const wallet = context?.account;
  return useQuery(
    [CacheKeys.Wallet, context?.account ?? ""],
    async () => {
      const client = await getClient();
      if (!client) throw new Error("Client not initialized.");
      if (!wallet) {
        return undefined;
      }
      const { data } = await client.wallet_txs({ wallet });
      const parsedData = JSON.parse(data);
      parsedData.forEach(tx => {
        cleanupForTransaction(tx);
      });

      return parsedData;
    },
    { refetchInterval: refetch && QUERY_UPDATE_INTERVAL, enabled: refetch },
  );
};

export const usePendingWithdrawals = () => {
  const result = useWalletTransactions(true);
  const data = result?.data
    ?.map(tx => {
      if (isDeposit(tx) || tx.Withdraw.status !== "pending") {
        return undefined;
      }

      return tx.Withdraw;
    })
    .filter(isDefined);

  return { ...result, data };
};

export const useTokens = () => {
  const { getClient } = useAxiosClient();
  return useQuery(
    [CacheKeys.Tokens],
    async () => {
      const client = await getClient();
      if (!client) throw new Error("Client not initialized.");
      const { data: tokens } = await client.list_tokens();
      const parsedTokens = JSON.parse(tokens);
      const tokenPromises = parsedTokens.map(async token => {
        if (token.ccd_contract?.index === undefined || token.ccd_contract.subindex === undefined) {
          throw new Error("Expected token address to be defined");
        }

        let metadata;
        try {
          metadata = await tokenMetadataFor(
            BigInt(token.ccd_contract.index),
            BigInt(token.ccd_contract.subindex),
          );
        } catch {
          metadata = undefined;
        }
        const { url: iconUrl } =
          metadata?.thumbnail ?? metadata?.display ?? metadata?.artifact ?? {};
        return { token, iconUrl };
      });

      return Promise.all(tokenPromises);
    },
    { staleTime: Infinity },
  );
};

export const useEthMerkleProof = (params, enabled = true) => {
  const { getClient } = useAxiosClient();

  return useQuery(
    [CacheKeys.EthMerkleProof, params],
    async () => {
      const client = await getClient();

      if (!client) throw new Error("Client not initialized.");
      if (params.event_id === undefined || params.tx_hash === undefined)
        throw new Error("Should not be enabled with partial params");

      const { data } = await client.eth_merkle_proof(params);
      return JSON.parse(data);
    },
    {
      enabled:
        params.tx_hash !== undefined &&
        params.event_id !== undefined &&
        params.event_id !== null &&
        enabled,
      retry: false,
      refetchInterval: data => {
        if (data?.proof) {
          return false;
        }
        return WATCH_TRANSACTION_INTERVAL;
      },
    },
  );
};

export const useNextMerkleRoot = () => {
  const { getClient } = useAxiosClient();

  return useQuery(
    [CacheKeys.EthMerkleProof],
    async () => {
      const client = await getClient();

      if (!client) throw new Error("Client not initialized.");
      const { data } = await client.expected_merkle_root_update();
      return JSON.parse(data);
    },
    {
      refetchInterval: QUERY_UPDATE_INTERVAL,
    },
  );
};
