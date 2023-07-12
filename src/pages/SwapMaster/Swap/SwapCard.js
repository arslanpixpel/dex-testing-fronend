import { useSelector } from "react-redux";

// Components
import SwapModal from "./SwapModal";
import SwapSuccessCard from "./SwapSuccessCard";

// Constants
import SwapFormContainer from "./SwapFormContainer";

const SwapCard = () => {
  const isSuccessModalOpen = useSelector(s => s.swap.modals.success.isOpen);

  return (
    <>
      {isSuccessModalOpen ? <SwapSuccessCard /> : <SwapFormContainer />}
      <SwapModal />
    </>
  );
};

export default SwapCard;
