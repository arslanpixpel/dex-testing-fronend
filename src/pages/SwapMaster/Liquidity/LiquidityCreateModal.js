import { useDispatch, useSelector } from "react-redux";

// Utils
import { getModalOverflow } from "../../../utils/common";

// Actions
import {
  setIsLiquidityModalOpen,
  setLiquidityActiveWindow,
} from "../../../store/reducers/SwapMaster/liquiditySlice";

// Constants
import { LIQUIDITY_WINDOWS } from "./constants";

export const LiquidityCreateModal = () => {
  const dispatch = useDispatch();
  const isShowModal = useSelector(s => s.liquidity.modals.create.isOpen);
  const tokenFrom = useSelector(s => s.swapMaster.tokenList[0]);
  const tokenTo = useSelector(s => s.liquidity.tokenTo);
  const {
    values = {},
    poolShare,
    lpBalance,
    isUnstakeMode,
  } = useSelector(s => s.liquidity.modals.create.modalData);

  if (!isShowModal) return;

  const closeModal = () => {
    dispatch(setIsLiquidityModalOpen({ modal: "create", isOpen: false }));
    dispatch(setLiquidityActiveWindow(LIQUIDITY_WINDOWS.pools));
  };

  return (
    <div className={`fixed inset-0 z-10 ${getModalOverflow()}`}>
      <div className="fixed inset-0 w-full h-full bg-black opacity-40" onClick={closeModal} />
      <div className="flex items-center min-h-screen px-4 py-8">
        <div className="relative flex flex-col mx-auto text-lg shadow-lg bg-app-black-modal rounded-xl w-158 sm:p-[50px] xs:p-[40px] 1xs:p-[30px] 2xs:p-[20px] p-[10px]">
          <div className="flex justify-center mb-2 2xs:mb-7 2xs:justify-start">
            <div className="text-lg font-medium 2xs:text-2xl">LP tokens in your wallet</div>
          </div>
          <div className="flex flex-row justify-between py-5 mb-5 rounded-md px-7 bg-app-black">
            <div className="flex flex-row items-center gap-1">
              <img className="h-6" src={tokenFrom.images?.thumbnail.url} alt={tokenFrom.symbol} />
              <p>{tokenFrom.symbol}</p>
              <span>/</span>
              <img
                className="h-6"
                src={tokenTo.images?.thumbnail.url}
                alt={tokenTo.symbol}
                style={tokenTo.style}
              />
              <p>{tokenTo.symbol}</p>
            </div>
            <div className="flex items-center">
              <div className="text-xs font-medium text-app-blue 2xs:text-base">{lpBalance}</div>
            </div>
          </div>
          {!isUnstakeMode && (
            <div className="flex flex-row justify-between py-5 mb-2 rounded-md px-7 bg-app-black">
              <div className="text-xs font-normal 2xs:text-base">Share of Pool</div>
              <div className="text-xs font-medium text-app-blue 2xs:text-base">{poolShare}%</div>
            </div>
          )}
          <div className="flex flex-row justify-between py-5 mb-2 rounded-md px-7 bg-app-black">
            <div className="text-xs font-normal 2xs:text-base">
              {isUnstakeMode ? "Received" : "Pooled"} {tokenFrom.symbol}
            </div>
            <div className="text-xs font-medium text-app-blue 2xs:text-base">{values.from}</div>
          </div>
          <div className="flex flex-row justify-between py-5 mb-5 rounded-md px-7 bg-app-black">
            <div className="text-xs font-normal 2xs:text-base">
              {isUnstakeMode ? "Received" : "Pooled"} {tokenTo.symbol}
            </div>
            <div className="text-xs font-medium text-app-blue 2xs:text-base">{values.to}</div>
          </div>
          <div
            className="flex items-center justify-center rounded-md cursor-pointer h-14 bg-app-green hover:bg-app-green"
            onClick={closeModal}
          >
            <div className="text-lg">Close</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LiquidityCreateModal;
