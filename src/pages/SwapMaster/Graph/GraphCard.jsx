import { useState } from "react";
import { useSelector } from "react-redux";

// Components
import Chart from "./Chart";
import { MainButton } from "../../../components/Button/MainButton";

// Utils
import { getShortTokenName } from "../../../utils/format";

// Hooks
import { useChartData } from "./hooks";

const PERIODS = [
  { name: "day", label: "24H", description: "Past 24 Hours" },
  { name: "week", label: "1W", description: "Past Week" },
  { name: "month", label: "1M", description: "Past Month" },
];

const GraphCard = () => {
  const tokenFrom = useSelector(s => s.swap.tokenFrom);
  const tokenTo = useSelector(s => s.swap.tokenTo);
  const [period, setPeriod] = useState(PERIODS[0]);
  const [hoveredPointIndex, setHoveredPointIndex] = useState(null);

  const handlePeriodChange = period => () => {
    setPeriod(period);
  };

  const { chartData, percentDifference } = useChartData({ tokenFrom, tokenTo, period });
  console.log({ tokenFrom, tokenTo, period, chartData });

  return (
    <div className="flex flex-col text-lg 2xl1:w-[815px] bg-app-black rounded-xl sm:p-[50px] xs:p-[40px] 1xs:p-[30px] 2xs:p-[20px] p-[10px] ">
      <div className="flex items-center justify-center rounded-md w-36 bg-app-black-button h-14">
        <div>
          <span title={tokenFrom.symbol}>{getShortTokenName(tokenFrom.symbol)}</span>/
          <span title={tokenTo.symbol}>{getShortTokenName(tokenTo.symbol)}</span>
        </div>
      </div>
      <div className="flex flex-col justify-between mt-4 sm:items-center sm:flex-row">
        <div className="flex flex-row items-center mb-5 sm:mb-0">
          <div className="flex items-center justify-center h-16 px-2 mr-4 rounded-md w-60 bg-app-black-button">
            <div className="text-base 1xl:text-2xl">
              {!!chartData.length &&
                chartData[hoveredPointIndex ?? chartData.length - 1].exchangeRate}
              {/* {40656.65839907} */}
            </div>
          </div>
          <div
            className={`flex items-center justify-center w-24 h-12 px-2 ${
              percentDifference >= 0 ? "bg-green-600" : "bg-red-500"
            } rounded-md`}
          >
            <div className="text-sm 1xl:text-base">{percentDifference}%</div>
          </div>
          {/* <div
            className={`flex items-center justify-center w-24 h-12 px-2 ${
              -1.59 >= 0 ? "bg-green-600" : "bg-red-500"
            } rounded-md`}
          >
            <div className="text-sm 1xl:text-base">{-1.59}%</div>
          </div> */}
        </div>
        <div className="flex">
          <div className="flex items-center justify-center h-12 rounded-md w-36 bg-app-black-button">
            <div className="text-gray-400">{period.description}</div>
          </div>
        </div>
      </div>
      <div className="flex items-center h-72 mt-7 relative border-dashed border-b-2 border-app-black">
        <Chart data={chartData} setHoveredPointIndex={setHoveredPointIndex} />
        {/* <div className="mt-24 hidden 2xl:flex">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="520"
            height="331"
            viewBox="0 0 714 331"
            fill="none"
          >
            <path
              d="M1 232.581L38.7512 261.918C39.5564 262.543 40.7036 262.463 41.4138 261.731L69.468 232.82C69.6219 232.662 69.7484 232.479 69.8424 232.279L108.107 150.948C108.622 149.853 109.983 149.463 111 150.118L167.135 186.274C167.759 186.675 168.552 186.699 169.198 186.336L221.994 156.659C222.193 156.547 222.41 156.47 222.635 156.432L265.831 149.012C266.323 148.928 266.766 148.662 267.072 148.268L310.109 92.8292C310.589 92.2102 311.387 91.9289 312.15 92.1095L350.452 101.182C351.171 101.352 351.926 101.112 352.414 100.557L385.202 63.3321C386.099 62.3141 387.727 62.4651 388.421 63.6307L414.008 106.595C414.179 106.881 414.418 107.12 414.705 107.291L476.06 143.769C477.178 144.433 478.622 143.872 478.997 142.627L521.111 2.83237C521.715 0.828115 524.602 0.980751 524.991 3.03749L561.089 193.841C561.413 195.556 563.625 196.061 564.662 194.658L581.522 171.853C581.594 171.757 581.656 171.654 581.709 171.546L615.921 101.88C616.678 100.339 618.896 100.405 619.561 101.988L644.591 161.644C645.106 162.872 646.656 163.263 647.692 162.425L714.749 108.228"
              stroke="#2EBD85"
              strokeinejoin="round"
            />
            <path
              d="M38.2213 261.672L0.25 233.359V329C0.25 330.105 1.14545 331 2.25002 331H711.998C713.102 331 713.998 330.105 713.998 329V107.959L647.137 162.14C646.107 162.975 644.564 162.595 644.041 161.376L618.093 101.004C617.413 99.422 615.185 99.3817 614.448 100.938L581.176 171.237C581.121 171.354 581.054 171.466 580.977 171.57L564.112 194.381C563.076 195.782 560.87 195.282 560.54 193.571L523.585 2.08731C523.188 0.0286603 520.293 -0.109093 519.702 1.90251L478.449 142.309C478.081 143.562 476.63 144.132 475.508 143.465L414.168 106.996C413.881 106.825 413.642 106.586 413.472 106.3L387.848 63.2765C387.165 62.1285 385.569 61.9609 384.662 62.942L351.383 98.9259C350.908 99.4395 350.199 99.6676 349.514 99.5274L311.579 91.7672C310.833 91.6146 310.065 91.8987 309.599 92.5002L266.536 147.973C266.229 148.367 265.786 148.633 265.294 148.717L222.098 156.137C221.873 156.175 221.656 156.252 221.457 156.364L168.662 186.041C168.016 186.404 167.222 186.38 166.599 185.979L110.463 149.823C109.446 149.168 108.085 149.558 107.57 150.653L69.3056 231.984C69.2116 232.184 69.085 232.367 68.9312 232.525L40.8522 261.462C40.1526 262.183 39.0267 262.273 38.2213 261.672Z"
              fill="url(#paint0_linear_5941_23809)"
            />
            <defs>
              <linearGradient
                id="paint0_linear_5941_23809"
                x1="357.124"
                y1="-247.198"
                x2="357.432"
                y2="304.915"
                gradientUnits="userSpaceOnUse"
              >
                <stop stopColor="#2EBD73" />
                <stop offset="1" stopColor="#2EBD85" stopOpacity="0" />
              </linearGradient>
            </defs>
          </svg>
        </div> */}
        {/* <div className="mt-6 flex">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="720"
            height="331"
            viewBox="0 0 714 331"
            fill="none"
          >
            <path
              d="M1 232.581L38.7512 261.918C39.5564 262.543 40.7036 262.463 41.4138 261.731L69.468 232.82C69.6219 232.662 69.7484 232.479 69.8424 232.279L108.107 150.948C108.622 149.853 109.983 149.463 111 150.118L167.135 186.274C167.759 186.675 168.552 186.699 169.198 186.336L221.994 156.659C222.193 156.547 222.41 156.47 222.635 156.432L265.831 149.012C266.323 148.928 266.766 148.662 267.072 148.268L310.109 92.8292C310.589 92.2102 311.387 91.9289 312.15 92.1095L350.452 101.182C351.171 101.352 351.926 101.112 352.414 100.557L385.202 63.3321C386.099 62.3141 387.727 62.4651 388.421 63.6307L414.008 106.595C414.179 106.881 414.418 107.12 414.705 107.291L476.06 143.769C477.178 144.433 478.622 143.872 478.997 142.627L521.111 2.83237C521.715 0.828115 524.602 0.980751 524.991 3.03749L561.089 193.841C561.413 195.556 563.625 196.061 564.662 194.658L581.522 171.853C581.594 171.757 581.656 171.654 581.709 171.546L615.921 101.88C616.678 100.339 618.896 100.405 619.561 101.988L644.591 161.644C645.106 162.872 646.656 163.263 647.692 162.425L714.749 108.228"
              stroke="#2EBD85"
              strokeinejoin="round"
            />
            <path
              d="M38.2213 261.672L0.25 233.359V329C0.25 330.105 1.14545 331 2.25002 331H711.998C713.102 331 713.998 330.105 713.998 329V107.959L647.137 162.14C646.107 162.975 644.564 162.595 644.041 161.376L618.093 101.004C617.413 99.422 615.185 99.3817 614.448 100.938L581.176 171.237C581.121 171.354 581.054 171.466 580.977 171.57L564.112 194.381C563.076 195.782 560.87 195.282 560.54 193.571L523.585 2.08731C523.188 0.0286603 520.293 -0.109093 519.702 1.90251L478.449 142.309C478.081 143.562 476.63 144.132 475.508 143.465L414.168 106.996C413.881 106.825 413.642 106.586 413.472 106.3L387.848 63.2765C387.165 62.1285 385.569 61.9609 384.662 62.942L351.383 98.9259C350.908 99.4395 350.199 99.6676 349.514 99.5274L311.579 91.7672C310.833 91.6146 310.065 91.8987 309.599 92.5002L266.536 147.973C266.229 148.367 265.786 148.633 265.294 148.717L222.098 156.137C221.873 156.175 221.656 156.252 221.457 156.364L168.662 186.041C168.016 186.404 167.222 186.38 166.599 185.979L110.463 149.823C109.446 149.168 108.085 149.558 107.57 150.653L69.3056 231.984C69.2116 232.184 69.085 232.367 68.9312 232.525L40.8522 261.462C40.1526 262.183 39.0267 262.273 38.2213 261.672Z"
              fill="url(#paint0_linear_5941_24002)"
            />
            <defs>
              <linearGradient
                id="paint0_linear_5941_24002"
                x1="357.124"
                y1="-247.198"
                x2="357.432"
                y2="304.915"
                gradientUnits="userSpaceOnUse"
              >
                <stop stopColor="#2EBD73" />
                <stop offset="1" stopColor="#2EBD85" stopOpacity="0" />
              </linearGradient>
            </defs>
          </svg>
        </div> */}
        <div className="absolute right-0 bottom-0 rounded-2xl bg-app-black-button px-4 py-2 translate-y-1/2 text-sm">
          {!!chartData.length && chartData[chartData.length - 1].exchangeRate}
          {/* {"40703.6800000"} */}
        </div>
      </div>
      <div className="flex flex-row justify-end gap-3 mt-8">
        {PERIODS.map(period => (
          <MainButton
            key={period.name}
            className="h-12 px-5 py-3 rounded-lg w-max bg-app-black-button"
            onClick={handlePeriodChange(period)}
          >
            {period.label}
          </MainButton>
        ))}
      </div>
    </div>
  );
};

export default GraphCard;
