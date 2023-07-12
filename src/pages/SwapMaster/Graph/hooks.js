import { useCallback, useEffect, useMemo, useState } from "react";
import BigNumber from "bignumber.js";

// Utils
import { getChartData } from "./utils/chartData";
import { checkIfValidBigNumber } from "../../../utils/format";
import { useSelector } from "react-redux";

export const useChartData = ({ tokenFrom, tokenTo, period }) => {
  const [chartData, setChartData] = useState([]);
  const isTokenListLoaded = useSelector(s => s.swapMaster.isTokenListLoaded);

  const handleChartDataUpdate = useCallback(async () => {
    if (!isTokenListLoaded) return;

    const data = await getChartData({ tokenFrom, tokenTo, period: period.name });
    setChartData(data);
  }, [isTokenListLoaded, period.name, tokenFrom, tokenTo]);

  useEffect(() => {
    handleChartDataUpdate();
  }, [handleChartDataUpdate]);

  const percentDifference = useMemo(() => {
    if (chartData.length < 2) return 0;

    const firstItemRate = BigNumber(chartData[0].exchangeRate);
    const lastItemRate = BigNumber(chartData[chartData.length - 1].exchangeRate);
    const result = lastItemRate
      .minus(firstItemRate)
      .dividedBy(firstItemRate)
      .multipliedBy(BigNumber(100))
      .decimalPlaces(2);

    return checkIfValidBigNumber(result) ? result.toString() : "0";
  }, [chartData]);

  return {
    chartData,
    percentDifference,
  };
};
