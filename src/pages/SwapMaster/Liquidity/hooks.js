import BigNumber from "bignumber.js";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

// Utils
import { getLiquidityBalances } from "./utils";
import { getMaxCcdAmount } from "../Swap/utils";
import { getTokenRawAmount, getTokenUiAmount } from "../../../utils/format";

// Actions
import { setLiquidityActiveWindow } from "../../../store/reducers/SwapMaster/liquiditySlice";

// Constants
import {
  LIQUIDITY_FORM_FIELDS,
  LIQUIDITY_WINDOWS,
  LIQUIDITY_ADD_TOKEN_FORM_FIELDS,
} from "./constants";
import { CCD_DECIMALS } from "../../../config";

export const useLiquidityDataUpdate = () => {
  const dispatch = useDispatch();
  const isConnected = useSelector(s => !!s.connect.account);
  const liquidityTokenTo = useSelector(s => s.liquidity.tokenTo);

  useEffect(() => {
    if (!isConnected) return;

    dispatch(getLiquidityBalances());
  }, [dispatch, isConnected, liquidityTokenTo]);

  useEffect(() => {
    dispatch(setLiquidityActiveWindow(LIQUIDITY_WINDOWS.pools));
  }, [dispatch]);
};

export const useLiquidityInputsHandlers = ({
  isUnstakeMode,
  isFilledPool,
  tokenTo,
  exchangeData,
  balanceLp,
  balanceFrom,
  balanceTo,
  setValue,
}) => {
  const handleAddLiquidityAmount = (name, value) => {
    const isFromField = name === LIQUIDITY_FORM_FIELDS.from;
    const targetField = isFromField ? LIQUIDITY_FORM_FIELDS.to : LIQUIDITY_FORM_FIELDS.from;
    const decimalsFrom = isFromField ? CCD_DECIMALS : tokenTo.decimals;
    const decimalsTo = isFromField ? tokenTo.decimals : CCD_DECIMALS;
    const sourceRawAmount = getTokenRawAmount(value, decimalsFrom);
    const multiplier = BigNumber(isFromField ? exchangeData.tokenBalance : exchangeData.ccdBalance);
    const divider = BigNumber(isFromField ? exchangeData.ccdBalance : exchangeData.tokenBalance);
    const roundingMode = isFromField ? BigNumber.ROUND_UP : BigNumber.ROUND_DOWN;

    const targetRawAmount = sourceRawAmount
      .multipliedBy(multiplier)
      .dividedBy(divider)
      .decimalPlaces(decimalsTo, roundingMode);
    setValue(targetField, getTokenUiAmount(targetRawAmount, decimalsTo), {
      shouldValidate: true,
    });
  };

  const handleRemoveLiquidityAmount = value => {
    if (!exchangeData) return;

    const lpTokensSupply = BigNumber(exchangeData.lpTokensSupply);
    const ccdBalance = BigNumber(exchangeData.ccdBalance);
    const tokenBalance = BigNumber(exchangeData.tokenBalance);

    const lpRawAmount = getTokenRawAmount(value, CCD_DECIMALS);
    const targetCcdAmount = getTokenUiAmount(
      ccdBalance.multipliedBy(lpRawAmount).dividedBy(lpTokensSupply),
      CCD_DECIMALS,
    );
    const targetTokenAmount = getTokenUiAmount(
      tokenBalance.multipliedBy(lpRawAmount).dividedBy(lpTokensSupply),
      tokenTo.decimals,
    );

    setValue(LIQUIDITY_FORM_FIELDS.from, targetCcdAmount);
    setValue(LIQUIDITY_FORM_FIELDS.to, targetTokenAmount, { shouldValidate: true });
  };

  const onAddLiquidityInput = event => {
    const value = event.target?.value?.trim();
    const name = event.target?.name;

    handleAddLiquidityAmount(name, value);
  };

  const onInputLp = event => {
    const value = event.target?.value?.trim();

    handleRemoveLiquidityAmount(value);
  };

  const onMaxLp = () => {
    setValue(LIQUIDITY_FORM_FIELDS.lp, balanceLp, { shouldValidate: true });
    handleRemoveLiquidityAmount(balanceLp);
  };

  const onMaxAddLiquidityInput = name => () => {
    const isFromField = name === LIQUIDITY_FORM_FIELDS.from;
    const balance = isFromField ? getMaxCcdAmount(balanceFrom) : balanceTo;
    setValue(name, balance, { shouldValidate: true });

    if (isFilledPool) handleAddLiquidityAmount(name, balance);
  };

  const onAddTokenInput = event => {
    const value = event.target?.value?.trim();
    setValue(LIQUIDITY_ADD_TOKEN_FORM_FIELDS[event.target.name], value, { shouldValidate: true });
  };

  return {
    onInputTokenPair: isFilledPool && !isUnstakeMode ? onAddLiquidityInput : () => null,
    onMaxTokenPair: !isUnstakeMode ? onMaxAddLiquidityInput : () => null,
    onInputLp,
    onMaxLp,
    onAddTokenInput,
  };
};
