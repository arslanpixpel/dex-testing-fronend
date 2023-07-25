import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";

// Components
import Loader from "../../../components/Loader/Loader";
import { MainButton } from "../../../components/Button/MainButton";

// Utils
import { handleSwap } from "./utils";

// Actions
import { setIsSwapModalOpen } from "../../../store/reducers/SwapMaster/swapSlice";

const SwapModal = () => {
  const dispatch = useDispatch();
  const [isProcessing, setIsProcessing] = useState(false);
  const isShowModal = useSelector(s => s.swap.modals.confirm.isOpen);
  const tokenTo = useSelector(s => s.swap.tokenTo);
  const tokenFrom = useSelector(s => s.swap.tokenFrom);
  const {
    values = {},
    fromPerToAmount,
    toPerFromAmount,
  } = useSelector(s => s.swap.modals.confirm.modalData);

  if (!isShowModal) return null;

  const closeModal = () => {
    dispatch(setIsSwapModalOpen({ modal: "confirm", isOpen: false }));
    setIsProcessing(false);
  };

  const onConfirm = async () => {
    setIsProcessing(true);
    let txnHash;

    try {
      const outcomes = await dispatch(handleSwap({ amountFrom: values.from, amountTo: values.to }));

      if (outcomes) {
        const targetOutcome = Object.values(outcomes)[0];

        txnHash = targetOutcome?.hash;
      }
    } catch (e) {
      setIsProcessing(false);
      closeModal();
      console.error(e);

      return;
    }

    setIsProcessing(false);
    dispatch(
      setIsSwapModalOpen({
        modal: "success",
        isOpen: true,
        modalData: { values, fromPerToAmount, toPerFromAmount, txnHash },
      }),
    );
  };

  return (
    <div className="fixed inset-0 z-10 overflow-y-auto">
      <div className="fixed inset-0 w-full h-full bg-black opacity-40" onClick={closeModal} />
      <div className="flex items-center min-h-screen px-4 py-8">
        <div className="relative flex flex-col w-full sm:p-[50px] xs:p-[40px] 1xs:p-[30px] 2xs:p-[20px] p-[10px] mx-auto text-lg bg-app-black-modal rounded-xl xs:w-auto">
          <div className="flex mb-5">
            <div className="text-xl font-medium 2xs:text-2xl">Swap Confirmation</div>
          </div>
          <div className="flex flex-col gap-1 px-3 py-2 rounded-md 2xs:py-5 2xs:px-7 bg-app-black mb-7">
            <div className="flex flex-row gap-3 1xs:justify-between 2xs:w-auto">
              <div className="flex 1xs:w-26 ">
                <div className="text-xs font-medium 2xs:text-base text-slate-400">Spending</div>
              </div>
              <div className="flex w-56">
                <div className="text-xs font-medium 2xs:text-base">
                  {values.from} {tokenFrom.symbol}
                </div>
              </div>
            </div>
            <div className="flex flex-row gap-3 1xs:justify-between">
              <div className="flex 1xs:w-26 ">
                <div className="text-xs font-medium 2xs:text-base text-slate-400">Receiving</div>
              </div>
              <div className="flex w-56">
                <div className="text-xs font-medium break-all 2xs:text-base 2xs:w-auto w:52">
                  {values.to} {tokenTo.symbol}
                </div>
              </div>
            </div>
          </div>
          <MainButton
            disabled={isProcessing}
            className="flex items-center justify-center rounded-md cursor-pointer h-14 bg-app-blue hover:bg-app-blue disabled:cursor-wait"
            onClick={onConfirm}
          >
            {isProcessing && <Loader size="md" />}
            <div className="text-lg font-medium">Confirm</div>
          </MainButton>
        </div>
      </div>
    </div>
  );
};

export default SwapModal;
