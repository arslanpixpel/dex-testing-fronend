import { useDispatch, useSelector } from "react-redux";

// Actions
import { setIsSwapModalOpen } from "../../../store/reducers/SwapMaster/swapSlice";

// Constants
import { NETWORK } from "../../../config";

const SwapSuccessCard = () => {
  const dispatch = useDispatch();
  const tokenFrom = useSelector(s => s.swap.tokenFrom);
  const tokenTo = useSelector(s => s.swap.tokenTo);
  const {
    values = {},
    fromPerToAmount,
    toPerFromAmount,
    txnHash,
  } = useSelector(s => s.swap.modals.success.modalData);

  const onCloseModal = () => {
    dispatch(setIsSwapModalOpen({ modal: "success", isOpen: false }));
  };

  return (
    <div className="flex flex-col items-center 2xl:w-155 sm:p-[50px] xs:p-[40px] 1xs:p-[30px] 2xs:p-[20px] p-[10px] bg-app-black rounded-xl">
      <div
        className="flex mb-4 border-2 border-dashed rounded-full border-emerald-500"
        style={{
          width: "130px",
          height: "130px",
          paddingTop: "13px",
          paddingRight: "14px",
          paddingBottom: "14px",
          paddingLeft: "14px",
        }}
      >
        <div
          className="flex px-2 py-3 rounded-full bg-emerald-500"
          style={{ width: "100px", height: "100px" }}
        >
          <svg
            className="w-20 h-20 text-white"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="0.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polyline points="20 6 9 17 4 12" />
          </svg>
        </div>
      </div>
      <div className="flex justify-center mb-5">
        <div className="text-2xl font-semibold">Successful</div>
      </div>
      <div className="flex justify-center mb-1">
        <div className="text-lg font-normal text-slate-400">You will spend</div>
      </div>
      <div className="flex justify-center mb-5">
        <div className="text-2xl font-medium">
          {values.from} {tokenFrom.symbol}
        </div>
      </div>
      <div className="flex flex-row justify-between w-full mb-3 text-xs 2xs:text-sm">
        <div className="font-normal ">Converted</div>
        <div className="font-normal ">
          {values.to} {tokenTo.symbol}
        </div>
      </div>
      <div className="flex flex-row justify-between w-full mb-3 text-xs 2xs:text-sm">
        <div className="font-normal ">Price</div>
        <div className="font-normal ">
          1 {tokenFrom.symbol} = {fromPerToAmount} {tokenTo.symbol}
        </div>
      </div>
      <div className="flex flex-row justify-between w-full mb-5 text-xs 2xs:text-sm">
        <div className="font-normal ">Inverse Price</div>
        <div className="font-normal ">
          1 {tokenTo.symbol} = {toPerFromAmount} {tokenFrom.symbol}
        </div>
      </div>
      <div className="flex flex-row justify-between w-full gap-4">
        <div
          className="flex items-center justify-center h-16 py-5 rounded-lg cursor-pointer w-44 bg-app-black-button hover:bg-app-blue"
          onClick={onCloseModal}
        >
          <div className="text-lg font-medium">Back</div>
        </div>
        <a
          href={`https://dashboard.${NETWORK}.concordium.com/lookup/${txnHash}`}
          target="_blank"
          rel="noopener noreferrer nofollow"
          className="flex items-center justify-center w-56 h-16 py-5 rounded-lg cursor-pointer bg-app-blue hover:bg-app-blue"
        >
          <div className="text-base font-medium 2xs:text-lg">View Status</div>
        </a>
      </div>
    </div>
  );
};

export default SwapSuccessCard;
