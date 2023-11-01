import LiquidityConfirmModal from "./LiquidityConfirmModal";
import LiquidityForm from "./LiquidityForm";
import LiquidityCreateModal from "./LiquidityCreateModal";

const LiquidityCard = props => {
  return (
    <>
      <LiquidityForm {...props} />
      <LiquidityConfirmModal />
      <LiquidityCreateModal />
    </>
  );
};

export default LiquidityCard;
