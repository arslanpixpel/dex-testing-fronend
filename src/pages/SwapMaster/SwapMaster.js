import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { Navigate, Route, Routes, useParams } from "react-router-dom";

// Components
import Swap from "./Swap/Swap";
import Link from "../../components/Link/Link";
import Liquidity from "./Liquidity/Liquidity";
import LiquidityCreateTokenModal from "./Liquidity/LiquidityCreateTokenModal";

// Utils
import { getTokenList } from "./utils";

// Actions
import { setLiquidityActiveWindow } from "../../store/reducers/SwapMaster/liquiditySlice";

// Constants
import { LIQUIDITY_WINDOWS } from "./Liquidity/constants";

const buttonList = [
  {
    id: 1,
    title: "Market",
    buttonStyle: "w-33 xs:h-14 h-10 1xs:px-0 px-2",
    path: "swap",
  },
  {
    id: 3,
    title: "Liquidity",
    buttonStyle: "w-36 xs:h-14 h-10 1xs:px-0 px-2",
    path: "liquidity",
  },
];

const SwapMaster = () => {
  const params = useParams();
  const dispatch = useDispatch();

  const handleClickArrow = () => {
    dispatch(setLiquidityActiveWindow(LIQUIDITY_WINDOWS.pools));
  };

  const isLiquidityTab = params["*"] === "liquidity";

  useEffect(() => {
    dispatch(getTokenList());
  }, [dispatch]);

  return (
    <>
      <div className="flex flex-col items-center py-12" style={{ fontFamily: "Poppins" }}>
        <div className="flex flex-row items-center justify-around w-full mb-5">
          <div
            className={`flex items-center justify-center w-12 h-12 rounded-lg bg-app-black-button hover:bg-app-blue cursor-pointer ${
              isLiquidityTab ? "" : "opacity-50 pointer-events-none"
            }`}
            onClick={handleClickArrow}
          >
            <svg
              className="h-6 w-6 text-white"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              strokeWidth="2"
              stroke="currentColor"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path stroke="none" d="M0 0h24v24H0z" />
              <line x1="5" y1="12" x2="19" y2="12" />
              <line x1="5" y1="12" x2="11" y2="18" />
              <line x1="5" y1="12" x2="11" y2="6" />
            </svg>
          </div>
          <div className="text-2xl  2xs:text-3xl 1xs:text-[40px]">Swap Master</div>
          <div className="w-12 h-12"></div>
        </div>
        <div className="flex flex-row justify-center w-full gap-5 mb-12 xs:font-semibold xs:text-lg px-28">
          {buttonList.map((button, idx) => {
            return (
              <Link
                key={idx}
                title={button.title}
                linkStyle={button.buttonStyle}
                selected={params["*"] === button.path}
                to={button.path}
              />
            );
          })}
        </div>
        <div className="flex w-full px-5">
          <div className="flex justify-center w-full">
            <Routes>
              <Route index element={<Navigate to="swap" replace />} />
              <Route path="swap" element={<Swap />} />
              <Route path="liquidity" element={<Liquidity />} />
            </Routes>
          </div>
        </div>
      </div>
      <LiquidityCreateTokenModal />
    </>
  );
};

export default SwapMaster;
