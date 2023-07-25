import TransferProgress from "../../../ccd-bridge/components/templates/transfer-progress";
import { routes } from "../../../ccd-bridge/constants/routes";
import { useEffect, useState } from "react";
import useRootManagerContract from "../../../ccd-bridge/contracts/use-root-manager";
import { useApprovedWithdrawalsStore } from "../../../ccd-bridge/store/approved-withdraws";
import { useEthMerkleProof, useWatchWithdraw } from "../../../ccd-bridge/api-query/queries";
import { useNavigate, useParams } from "react-router-dom";
import { useApprovalClicked } from "../../../ccd-bridge/store/approvalClicked";

const WithdrawTransactionStatus = () => {
  const navigate = useNavigate();
  const { tx } = useParams();

  const { data: txData } = useWatchWithdraw(tx !== undefined ? { tx_hash: tx } : undefined, {
    enabled: tx !== undefined,
  });
  const { withdraw } = useRootManagerContract();
  const { addApproved, transactions: approvedTransactions } = useApprovedWithdrawalsStore();
  const [pendingWallet, setPendingWallet] = useState(false);

  const { data: merkleProofData } = useEthMerkleProof(
    { event_id: txData?.concordium_event_id, tx_hash: tx },
    txData?.status !== "processed", // Disable the query when transaction has been processed.
  );
  const { setClicked } = useApprovalClicked();

  useEffect(() => {
    if (tx === undefined) {
      navigate(routes.withdraw.path, { replace: true });
    }
  }, []);

  const handleApprovalRequest = async (setError, setStatus) => {
    if (
      merkleProofData?.proof === undefined ||
      merkleProofData?.params === undefined ||
      tx === undefined
    )
      throw new Error("Dependencies for withdrawal request not available");

    try {
      setPendingWallet(true);
      setStatus("Waiting for approval in Ethereum wallet");
      const approvalTx = await withdraw(merkleProofData.params, merkleProofData.proof);

      setStatus("Waiting for transaction to be confirmed");
      setClicked(true);
      await approvalTx.wait(1);

      addApproved(tx, approvalTx.hash);
      setClicked(false);
    } catch {
      setError("Transaction rejected");
    } finally {
      setPendingWallet(false);
    }
  };

  const hasApproved = approvedTransactions[tx ?? ""] !== undefined;
  const canWithdraw =
    merkleProofData?.proof !== undefined && merkleProofData.params !== undefined && !hasApproved;

  return (
    <TransferProgress
      isWithdraw
      transferStatus={txData?.status}
      canWithdraw={canWithdraw}
      onRequestApproval={handleApprovalRequest}
      disableContinue={pendingWallet}
    />
  );
};

export default WithdrawTransactionStatus;
