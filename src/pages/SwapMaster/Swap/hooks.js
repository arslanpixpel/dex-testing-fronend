import { useCallback, useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useFormContext } from "react-hook-form";

// Utils
import { getAmount, getFromPerToAmount, getSwapBalances, getToPerFromAmount } from "./utils";
import { parseTokenAddress } from "../../../utils/format";
import { isSameToken } from "../utils";

// Actions
import { setSwapTokens } from "../../../store/reducers/SwapMaster/swapSlice";

// Constants
import { SWAP_FORM_FIELDS } from "./constants";

export const useSwapDataUpdate = () => {
  const dispatch = useDispatch();
  const {
    setValue,
    watch,
    getValues,
    trigger,
    formState: { touchedFields },
    setError,
    clearErrors,
  } = useFormContext();

  const isAmountLoading = useRef(false);
  const isConnected = useSelector(s => !!s.connect.account);
  const tokenList = useSelector(s => s.swapMaster.tokenList);
  const exchanges = useSelector(s => s.swapMaster.exchanges);
  const isExchangesListLoaded = useSelector(s => s.swapMaster.isExchangesListLoaded);
  const swapTokenFrom = useSelector(s => s.swap.tokenFrom);
  const swapTokenTo = useSelector(s => s.swap.tokenTo);
  const [fromPerToAmount, setFromPerToAmount] = useState("0");
  const [toPerFromAmount, setToPerFromAmount] = useState("0");

  const isTokenInExchange = useCallback(
    tokenData => {
      const { address, tokenId } = tokenData;
      const isCCD = !address;

      return (
        isCCD ||
        exchanges.some(exchange => {
          const { index, subindex } = parseTokenAddress(exchange.token.address);
          const isFilledPool = exchange.ccdBalance > 0 && exchange.tokenBalance > 0;

          return (
            isSameToken(
              { index: address.index, subindex: address.subindex, tokenId },
              { index, subindex, tokenId: exchange.token.id },
            ) && isFilledPool
          );
        })
      );
    },
    [exchanges],
  );

  useEffect(() => {
    if (!isExchangesListLoaded) return;

    const isValidPair = isTokenInExchange(swapTokenFrom) && isTokenInExchange(swapTokenTo);

    if (!isValidPair) {
      setError("InvalidExchange", {
        type: "custom",
        message: "Insufficient liquidity for this trade",
      });
    } else {
      clearErrors("InvalidExchange");
    }
  }, [isExchangesListLoaded, isTokenInExchange, swapTokenFrom, swapTokenTo, setError, clearErrors]);

  useEffect(() => {
    const filteredTokenList = tokenList.filter(isTokenInExchange);

    if (filteredTokenList.length < 2) return;

    // set valid pair tokens
    dispatch(setSwapTokens({ tokenFrom: filteredTokenList[0], tokenTo: filteredTokenList[1] }));
  }, [dispatch, isTokenInExchange, tokenList]);

  const handleAmount = useCallback(
    async values => {
      try {
        const targetAmount = await dispatch(getAmount(values.from));
        isAmountLoading.current = false;
        setValue(SWAP_FORM_FIELDS.to, targetAmount, { shouldValidate: true });
      } catch {
        isAmountLoading.current = false;
      }
    },
    [dispatch, setValue],
  );

  useEffect(() => {
    const subscription = watch((values, { name, type }) => {
      if (type === "change") {
        isAmountLoading.current = true;
      }

      if (name === SWAP_FORM_FIELDS.from) {
        handleAmount(values);
      }

      if (!isAmountLoading.current) {
        setFromPerToAmount(getFromPerToAmount(values, swapTokenFrom.decimals));
        setToPerFromAmount(getToPerFromAmount(values, swapTokenTo.decimals));
      }
    });

    return () => subscription.unsubscribe();
  }, [dispatch, handleAmount, setValue, swapTokenFrom, swapTokenTo, watch]);

  useEffect(() => {
    // update values when direction changes
    handleAmount(getValues());
  }, [dispatch, getValues, handleAmount, swapTokenFrom, swapTokenTo]);

  useEffect(() => {
    if (!isConnected) return;

    dispatch(getSwapBalances()).then(() => {
      const isAnyFieldTouched = Object.keys(touchedFields).length >= 1;

      if (isAnyFieldTouched) {
        trigger(Object.values(SWAP_FORM_FIELDS));
      }
    });
  }, [dispatch, isConnected, swapTokenFrom, swapTokenTo, touchedFields, trigger]);

  return {
    fromPerToAmount,
    toPerFromAmount,
    tokenList,
  };
};
