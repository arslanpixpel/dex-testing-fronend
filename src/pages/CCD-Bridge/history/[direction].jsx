import { useParams } from "react-router-dom";
import History from "../../../ccd-bridge/components/templates/history";
import { BridgeDirection } from "../../../ccd-bridge/constants/routes";

const TransferHistory = () => {
  const { direction } = useParams();

  return <History depositSelected={direction === BridgeDirection.Deposit} />;
};

export default TransferHistory;
