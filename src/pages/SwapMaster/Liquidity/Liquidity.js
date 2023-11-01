import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";

// Components
import LiquidityPools from "./LiquidityPools";
import LiquidityCard from "./LiquidityCard";

// Hooks
import { useLiquidityDataUpdate } from "./hooks";

// Actions
import { setLiquidityActiveWindow } from "../../../store/reducers/SwapMaster/liquiditySlice";
import { LIQUIDITY_WINDOWS } from "./constants";

const Liquidity = () => {
  const dispatch = useDispatch();
  const activeWindow = useSelector(s => s.liquidity.activeWindow);
  const [formParameters, setFormParameters] = useState({});

  useLiquidityDataUpdate();

  const openLiquidityForm = params => {
    setFormParameters(params);
    dispatch(setLiquidityActiveWindow(LIQUIDITY_WINDOWS.form));
  };

  if (activeWindow === LIQUIDITY_WINDOWS.pools) {
    return <LiquidityPools openLiquidityForm={openLiquidityForm} />;
  }

  if (activeWindow === LIQUIDITY_WINDOWS.form) {
    return <LiquidityCard {...formParameters} />;
  }
};

export default Liquidity;
