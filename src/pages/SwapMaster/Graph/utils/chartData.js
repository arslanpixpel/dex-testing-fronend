import { startOfHour, addDays, addWeeks, addMonths } from "date-fns";

// Utils
import { pixpelRequest } from "../../../../utils/axios";

const getTokenParam = tokenData => {
  if (!tokenData.address) return "CCD";

  const { address, tokenId } = tokenData;

  return {
    tokenIndex: String(address.index),
    tokenSubindex: String(address.subindex),
    tokenId,
  };
};

const PERIOD_METHODS = {
  day: addDays,
  week: addWeeks,
  month: addMonths,
};

export const getChartData = async ({ tokenFrom, tokenTo, period }) => {
  const currentDate = new Date();
  const startOfHourDate = startOfHour(currentDate);

  const periodMethod = PERIOD_METHODS[period];
  const dateFrom = periodMethod(startOfHourDate, -1);

  try {
    const response = await pixpelRequest.post("/chart-data", {
      pairFrom: getTokenParam(tokenFrom),
      pairTo: getTokenParam(tokenTo),
      dateFrom: dateFrom,
      dateTo: startOfHourDate,
    });

    return response.data.chartData || [];
  } catch {
    return [];
  }
};
