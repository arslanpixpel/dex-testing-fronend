import { useFormContext } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";

// Components
import TokenSelectInput from "../../../components/TokenSelectInput/TokenSelectInput";
import { MainButton } from "../../../components/Button/MainButton";

// Utils
import { changeSwapDirection, getMaxCcdAmount } from "./utils";
import { capitalizeString } from "../../../utils/common";

// Hooks
import { useSwapDataUpdate } from "./hooks";

// Actions
import {
  setIsSwapModalOpen,
  setSwapTokenFrom,
  setSwapTokenTo,
} from "../../../store/reducers/SwapMaster/swapSlice";

// Icons
import { SwapDirectionIcon } from "../icons/SwapDirectionIcon";

// Constants
import { SWAP_FORM_FIELDS } from "./constants";

const SwapForm = () => {
  const dispatch = useDispatch();
  const balanceFrom = useSelector(s => s.swap.balance.from);
  const tokenFrom = useSelector(s => s.swap.tokenFrom);
  const tokenTo = useSelector(s => s.swap.tokenTo);
  const balanceTo = useSelector(s => s.swap.balance.to);
  const isNoFilledPools = useSelector(s => s.swapMaster.isNoFilledPools);

  const {
    formState: { errors, isSubmitting },
    handleSubmit,
    getValues,
    setValue,
  } = useFormContext();

  const currentValues = getValues();

  const { tokenList, fromPerToAmount, toPerFromAmount } = useSwapDataUpdate();

  const onSubmit = values => {
    dispatch(
      setIsSwapModalOpen({
        modal: "confirm",
        isOpen: true,
        modalData: { values, fromPerToAmount, toPerFromAmount },
      }),
    );
  };

  const handleSwapDirection = () => {
    dispatch(changeSwapDirection());
  };

  const onMaxHandler = () => {
    const isCCD = !tokenFrom.address;
    const balance = isCCD ? getMaxCcdAmount(balanceFrom) : balanceFrom;

    setValue(SWAP_FORM_FIELDS.from, balance, { shouldValidate: true, shouldTouch: true });
  };

  const errorMessage = Object.values(errors)
    .map(({ message }) => message)
    .join(", ");

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className={`flex flex-col rounded-md w-full 2xl:w-155 bg-app-black sm:p-[50px] xs:p-[40px] 1xs:p-[30px] 2xs:p-[20px] p-[10px] ${
        isNoFilledPools ? "relative pointer-events-none" : ""
      }`}
    >
      <div className="flex flex-col justify-between text-lg 1xs:flex-row">
        <div className="font-semibold">From</div>
        <div className="font-normal text-gray-400">Balance: {balanceFrom}</div>
      </div>
      <TokenSelectInput
        name={SWAP_FORM_FIELDS.from}
        tokenList={tokenList}
        selectedToken={tokenFrom}
        disabledToken={tokenTo}
        backgroundColor="bg-app-black-button"
        onTokenSelect={tokenData => {
          dispatch(setSwapTokenFrom(tokenData));
        }}
        isWithMaxButton
        onMaxHandler={onMaxHandler}
        isAddToken
      />
      <div className="flex justify-center w-full mt-5">
        <div
          className="flex items-center justify-center rounded-full cursor-pointer full bg-app-black-button"
          style={{ marginBottom: "10px", width: "53px", height: "53px" }}
          onClick={handleSwapDirection}
          title="Revert swap direction"
        >
          <SwapDirectionIcon />
        </div>
      </div>
      <div className="flex flex-col justify-between text-lg 1xs:flex-row">
        <div className="font-semibold">To</div>
        <div className="font-normal text-gray-400">Balance: {balanceTo}</div>
      </div>
      <TokenSelectInput
        name={SWAP_FORM_FIELDS.to}
        tokenList={tokenList}
        selectedToken={tokenTo}
        disabledToken={tokenFrom}
        backgroundColor="bg-app-black-button"
        readOnly
        onTokenSelect={tokenData => {
          dispatch(setSwapTokenTo(tokenData));
        }}
        isAddToken
      />
      <div className="flex flex-col gap-2 mt-5 text-sm border-b-2 border-app-black">
        <div className="flex flex-row justify-between">
          <div>Price</div>
          <div>
            1 {tokenFrom.symbol} = {toPerFromAmount} {tokenTo.symbol}
          </div>
        </div>
        <div className="flex flex-row justify-between">
          <div>Inverse Price</div>
          <div>
            1 {tokenTo.symbol} = {fromPerToAmount} {tokenFrom.symbol}
          </div>
        </div>
        <div className="flex flex-row items-center justify-between mb-4">
          <div>You will receive</div>
          <div className="text-2xl text-app-blue">{currentValues[SWAP_FORM_FIELDS.to]}</div>
        </div>
      </div>
      <div className="mt-2">
        <div className="text-sm text-slate-400">Please confirm conversion within the time.</div>
      </div>
      <MainButton
        type="submit"
        disabled={!!errorMessage || isSubmitting}
        className="p-4 h-16 mt-5 bg-app-blue text-lg disabled:bg-app-black-button"
      >
        {capitalizeString(errorMessage) || "Confirm"}
      </MainButton>
      {isNoFilledPools && (
        <div className="absolute top-0 right-0 bottom-0 left-0 bg-black bg-opacity-25 flex items-start justify-center">
          <p className="text-lg pt-4">No filled pools found</p>
        </div>
      )}
    </form>
  );
};

export default SwapForm;
