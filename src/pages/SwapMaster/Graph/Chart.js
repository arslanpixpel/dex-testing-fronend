import { useMemo, useRef, useEffect, useCallback } from "react";
import {
  Chart as ChartJS,
  LineElement,
  PointElement,
  LinearScale,
  TimeScale,
  Decimation,
  LineController,
} from "chart.js";

// for decimation mechanism
import "chartjs-adapter-date-fns";

ChartJS.register(LineController, LineElement, PointElement, LinearScale, TimeScale, Decimation);

const DATASET_OPTIONS = {
  label: "Exchange Rate",
  fill: true,
  borderColor: "#2d9b71",
  pointRadius: 3,
  backgroundColor: ({ chart: { ctx: context, height } }) => {
    const grad = context.createLinearGradient(height, 0, height, height);

    grad.addColorStop(0, "rgba(46, 189, 115, 1)");
    grad.addColorStop(0.9221, "rgba(46, 189, 133, 0)");

    return grad;
  },
};

const CHART_OPTIONS = {
  responsive: true,
  scales: {
    x: {
      type: "time",
      display: false,
      grid: {
        display: false,
      },
    },
    y: {
      suggestedMin: 0,
      display: false,
      grid: {
        display: false,
      },
    },
  },
  parsing: false,
  plugins: {
    legend: {
      display: false,
    },
    decimation: {
      enabled: true,
      algorithm: "lttb",
      samples: 24,
      threshold: 24,
    },
    tooltip: {
      callbacks: {
        label: context => `${context.dataset.label}: ${context.raw.y}`,
      },
    },
  },
};

const Chart = ({ data, setHoveredPointIndex }) => {
  const canvasRef = useRef();
  const chart = useRef();

  const preparedData = useMemo(
    () =>
      data.map(({ createdAt, exchangeRate }) => ({
        x: Date.parse(createdAt),
        y: Number(exchangeRate),
      })),
    [data],
  );

  const onChartHover = useCallback(
    (e, elements) => {
      const hoveredPoint = elements.find(({ element }) => element instanceof PointElement);

      setHoveredPointIndex(hoveredPoint ? hoveredPoint.index : null);
    },
    [setHoveredPointIndex],
  );

  useEffect(() => {
    const isDataLoaded = !!preparedData.length;

    if (!canvasRef.current || !isDataLoaded) return;

    // used direct initialization instead of react-chartjs-2 because of react-chartjs-2 bug with decimation handling
    chart.current = new ChartJS(canvasRef.current, {
      type: "line",
      data: {
        datasets: [{ ...DATASET_OPTIONS, data: preparedData }],
      },
      options: { ...CHART_OPTIONS, onHover: onChartHover },
    });

    return () => chart.current?.destroy();
  }, [preparedData, onChartHover]);

  return <canvas id="swap-chart" ref={canvasRef} />;
};

export default Chart;
