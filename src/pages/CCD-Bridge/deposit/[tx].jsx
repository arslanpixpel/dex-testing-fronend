import TransferProgress from "../../../ccd-bridge/components/templates/transfer-progress";
import { useWatchDeposit } from "../../../ccd-bridge/api-query/queries";
import { routes } from "../../../ccd-bridge/constants/routes";
import { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

const DepositTransactionStatus = () => {
  const navigate = useNavigate();
  const { tx } = useParams();
  const { data } = useWatchDeposit(tx !== undefined ? { tx_hash: tx } : undefined, {
    enabled: tx !== undefined,
  });

  useEffect(() => {
    if (tx === undefined) {
      navigate(routes.deposit.path, { replace: true });
    }
  }, [tx]);

  return <TransferProgress transferStatus={data?.status} />;
};

export default DepositTransactionStatus;
