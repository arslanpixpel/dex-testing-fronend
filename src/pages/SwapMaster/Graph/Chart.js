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
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
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

  return (
    <>
      {/* <canvas id="swap-chart" ref={canvasRef} /> */}
      <div style={{ width: "100%", height: 300, color: "black" }}>
        <ResponsiveContainer>
          <AreaChart
            data={data}
            margin={{
              top: 10,
              right: 30,
              left: 0,
              bottom: 0,
            }}
          >
            <defs>
              <linearGradient id="colorUv" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#2EBD73" stopOpacity={0.6} />
                <stop offset="100%" stopColor="rgba(46, 189, 133, 0)" stopOpacity={0.6} />
              </linearGradient>
            </defs>
            <Tooltip
              content={({ active, payload, label }) => {
                setHoveredPointIndex(label);

                if (active && payload && payload.length) {
                  return (
                    <div className="custom-tooltip ">
                      {/* <p className="label">{payload[0].value}</p> */}
                    </div>
                  );
                }

                return null;
              }}
            />
            <Area type="monotone" dataKey="exchangeRate" stroke="#2EBD85" fill="url(#colorUv)" />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </>
  );
};

export default Chart;
