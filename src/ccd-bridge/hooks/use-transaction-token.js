import { useCallback } from "react";
import { useTokens } from "../api-query/queries";
import isDeposit from "../helpers/checkTransaction";

export function useGetTransactionToken() {
  const tokensQuery = useTokens();
  return useCallback(
    transaction => {
      if (tokensQuery.status !== "success") {
        return { status: tokensQuery.status };
      }

      const { token } =
        tokensQuery.data?.find(({ token: t }) => {
          if (isDeposit(transaction)) {
            return t.eth_address === transaction.Deposit.root_token;
          } else {
            return (
              t.ccd_contract?.index === transaction.Withdraw.child_token?.index &&
              t.ccd_contract?.subindex === transaction.Withdraw.child_token?.subindex
            );
          }
        }) ?? {};

      return { status: tokensQuery.status, token };
    },
    [tokensQuery],
  );
}
