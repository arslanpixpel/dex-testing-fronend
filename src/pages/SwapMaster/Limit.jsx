import React from "react";
import LimitCard from "./LimitCard";
import GraphCard from "./Graph/GraphCard";
import SwapModal from "./Swap/SwapModal";
//import { useSelector } from "react-redux";
//import SwapSuccessCard from "./Swap/SwapSuccessCard";

const Limit = () => {
  // const isSuccessModalOpen = useSelector(s => s.swap.modals.success.isOpen);
  return (
    <>
      <div className="flex flex-col w-full gap-8 2xl:flex-row md:w-auto">
        <GraphCard />
        <LimitCard />
        <SwapModal />
        {/* {isSuccessModalOpen && <SwapSuccessCard />} */}
      </div>
    </>
  );
};

export default Limit;
