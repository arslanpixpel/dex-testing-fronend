import { useCallback, useEffect, useRef, useState } from "react";
import { useEthMerkleProof, usePendingWithdrawals } from "../api-query/queries";
import NotifyPendingWithdrawal from "./NotifyPendingWithdrawal";
import { isDefined } from "../helpers/basic";
import { useApprovedWithdrawalsStore } from "../store/approved-withdraws";

const WatchWithdrawal = ({
  tx: { origin_event_index, origin_tx_hash, status },
  onNeedsApproval,
  onUnmount,
}) => {
  const { remove } = useApprovedWithdrawalsStore();

  if (origin_tx_hash === undefined || origin_event_index === undefined) {
    throw new Error("Dependencies not available");
  }

  const { data } = useEthMerkleProof({ tx_hash: origin_tx_hash, event_id: origin_event_index });

  useEffect(() => {
    if (data?.proof) {
      onNeedsApproval(origin_tx_hash);
    }
  }, [data?.proof, onNeedsApproval, origin_tx_hash]);

  useEffect(() => {
    if (status === "processed") {
      remove(origin_tx_hash);
    }
  }, [status, origin_tx_hash, remove]);

  useEffect(() => () => onUnmount(origin_tx_hash), [onUnmount, origin_tx_hash]);

  return null;
};

const requestedApprovals = [];

const WatchWithdrawals = () => {
  const { data: pendingWithdrawals } = usePendingWithdrawals();
  // This is used to avoid an infinite render loop, due to `pendingWithdrawals` object identity changing with every render.
  const withdrawalsBatchFingerprint = pendingWithdrawals
    ?.map(w => w.origin_tx_hash?.slice(0, 4))
    .filter(isDefined)
    .join();

  const { transactions: approvedWithdrawals } = useApprovedWithdrawalsStore();
  const notifyRef = useRef(null);
  const [needsApproval, setNeedsApproval] = useState([]);

  const handleNeedsApproval = useCallback(
    (hash: string) => {
      setNeedsApproval(n => [...n, hash]);

      // Batch approval notifications to make sure not to spam the user.
      if (!requestedApprovals.includes(hash)) {
        pendingWithdrawals
          ?.filter(
            w => w.origin_tx_hash !== undefined && !requestedApprovals.includes(w.origin_tx_hash),
          )
          .forEach(w => {
            requestedApprovals.push(w.origin_tx_hash);
          });

        notifyRef.current?.open();
      }
    },
    [setNeedsApproval, withdrawalsBatchFingerprint],
  );

  const handleUnmount = useCallback(
    hash => {
      setNeedsApproval(ns => ns.filter(n => n !== hash));
    },
    [setNeedsApproval],
  );

  if (pendingWithdrawals === undefined) {
    return null;
  }

  return (
    <>
      <NotifyPendingWithdrawal ref={notifyRef} hasPendingWithdrawal={needsApproval.length > 0} />
      {pendingWithdrawals
        .filter(
          tx =>
            tx.origin_tx_hash !== undefined && approvedWithdrawals[tx.origin_tx_hash] === undefined,
        )
        .map(tx => (
          <WatchWithdrawal
            key={tx.origin_tx_hash}
            tx={tx}
            onNeedsApproval={handleNeedsApproval}
            onUnmount={handleUnmount}
          />
        ))}
    </>
  );
};

export default WatchWithdrawals;
