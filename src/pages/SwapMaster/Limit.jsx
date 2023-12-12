import React from "react";
import LimitCard from "./LimitCard";
import GraphCard from "./Graph/GraphCard";
import SwapModal from "./Swap/SwapModal";
import LimitOrders from "./LimitOrders";
import { useSelector } from "react-redux";
import LimitSuccessCard from "./LimitSuccess";
//import SwapSuccessCard from "./Swap/SwapSuccessCard";

const Limit = () => {
  const limitsuccessmodal = useSelector(s => s.swap.limitsuccessmodal);
  return (
    <>
      <div className="grid grid-cols-1 w-full gap-8 2xl:grid-cols-2 md:w-auto">
        <GraphCard />
        <LimitCard />
        <SwapModal />
        {/* {isSuccessModalOpen && <SwapSuccessCard />} */}
        <LimitOrders />
        {limitsuccessmodal && <LimitSuccessCard />}
      </div>
    </>
  );
};

export default Limit;
