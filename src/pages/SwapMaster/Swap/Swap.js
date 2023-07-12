// Components
import SwapCard from "./SwapCard";
import GraphCard from "../Graph/GraphCard";

const Swap = () => {
  return (
    <div className="flex flex-col w-full gap-8 2xl:flex-row md:w-auto">
      <GraphCard />
      <SwapCard />
    </div>
  );
};

export default Swap;
