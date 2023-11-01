import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";

// Components
import Loader from "../../../components/Loader/Loader";
import { MainButton } from "../../../components/Button/MainButton";

// Utils
import { addLiquidity, removeLiquidity } from "./utils";
import { getModalOverflow } from "../../../utils/common";

// Actions
import { setIsLiquidityModalOpen } from "../../../store/reducers/SwapMaster/liquiditySlice";

const LiquidityConfirmModal = () => {
  const dispatch = useDispatch();
  const [isProcessing, setIsProcessing] = useState(false);
  const isShowModal = useSelector(s => s.liquidity.modals.confirm.isOpen);
  const tokenFrom = useSelector(s => s.swapMaster.tokenList[0]);
  const tokenTo = useSelector(s => s.liquidity.tokenTo);
  const {
    values = {},
    fromPerToAmount,
    toPerFromAmount,
    poolShare,
    isUnstakeMode,
    isFilledPool,
  } = useSelector(s => s.liquidity.modals.confirm.modalData);

  if (!isShowModal) return null;

  const closeModal = () => {
    dispatch(setIsLiquidityModalOpen({ modal: "confirm", isOpen: false }));
    setIsProcessing(false);
  };

  const onConfirm = async () => {
    setIsProcessing(true);
    let lpBalance;

    const actionHandler = isUnstakeMode ? removeLiquidity : addLiquidity;

    try {
      console.log(values);
      lpBalance = await dispatch(actionHandler({ values }));
    } catch (e) {
      closeModal();
      console.error(e);

      return;
    }

    setIsProcessing(false);
    dispatch(
      setIsLiquidityModalOpen({
        modal: "create",
        isOpen: true,
        modalData: { values, poolShare, lpBalance, isUnstakeMode },
      }),
    );
  };

  return (
    <div className={`fixed inset-0 z-10 ${getModalOverflow()}`}>
      <div className="fixed inset-0 w-full h-full bg-black opacity-40" onClick={closeModal} />
      <div className="flex items-center min-h-screen px-4 py-8">
        <div className="relative flex flex-col mx-auto text-lg shadow-lg w-158 bg-app-black-modal rounded-xl sm:p-[50px] xs:p-[40px] 1xs:p-[30px] 2xs:p-[20px] p-[10px]">
          <div className="flex mb-5">
            <div className="text-xl font-medium 2xs:text-2xl">
              You are {isUnstakeMode ? "unstaking" : isFilledPool ? "updating" : "creating"} a pool
            </div>
          </div>
          <div className="flex flex-row items-center mb-5 gap-2">
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
          <div className="text-xs 2xs:text-base">
            {isUnstakeMode && (
              <>
                <div className="flex flex-row justify-between py-5 mb-2 rounded-md px-7 bg-app-black">
                  <div className="font-normal ">LP Deposited</div>
                  <div className="font-medium text-app-blue">{values.lp}</div>
                </div>
              </>
            )}
            <div className="flex flex-row justify-between py-5 mb-2 rounded-md px-7 bg-app-black">
              <div className="font-normal ">
                {tokenFrom.symbol} {isUnstakeMode ? "Receiving" : "Deposited"}
              </div>
              <div className="font-medium text-app-blue">{values.from}</div>
            </div>
            <div className="flex flex-row justify-between py-5 mb-2 last:mb-5 rounded-md px-7 bg-app-black">
              <div className="font-normal ">
                {tokenTo.symbol} {isUnstakeMode ? "Receiving" : "Deposited"}
              </div>
              <div className="font-medium text-app-blue">{values.to}</div>
            </div>
            {!isUnstakeMode && (
              <>
                <div className="flex flex-col py-5 mb-2 rounded-md px-7 bg-app-black">
                  <div className="flex flex-row justify-between mb-3">
                    <div className="font-normal">Rates</div>
                    <div className="font-medium text-app-blue">
                      1 {tokenFrom.symbol} = {fromPerToAmount} {tokenTo.symbol}
                    </div>
                  </div>
                  <div className="flex flex-row justify-end">
                    <div className="font-medium text-app-blue">
                      1 {tokenTo.symbol} = {toPerFromAmount} {tokenFrom.symbol}
                    </div>
                  </div>
                </div>
                <div className="flex flex-row justify-between py-5 last:mb-5 rounded-md px-7 bg-app-black">
                  <div className="font-normal">Share of Pool</div>
                  <div className="font-medium text-app-blue">{poolShare}%</div>
                </div>
              </>
            )}
          </div>
          <MainButton
            disabled={isProcessing}
            className="flex items-center justify-center rounded-md cursor-pointer h-14 bg-app-green hover:bg-[#1FF19F] disabled:cursor-wait"
            onClick={onConfirm}
          >
            {isProcessing && <Loader size="md" />}
            <div className="text-lg">
              {isUnstakeMode ? "Unstake" : isFilledPool ? "Update" : "Create"} Pool{" "}
              {isUnstakeMode ? "" : "& Supply"}
            </div>
          </MainButton>
        </div>
      </div>
    </div>
  );
};

export default LiquidityConfirmModal;
