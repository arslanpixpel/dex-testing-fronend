import { ethers } from "ethers";
import Transfer from "../../ccd-bridge/components/templates/transfer";
import addresses from "../../ccd-bridge/config/addresses";
import useGenerateContract from "../../ccd-bridge/contracts/use-generate-contract";
import useRootManagerContract from "../../ccd-bridge/contracts/use-root-manager";
import { noOp } from "../../ccd-bridge/helpers/basic";
import useEthWallet from "../../ccd-bridge/hooks/use-eth-wallet";
import { useAsyncMemo } from "../../ccd-bridge/hooks/utils";
import { useTransactionFlowStore } from "../../ccd-bridge/store/transaction-flow";

const Deposit = () => {
  const { token } = useTransactionFlowStore();
  const { estimateGas } = useRootManagerContract();
  const { context } = useEthWallet();
  const { getBalance } = useGenerateContract(
    token?.eth_address || "", // address or empty string because the address is undefined on first renders
    !!token, // plus it's disabled on the first render anyway
  );

  const maxTransferValue = useAsyncMemo(
    async () => {
      if (token?.eth_address !== addresses.eth || !context.account) {
        return undefined;
      }

      const ethBalance = await getBalance();
      const gasFeeFractional = await estimateGas(ethBalance, token, "deposit");

      if (!gasFeeFractional) {
        return undefined;
      }

      const gasFee = ethers.utils.parseEther(gasFeeFractional).toBigInt();

      // Double the gas estimate as an attempt to align with metamask max estimate (for the most commonly used gas setting).
      // This max estimate seems to vary a lot (anywhere between 130% to 200% of the "base fee").
      const conservativeGasFee = gasFee * BigInt(2);
      const max = ethBalance - conservativeGasFee;
      return { value: max > BigInt(0) ? max : BigInt(0), deductedFee: conservativeGasFee };
    },
    noOp,
    [token?.eth_address, context.account],
  );

  return (
    <>
      <Transfer isDeposit maxTransferValue={maxTransferValue} />
    </>
  );
};

export default Deposit;
