import BigNumber from "bignumber.js";
import { useDispatch, useSelector } from "react-redux";
import { FormProvider, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup/dist/yup";

// Components
import TokenSelectInput from "../../../components/TokenSelectInput/TokenSelectInput";
import { MainButton } from "../../../components/Button/MainButton";

// Actions
import {
  setIsLiquidityModalOpen,
  setLiquidityTokenTo,
} from "../../../store/reducers/SwapMaster/liquiditySlice";

// Utils
import { getFromPerToAmount, getPoolShare, getToPerFromAmount } from "./utils";
import { getMaxCcdAmount } from "../Swap/utils";
import { getCurrentExchange } from "../utils";
import { getShortTokenName, getTokenUiAmount } from "../../../utils/format";
import { capitalizeString } from "../../../utils/common";
import { validationSchema } from "./validationSchema";

// Hooks
import { useLiquidityInputsHandlers } from "./hooks";

// Constants
import { LIQUIDITY_FORM_ID, LIQUIDITY_FORM_FIELDS } from "./constants";
import { CCD_DECIMALS, LP_DATA } from "../../../config";

const LiquidityForm = ({ isUnstakeMode, isCreateMode }) => {
  const dispatch = useDispatch();
  const tokenList = useSelector(s => s.swapMaster.tokenList);
  const tokenTo = useSelector(s => s.liquidity.tokenTo);
  const tokenFrom = tokenList[0];
  console.log(tokenList);
  const exchanges = useSelector(s => s.swapMaster.exchanges);
  const exchangeData = getCurrentExchange(exchanges, tokenTo);

  const balanceFrom = useSelector(s => s.liquidity.balance.from);
  const balanceTo = useSelector(s => s.liquidity.balance.to);
  const balanceLp = isUnstakeMode
    ? getTokenUiAmount(BigNumber(exchangeData?.lpTokensHolderBalance), CCD_DECIMALS)
    : 0;
  const methods = useForm({
    defaultValues: {
      ...(isUnstakeMode && { [LIQUIDITY_FORM_FIELDS.lp]: 0 }),
      [LIQUIDITY_FORM_FIELDS.from]: 0,
      [LIQUIDITY_FORM_FIELDS.to]: 0,
    },
    resolver: yupResolver(validationSchema),
    context: {
      balanceFrom: getMaxCcdAmount(balanceFrom),
      balanceTo,
      balanceLp,
      isUnstakeMode,
      maxFromDecimals: tokenFrom.decimals,
      maxToDecimals: tokenTo.decimals,
    },
    mode: "all",
  });
  const {
    handleSubmit,
    watch,
    formState: { isSubmitting, errors },
    setValue,
  } = methods;

  const values = watch();
  const isFilledPool = exchangeData?.ccdBalance > 0 && exchangeData?.tokenBalance > 0;
  console.log({
    values,
    exchangeData: isFilledPool && exchangeData,
    tokenFrom,
    tokenTo,
  });
  const fromPerToAmount = getFromPerToAmount({
    values,
    exchangeData: isFilledPool && exchangeData,
    tokenFrom,
    tokenTo,
  });
  const toPerFromAmount = getToPerFromAmount({
    values,
    exchangeData: isFilledPool && exchangeData,
    tokenFrom,
    tokenTo,
  });
  const poolShare = getPoolShare(values, isFilledPool && exchangeData);

  const onSubmit = async values => {
    dispatch(
      setIsLiquidityModalOpen({
        modal: "confirm",
        isOpen: true,
        modalData: {
          fromPerToAmount,
          toPerFromAmount,
          values,
          poolShare,
          isUnstakeMode,
          isFilledPool,
        },
      }),
    );
  };

  const errorMessage = Object.values(errors)
    .map(({ message }) => message)
    .join(", ");

  const { onInputTokenPair, onInputLp, onMaxTokenPair, onMaxLp } = useLiquidityInputsHandlers({
    isUnstakeMode,
    isFilledPool,
    tokenTo,
    setValue,
    exchangeData,
    balanceFrom,
    balanceTo,
    balanceLp,
  });

  return (
    <div className="flex flex-col bg-app-black rounded-xl sm:p-[50px] xs:p-[40px] 1xs:p-[30px] 2xs:p-[20px] p-[10px] w-full md1:w-155">
      <div className="flex justify-center">
        <div className="text-xl font-semibold">{isUnstakeMode ? "Remove" : "Add"} liquidity</div>
      </div>
      <div className="flex justify-center mt-2 mb-6">
        <div className="text-sm font-medium text-slate-500">
          {isUnstakeMode ? "Remove" : "Add"} liquidity to recieve
          {isUnstakeMode ? " tokens" : " LP token"}
        </div>
      </div>
      {!exchangeData && (
        <div className="flex flex-col px-4 py-4 mb-8 2xs:py-8 2xs:px-8 1xs:py-12 1xs:px-12 sm:py-8 sm:px-16 rounded-xl bg-app-black-button">
          <div className="flex justify-center mb-4">
            <div className="text-base font-semibold">You are the first liquidity provider.</div>
          </div>
          <div className="flex justify-center mb-3">
            <div className="text-sm font-normal text-slate-500">
              The ratio of tokens you add will set the price of this pool
            </div>
          </div>
          <div className="flex justify-center">
            <div className="text-sm font-normal text-slate-500">
              Once you are happy with the rate clock supply to review
            </div>
          </div>
        </div>
      )}
      <FormProvider {...methods}>
        <form onSubmit={handleSubmit(onSubmit)} id={LIQUIDITY_FORM_ID}>
          {isUnstakeMode && (
            <>
              <TokenSelectInput
                name={LIQUIDITY_FORM_FIELDS.lp}
                selectedToken={LP_DATA}
                backgroundColor="bg-app-black-button"
                onInput={onInputLp}
                isWithMaxButton
                onMaxHandler={onMaxLp}
                isSelectDisabled
              />
              <div className="flex flex-row justify-end mt-1 text-sm mb-4">
                <div className="font-normal text-gray-400">Balance: {balanceLp}</div>
              </div>
            </>
          )}
          <TokenSelectInput
            name={LIQUIDITY_FORM_FIELDS.from}
            tokenList={tokenList}
            selectedToken={tokenFrom}
            disabledToken={tokenTo}
            backgroundColor="bg-app-black-button"
            onInput={onInputTokenPair}
            isWithMaxButton={!isUnstakeMode}
            onMaxHandler={onMaxTokenPair(LIQUIDITY_FORM_FIELDS.from)}
            readOnly={isUnstakeMode}
            isSelectDisabled
          />
          <div className="flex flex-row justify-end mt-1 text-sm mb-4">
            <div className="font-normal text-gray-400">Balance: {balanceFrom}</div>
          </div>
          <TokenSelectInput
            name={LIQUIDITY_FORM_FIELDS.to}
            tokenList={tokenList}
            selectedToken={tokenTo}
            disabledToken={tokenFrom}
            backgroundColor="bg-app-black-button"
            onInput={onInputTokenPair}
            isWithMaxButton={!isUnstakeMode}
            onMaxHandler={onMaxTokenPair(LIQUIDITY_FORM_FIELDS.to)}
            onTokenSelect={tokenData => {
              dispatch(setLiquidityTokenTo(tokenData));
            }}
            readOnly={isUnstakeMode}
            isSelectDisabled={isUnstakeMode}
            isAddToken={isCreateMode}
          />
          <div className="flex flex-row justify-end mt-1 text-sm">
            <div className="font-normal text-gray-400">Balance: {balanceTo}</div>
          </div>
        </form>
      </FormProvider>
      <div className="flex flex-col py-4 mt-6 mb-8 xs:py-8 rounded-xl bg-app-black-button">
        <div className="flex justify-center pb-5 mb-4 border-b-2 border-gray-500">
          <div className="text-xs font-medium 2xs:text-base">
            {isFilledPool ? "Prices" : "Initial prices"} and pool share
          </div>
        </div>
        <div className="flex flex-col text-lg font-medium 2xs:text-xs 2xs:justify-around 2xs:flex-row 1xs:text-base">
          <div className="flex flex-col items-center">
            <div className="flex flex-row justify-center">
              <div>{fromPerToAmount}</div>
            </div>
            <div>
              <span title={tokenFrom.symbol}>{getShortTokenName(tokenFrom.symbol)}</span> per&nbsp;
              <span title={tokenTo.symbol}>{getShortTokenName(tokenTo.symbol)}</span>
            </div>
          </div>
          <div className="flex flex-col items-center">
            <div className="flex flex-row justify-center">
              <div>{toPerFromAmount}</div>
            </div>
            <div>
              <span title={tokenTo.symbol}>{getShortTokenName(tokenTo.symbol)}</span> per&nbsp;
              <span title={tokenFrom.symbol}>{getShortTokenName(tokenFrom.symbol)}</span>
            </div>
          </div>
          <div className="flex flex-col items-center">
            <div className="flex flex-row justify-center">
              <div>{poolShare}%</div>
            </div>
            <div>Share of Pool</div>
          </div>
        </div>
      </div>
      <MainButton
        type="submit"
        className="p-4 h-16 mt-5 bg-app-blue text-lg disabled:bg-app-black-button hover:bg-[#50D0FB] "
        disabled={!!errorMessage || isSubmitting}
        form={LIQUIDITY_FORM_ID}
      >
        {capitalizeString(errorMessage) || "Supply"}
      </MainButton>
    </div>
  );
};

export default LiquidityForm;
